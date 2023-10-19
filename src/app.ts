import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router as ExpressRouter
} from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';

import { Kysely } from 'kysely';
import http from 'http';

import { Config } from './config';
import { Database, dbInstance } from './database';
import { userController } from './user/user.controller';
import { ControllerError } from './util/errors';
import { isObject } from './util/object';

class App {
  private config: Config;
  private app: Express;
  private router: ExpressRouter;
  public db: Kysely<Database>;
  private server?: http.Server;

  constructor(config: Config) {
    this.config = config;
    this.app = express();
    this.router = express.Router();
    this.db = dbInstance;

    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(this.errorHandler.bind(this));

    userController(this.router);

    this.app.use(this.router);
  }

  public async start(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.server = this.app.listen(this.config.port, () => {
        resolve();
      });
    });
  }


  public async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.close((err?: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });

    await this.db?.destroy();
  }

  private async errorHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await next();
    } catch (error) {
      if (error instanceof ControllerError) {
        respondError(res, error);
      } else {
        respondError(res, createUnknownError(error));
      }
    }
  }
}

function respondError(res: Response, error: ControllerError): void {
  res.status(error.status).json(error.toJSON());
}

function createUnknownError(error: unknown): ControllerError {
  return new ControllerError(
    500,
    'UnknownError',
    (isObject(error) ? error.message : undefined) ?? 'unknown error'
  );
}

export default App;
