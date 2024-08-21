import { IDatabase, IMain } from "pg-promise";
import { IClient, IClientAdd } from "./interfaces"
export interface IClientsRepository {

}
export default class ClientsRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {
  }

  // Returns all cloent records;
  all(): Promise<IClient[]> {
    return this.db.any('SELECT * FROM clients');
  }

  byClientId(clientId: string): Promise<IClient | null> {
    return this.db.oneOrNone('SELECT * FROM clients WHERE client_id = $1', [clientId]);
  }

  // Adds a new record and returns the full object;
  add(values: IClientAdd): Promise<IClient> {
    return this.db.one(`
      INSERT INTO clients(name, domain, client_id)
      VALUES($1, $2, $3)
      RETURNING *`,
      [values.name, values.domain, values.client_id]
    );
  }
};
