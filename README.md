# App - GymPass style

## Requisitos Funcionais (RF)
- [x] user should be able to sign-up;
- [x] user should be able to sign-in;
- [x] should be able to get a user profile when signed-in;
- [x] user should be able to get the check-ins amount done in the past when signed-in;
- [x] user should be able to get check-ins historic;
- [x] user should be able to get the nearest gyms, max-distance: 10km;
- [x] user should be able to get gyms by name;
- [x] user should be able to check in at a gym;
- [x] Should be able to validate the user check-in;
- [x] Should be able to register a gym.


## Regras de Negócio (RN)
- [x] user shouldn't be able to register with a duplicate email;
- [x] user shouldn't be able to do 2 check-ins on the same day;
- [x] user shouldn't be able to do a check-in if not within 100 meters of the gym;
- [x] check-in can only be validated within 20 minutes of its creation;
- [ ] check-in can only be validated by admins;
- [ ] gyms can only be registered by admins.


## Requisitos Não Funcionais (RNF)
- [x] users passwords must be encrypted;
- [x] API data must be persisted in a PostgreSQL database;
- [x] all lists of data must be paginated with 20 items per page;
- [x] user must be authenticated using JWT (JSON Web Token).

# First steps
1) Create a `package.json` file:
 ```bash
npm init -y 
```

1) Install typescript and @types/node:
 ```bash
npm i typescript @types/node -D
```

1) Install tsx to enable Node.js to execute .ts files:

 ```bash
npm i tsx -D
```

Add a script to package.json for the tsx CLI:

```
"start:dev": "tsx watch src/server.ts"
```


4) Install tsup for building:

 ```bash
npm i tsup -D
```

Add a script to package.json for the tsup CLI:

```
"build": "tsup src --out-dir build"
```

Add a script to package.json to execute the built code:

```
 "start": "node build/server.js"
```

5) Create a `tsconfig.json` file:

 ```bash
npx tsc --init
```

Don't forget to change "target" to "es2020".


6) Install fastify
 ```bash
npm i fastify
```

7) .npmrc
Create a `.npmrc` file with the content below:

```
save-exact=true
```

This will fix the versions of our package dependencies.


8) Environment variables
Create a `.env` file with the content below:
```
NODE_ENV=dev
```

Install dotenv lib.

```bash
npm i dotenv
```

Use a Zod schema to validate the environment variables.

`src/env/index.ts` with content below:

```
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('❌ Invalid environment variables!', _env.error.format())

    throw new Error('❌ Invalid environment variables!')
}


export const env = _env.data
```

9) Eslint config: 
Install eslint and @rocketseat/eslint

```bash
npm i eslint @rocketseat/eslint-config -D
```

Create a `.eslintrc.json` file with content below:

```
{
    "extends": "@rocketseat/eslint-config/react",
}
```

Install eslint-plugin-simple-import-sort
```bash
npm i --save-dev eslint-plugin-simple-import-sort
```

```
{
    "extends": "@rocketseat/eslint-config/react",
    "plugins": ["simple-import-sort"],
    "rules": {
        "simple-import-sort/imports": "error"
    }
}
```

Create `.eslintignore` file:
node_modules
build


10) Create import aliases
inside `tsconfig.json`: 

```
"baseUrl": "./",                                  
"paths": {
    "@/*": ["./src/*"]
},     
```


# Prisma - Object Relational Mapper (ORM)
Type-safety & auto-completion.
Automated migrations.


```bash
npm i prisma -D

```

Initialize the database connnections with prisma 

```bash
npx prisma init
```

## Tables creation with Prisma

Example:

```
model [table_table] {
  id String @id @default(uuid())

  name     String
  email    String
  password String @unique

  @@map([change_table_name])
}

```

**Create tables or update tables**
```bash
npx prisma generate
```

## Initialize database connection 

```bash
npm i @prisma/client
```

