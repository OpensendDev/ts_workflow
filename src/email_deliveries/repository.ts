import { IDatabase, IMain } from "pg-promise";
import { IEmailDelivery, IEmailDeliveryAdd } from "./interfaces"

export class EmailDeliveriesRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {
  }

  // Returns all cloent records;
  all(): Promise<IEmailDelivery[]> {
    return this.db.any('SELECT * FROM email_deliveries');
  }

  // Adds a new record and returns the full object;
  add(values: IEmailDeliveryAdd): Promise<IEmailDelivery | null> {
    return this.db.oneOrNone(`
      INSERT INTO email_deliveries(client_id, email)
      VALUES($1, $2)
      RETURNING *`,
      [values.client_id, values.email]
    );
  }
};
