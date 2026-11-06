import { PrismaClient } from '@prisma/client'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'

// Engine type "client": o Prisma não usa binário nativo, e sim um driver adapter.
// O datasource do schema continua sendo a fonte da verdade para o caminho do banco.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  let url = process.env.DATABASE_URL ?? 'file:./db/custom.db'
  url = url.replace(/^file:/, '')

  return new PrismaClient({
    adapter: new PrismaBetterSQLite3({ url }),
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
