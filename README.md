# App - GymPass style

## Requisitos Funcionais (RF)
- [ ] user should be able to sign-up;
- [ ] user should be able to sign-in;
- [ ] should be able to get a user profile when signed-in;
- [ ] user should be able to get the check-ins amount done in the past when signed-in;
- [ ] user should be able to get check-ins historic;
- [ ] user should be able to get the nearest gyms;
- [ ] user should be able to get gyms by name;
- [ ] user should be able to check in at a gym;
- [ ] Should be able to validate the user check-in;
- [ ] Should be able to register a gym.


## Regras de Negócio (RN)
- [ ] user shouldn't be able to register with a duplicate email;
- [ ] user shouldn't be able to do 2 check-ins on the same day;
- [ ] user shouldn't be able to do a check-in if not within 100 meters of the gym;
- [ ] check-in can only be validated within 20 minutes of its creation;
- [ ] check-in can only be validated by admins;
- [ ] gyms can only be registered by admins.


## Requisitos Não Funcionais (RNF)
- [ ] users passwords must be encrypted;
- [ ] API data must be persisted in a PostgreSQL database;
- [ ] all lists of data must be paginated with 20 items per page;
- [ ] user must be authenticated using JWT (JSON Web Token).

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

Create tables
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


# Docker


 











