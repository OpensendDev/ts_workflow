import { IDatabase, IMain } from "pg-promise";
import { IDCREmailDelivery, IDCREmailDeliveryAdd, IDCREmailDeliveryUpdate } from "./interfaces"

export class DCREmailDeliveriesRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {
  }

  // Returns all cloent records;
  all(): Promise<IDCREmailDelivery[]> {
    return this.db.any('SELECT * FROM dcr_email_deliveries');
  }

  byClientId(clientId: number): Promise<IDCREmailDelivery | null> {
    return this.db.oneOrNone('SELECT * FROM dcr_email_deliveries WHERE client_id = $1', [clientId]);
  }

  // Adds a new record and returns the full object;
  add(values: IDCREmailDeliveryAdd): Promise<IDCREmailDelivery | null> {
    return this.db.oneOrNone(`
      INSERT INTO dcr_email_deliveries(client_id, total)
      VALUES($1, $2)
      ON CONFLICT (client_id) DO NOTHING
      RETURNING *`,
      [values.client_id, values.total]
    );
  }

  // Adds a new record and returns the full object;
  update(values: IDCREmailDeliveryUpdate): Promise<IDCREmailDelivery | null> {
    return this.db.oneOrNone(`
      UPDATE dcr_email_deliveries SET total = total + 1
      WHERE client_id = $1
      RETURNING *`,
      [values.client_id]
    );
  }
};
