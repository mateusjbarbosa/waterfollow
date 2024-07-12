import Fastify from 'fastify';
import { ZodError, z } from 'zod';
import { db } from './db';
import { ENV } from './env';
import { HydrationHistory, hydrationHistory } from './schema';

const fastify = Fastify({
  logger: true
})

const newHydrationRegistrySchema = z.object({
  quantityInMilliliters: z.number()
})

fastify.post('/hydration', async (request, reply) => {
  try {
    const data = newHydrationRegistrySchema.parse(request.body)

    const newRegistry: HydrationHistory = {
      quantityInMilliliters: data.quantityInMilliliters
    }
    const result = await db.insert(hydrationHistory).values(newRegistry).returning();
    reply.code(201).send({success: true, data: result})
  } catch(err) {
    if (err instanceof ZodError) {
      reply.status(400).send({success: false, errors: err.issues.map(issue => ({ path: issue.path.join(), message: issue.message}))})
    }
    console.log(err)
    reply.code(500).send({success: false, message: "Internal server error"})
  }
})

fastify.get('/hydration', async (_, reply) => {
  try {
    const result: HydrationHistory[] = await db.select().from(hydrationHistory);
    reply.send({success: true, data: result})
  } catch(err) {
    console.log(err)
    reply.code(500).send({success: false, message: "Internal server error"})
  }
})

fastify.listen({ port: ENV.PORT, host: '0.0.0.0' }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
