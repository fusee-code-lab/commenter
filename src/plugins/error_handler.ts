import { env } from "@/env";
import fastifyPlugin from "fastify-plugin";
import httpStatus from "http-status";
import _ from "lodash";
import { ZodError } from "zod";

const errorHandlerPlugin = fastifyPlugin(async (app, options) => {
  app.setErrorHandler(function (error, request, reply) {
    const isProduction = env.NODE_ENV === "production";

    if (error instanceof ZodError) {
      reply.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        error: httpStatus["400_NAME"],
        coode: isProduction ? undefined : error.code,
        message: error.errors,
      });
    } else {
      // TODO: ignore error stack here
      // remove code in error if in production
      reply
        .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .send(isProduction ? _.omit(error, "code") : error);
    }
  });
});

export default errorHandlerPlugin;
