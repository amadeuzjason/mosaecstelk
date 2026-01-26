
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const fileContent = fs.readFileSync(envPath, 'utf-8')
  console.log('File content length:', fileContent.length)
  const envConfig = dotenv.parse(fileContent)
  console.log('Parsed config keys:', Object.keys(envConfig))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
} else {
  console.log('Env file not found at:', envPath)
}

console.log('Env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateEvents() {
  console.log('Migrating Events...')
  const events = await prisma.event.findMany({
    where: {
      image: {
        startsWith: '/uploads/'
      }
    }
  })

  for (const event of events) {
    if (!event.image) continue
    const filename = path.basename(event.image)
    const localPath = path.join(process.cwd(), 'public', event.image)
    
    try {
      const fileBuffer = await fsPromises.readFile(localPath)
      const { error } = await supabase.storage
        .from('events_img')
        .upload(filename, fileBuffer, {
          contentType: 'image/jpeg', // approximate, or detect
          upsert: true
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('events_img')
        .getPublicUrl(filename)

      await prisma.event.update({
        where: { id: event.id },
        data: { image: publicUrl }
      })
      console.log(`Migrated event image: ${filename}`)
    } catch (e) {
      console.error(`Failed to migrate event image ${filename}:`, e)
    }
  }
}

async function migrateMembers() {
  console.log('Migrating Members...')
  const members = await prisma.member.findMany({
    where: {
      image: {
        startsWith: '/uploads/'
      }
    }
  })

  for (const member of members) {
    if (!member.image) continue
    const filename = path.basename(member.image)
    const localPath = path.join(process.cwd(), 'public', member.image)
    
    try {
      const fileBuffer = await fsPromises.readFile(localPath)
      const { error } = await supabase.storage
        .from('members_img')
        .upload(filename, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('members_img')
        .getPublicUrl(filename)

      await prisma.member.update({
        where: { id: member.id },
        data: { image: publicUrl }
      })
      console.log(`Migrated member image: ${filename}`)
    } catch (e) {
      console.error(`Failed to migrate member image ${filename}:`, e)
    }
  }
}

async function migratePeriods() {
  console.log('Migrating Periods...')
  const periods = await prisma.period.findMany({
    where: {
      image: {
        startsWith: '/uploads/'
      }
    }
  })

  for (const period of periods) {
    if (!period.image) continue
    const filename = path.basename(period.image)
    const localPath = path.join(process.cwd(), 'public', period.image)
    
    try {
      const fileBuffer = await fsPromises.readFile(localPath)
      const { error } = await supabase.storage
        .from('period_img')
        .upload(filename, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('period_img')
        .getPublicUrl(filename)

      await prisma.period.update({
        where: { id: period.id },
        data: { image: publicUrl }
      })
      console.log(`Migrated period image: ${filename}`)
    } catch (e) {
      console.error(`Failed to migrate period image ${filename}:`, e)
    }
  }
}

async function main() {
  await migrateEvents()
  await migrateMembers()
  await migratePeriods()
  console.log('Migration complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
