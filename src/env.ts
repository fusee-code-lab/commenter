import { z } from "zod";

// import .env file let tsup watch it
// @ts-ignore
import envPath from "../.env";

import dotenv from "dotenv";
dotenv.config({ path: `dist/${envPath}` });

const EnvScheme = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string().transform((val) => parseInt(val)).default("5050"),
    DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvScheme>;
export const env = EnvScheme.parse(process.env);