// src/app.js

import 'express-async-errors';
import { errorMiddleware } from '@panenco/papi';
import express, { Application } from 'express';
import {
	getMetadataArgsStorage,
	RoutingControllersOptions,
	useExpressServer
} from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { getMetadataStorage } from "class-validator";
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config.js';
import { UserController } from './controllers/user.controller.js';

export class App {
  public host: Application
  public orm: MikroORM<PostgreSqlDriver>;

  constructor() {
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.host.use((req, __, next) => {
      RequestContext.create(this.orm.em, next);
    });

    const controllers = [UserController]
    this.initializeControllers(controllers)
    this.initializeSwagger();

    this.host.use(errorMiddleware);
  }

  public async createConnection() {
    try {
      this.orm = await MikroORM.init(ormConfig);
    } catch (error) {
      console.log("Error while connecting to the database", error);
    }
  }

  listen() {
    this.host.listen(3000, () => {
      console.info("🚀 http://localhost:3000");
      console.info("=======================");
    });
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, {  // link express host to routing-controllers
      cors: {
        origin: "*",  // any application on any url can call api.
        exposedHeaders: ["x-auth"],  // allow `x-auth` to be exposed to client.
      },
      controllers,
      defaultErrorHandler: false,  // let errors be handled through papi
      routePrefix: "/api",  // map routes to `/api` path.
    });
  }

  private initializeSwagger() {
    const schemas = validationMetadatasToSchemas({
      classValidatorMetadataStorage: getMetadataStorage(),
      refPointerPrefix: "#/components/schemas/",
    });
    const routingControllersOptions: RoutingControllersOptions = {
      routePrefix: "/api",
    };
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
			components: {
				schemas
			},
		});
    this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  }
}