Example:
```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Cristian Giehl',
    email: 'cristian@example.com',
    password: '12345678',
  },
})

```

Create a `prisma.ts` file to isolate our Prisma client.
The log configuration will show the queries made in every request to our database.

```
import { PrismaClient } from '@prisma/client'

import { env } from '@/env'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

```

## Prisma Studio
It will run a Prisma-related schema on port 5555.

```bash
npx prisma studio
```

# Docker
Install the Bitnami package for PostgreSQL. 
We are using Bitnami images because they seem to be more efficient in security than the common PostgreSQL images.

POSTGRESQL_USERNAME=docker => PostgreSQL default username	
POSTGRESQL_PASSWORD=docker => password for the PostgreSQL created user	
POSTGRESS_DATABASE=apisolid => default PostgreSQL database	

-p host_port:container_port

```bash
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5430:5432 bitnami/postgresql:latest
```

list historic of dockers containers created
```bash
docker ps -a
```

start docker container
```bash
docker start <container_name or ID>
```

stop docker container
```bash
docker stop <container_name or ID>
```
 
delete docker container
```bash
docker rm <container_name or ID>
```

show docker container logs
```bash
docker logs <container_name or ID>
```

watch docker container logs
```bash
docker logs <container_name or ID> -f
```

Test if the container is working
The CLI command below will check if the Prisma tables exist in our Docker container; if not, it will create them.

It should create a new folder called migrations inside our Prisma folder with our new migration.
```bash
npx prisma migrate dev
```

**Don't forget to configure the `DATABASE_URL` in our `.env` file, as automatically generated by Prisma for our Docker container. It should be similar to below:**

```
DATABASE_URL="postgresql://docker:docker@localhost:5430/apisolid?schema=public"
```

## Docker Compose
Will contain the information about all containers needed for our API to run.

Create a `docker-compose.yml` file.

```
version: '3'

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5430:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=apisolid 
```

Start and execute all api docker containers
-d => roda o banco de dados detached (background) sem ficar mostrando os logs no terminal
```bash
docker compose up -d
```

Stop all api docker containers
```bash
docker compose stop
```

Stop and delete all api docker containers
```bash
docker compose down
```

# Controllers & Routes
For better usage and clean code, separate your HTTP requests into individual files for each request.

For better usage and clean code, separate your routes into a single file that call each controller and register this function using `app.register()` from fastify, will work as a fastify plugin.


# bcryptjs - password Hashing
Commonly used library for hashing passwords.

```bash
npm i bcryptjs
```

```bash
npm i -D @types/bcryptjs
```
Use the `hash(password, round as number)` function for hashing your password.

# Use-cases or Services
A use-case folder in the back-end generally contains code related to specific use cases of the application, meaning the main operations and business logic that the application needs to execute. Each use-case represents a particular scenario or functionality that the application must support. The code in this folder typically:
1) Businnes logic;
2) Repository Interaction;
3) Data validation;
4) Service coordination;
5) Transaction management;
6) User interaction.

Create a `services` or `use-case` folder and inside it create the functionalities that the application must support.

## Benefits of a Use-Case Structure:

- Organization: Helps keep the code organized and modularized, making maintenance and understanding easier.
- Reusability: Allows for the reuse of business logic in different parts of the application.
- Testability: Facilitates the creation of specific tests for each use case, improving test coverage and application reliability.

## Error handling for use-cases
Create one file for each type of the most common errors that can occur in the application.

Example:
```
export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists! 👹')
  }
}

```
Usage:
```
  try {
    const userRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(userRepository)

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message }
    } else {
      return reply.status(500).send()
    }
  }
```

# Global error handling
Use Fastify's ErrorHandler to handle errors that are outside the scope of our services' errors.

```
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
```

# Repository Pattern
The Repository Pattern is a design pattern used in software development to manage data access and operations in a way that separates the application's business logic from the data access logic. It provides a layer of abstraction between the data source (e.g., a database) and the application's business logic, making the codebase cleaner and more maintainable.

