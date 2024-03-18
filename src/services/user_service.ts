import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}
}
