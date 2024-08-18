import { IDatabase, IMain } from "pg-promise";
import { IMilestone, IMilestoneAdd } from "./interfaces"

export class MilestonesRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {
    /*
      If your repository needs to use helpers like ColumnSet,
      you should create it conditionally, inside the constructor,
      i.e. only once, as a singleton.
    */
  }

  // Returns all cloent records;
  all(): Promise<IMilestone[]> {
    return this.db.any('SELECT * FROM milestones');
  }

  byClientIdAndValue(clientId: number, value: number): Promise<IMilestone | null> {
    return this.db.oneOrNone('SELECT * FROM milestones WHERE client_id = $1 AND value = $2', [clientId, value]);
  }

  // Adds a new record and returns the full object;
  add(values: IMilestoneAdd): Promise<IMilestone | null> {
    return this.db.oneOrNone(`
      INSERT INTO milestones(client_id, value, email_sent)
      VALUES($1, $2, $3)
      RETURNING *`,
      [values.client_id, values.value, values.email_sent]
    );
  }
};
