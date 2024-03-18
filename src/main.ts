import fastify, { errorCodes } from "fastify";
import { env } from "./env";
import prismaPlugin from "./plugins/prisma";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { UserRoutes } from "./routes/users";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import _ from "lodash";
import errorHandlerPlugin from "./plugins/error_handler";

async function main() {
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
  app.register(prismaPlugin);
  app.register(fastifyCookie);
  app.register(fastifySession, { secret: env.SESSION_SECRET });
  app.register(errorHandlerPlugin)

  // setup routes
  app.register(UserRoutes, { prefix: "/users" });

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
