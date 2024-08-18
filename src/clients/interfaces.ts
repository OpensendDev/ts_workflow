export interface IClient {
  id: number;
  name: string;
  domain: string;
  client_id: string;
}

export interface IClientAdd {
  name: string;
  domain: string;
  client_id: string;
}
