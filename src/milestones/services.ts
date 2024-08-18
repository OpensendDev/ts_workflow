import { IExtensions } from "../db";
import { IMilestoneAdd, IMilestone } from "./interfaces";

export default class MilestoneServices {
  constructor(private repositories: IExtensions) {

  }

  async detail(clientId: number, value): Promise<IMilestone> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    if (!value) {
      throw new Error('value is empty');
    }
    return await this.repositories.milestones.byClientIdAndValue(clientId, value);
  }

  addNew(clientId: number, value: number, emailSent: boolean): Promise<IMilestone> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    if (!value) {
      throw new Error('value is empty');
    }
    if (!emailSent) {
      throw new Error('emailSent is empty');
    }
    const data: IMilestoneAdd = {
      client_id: clientId,
      value: value,
      email_sent: emailSent
    }
    return this.repositories.milestones.add(data);
  }
}