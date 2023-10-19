import * as userRepository from './user.repository';
import { CreateUserRequest, User } from './user';
import { UserRow } from './user.table';

export async function createUser(
  req: CreateUserRequest,
): Promise<User> {
  
  const request: CreateUserRequest = req;
  const user = await userRepository.insertUser({
    first_name: request.firstName,
    last_name: request.lastName,
    email: request.email,
  });

  return userRowToUser(user)
}

export async function findUserById(
  userId: string,
): Promise<User | undefined> {
  const userRow = await userRepository.findUserById(userId);

  if (userRow) {
    return userRowToUser(userRow);
  }
}

function userRowToUser(user: UserRow): User {
  return {
    id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  };
}
