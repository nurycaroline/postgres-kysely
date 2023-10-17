import * as userRepository from './user.repository'

import { Kysely } from 'kysely'
import { Database } from '../database'
import { CreateUserRequest, User } from './user'
import { UserRow } from './user.table'

export async function createUser(
  db: Kysely<Database>,
  request: CreateUserRequest
): Promise<User> {
  const user = await userRepository.insertUser(db, {
    first_name: request.firstName,
    last_name: request.lastName,
    email: request.email,
  })

  return userRowToUser(user)
}

export async function findUserById(
  db: Kysely<Database>,
  userId: string
): Promise<User | undefined> {
  const userRow = await userRepository.findUserById(db, userId)

  if (userRow) {
    return userRowToUser(userRow)
  }
}

export function userRowToUser(user: UserRow): User {
  return {
    id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  }
}
