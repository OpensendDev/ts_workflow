import { IDatabase, IMain } from "pg-promise";
import { IFindMember, IMember, IMemberAdd } from "./interfaces"

export class MembersRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {
    /*
      If your repository needs to use helpers like ColumnSet,
      you should create it conditionally, inside the constructor,
      i.e. only once, as a singleton.
    */
  }

  // Returns all cloent records;
  all(): Promise<IMember[]> {
    return this.db.any('SELECT * FROM members');
  }

  // Adds a new record and returns the full object;
  add(values: IMemberAdd): Promise<IMember | null> {
    return this.db.oneOrNone(`
      INSERT INTO members(client_id, first_name, last_name, email, role)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *`,
      [values.client_id, values.first_name, values.last_name, values.email, values.role]
    );
  }

  find(values: IFindMember): Promise<IMember[]> {
    const agrs: [any] = [values.client_id];
    let sql = 'SELECT * FROM members WHERE client_id = $1';
    let count = 1;
    const roles = [];
    for (let index = 0; index < values.roles.length; index++) {
      const role = values.roles[index];
      agrs.push(role);
      count++;
      roles.push(`$${count}`)
    }
    if (roles.length > 0) {
      sql += ` AND role IN(${roles.join(',')})`
    }
    return this.db.any(sql, agrs);
  }

};
