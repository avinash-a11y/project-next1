// This script checks for required environment variables
const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

let missingVars = [];

// Check each required variable
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

// Report missing variables
if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease add these variables to your Vercel project environment variables:');
  console.error('1. Go to your Vercel Dashboard');
  console.error('2. Select your project');
  console.error('3. Navigate to Settings > Environment Variables');
  console.error('4. Add the missing variables\n');
  
  // Exit with error code
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ All required environment variables are set!');
} 