import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Define __dirname explicitly for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, './database.sqlite'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, '../migrations'),
    extension: 'ts',
  },
  pool: {
    afterCreate: (conn: any, cb: any) => conn.run('PRAGMA foreign_keys = ON', cb),
  },
};

export default config;
