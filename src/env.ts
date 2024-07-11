import z from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().trim().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;
export const ENV: Env = envSchema.parse(process.env);