## Key Concepts of the Repository Pattern:
- Abstraction;
- Separation of Concerns;
- Centralized Data Access;
- Unit of Work.

## Benefits of the Repository Pattern:
- Encapsulation;
Testability;
Maintainability;
Flexibility;

Import `Prisma` from `@prisma/client`; it contains the types for the tables that have already been created.

Create a `repositories` folder; inside it, for each table, create a file that will contain the CRUD operations (create, read, update, delete).

This code separation will provide maintainability and make it easier to change the ORM (Prisma) we are using by isolating the code related to it.

# SOLID 
## S
## O
## L
## I

## D - Dependency Inversion Principle
In your `services.ts` file remove all dependencies on Prisma, and create a class with a constructor that will receive a repository.

By doing that ou services and controllers should be like below:

`user controller for register`
```
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { RegisterService } from '@/services/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService({ prismaUsersRepository })

    await registerService.execute({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
```

`register service`

```
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error(`E-mail already exists! 👹`)
    }

    const passwordHash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}

```

Create a type for `userRepository`, the constructor used in `register service` to ensure better IntelliSense and avoid typos. It will related to our current ORM (prisma) in the `prisma-users-repository` file and will indicate all functionalities needed for that table.

```
import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
```

```
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
```



# Design Patterns & Tests

## Vitest

vite-tsconfig-paths plugin  is used so that Vitest can understand the paths in the `tsconfig.json` file.

```bash
npm i vitest vite-tsconfig-paths -D
```

Create a `vite.config.ts` file:
```
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
})
```

Create a script in `package.json`:

```
{
    scripts: {
        "test": "vitest run",
        "test:watch": "vitest"
    }
}
```

Example:
**Make sure your individual tests don't affect your production database.**
In the example below, you can see that we aren't using our Prisma connection to ensure that the password is hashed. Instead, we are passing a "fake" UserRepository as a parameter to our `RegisterService class`. The production one is the `PrismaUsersRepository class`.

```
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { RegisterService } from './register'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterService({
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
```

## Test Coverage
```
{
    script: {
        "test:coverage": "vitest run --coverage"
    }
}
```
This will generate a `coverage` folder that contains our test coverage reports, allowing us to see which parts of our code are not covered by tests.


## Vitest UI
Install @vitest/ui package.

```bash
npm i -D @vitest/ui
```

Create a new script: 

```
{
    script: {
        "test:ui": "vitest --ui"
    }
}
```

# API CONSTRUCTION WORKFLOW
1) Use cases or services
2) Tests
3) Controller


# Factory Pattern
The Factory Pattern is a design pattern used to abstract the creation of objects. Instead of instantiating objects directly, you use a factory that manages the creation of these objects. This allows the client code (the code using the objects) to not need to know which concrete class is being instantiated.


## Why Use the Factory Pattern?
Decoupling;
Ease of Extension;
Centralization of Creation Logic.


## Example
```
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { RegisterService } from '../register'

export function makeRegisterService() {
  const userRepository = new PrismaUsersRepository()
  const registerService = new RegisterService(userRepository)

  return registerService
}
```
## Usage
```
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error'
import { makeRegisterService } from '@/services/factories/make-register-service'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    // without factory pattern
    // const userRepository = new PrismaUsersRepository()
    // const registerService = new RegisterService(userRepository)

    // with factory pattern
    **const registerService = makeRegisterService()**

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
```

# TDD - Test-Driven Development
Test-Driven Development (TDD) is a software development approach that focuses on creating automated tests before writing the functional code.

## Core Principles of TDD:
1) Red-Green-Refactor: This is the development cycle in TDD:
- Red: Write a test that fails. The test should be as simple as possible  and should fail because the desired functionality hasn't been implemented yet.
- Green: Write the minimum code necessary to make the test pass. The focus here is on getting the test to pass quickly, without worrying about code quality.
- Refactor: Refactor the code to improve its structure and quality, ensuring all tests still pass.

