import { UserService } from "@/services/user_service";
import { ResponsePack } from "@/utils/response_pack";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const userSignupSchema = z.object({
  email: z.string().email(),
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
        request.body.email,
        request.body.password,
      );

      return ResponsePack({ data: newUser, message: "User created" });
    },
  );
};
