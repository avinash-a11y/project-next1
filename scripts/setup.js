// This script is run during the build process to ensure Prisma is properly initialized

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  // Path to prisma schema
  const prismaSchemaPath = path.join(__dirname, '../db/prisma/schema.prisma');

  // Check if prisma schema exists
  if (!fs.existsSync(prismaSchemaPath)) {
    console.error(`Prisma schema not found at ${prismaSchemaPath}`);
    // Try the schema in the root directory
    const rootSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    if (fs.existsSync(rootSchemaPath)) {
      console.log(`Found Prisma schema at ${rootSchemaPath}`);
      
      console.log('Running Prisma generate with root schema...');
      const output = execSync(`npx prisma generate --schema=${rootSchemaPath}`, { encoding: 'utf-8' });
      console.log(output);
      
      process.exit(0);
    } else {
      console.error('No Prisma schema found. Exiting...');
      process.exit(1);
    }
  }

  console.log('Running Prisma generate...');
  console.log(`Using schema at ${prismaSchemaPath}`);

  // Generate client with simpler options
  const output = execSync(`npx prisma generate --schema=${prismaSchemaPath}`, { encoding: 'utf-8' });
  console.log(output);
  
  console.log('Prisma generate completed successfully!');
} catch (error) {
  console.error('Error running Prisma generate:');
  console.error(error);
  process.exit(1);
} 