
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars manually like check-data.ts
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

async function migrate() {
  console.log('Starting migration...');

  // 1. Migrate Period Images
  console.log('\n--- Checking Periods ---');
  const periods = await prisma.period.findMany();
  for (const period of periods) {
    if (period.image && period.image.startsWith('http')) {
      console.log(`Period ${period.year} already has Supabase image.`);
      continue;
    }

    // Look for local file
    const periodDir = path.join(ASSETS_DIR, 'periode', period.year.toString());
    if (!fs.existsSync(periodDir)) {
        console.log(`No local directory for period ${period.year}`);
        continue;
    }

    const files = fs.readdirSync(periodDir);
    const teamPhoto = files.find(f => f.toLowerCase().includes(`tim${period.year}`));

    if (teamPhoto) {
      console.log(`Found local team photo for ${period.year}: ${teamPhoto}`);
      const filePath = path.join(periodDir, teamPhoto);
      const publicUrl = await uploadImage('period_img', filePath, teamPhoto);
      if (publicUrl) {
        await prisma.period.update({
          where: { id: period.id },
          data: { image: publicUrl },
        });
        console.log(`Updated Period ${period.year} with ${publicUrl}`);
      }
    } else {
        console.log(`No team photo found for period ${period.year} in ${periodDir}`);
    }
  }

  // 2. Migrate Member Images
  console.log('\n--- Checking Members ---');
  
  const periodDirs = fs.readdirSync(path.join(ASSETS_DIR, 'periode'));
  for (const yearStr of periodDirs) {
      const yearDir = path.join(ASSETS_DIR, 'periode', yearStr);
      if (!fs.statSync(yearDir).isDirectory()) continue;

      const year = parseInt(yearStr);
      const period = periods.find(p => p.year === year);
      
      if (!period) {
          console.log(`Skipping folder ${yearStr} - no matching period in DB`);
          continue;
      }

      const files = fs.readdirSync(yearDir);
      for (const file of files) {
          if (file.toLowerCase().includes(`tim${year}`)) continue; // Skip team photos
          
          const namePart = path.parse(file).name; // e.g. "JASON DARYL AMADEUS"
          
          // Find member
          const member = await prisma.member.findFirst({
              where: {
                  name: {
                      contains: namePart,
                      mode: 'insensitive'
                  },
                  image: null // Only update if no image
              }
          });

          if (member) {
              console.log(`Found match: File "${file}" -> Member "${member.name}"`);
              const filePath = path.join(yearDir, file);
              const publicUrl = await uploadImage('members_img', filePath, file);
              if (publicUrl) {
                  await prisma.member.update({
                      where: { id: member.id },
                      data: { image: publicUrl }
                  });
                  console.log(`Updated Member ${member.name}`);
              }
          }
      }
  }

  console.log('\nMigration completed.');
}

async function uploadImage(bucket: string, filePath: string, filename: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const safeFilename = `${Date.now()}-${filename.replace(/\s/g, '-')}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(safeFilename, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error(`Error uploading ${filename}:`, error.message);
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(safeFilename);

    return data.publicUrl;
  } catch (error) {
    console.error(`Exception uploading ${filename}:`, error);
    return null;
  }
}

migrate()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
