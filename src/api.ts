import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { and, gte, lt } from "drizzle-orm";
import Fastify from "fastify";
import { ZodError, z } from "zod";
import { version } from "../package.json";
import { db } from "./db";
import { ENV } from "./env";
import { HydrationHistory, hydrationHistory } from "./schema";

const fastify = Fastify({
  logger: true,
});

const newHydrationRegistrySchema = z.object({
  quantityInMilliliters: z.number(),
});

fastify.get("/", (_, reply) => {
  reply.send({
    success: true,
    message: `Waterfollow API running | v${version}`,
  });
});

fastify.post("/hydrations", async (request, reply) => {
  try {
    const data = newHydrationRegistrySchema.parse(request.body);

    const newRegistry: HydrationHistory = {
      quantityInMilliliters: data.quantityInMilliliters,
    };
    const result = await db
      .insert(hydrationHistory)
      .values(newRegistry)
      .returning();
    reply.code(201).send({ success: true, data: result });
  } catch (err) {
    if (err instanceof ZodError) {
      reply
        .status(400)
        .send({
          success: false,
          errors: err.issues.map((issue) => ({
            path: issue.path.join(),
            message: issue.message,
          })),
        });
    }
    console.log(err);
    reply.code(500).send({ success: false, message: "Internal server error" });
  }
});

fastify.get("/hydrations", async (_, reply) => {
  try {
    dayjs.extend(utc);
    const todayAtMidnight = dayjs()
      .utc()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    const tomorrowAtMidnight = todayAtMidnight.add(1, "day");
    const result: HydrationHistory[] = await db
      .select()
      .from(hydrationHistory)
      .where(
        and(
          gte(hydrationHistory.hydrationAt, todayAtMidnight.toDate()),
          lt(hydrationHistory.hydrationAt, tomorrowAtMidnight.toDate())
        )
      );
    reply.send({ success: true, data: result });
  } catch (err) {
    console.log(err);
    reply.code(500).send({ success: false, message: "Internal server error" });
  }
});

function isStagingOrProductionEnv() {
  return ["staging", "production"].includes(ENV.NODE_ENV);
}

fastify.listen(
  { port: ENV.PORT, host: isStagingOrProductionEnv() ? "0.0.0.0" : "" },
  function (err) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
