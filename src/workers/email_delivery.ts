import { ColumnFilter } from "../machine/column_filter";
import { Consumer } from "../workflow/consumer";
import { Pipeline } from "../workflow/pipeline";
import { Producer } from "../workflow/producer";
import { Stage } from "../workflow/stage";
import { StreamProducer } from "../workflow/stream_producer";
import { Task } from "../workflow/task";
import { db, IExtensions } from '../db';
import ClientService from "../clients/services";
import EmailDeliveryServices from "../email_deliveries/services";
import DCREmailDeliveryServices from "../dcr_email_deliveries/services";
import { IClient } from "../clients/interfaces";
import MilestoneServices from "../milestones/services";
import MemberServices from "../members/services";
import { MemberRole } from "../members/enums";
import { IMailPayload, sendEmail } from "../common/emailer";
import logger from "../logger";
import { IMember } from "../members/interfaces";

export interface IMessageData {
  clientId: string;
  email: string;
  client?: IClient;
  total?: number;
  emailSent?: boolean;
  sendEmailTo?: string[];
}

export interface ISendMailMilestoneSetting {
  milestones: number[];
  db: IExtensions;
  source: AsyncIterable<Record<string, any>>
}

async function* generateClientEmail(name: string, thread: number): AsyncIterable<Record<string, any>> {
  const clienService = new ClientService(db);
  const clients = await clienService.all();
  for (let index = 0; index < clients.length; index++) {
    const client = clients[index];
    const data = {}
    for (let index = 0; index < 10; index++) {
      data[name] = {
        clientId: client.client_id,
        email: `${client.name}-${thread}-${index}@${client.domain}`
      };
      yield data;
    }
  }
}

class EmailValidatingStage extends Stage {
  constructor(private key: string) {
    super();
  }
  protected regex = new RegExp('.*@.*\..*');
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data = item[this.key];
    if (!this.regex.test(data.email)) {
      return false;
    }
    yield {
      'data': data
    };
  }
}

class GetClientInfoStage extends Stage {
  private clients: object = {};
  constructor(private clienService: ClientService, private key: string) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('GetClientInfoStage', this.key, data);
    try {
      if (!this.clients[data.clientId]) {
        this.clients[data.clientId] = await this.clienService.detailByClientId(data.clientId);
      }

      if (!this.clients[data.clientId]) {
        throw new Error('client is not exist');
      }

      const emailDeliveryData: IMessageData = {
        clientId: data.clientId,
        email: data.email,
        client: this.clients[data.clientId]
      }

      yield {
        'data': emailDeliveryData
      }

    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

class InitDCRDeliveryEmailStage extends Stage {
  constructor(private dcrEmailDeliveryServices: DCREmailDeliveryServices, private key: string) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('InitDCRDeliveryEmailStage', this.key, data);
    try {
      await this.dcrEmailDeliveryServices.addNew(data.client.client_id);
      yield {
        'data': data,
      };
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

class DeliveryEmailStage extends Stage {
  constructor(private emailDeliveryServices: EmailDeliveryServices, private key: string) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('DeliveryEmailStage', this.key, data);
    try {
      const result = await this.emailDeliveryServices.addNew(data.client.id, data.email);
      if (!result) {
        throw new Error('deliver email error');
      }

      yield {
        'data': data,
      };
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

class DCRDeliveryEmailStage extends Stage {
  constructor(private dcrEmailDeliveryServices: DCREmailDeliveryServices, private key: string, private milestones: number[]) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('DCRDeliveryEmailStage', this.key, data);
    try {
      const result = await this.dcrEmailDeliveryServices.report(data.client.client_id);
      if (!this.milestones.includes(result.total)) {
        return false;
      }
      data.total = result.total
      yield {
        'data': data,
      };
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

class MemberStage extends Stage {
  private members: { [key: string]: IMember[] } = {};
  constructor(private memberSerivices: MemberServices, private key: string) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('MemberStage', this.key, data);
    try {
      if (!this.members[data.clientId]) {
        this.members[data.clientId] = await this.memberSerivices.members(data.client.id, [MemberRole.MANAGER, MemberRole.OWNER]);
      }
      if (this.members[data.clientId].length == 0) {
        throw new Error('members is empty');
      }

      data.sendEmailTo = this.members[data.clientId].map((member) => member.email);

      yield {
        'data': data,
      };
    } catch (error) {
      logger.error(error)
    }
  }
}

class MilestoneStage extends Stage {
  constructor(private milestoneSerivices: MilestoneServices, private key: string) {
    super();
  }
  async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    const data: IMessageData = item['data'];
    logger.info('MemberStage', this.key, data);
    try {
      const milestone = await this.milestoneSerivices.detail(data.client.id, data.total);
      if (milestone) {
        throw new Error('milestone is not exist');
      }

      yield {
        'data': data,
      };
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

class SendMailConsumer extends Consumer {
  constructor(private milestoneSerivices: MilestoneServices, private key: string) {
    super();
  }

  async process(item: Record<string, any>): Promise<void> {
    const data: IMessageData = item['data'];
    logger.info('SendMailConsumer', this.key, data);
    try {
      const mailPayload: IMailPayload = {
        to: [''],
        subject: 'Opensend is successfully delivered',
        text: `We deliveried ${data.total} successfully`
      }

      const email_sent = sendEmail(mailPayload);

      await this.milestoneSerivices.addNew(data.client.id, data.total, email_sent);
    } catch (error) {
      logger.error(error);
    }
  }
}

export class SendMailMilestone extends Task {
  private clienService: ClientService;
  private emailDeliveryServices: EmailDeliveryServices;
  private dcrEmailDeliveryServices: DCREmailDeliveryServices;
  private milestoneSerivices: MilestoneServices;
  private memberSerivices: MemberServices;

  constructor(name: string, private setting: ISendMailMilestoneSetting) {
    super(name)

    this.clienService = new ClientService(this.setting.db);
    this.emailDeliveryServices = new EmailDeliveryServices(this.setting.db);
    this.dcrEmailDeliveryServices = new DCREmailDeliveryServices(this.setting.db);
    this.milestoneSerivices = new MilestoneServices(this.setting.db);
    this.memberSerivices = new MemberServices(this.setting.db);
  }

  getPipeline(): Pipeline {
    return new Pipeline(
      new ColumnFilter([this.name])
    ).addStage(
      new EmailValidatingStage(this.name)
    ).addStage(
      new GetClientInfoStage(this.clienService, this.name)
    ).addStage(
      new InitDCRDeliveryEmailStage(this.dcrEmailDeliveryServices, this.name)
    ).addStage(
      new DeliveryEmailStage(this.emailDeliveryServices, this.name)
    ).addStage(
      new DCRDeliveryEmailStage(this.dcrEmailDeliveryServices, this.name, this.setting.milestones)
    ).addStage(
      new MemberStage(this.memberSerivices, this.name)
    ).addStage(
      new MilestoneStage(this.milestoneSerivices, this.name)
    );
  };

  getProducer(): Producer {
    return new StreamProducer(this.setting.source);
  };

  getConsumer(): Consumer {
    return new SendMailConsumer(this.milestoneSerivices, this.name);
  };
}

const threads = [1, 2, 3];

threads.map((thread) => {
  const name = `TestTask-${thread}`;
  const setting: ISendMailMilestoneSetting = {
    milestones: [1, 100, 1000, 10000, 100000, 1000000],
    db,
    source: generateClientEmail(name, thread)
  }
  new SendMailMilestone(name, setting).main();
})
