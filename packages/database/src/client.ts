import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schemas";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

export const db = drizzle({
  client: pool,
  connection: {
    connectionString,
    ssl: false
  },
  schema
});

export type Database = typeof db;