2) Unit Tests: Tests are usually unit tests, focusing on small units of functionality, such as individual methods or classes.

3) Automation: Tests are automated and part of the continuous integration pipeline, ensuring that any code changes are automatically verified

Example in `check-in.spec` 


# dayjs
```bash
npm i dayjs
```


# JWT with Fastify
There are three primary authentication strategies:
- Basic Auth
- JSON Web Token (JWT)
- Cookies

## JWT
When using JWT for authentication, the process generally works as follows:

1) User Login: The user logs in by sending their email and password to the backend.

2) Token Creation: The backend generates a unique, non-modifiable, and stateless token.
   - Stateless: This means the token is not stored in any persistent data structure (like a database).
  
3) Token Generation: When creating the token, the backend uses a secret key (a string) to sign the token.
   - Example Secret Key: dkosajdoasiojfidjoopksajifgakopsfnbcvcnmvxoiqw

4) Token Structure: The generated token has the following structure: `header.payload.signature`

After the user is authenticated, all subsequent requests from the user include the JWT in the request headers, typically in the format: Authorization: Bearer <JWT>.

### JWT STRUCTURE
A JWT consists of three parts:

1) Header
2) Payload
3) Signature
Each of these parts is encoded in Base64URL and concatenated with a dot (.).

### Example of Encoded JWT
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. --> HEADER
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ. --> PAYLOAD
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c --> SIGN


### Example of Decoded JWT
1) HEADER
The header typically consists of two parts:
- alg: The algorithm used to sign the token (e.g., HS256).
- typ: The type of token, which is JWT.

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
2) PAYLOAD
The payload contains the claims. Claims are statements about an entity (typically, the user) and additional metadata. In this example:

- sub: The subject of the token, typically the user ID.
- name: The name of the user.
- iat: The issued-at timestamp (when the token was created).
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

3) VERIFY SIGNATURE
The signature is used to verify that the token hasn’t been tampered with. It’s created by taking the encoded header, the encoded payload, a secret key, and the algorithm specified in the header.
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  
your-256-bit-secret

) secret base64 encoded
```
your-256-bit-secret: This is the secret key used by the backend to sign the token. It must be kept secure on the server.

## Install

```bash
npm i @fastify/jwt
```

## Config
In your file that contains the fastify() instance, you need to register the FastifyJwt plugin.

Create a new environment variable to set the `JWT_SECRET`. Make sure to include this variable in the `envSchema` for validation."

```
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
```

After registering the JWT plugin, the Fastify reply and request objects will have new options available, like `jwtSign`.

Use `jwtSign` to create a new JWT, typically used in authentication routes.

In the `sign`, send the user.id to be accessible in all routes of the app.

```
  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
      },
    },
  )
