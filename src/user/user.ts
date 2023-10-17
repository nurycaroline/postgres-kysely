import { ajv } from '../util/ajv'

export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
}

export interface CreateUserRequest {
  firstName?: string
  lastName?: string
  email?: string
}

export const validateCreateUserRequest =
  ajv.compile<CreateUserRequest>({
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
    },
  })
