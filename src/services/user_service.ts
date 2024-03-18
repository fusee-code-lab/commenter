import { hashRawPassword } from "@/utils/crypt";
import createError from "@fastify/error";
import { PrismaClient, User } from "@prisma/client";
import _ from "lodash";
import { injectable } from "tsyringe";

const CreateUserError = createError("CREATE_USER_ERROR", "Create user error: %s", 400);

@injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(username: string, password: string, email?: string) {
    // check email exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new CreateUserError("Email already exists");
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
