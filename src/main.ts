import ClientService from './clients/services';
import { db } from './db';
import EmailDeliveryServices from './email_deliveries/services';
import { MemberRole } from './members/enums';
import MemberServices from './members/services';
import logger from './logger';

const clienService = new ClientService(db);
const emailDeliveryServices = new EmailDeliveryServices(db);
const memberServices = new MemberServices(db);

const main = async () => {
  await clienService.addNew('client1', 'client1.com', "ca61da8c-938a-48a6-8eb6");
  await memberServices.addNew(1, 'cuong1', 'huynh', 'tuancuong315+1@gmail.com', MemberRole.MANAGER);
  await memberServices.addNew(1, 'cuong2', 'huynh', 'tuancuong315+2@gmail.com', MemberRole.OWNER);
  await memberServices.addNew(1, 'cuong3', 'huynh', 'tuancuong315+3@gmail.com', MemberRole.VIEWER);
  await memberServices.addNew(1, 'cuong4', 'huynh', 'tuancuong315+4@gmail.com', MemberRole.MANAGER);
}

main();