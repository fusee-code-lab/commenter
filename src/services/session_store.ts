import { SessionStore } from "@fastify/session";
import { PrismaClient } from "@prisma/client";
import { Session } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class PrismaSessionStore implements SessionStore {
  constructor(private readonly prisma: PrismaClient) {}

  set(sessionId: string, session: Session, callback: (err?: any) => void): void {
    this.prisma.session
      .upsert({
        where: { sid: sessionId },
        update: { data: JSON.stringify(session) },
        create: { sid: sessionId, data: JSON.stringify(session), expires: session.cookie.expires! },
      })
      .then(() => callback())
      .catch(callback);
  }

  get(sessionId: string, callback: (err: any, result?: Session | null | undefined) => void): void {
    this.prisma.session
      .findUnique({ where: { sid: sessionId } })
      .then((session) => {
        if (!session) {
          callback(null, null);
          return;
        }

        callback(null, JSON.parse(session.data));
      })
      .catch(callback);
  }

  destroy(sessionId: string, callback: (err?: any) => void): void {
    this.prisma.session
      .delete({ where: { sid: sessionId } })
      .then(() => callback())
      .catch(callback);
  }
}
