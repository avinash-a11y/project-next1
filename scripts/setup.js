// This script is run during the build process to ensure Prisma is properly initialized

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to prisma schema
const prismaSchemaPath = path.join(__dirname, '../db/prisma/schema.prisma');

// Check if prisma schema exists
if (!fs.existsSync(prismaSchemaPath)) {
  console.error(`Prisma schema not found at ${prismaSchemaPath}`);
  process.exit(1);
}

console.log('Running Prisma generate...');

// Run prisma generate with the correct schema path
exec(`npx prisma generate --schema=${prismaSchemaPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running Prisma generate: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`Prisma generate stderr: ${stderr}`);
  }
  
  console.log(`Prisma generate output: ${stdout}`);
  console.log('Prisma generate completed successfully!');
}); 