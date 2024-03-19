import "reflect-metadata";

import fastify, { errorCodes } from "fastify";
import { env } from "./env";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { UserRoutes } from "./routes/user";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import _ from "lodash";
import errorHandlerPlugin from "./plugins/error_handler";

import dependencyInjectionPlugin from "./plugins/dependency_injection";
import { AuthRoutes } from "./routes/auth";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "./services/session_store";

async function main() {
  const isProduction = env.NODE_ENV === "production";

  // create database client
  const prisma = new PrismaClient();
  await prisma.$connect();

  // setup dependencies injection container
  container.register(PrismaClient, { useValue: prisma });

  const app = fastify({
    logger: {
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            }
          : undefined,
      file: env.NODE_ENV === "production" ? "logs.log" : undefined,
    },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.withTypeProvider<ZodTypeProvider>();

  // register plugins
  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: env.SESSION_SECRET,
    cookie: {
      secure: isProduction,
      maxAge: env.SESSION_MAX_AGE_SECONDS,
    },
    // see https://github.com/fastify/session?tab=readme-ov-file#saveuninitialized-optional
    saveUninitialized: false,
    store: container.resolve(PrismaSessionStore)
  });
  app.register(errorHandlerPlugin);
  app.register(dependencyInjectionPlugin);

  // setup routes
  app.register(UserRoutes, { prefix: "/user" });
  app.register(AuthRoutes, { prefix: "/auth" });

  // starting server
  try {
    app.log.info("Starting server...");
    app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
