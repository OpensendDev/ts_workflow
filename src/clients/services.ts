import { IExtensions } from "../db";
import { IClient, IClientAdd } from "./interfaces";

export default class ClientService {
  constructor(private repositories: IExtensions) {

  }

  all(): Promise<IClient[]> {
    return this.repositories.clients.all();
  }

  detailByClientId(clientId: string): Promise<IClient> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    return this.repositories.clients.byClientId(clientId);
  }

  addNew(name: string, domain: string, clientId: string): Promise<IClient> {
    if (!name) {
      throw new Error('name is empty');
    }

    if (!domain) {
      throw new Error('domain is empty');
    }

    if (!clientId) {
      throw new Error('client id is empty');
    }
    const data: IClientAdd = {
      name: name,
      domain: domain,
      client_id: clientId
    }
    return this.repositories.clients.add(data);
  }
}