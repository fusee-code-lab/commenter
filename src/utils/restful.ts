import createError from "@fastify/error";
import { FastifyError } from "fastify";
import httpStatus from "http-status";

export function ResponsePack<T>(props: { statusCode?: number; data: T; message?: string }) {
  return {
    statusCode: props.statusCode ?? httpStatus.OK,
    data: props.data,
    message: props.message,
  };
}

// common errors
export const UnauthorizedError = createError(
  httpStatus["401_NAME"],
  httpStatus["401_MESSAGE"],
  httpStatus.UNAUTHORIZED,
);
