import { IExtensions } from '../../db';
import ClientService from '../../clients/services';
import DCREmailDeliveryServices from '../../dcr_email_deliveries/services';
import EmailDeliveryServices from '../../email_deliveries/services';
import { ISendMailMilestoneSetting, SendMailMilestone } from '../email_delivery';
import { IDCREmailDelivery } from '../../dcr_email_deliveries/interfaces';
import { clients, generateClientEmail, members } from '../__mocks__/data';
import { IEmailDelivery } from '../../email_deliveries/interfaces';
import MemberServices from '../../members/services';
import MilestoneServices from '../../milestones/services';
import { IMilestone } from '../../milestones/interfaces';

const mockDetailByClientId = jest.spyOn(ClientService.prototype, 'detailByClientId');
const mockAddNewDCREmailDelivery = jest.spyOn(DCREmailDeliveryServices.prototype, 'addNew');
const mockReportDCREmailDelivery = jest.spyOn(DCREmailDeliveryServices.prototype, 'report');
const mockAddNewEmailDelivery = jest.spyOn(EmailDeliveryServices.prototype, 'addNew');
const mockGetMembers = jest.spyOn(MemberServices.prototype, 'members');
const mockAddNewMilestone = jest.spyOn(MilestoneServices.prototype, 'addNew');
const mockDetailMilestone = jest.spyOn(MilestoneServices.prototype, 'detail');

describe('wokers > email_delivery', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDetailByClientId.mockClear();
    mockAddNewDCREmailDelivery.mockClear();
    mockReportDCREmailDelivery.mockClear();
    mockAddNewEmailDelivery.mockClear();
    mockGetMembers.mockClear();
    mockAddNewMilestone.mockClear();
    mockDetailMilestone.mockClear();
  });

  it('GetClientInfoStage > client is not exist', async () => {
    const thread = 1;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(null);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();
    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalledTimes(0);
  });

  it('GetClientInfoStage > client exist', async () => {
    const thread = 2;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockRejectedValueOnce(new Error('data error'));

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();
    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
  });

  it('InitDCRDeliveryEmailStage > Init DCRDeliveryEmail by client id error and stop process', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockRejectedValueOnce(new Error('data error'));

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalledTimes(0);
  });

  it('InitDCRDeliveryEmailStage > Init DCRDeliveryEmail by client id', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue(null);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
  });

  it('DeliveryEmailStage > insert email delivery into db', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue(null);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalledTimes(1);
  });

  it('DCRDeliveryEmailStage > update the DCRDeliveryEmail with total value into db', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [2, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
  });

  it('DCRDeliveryEmailStage > the total email delivery is not equal with milestone', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 2 } as IDCREmailDelivery);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(0);
  });

  it('DCRDeliveryEmailStage > update the DCRDeliveryEmail with total value had error', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockRejectedValue(new Error('database error'));


    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(0);
  });

  it('MemberStage > get list members by client id and roles', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockResolvedValue([members[0], members[1]])
    mockDetailMilestone.mockResolvedValue(null);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockDetailMilestone).toHaveBeenCalledTimes(1);
  });

  it('MemberStage > get list members by client id and roles with empty list', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockResolvedValue([])

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockAddNewMilestone).toHaveBeenCalledTimes(0);
  });

  it('MemberStage > get list members by client id and roles with error', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockRejectedValue(new Error('database error'));

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockAddNewMilestone).toHaveBeenCalledTimes(0);
  });

  it('MilestoneStage > get milestone detail with response data', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockResolvedValue([members[0], members[1]])
    mockDetailMilestone.mockResolvedValue({} as IMilestone);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockDetailMilestone).toHaveBeenCalledTimes(1);
    expect(mockAddNewMilestone).toHaveBeenCalledTimes(0);
  });

  it('MilestoneStage > get milestone detail with error', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockResolvedValue([members[0], members[1]])
    mockDetailMilestone.mockRejectedValue(new Error('database error'));

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockDetailMilestone).toHaveBeenCalledTimes(1);
    expect(mockAddNewMilestone).toHaveBeenCalledTimes(0);
  });

  it('MilestoneStage > get milestone detail with null data', async () => {
    const thread = 3;
    const name = `TestTask-${thread}`;
    const db: IExtensions = {};
    const setting: ISendMailMilestoneSetting = {
      milestones: [1, 10, 30, 1000, 10000],
      db,
      source: generateClientEmail(name, thread, [clients[0]], 1)
    }

    mockDetailByClientId.mockResolvedValue(clients[0]);
    mockAddNewDCREmailDelivery.mockResolvedValue({} as IDCREmailDelivery);
    mockAddNewEmailDelivery.mockResolvedValue({} as IEmailDelivery);
    mockReportDCREmailDelivery.mockResolvedValue({ total: 1, } as IDCREmailDelivery);
    mockGetMembers.mockResolvedValue([members[0], members[1]])
    mockDetailMilestone.mockResolvedValue(null);

    const sendMailMilestone = new SendMailMilestone(name, setting);
    await sendMailMilestone.main();

    expect(mockDetailByClientId).toHaveBeenCalled();
    expect(mockAddNewDCREmailDelivery).toHaveBeenCalled();
    expect(mockAddNewEmailDelivery).toHaveBeenCalled();
    expect(mockReportDCREmailDelivery).toHaveBeenCalledTimes(1);
    expect(mockGetMembers).toHaveBeenCalledTimes(1);
    expect(mockDetailMilestone).toHaveBeenCalledTimes(1);
    expect(mockAddNewMilestone).toHaveBeenCalledTimes(1);
  });
});