const config = require("./config");
const { Client } = require("pg");

const CONNECTION = {
  connectionString: config.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}

async function dbQuery(statement, ...parameters) {
  let client = new Client(CONNECTION);

  await client.connect();
  let results = await client.query(statement, parameters);
  await client.end();

  return results;
}

module.exports = dbQuery;