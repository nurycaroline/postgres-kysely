import express, { Request, Response } from 'express';
import * as userService from './user.service';
import { CreateUserRequest, validateCreateUserRequest } from './user';
import { ControllerError } from '../util/errors';

export function userController(router: express.Router): void {
  router.get('/api', (req: Request, res: Response) => {
    res.status(200).send('Funcionando!');
  });

  router.post('/api/v1/user', async (req: Request, res: Response) => {
    const { body } = req;

    if (!validateCreateUserRequest(body)) {
      throw new ControllerError(400, 'InvalidUser', 'invalid user');
    }

    try {
      const result = await userService.createUser(body as CreateUserRequest);
      res.status(201).json({
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      });
    } catch (error) {
      throw new ControllerError(500, 'ServerError', 'error creating user');
    }
  });

  router.get('/api/v1/user/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.findUserById(userId);

    if (!user) {
      throw new ControllerError(
        404,
        'UserNotFound',
        `user with id ${userId} was not found`
      );
    }

    res.json(user);
  });
}
