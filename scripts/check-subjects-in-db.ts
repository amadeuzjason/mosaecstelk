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
  const questions = await prisma.question.findMany({
    select: {
      grade: true,
      subject: true
    }
  })
  
  const subjectsMap: Record<string, Set<string>> = {}
  questions.forEach(q => {
    if (!subjectsMap[q.grade]) {
      subjectsMap[q.grade] = new Set()
    }
    subjectsMap[q.grade].add(q.subject)
  })
  
  console.log('--- Subjects in DB grouped by Grade ---')
  for (const grade in subjectsMap) {
    console.log(`\nGrade: ${grade}`);
    console.log(`Subjects:`, Array.from(subjectsMap[grade]));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
