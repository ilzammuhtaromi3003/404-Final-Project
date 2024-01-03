# Getting Started

First, install pakage:

```bash

npm install

```

## Settings Prisma

You now need to adjust the connection URL in schema.prisma to point to your own database.

postgresql://USER:PASSWORD@HOST:PORT/DATABASE

for example in my local database (postgreSQL)

postgresql://postgres:postgres@localhost:5432/e-commerce

### do migration

```bash

npx prisma migrate dev

```

### do seeding

```bash

npx prisma db seed

```
