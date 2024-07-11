import Fastify from 'fastify';
import { db } from './db';
import { ENV } from './env';
import { hydrationHistory } from './schema';

const fastify = Fastify({
  logger: true
})

fastify.post('/', async (_, reply) => {
  await db.insert(hydrationHistory).values({ hydrationAt: new Date(Date.now()), quantityInMilliliters: 300 });
  reply.code(201).send({ success: true, message: "Hydration updated successfully!" })
})

fastify.listen({ port: ENV.PORT }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
