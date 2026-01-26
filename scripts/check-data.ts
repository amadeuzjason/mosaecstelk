
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- Events (First 5) ---')
  const events = await prisma.event.findMany({ take: 5 })
  events.forEach(e => console.log(`ID: ${e.id}, Title: ${e.title}, Image: ${e.image}`))

  console.log('\n--- Periods (All) ---')
  const periods = await prisma.period.findMany()
  periods.forEach(p => console.log(`ID: ${p.id}, Year: ${p.year}, Period: ${p.period}, Image: ${p.image}`))

  console.log('\n--- Members (First 10) ---')
  const members = await prisma.member.findMany({ take: 10 })
  members.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, Image: ${m.image}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
