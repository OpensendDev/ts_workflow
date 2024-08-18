import { IExtensions } from "../db";
import { MemberRole } from "./enums";
import { IMember, IFindMember, IMemberAdd } from "./interfaces";

export default class MemberServices {
  constructor(private repositories: IExtensions) {

  }

  addNew(clientId: number, firstName: string, lastName: string, email: string, role: MemberRole): Promise<IMember> {
    if (!clientId) {
      throw new Error('client id is empty');
    }
    if (!firstName) {
      throw new Error('firstName is empty');
    }
    if (!lastName) {
      throw new Error('lastName is empty');
    }
    if (!email) {
      throw new Error('email is empty');
    }
    if (!role) {
      throw new Error('role is empty');
    }
    const data: IMemberAdd = {
      client_id: clientId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role
    }
    return this.repositories.members.add(data);
  }

  members(clientId: number, roles: MemberRole[]): Promise<IMember[]> {
    const data: IFindMember = {
      client_id: clientId,
      roles: roles
    }
    return this.repositories.members.find(data);
  }
}