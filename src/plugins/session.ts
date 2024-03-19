// Correct ✔️:
import { fastifySession } from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";
import { User } from "@prisma/client";

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    user: Omit<User, "secret">;
  }
}
