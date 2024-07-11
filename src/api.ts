import Fastify from 'fastify';
import { ENV } from './env';

const fastify = Fastify({
  logger: true
})

fastify.listen({ port: ENV.PORT }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
