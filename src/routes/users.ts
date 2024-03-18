import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const UserRoutes: FastifyPluginAsync = async (server) => {
  server.post("/signup", {
    schema: {
        body: z.object({
            email: z.string().email(),
            username: z.string().min(3),
            password: z.string().min(8),
        })
    }
  }, async (request, reply) => {
    return { hello: "world" };
  });
};
