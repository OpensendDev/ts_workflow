export interface IEmailDelivery {
  id: number;
  client_id: number;
  email: string;
}

export interface IEmailDeliveryAdd {
  client_id: number;
  email: string;
}