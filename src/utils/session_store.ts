import type { SessionStore } from "@fastify/session";
import type { Prisma, PrismaClient } from "@prisma/client";
import { EventEmitter } from "events";
import { Session } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class PrismaStore implements SessionStore {
  constructor(private readonly prisma: PrismaClient) {}

  set(sessionId: string, session: Session, callback: (err?: any) => void): void {
    throw new Error("Method not implemented.");
  }

  get(sessionId: string, callback: (err: any, result?: Session | null | undefined) => void): void {
    throw new Error("Method not implemented.");
  }

  destroy(sessionId: string, callback: (err?: any) => void): void {
    throw new Error("Method not implemented.");
  }
}
