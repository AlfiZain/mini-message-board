const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(25) NOT NULL,
        text TEXT NOT NULL,
        added TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    INSERT INTO messages (username, text)
    VALUES
        ('dummy', 'text dummy'),
        ('gummy', 'text gummy');
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log('done');
}

main();
