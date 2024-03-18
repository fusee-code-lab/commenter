import { AuthService } from "@/services/auth_service";
import { UserService } from "@/services/user_service";
import { ResponsePack } from "@/utils/restful";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const loginSchema = z.object({
  credential: z.string(),
  password: z.string().min(8),
});

export const AuthRoutes: FastifyPluginAsync = async (server) => {
  server.post<{ Body: z.infer<typeof loginSchema> }>(
    "/login",
    { schema: { body: loginSchema } },
    async (request, reply) => {
      const service = server.container.resolve(AuthService);
      const user = await service.loginByCredential(request.body.credential, request.body.password);
    },
  );
};
