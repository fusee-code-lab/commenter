import fastify from "fastify";
import { env } from "./env";

const app = fastify({
  logger: {
    transport: env.NODE_ENV === "development" ? {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    } : undefined,
    file: env.NODE_ENV === "production" ? "logs.log" : undefined,
  }
});

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

async function main() {
  try {
    app.log.info("Starting server...");
    app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
