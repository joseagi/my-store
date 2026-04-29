import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import path from 'path'

// process.cwd() always points to project root on Windows
const root = process.cwd()

// Load .env first, then .env.local overrides
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.join(root, '.env') })
  config({ path: path.join(root, '.env.local'), override: true })
}

// Debug — confirm it loaded (remove this line after confirming)
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL)

export default defineConfig({
  schema: path.join(root, 'prisma/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    seed: 'node --env-file=.env --import tsx/esm prisma/seed.ts'
  },
})