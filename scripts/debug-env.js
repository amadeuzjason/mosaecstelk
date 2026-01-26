
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env');
console.log('Env path:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file found');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  console.log('Keys found:', Object.keys(envConfig));
  
  if (envConfig.NEXT_PUBLIC_SUPABASE_URL) console.log('NEXT_PUBLIC_SUPABASE_URL is present');
  if (envConfig.SUPABASE_SERVICE_ROLE_KEY) console.log('SUPABASE_SERVICE_ROLE_KEY is present');
} else {
  console.log('.env file NOT found');
}