```
## jwtVerify()
1º The function will retrieve the token from the headers.
2º If the token exists, it will validate whether the token was created by our API.
3º If the validation fails, it will return an Error.

It is better to use middleware to perform the validation on each route you want.

Example:
```
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
```

Usage:

```
app.get('/me', { onRequest: [verifyJwt] }, profile)
```


## Typescript declariton merging
If we send data through the token, it's necessary to indicate it to the TypeScript interpreter.

"Create a `@types` folder and inside it, create a `fastify-jwt.d.ts` file with the following code:"

```
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: number
    }
  }
}
```

# Test environment
End-to-end tests need to use a real database (not in memory), but we cannot use the same database for both production and testing.

End-to-end tests will require more memory on the user's computer, which comes at the cost of performance. They are slower than unit tests, but more efficient and closer to real user requests.

Currently, `Vitest` doesn't support direct environment configurations. To work around this, you need to create a folder inside the prisma directory in your project's root called `vitest-environment-prisma`, and then run:

```bash
npm init-y
```

**The folder name must begin with `vitest-environment`**

1) Test Environment Configuration
Create a new file `prisma-test-environment.ts` and don't forget to update the `main` field in the `package.json`.

```
export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Setup.')

    return {
      teardown() {
        console.log('Teardown')
      },
    }
  },
}
```

3) `package.json` inside Test Environment folder.

The `name` must be the same as the folder name.

```
{
  "name": "vitest-environment-prisma",
  "version": "1.0.0",
  "description": "",
  "main": "prisma-test-environment.ts",
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Our `root package.json` needs to access this `env package.json`. To do that run: 

```bash
npm link
```

**Don't forget to run this CLI command inside de environment folder**


In the root of our project, run: 
```bash
npm link vitest-environment-prisma
```

**IMPORTANT!**
The `npm link` will only work locally. When you deploy the application to a server, you will need to run the command again. To automate this, create a script to execute this command. Otherwise, the root package.json will not be able to access the environment package.json.

**NOTE: When you write a script in the `package.json` file, if the script name has a `pre` or `post` prefix, it will affect how the script is executed:**
- `pre` scripts will be executed before the main script.
- `post` scripts will be executed after the main script.

Example:
```
{
  scripts: {
    "pretest": "echo before hi",
    "test": "echo this is your main script",
    "posttest": "echo hi after"
  }
}
```

Terminal sequence:
```
echo before hi
echo this is your main script
echo hi after
```

4) Update root package.json 
`npm-run-all` will ensure that scripts are compatible with the current operating system.

```bash
npm i -D npm-run-all
```

All of this said, adjust the package.json file in the root of your project:

```
{
  scripts: {
    "test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma",
    "test:install-prisma-environment": "npm link vitest-environment-prisma",
    "pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment",
    "test:e2e": "vitest run --dir src/http/",
  }
}
```

**Running `npm run test:e2e` will execute all the scripts above.**


1) `vite.config.ts`
The `environmentMatchGlobs` must be:
1º The path where the tests are located;
2º The name of the test environment set inside the `vitest-environment` folder.

**The name defined within the environment configuration must match the name following vitest-environment in the folder name.**

```
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/tests/**', 'prisma']],
    dir: 'src',
  },
})
```

6) Testing the new environment
To check if the Vitest environment is working, create a new `.spec` file in the specified path and run:

```bash
npm run test
```

It should be working and executing for each file inside the specified path.


## End-to-end (e2e) tests are typically executed in CI (continuous Integration).
End-to-end tests verify the overall functionality of a system by simulating user interactions. They test the integration of various components to ensure that the entire application works as expected.

E2E tests are often resource-intensive and require a consistent environment. Running them in a CI environment provides a clean and controlled setting, which helps in accurately assessing the integration of different parts of the application.

Continuous Integration (CI) systems automatically build, test, and deploy code changes. They provide a consistent environment for running tests, which is ideal for e2e tests that need a stable setup to simulate real user interactions.

Because of that, it is recommended to split the scripts for unit tests and e2e tests:
- Unit Tests: Ideal for local execution during development.
- E2E Tests: Best suited for execution in CI environments to ensure consistent and accurate results.

In your `root package.json` do the following:
```
{
  scripts: {
    "test": "vitest run --dir src/services",
    "test:watch": "vitest --dir src/services",
    "test:e2e": "vitest run --dir src/http/"
  }
}
```

# PostgreSQL Schemas
In PostgreSQL, a schema is a namespace within a database that allows you to organize and manage your database objects (such as tables, views, functions, etc.) more efficiently. Instead of splitting your database into multiple databases, you can use schemas to logically group related objects within the same database.

Imagine you have an application with two different modules: auth and sales. Instead of creating separate databases for each module, you can create separate schemas within a single database:
- auth schema: Contains tables like users, roles, permissions.
- sales schema: Contains tables like orders, products, customers.

