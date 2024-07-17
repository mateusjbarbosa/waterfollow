import z from "zod";

const envSchema = z.object({
  DB_URL: z.string().trim().url(),
  FRONTEND_URL: z.string().trim().url(),
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number(),
  RESEND_API_KEY: z.string().trim().min(1),
})

type Env = z.infer<typeof envSchema>;
export const ENV: Env = envSchema.parse(process.env);
