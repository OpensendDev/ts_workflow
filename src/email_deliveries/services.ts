import { IExtensions } from "../db";
import { IEmailDelivery, IEmailDeliveryAdd } from "./interfaces";

export default class EmailDeliveryServices {
  constructor(private repositories: IExtensions) {

  }

  addNew(clientId: number, email: string): Promise<IEmailDelivery> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    if (!email) {
      throw new Error('email is empty');
    }
    const data: IEmailDeliveryAdd = {
      client_id: clientId,
      email: email
    }
    return this.repositories.emailDeliveries.add(data);
  }
}