## How Schemas Work
- **Default Schema:** When you create objects without specifying a schema, they are placed in the `public` schema by default.
**Accessing Objects:** You can access objects within a schema using the schema_name.object_name syntax. For example, auth.users refers to the users table within the auth schema.

## Advantages
- **Organization**: Schemas help in organizing database objects logically.
- **Access Control:** You can assign different permissions to different schemas, providing better access control.
- **Simplified Development:** Developers can work on different modules independently without interfering with each other's work.

## Implementing
We are using `migrate deploy` instead of `migrate dev` because 
`migrate dev` will compare the local schema with the existing database 
schema, which can lead to conflicts or unintended changes during 
development. migrate deploy is better suited for deploying migrations i
n production environments, as it only applies the migrations that
haven't been executed yet, without altering the current database 
schema unexpectedly. 

`execSync` allows us to execute CLI commands directly within our code, synchronously, meaning the code will wait for the command to complete before moving on to the next operation.

`async setup()` will be executed before each test.
`async teardown()` will be executed after each test.

```
import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
```

# Supertest lib
```bash
npm i -D supertest @types/supertest
```
Supertest is a popular Node.js library used for testing HTTP servers. It is particularly useful for testing APIs because it allows you to make HTTP requests to your server and assert the responses.

## Why Use Supertest?
- **End-to-End Testing:** Supertest is ideal for end-to-end testing of your API, ensuring that your server behaves as expected.
- **Integration Testing:** It can be used to test the integration of various parts of your application, like controllers, middleware, and routes.
- **Ease of Use:** Its intuitive and chainable API makes it simple to write tests that are both readable and maintainable.


## Example
```
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
```

# IMPORTANT!!!!! EVERY QUERY PARAMS WILL BE SENT AS A STRING.



# Refresh Token
The concept of a Refresh Token is central to token-based authentication systems, such as `OAuth 2.0` and `JWT (JSON Web Token)`. It is used to enhance the security and usability of authenticated sessions, allowing a user to maintain an active session for an extended period without needing to re-authenticate repeatedly.


## Cookie and Refresh Token
Storing the `refresh token` in a cookie is a common security practice in web development.

```bash
npm i @fastify/cookie
```

It will unlock the `setCookie()` function on our reply object.

### setCookie() explanation of each configuration option:
1) path: '/'
- Definition: Specifies the URL path for which the cookie is valid.
- Purpose: Setting the path to '/' makes the cookie available across the entire domain.

2) secure: true
- Definition: Ensures that the cookie is only sent over secure HTTPS connections.
- Purpose: Enhances security by preventing the cookie from being transmitted over unencrypted HTTP connections.

3) sameSite: 'true' / 'strict'
- Definition: Controls whether the cookie is sent with cross-site requests.
- Purpose: 'true' / 'strict' value means the cookie will only be sent if the request originates from the same site that set the cookie. This prevents the cookie from being sent with requests initiated by third-party sites, enhancing security against cross-site request forgery (CSRF) attacks.

4) httpOnly: true
- Definition: Specifies that the cookie is accessible only via HTTP(S) and not available to JavaScript running in the browser.
- Purpose: Prevents client-side scripts from accessing the cookie, which helps protect against cross-site scripting (XSS) attacks by ensuring that sensitive data is not exposed to client-side scripts.

#### Setcookie() Summary
- path: '/': The cookie is valid for the entire domain.
- secure: true: The cookie is only sent over HTTPS connections.
- sameSite: 'Strict': The cookie is only sent with requests originating from the same site, protecting against CSRF attacks.
- httpOnly: true: The cookie is not accessible via JavaScript, protecting against XSS attacks.


## How the Refresh Token Works:
1) Initial Authentication:

- When the user logs in, the server issues two tokens: an `Access Token` and a `Refresh Token`.
- The `Access Token` has a short validity, usually lasting a few minutes to a few hours. It is used to authenticate the user's requests to APIs and protected resources.
- The `Refresh Token` has a longer validity, potentially lasting days, weeks, or even months.

