
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
  console.log('Setting up storage policies...')
  
  try {
    // Create buckets if they don't exist
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('events_img', 'events_img', true),
             ('members_img', 'members_img', true),
             ('period_img', 'period_img', true)
      ON CONFLICT (id) DO NOTHING;
    `)
    console.log('Buckets ensured.')

    // Drop existing policies to avoid conflicts (risky but effective for setup)
    // We'll wrap in DO block or just try to create.
    // Better to create if not exists.
    
    // Policy for SELECT (Public Read)
    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Public Access Select" ON storage.objects;
      CREATE POLICY "Public Access Select" ON storage.objects FOR SELECT USING ( bucket_id IN ('events_img', 'members_img', 'period_img') );
    `)

    // Policy for INSERT (Public Upload)
    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Public Access Insert" ON storage.objects;
      CREATE POLICY "Public Access Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('events_img', 'members_img', 'period_img') );
    `)
    
     // Policy for UPDATE (Public Update)
    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Public Access Update" ON storage.objects;
      CREATE POLICY "Public Access Update" ON storage.objects FOR UPDATE USING ( bucket_id IN ('events_img', 'members_img', 'period_img') );
    `)

    console.log('Policies applied.')

  } catch (e) {
    console.error('Error applying policies:', e)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
