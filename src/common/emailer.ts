export interface IMailPayload {
  to: [string],
  subject: string,
  text: string,
}

export const sendEmail = (payload: IMailPayload): boolean => {
  console.log(payload.text);
  return true
}