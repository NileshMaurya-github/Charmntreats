const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

function getBrevoApiKey() {
  const key = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  if (!key) {
    throw new Error('Missing BREVO_API_KEY or VITE_BREVO_API_KEY environment variable.');
  }
  return key;
}

module.exports = { getBrevoApiKey };
