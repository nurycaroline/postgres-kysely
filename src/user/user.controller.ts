import * as userService from './user.service'

import { Router } from '../router'
import { validateCreateUserRequest } from './user'
import { ControllerError } from '../util/errors'

export function userController(router: Router): void {
  router.get('/api', async (ctx) => {
    ctx.status = 200
    ctx.body = "Funcionando!"
  })

  router.post('/api/v1/user', async (ctx) => {
    const { body } = ctx.request

    if (!validateCreateUserRequest(body)) {
      throw new ControllerError(400, 'InvalidUser', 'invalid user')
    }

    const result = await ctx.db.transaction().execute(async (trx) => {
      return userService.createUser(trx, body)
    })

    ctx.status = 201
    ctx.body = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    }
  })

  router.get(
    '/api/v1/user/:userId',
    async (ctx) => {
      const { userId } = ctx.params
      const user = await userService.findUserById(ctx.db, userId)

      if (!user) {
        throw new ControllerError(
          404,
          'UserNotFound',
          `user with id ${userId} was not found`
        )
      }

      ctx.body = user
    }
  )
}
