import { ConnectionConfig } from 'pg'
import { Config } from '../src/config'

export interface TestConfig extends Config {
  readonly adminDatabase: ConnectionConfig
}

export const testConfig: TestConfig = {
  port: 3001,
  authTokenSecret: 'a498a5cf13a8194a2477f9284df34af3954fad3dc8459e343a',
  authTokenExpiryDuration: '2h',
  database: {
    host: 'localhost',
    database: 'kysely_koa_example_test',
    user: 'postgres',
    password: 'postgres',
  },
  adminDatabase: {
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
}
