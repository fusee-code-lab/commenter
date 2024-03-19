import { env } from "@/env";
import fastifyPlugin from "fastify-plugin";
import _ from "lodash";
import { ZodError } from "zod";

const errorHandlerPlugin = fastifyPlugin(async (app, options) => {
  app.setErrorHandler(function (error, request, reply) {
    const isProduction = env.NODE_ENV === "production";

    if (error instanceof ZodError) {
      reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        coode: isProduction ? undefined : error.code,
        message: error.errors,
      });
    } else {
      // TODO: ignore error stack here
      // remove code in error if in production
      reply.status(error.statusCode || 500).send(isProduction ? _.omit(error, "code") : error);
    }
  });
});

export default errorHandlerPlugin;