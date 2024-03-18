import { hashRawPassword } from "@/utils/crypt";
import { PrismaClient, User } from "@prisma/client";
import _ from "lodash";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(username: string, email: string, password: string) {
    // check email exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new Error("Email already exists");
    }

    const secret = await hashRawPassword(password);
    const newUser = await this.prisma.user.create({
      data: {
        name: username,
        email,
        secret,
      },
    });

    return _.omit(newUser, "secret");
  }
}
