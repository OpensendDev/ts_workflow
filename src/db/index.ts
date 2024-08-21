import * as config from '../config';
import pgPromise from 'pg-promise';
import { Diagnostics } from './diagnostics';
import { IInitOptions, IDatabase, IMain } from 'pg-promise';
import ClientsRepository from '../clients/repository';
import { MembersRepository } from '../members/repository';
import { MilestonesRepository } from '../milestones/repository';
import { EmailDeliveriesRepository } from '../email_deliveries/repository';
import { DCREmailDeliveriesRepository } from '../dcr_email_deliveries/repository';

const dbConfig = config.get('database');

export interface IExtensions {
  clients?: ClientsRepository;
  members?: MembersRepository;
  milestones?: MilestonesRepository;
  emailDeliveries?: EmailDeliveriesRepository;
  dcrEmailDeliveries?: DCREmailDeliveriesRepository;
}

export type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
  // Extending the database protocol with our custom repositories;
  extend(obj: ExtendedProtocol, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases with different access API.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.clients = new ClientsRepository(obj, pgp);
    obj.members = new MembersRepository(obj, pgp);
    obj.milestones = new MilestonesRepository(obj, pgp);
    obj.emailDeliveries = new EmailDeliveriesRepository(obj, pgp);
    obj.dcrEmailDeliveries = new DCREmailDeliveriesRepository(obj, pgp);
  }
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const db: ExtendedProtocol = pgp(dbConfig);

// Initializing optional diagnostics:
// Diagnostics.init(initOptions);

export { db, pgp };
