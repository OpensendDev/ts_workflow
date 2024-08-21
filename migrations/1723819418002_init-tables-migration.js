/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('clients', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    domain: { type: 'varchar(255)', notNull: true },
    client_id: { type: 'varchar(50)', notNull: true, unique: true },
  });

  pgm.createTable('members', {
    id: 'id',
    client_id: { type: 'integer', notNull: true, references: '"clients"', onDelete: 'cascade' },
    role: { type: 'varchar(50)', notNull: true },
    email: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(50)', notNull: true },
    last_name: { type: 'varchar(50)', notNull: true },
  });

  pgm.createTable('email_deliveries', {
    id: 'id',
    client_id: { type: 'integer', notNull: true, references: '"clients"', onDelete: 'cascade' },
    email: { type: 'varchar(100)', notNull: true },
    delivery_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('dcr_email_deliveries', {
    id: 'id',
    client_id: { type: 'varchar(50)', notNull: true, unique: true },
    total: { type: 'integer', notNull: true, default: 0 },
  });

  pgm.createTable('milestones', {
    id: 'id',
    client_id: { type: 'integer', notNull: true, references: '"clients"', onDelete: 'cascade' },
    value: { type: 'integer', notNull: true, default: 0 },
    email_sent: { type: 'boolean', notNull: true },
    send_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};



/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
