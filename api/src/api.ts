import cors from "@fastify/cors";
import dayjs from "dayjs";
import { and, gte, lt } from "drizzle-orm";
import Fastify from "fastify";
import { Resend } from "resend";
import { ZodError, z } from "zod";
import { version } from "../package.json";
import { db } from "./db";
import { ENV } from "./env";
import { HydrationHistory, hydrationHistory } from "./schema";

function isStagingOrProductionEnv() {
  return ["staging", "production"].includes(ENV.NODE_ENV);
}

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: isStagingOrProductionEnv() ? ["https://waterfollow-staging-frontend.onrender.com"] : true
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
      reply.status(400).send({
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

const getHydrationHistorySchema = z.object({
  periodInDays: z.coerce.number().optional().default(1),
});

type HydrationHistoryByPeriod = {
  id: string;
  day: string;
  hydration: number;
};

fastify.get("/hydrations", async (request, reply) => {
  const { periodInDays } = getHydrationHistorySchema.parse(request.query);

  try {
    // TODO: update this by user timezone
    const todayAtLastMinute = dayjs()
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);
    const initialDateByPeriod = todayAtLastMinute
      .subtract(periodInDays - 1, "day") // -1 to count today
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    const repositoryResult: HydrationHistory[] = await db
      .select()
      .from(hydrationHistory)
      .where(
        and(
          gte(hydrationHistory.hydrationAt, initialDateByPeriod.toDate()),
          lt(hydrationHistory.hydrationAt, todayAtLastMinute.toDate())
        )
      );

    const hydrationHistoryByPeriod: HydrationHistoryByPeriod[] = [];
    for (const registry of repositoryResult) {
      const date = dayjs(registry.hydrationAt).format("YYYY/MM/DD");
      const indexOfDateInTheArray = hydrationHistoryByPeriod.findIndex(
        (element: HydrationHistoryByPeriod) => element.day === date
      );
      if (indexOfDateInTheArray !== -1) {
        hydrationHistoryByPeriod[indexOfDateInTheArray].hydration +=
          registry.quantityInMilliliters;
      } else {
        hydrationHistoryByPeriod.push({
          id: registry.id!,
          day: date,
          hydration: registry.quantityInMilliliters,
        });
      }
    }
    reply.send({ success: true, data: hydrationHistoryByPeriod });
  } catch (err) {
    console.log(err);
    reply.code(500).send({ success: false, message: "Internal server error" });
  }
});

fastify.get("/reminder", (_, reply) => {
  const resend = new Resend(ENV.RESEND_API_KEY);
  resend.emails.send({
    from: 'onboarding@resend.dev', // TODO: update to waterfollow or mateusjbarbosa.dev e-mail
    to: 'dev.mateusbarbosa@gmail.com', // TODO: update to dynamic as user
    subject: 'Waterfollow - Lembrete de hidratação',
    // TODO: improve
    html: `
      <div>
        <p><strong>Hora de se hidratar!</strong></p>
        <br />
        <p>Acesse: <a href="${ENV.FRONTEND_URL}">${ENV.FRONTEND_URL}</a></p>
      </div>
    `
  });

  reply.send({ success: true, message: "Reminder sent" });
})

fastify.listen(
  { port: ENV.PORT, host: isStagingOrProductionEnv() ? "0.0.0.0" : "" },
  function (err) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
