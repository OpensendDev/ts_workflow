# Requirements
Write a script to send email to notify client owner about their milestone which they read
- Client is an organization included name, domain, client_id (unique)
- Each client may have multiple members with different roles: Owner, Manager, and Viewer. We will send the notification to the Owner and Managers (user has email, first name and last_name)
- We delivery email to client, we count number of email of client table email_deliver(client_id, email) 
- We will send milestone reach email when client reach 1 1000 10000 100000 and 1000000 successfully delivered
- We send email only 1 time for each milestone
## Requirements:
- Use code flow which is provided in the github repo: https://github.com/OpensendDev/ts_workflow.
- Please provide the schema DDL for tables which mentions above as well, create more table if needed.
- Concentrate to code clean, code organization for easy reuse, maintaining.
- Include testing using Jest would be a plus
## Notes:
- sendMail() function can be replace by console.log(email_text)
- Example script can be found here: https://github.com/OpensendDev/ts_workflow/blob/main/src/tests/simple_log_consumer.ts



# DDL
We’ll create tables for clients, members, email deliveries, and milestones. Here’s the schema definition:

## Clients Table:
- id (unique identifier for each client)
- name (organization name)
- domain (organization domain)
- client_id (organization client id)
```
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL
  client_id VARCHAR(30) UNIQUE
);
```

## Members Table:
- id (unique identifier for each member)
- client_id (foreign key referencing the clients table)
- first_name
- last_name
- email
- role (Owner, Manager, or Viewer)

```
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    client_id INT,
    role VARCHAR(50),
    email VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

## Email Deliveries Table:
- id (unique identifier for each email delivery)
- client_id (foreign key referencing the clients table)
- email (email address)
- delivery_at (when the email was delivered)

```
CREATE TABLE email_deliveries (
    id SERIAL PRIMARY KEY,
    client_id INT,
    email VARCHAR(100),
    delivery_at TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

## Data Capture Report Email Deliveries Table:
- id (unique identifier for each client email delivery)
- client_id (foreign key referencing the clients table)
- total (total email delivery of each client)

```
CREATE TABLE dcr_dmail_deliveries (
    id SERIAL PRIMARY KEY,,
    client_id INT UNIQUE,
    total INT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

## Milestones Table:
- id (unique identifier for each milestone)
- client_id (foreign key referencing the clients table)
- value (e.g., 1, 1000, 10000, 100000, 1000000)
- email_sent (boolean indicating whether the milestone has been sent)
- send_at (when the email was sent)
```
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,,
    client_id INT,
    value INT,
    email_sent BOOLEAN DEFAULT FALSE,
    send_at TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

# Get Start
## Setup environment
- Install node v18
- Install docker and docker compose

## Start Worker
### Start PostgreSQL
```
docker-compose up -d
```

### Install node module
```
npm i
```
### Unit Test
```
npm test
npm run test:cov
```

### Migrate data
Init tables
```
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb npm run migrate up
```

### Add sample data
```
npx ts-node src/main.ts 
```

### Run worker
```
npm run email_delivery
```
