import { Database, dbInstance } from '../database';
import { InsertableUserRow, UserRow } from './user.table';
import { Kysely, Transaction } from 'kysely';

export async function insertUser(
  user: InsertableUserRow
): Promise<UserRow> {
  const insertedUser = await dbInstance
    .insertInto('user')
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedUser;
}

export async function findUserById(
  userId: string
): Promise<UserRow | undefined> {

  const user = await dbInstance
    .selectFrom('user')
    .where('user_id', '=', userId)
    .selectAll('user')
    .executeTakeFirst();

  return user;
}

export async function lockUserById(
  trx: Transaction<Database>,
  id: string
): Promise<UserRow | undefined> {
  return lockUser(trx, 'user_id', id);
}

export async function lockUserByEmail(
  trx: Transaction<Database>,
  email: string
): Promise<UserRow | undefined> {
  return lockUser(trx, 'email', email);
}

async function lockUser(
  trx: Transaction<Database>,
  column: 'user_id' | 'email',
  value: string
): Promise<UserRow | undefined> {
  const user = await trx
    .selectFrom('user')
    .where(column, '=', value)
    .selectAll('user')
    .forUpdate()
    .executeTakeFirst();

  return user;
}

export async function setUserEmail(
  userId: string,
  email: string
): Promise<void> {

  await dbInstance
    .updateTable('user')
    .where('user_id', '=', userId)
    .set({ email })
    .execute();
}
