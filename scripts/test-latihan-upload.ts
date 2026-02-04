
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUpload() {
  console.log('Testing upload to latihan_img bucket with ANON key...')

  const fileName = `test_upload_${Date.now()}.png`
  // Create a minimal 1x1 transparent PNG
  const fileContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
  const buffer = fileContent

  try {
    // 1. Test Upload
    console.log(`Uploading ${fileName}...`)
    const { data, error } = await supabase.storage
      .from('latihan_img')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false
      })

    if (error) {
      console.error('Upload failed:', error)
      process.exit(1)
    }
    console.log('Upload successful:', data)

    // 2. Test Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('latihan_img')
      .getPublicUrl(fileName)
    
    console.log('Public URL:', publicUrl)

    // 3. Test Download (optional, but good to check access)
    console.log('Verifying download...')
    const downloadRes = await fetch(publicUrl)
    if (!downloadRes.ok) {
        console.error('Download failed:', downloadRes.statusText)
    } else {
        const arrayBuffer = await downloadRes.arrayBuffer()
        console.log('Downloaded size:', arrayBuffer.byteLength)
        if (arrayBuffer.byteLength === buffer.byteLength) {
            console.log('Content verification successful (size match)!')
        } else {
            console.error('Content verification failed (size mismatch)!')
        }
    }

    // 4. Cleanup
    console.log('Cleaning up...')
    const { error: deleteError } = await supabase.storage
      .from('latihan_img')
      .remove([fileName])
    
    if (deleteError) {
      console.error('Cleanup failed:', deleteError)
    } else {
      console.log('Cleanup successful.')
    }

  } catch (err) {
    console.error('Test execution error:', err)
    process.exit(1)
  }
}

testUpload()
