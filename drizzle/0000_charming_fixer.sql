CREATE TABLE IF NOT EXISTS "hydration_histories" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"hydration_at" timestamp NOT NULL,
	"quantity" integer NOT NULL
);
