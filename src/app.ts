import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { CheckInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(CheckInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: '❌ Validation error! ❌', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we should log to on external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error! 😭' })
})
