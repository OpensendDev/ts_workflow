import { IClient } from "../../clients/interfaces";
import { MemberRole } from "../../members/enums";
import { IMember } from "../../members/interfaces";

export const clients: IClient[] = [
  {
    id: 1,
    name: "client1",
    domain: "client1.com",
    client_id: "client1"
  },
  {
    id: 2,
    name: "client2",
    domain: "client2.com",
    client_id: "client2"
  }
];

export const members: IMember[] = [
  {
    id: 1,
    client_id: 1,
    first_name: 'Member1',
    last_name: 'Member1',
    email: 'member1@client1.com',
    role: MemberRole.OWNER
  },
  {
    id: 2,
    client_id: 1,
    first_name: 'Member2',
    last_name: 'Member2',
    email: 'member2@client1.com',
    role: MemberRole.MANAGER
  },
  {
    id: 3,
    client_id: 1,
    first_name: 'Member3',
    last_name: 'Member3',
    email: 'member3@client1.com',
    role: MemberRole.VIEWER
  },
];

export async function* generateClientEmail(name: string, thread: number, clients: IClient[], total: number): AsyncIterable<Record<string, any>> {
  for (let index = 0; index < clients.length; index++) {
    const client = clients[index];
    const data = {}
    for (let index = 0; index < total; index++) {
      data[name] = {
        clientId: client.client_id,
        email: `${client.name}-${thread}-${index}@${client.domain}`
      };
      yield data;
    }
  }
}

