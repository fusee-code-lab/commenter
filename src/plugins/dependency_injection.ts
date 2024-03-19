import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { DependencyContainer, container } from "tsyringe";

declare module "fastify" {
  interface FastifyInstance {
    container: DependencyContainer;
  }
}

const dependencyInjectionPlugin: FastifyPluginAsync = fastifyPlugin(async (app, options) => {
  app.decorate("container", container);
});

export default dependencyInjectionPlugin;
