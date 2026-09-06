import { defineConfig } from '@prisma/orm-postgres/config'

export default defineConfig({
  contract: {
    schema: './prisma/schema.prisma',
    output: './src/generated/prisma'
  },
  db: {
    connection: process.env.DATABASE_URL
  }
})
