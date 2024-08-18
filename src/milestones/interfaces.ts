export interface IMilestone {
  id: number;
  client_id: number;
  value: number;
  email_sent: boolean;
  send_at: Date;
}

export interface IMilestoneAdd {
  client_id: number;
  value: number;
  email_sent: boolean;
  send_at?: Date;
}