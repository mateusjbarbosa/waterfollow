import z from "zod";

const envSchema = z.object({
  DB_HOST: z.string().trim().min(1),
  DB_NAME: z.string().trim().min(1),
  DB_PASSWORD: z.string().trim().min(1),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string().trim().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]),
  RESEND_API_KEY: z.string().trim().min(1),
});

type Env = z.infer<typeof envSchema>;
export const ENV: Env = envSchema.parse(process.env);
