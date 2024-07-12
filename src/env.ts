import z from "zod";

const defaultEnvSchema = z.object({
  DB_URL: z.string().trim().url(),
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number(),
  RESEND_API_KEY: z.string().trim().min(1),
});

const stagingEnvSchema = z.object({
  SUPABASE_API_KEY: z.string().trim().min(1)
})

let envSchema;

if (["staging", "production"].includes(process.env.NODE_ENV!)) {
  envSchema = defaultEnvSchema.merge(stagingEnvSchema)
} else {
  envSchema = defaultEnvSchema
}

type Env = z.infer<typeof envSchema>;
export const ENV: Env = envSchema.parse(process.env);
