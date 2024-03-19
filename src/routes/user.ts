import { UserService } from "@/services/user_service";
import { ResponsePack, UnauthorizedError } from "@/utils/restful";
import fastify, { FastifyPluginAsync } from "fastify";
import httpStatus from "http-status";
import { z } from "zod";

const userSignupSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export const UserRoutes: FastifyPluginAsync = async (server) => {
  server.post<{ Body: z.infer<typeof userSignupSchema> }>(
    "/signup",
    { schema: { body: userSignupSchema } },
    async (request, reply) => {
      const service = server.container.resolve(UserService);
      const newUser = await service.createUser(
        request.body.username,
        request.body.password,
        request.body.email,
      );

      return ResponsePack({
        data: newUser,
        message: "User created",
        statusCode: httpStatus.CREATED,
      });
    },
  );

  // retrive self info
  server.get("/", async (request, reply) => {
    // reply 401 if not logged in
    if (!request.session.user) {
      throw UnauthorizedError();
    }
    return ResponsePack({ data: request.session.user });
  });
};
