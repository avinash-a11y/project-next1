import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global;

// Error handling function for Prisma connection issues
function logPrismaConnectionError(error) {
  console.error('Prisma Client Error:');
  console.error(error);
  
  // Additional debugging for DATABASE_URL issues
  if (error.message?.includes('database') || error.message?.includes('connection')) {
    console.error('This may be related to DATABASE_URL environment variable.');
    console.error('Environment check: DATABASE_URL is', 
      process.env.DATABASE_URL ? 'set' : 'NOT SET');
  }
}

let prismaClient;

try {
  prismaClient = 
    globalForPrisma.prisma || 
    new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
} catch (error) {
  logPrismaConnectionError(error);
  // Create a mock client that will throw helpful errors
  prismaClient = new Proxy({}, {
    get() {
      throw new Error(
        'Failed to initialize Prisma Client. Database connection error. Check your DATABASE_URL.'
      );
    },
  });
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

export default prismaClient; 