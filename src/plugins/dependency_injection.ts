import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { DependencyContainer, container } from "tsyringe";

declare module "fastify" {
  interface FastifyInstance {
    container: DependencyContainer;
  }
}

const dependencyInjectionPlugin: FastifyPluginAsync = fastifyPlugin(async (app, options) => {
  const prisma = app.prisma;
  container.register(PrismaClient, { useValue: prisma });

  // Make Prisma Client available through the fastify server instance: server.prisma
  app.decorate("container", container);
});

export default dependencyInjectionPlugin;
