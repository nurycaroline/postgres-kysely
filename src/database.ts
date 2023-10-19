import { UserTable } from './user/user.table'
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { config } from './config'

export interface Database {
  user: UserTable
}

export const dbInstance = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: async () => new Pool(config.database),
  }),
})