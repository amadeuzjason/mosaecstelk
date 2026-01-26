
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('--- Events ---')
  const events = await prisma.event.findMany()
  events.forEach(e => console.log(`ID: ${e.id}, Image: ${e.image}`))

  console.log('\n--- Periods ---')
  const periods = await prisma.period.findMany()
  periods.forEach(p => console.log(`ID: ${p.id}, Year: ${p.year}, Image: ${p.image}`))

  console.log('\n--- Members ---')
  const members = await prisma.member.findMany({ take: 20 })
  members.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, Image: ${m.image}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
