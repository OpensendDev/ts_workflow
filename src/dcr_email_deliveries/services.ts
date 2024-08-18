import { IExtensions } from "../db";
import { IDCREmailDelivery, IDCREmailDeliveryAdd, IDCREmailDeliveryUpdate } from "./interfaces";

export default class DCREmailDeliveryServices {
  constructor(private repositories: IExtensions) {

  }

  async report(clientId: string): Promise<IDCREmailDelivery> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    const data: IDCREmailDeliveryUpdate = {
      client_id: clientId,
    }
    return await this.repositories.dcrEmailDeliveries.update(data);
  }

  async addNew(clientId: string): Promise<IDCREmailDelivery> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    const data: IDCREmailDeliveryAdd = {
      client_id: clientId,
      total: 0
    }
    return await this.repositories.dcrEmailDeliveries.add(data);
  }
}