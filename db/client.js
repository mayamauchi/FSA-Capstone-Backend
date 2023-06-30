const { Client } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl === undefined) {
  throw new error("DATABASE_URL environment variable not set");
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false 
  }
});

console.log("DB_URL: " + process.env.DATABASE_URL);
console.log("NODE_ENV: "+ process.env.NODE_ENV);

module.exports = {
  client,
};
