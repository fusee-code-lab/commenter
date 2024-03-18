import createError from "@fastify/error";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt";
import _ from "lodash";
import { injectable } from "tsyringe";

const LoginError = createError("LOGIN_ERROR", "Login error: %s", 400);

@injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async loginByCredential(credential: string, password: string) {
    const record = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: credential }, { name: credential }],
      },
    });

    if (!record) {
      throw new LoginError("User not found");
    }

    // compare password
    const passwordMatch = await compareSync(password, record.secret);
    if (!passwordMatch) {
      throw new LoginError("Password not match");
    }

    return _.omit(record, "secret");
  }
}
