import { Generated, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

interface PersonTable {
  id: Generated<number>;
  username: string;
  password: string;
}

interface SessionTable {
  id: Generated<number>;
  user_id: number;
  token: string;
}

export interface Database {
  users: PersonTable;
  sessions: SessionTable;
}

// db
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      database: "todo-list",
    }),
  }),
});

export { db };
