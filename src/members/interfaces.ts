import { MemberRole } from "./enums";

export interface IMember {
  id: number;
  client_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: MemberRole;
}

export interface IMemberAdd {
  client_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: MemberRole;
}

export interface IFindMember {
  client_id: number;
  roles: MemberRole[];
}