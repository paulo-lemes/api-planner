import { z } from "zod";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("API_BASE_URL:", process.env.API_BASE_URL);
console.log("WEB_BASE_URL:", process.env.WEB_BASE_URL);

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