2) Using the Access Token:
- As long as the Access Token is valid, it is sent along with requests to authorize access to protected resources. This is usually done in the Authorization header.

3) Expiration of the Access Token:
- When the Access Token expires, the user can no longer access protected resources. However, instead of requiring the user to log in again, the Refresh Token is used.

4) Using the Refresh Token:
- The Refresh Token is sent to the server in a specific request to obtain a new Access Token.
- If the Refresh Token is valid and has not expired, the server issues a new Access Token and, in some cases, also a new Refresh Token.

5) Session Renewal:
- The cycle of obtaining new Access Tokens using the Refresh Token can continue until the Refresh Token expires or is revoked.

6) Security:
- The Refresh Token must be handled with great security, as it allows obtaining new Access Tokens. It is usually stored in a more secure location, such as HttpOnly cookies, to protect against cross-site scripting (XSS) attacks.

## Advantages of Using Refresh Tokens:
- **Long and Secure Sessions:** Allows for long sessions without the user needing to re-authenticate repeatedly, improving the user experience.
- **Reduced Exposure:** Since the Access Token has a short lifespan, the exposure in case of compromise is reduced. Even if an access token is stolen, it quickly becomes useless.
- **Revocation:** The Refresh Token can be revoked in situations such as user logout or detection of suspicious activity.


## Example:
`app.ts`
```
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
```

`authenticate.ts`
```
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({ email, password })

    // create a new access token
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // create a new refresh token
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
```

`refresh.ts`
It will check if the refreshToken exists inside our cookies. If it doesn’t, it will return an error."

```
await request.jwtVerify({ onlyCookie: true })
```

```
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  // create a new access token
  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  // create a new refresh token
  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
```

# Role-Based Access Control (RBAC)
A widely used approach for managing permissions and access within systems. It assigns roles to users, and each role has specific permissions associated with it. Here’s a breakdown of the RBAC context:

## Key Concepts:
1) Roles:
- Definition: Roles are predefined sets of permissions that are assigned to users. A role represents a job function or position within an organization.
- Examples: Admin, Manager, User, Guest. 

2) Permissions:
- Definition: Permissions define what actions can be performed on specific resources or data.
- Examples: Read, Write, Delete, Execute.

3) Users:
- Definition: Users are individuals who access the system and are assigned roles. Each user can have one or more roles.
- Example: John Doe (Admin), Jane Smith (User).


4) Role Assignments:
- Definition: Role assignments link users to roles. A user can be assigned one or multiple roles depending on their responsibilities.
- Example: John Doe is assigned the Admin role, giving him access to all system functions.

## fastify-jwt.d.ts

```
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
```

## authenticate.ts (token creation)

```
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({ email, password })

    // create a new access token
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // create a new refresh token
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
```

## refresh.ts
```
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  // update a new access token
  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  // update a new refresh token
  const refreshToken = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
```

## Create a middleware to handle role verification

```
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({
        message:
          'Your role does not have the necessary privileges to perform this action.',
      })
    }
  }
}
```

You can apply the middleware in the controllers, specifying the required role.

```
app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
```

# Continuous Integration (CI) | Continuous Deployment/Delivery (CD)

## Continuous Integration (CI) 
Is a development practice where code changes are frequently integrated into a shared repository.


## Continuous Deployment (CD) and Continuous Delivery (CD) 
Are practices that extend Continuous Integration to automate the deployment of code changes to production or staging environments.

## Github Actions
In the root of the project, create a `.github` folder. Inside it, create another folder named `workflows`.

Inside the `workflows` folder, create the workflow files you want to execute. The files need to be `.yml`

You can also use pre-defined actions available in the GitHub Actions Marketplace.


`Action.yml` file example: 

```
name: Run Unit Tests

on: [push]

jobs:
  run-unit-tests:
    name: Run Unit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      
      - run: npm test
```