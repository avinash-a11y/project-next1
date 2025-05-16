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
      process.env.DATABASE_URL ? 'set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET');
    
    // Log first few characters of DATABASE_URL for troubleshooting (avoid logging full string with credentials)
    if (process.env.DATABASE_URL) {
      const safePrefix = process.env.DATABASE_URL.substring(0, 15) + '...';
      console.error('DATABASE_URL prefix:', safePrefix);
    }
  }
}

// Create a safe Prisma client that won't crash the app
function createSafePrismaClient() {
  try {
    // Check if DATABASE_URL exists before initializing
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set!');
      return createMockClient();
    }
    
    console.log('Initializing Prisma Client...');
    return globalForPrisma.prisma || new PrismaClient({ log: ['error', 'warn'] });
  } catch (error) {
    logPrismaConnectionError(error);
    return createMockClient();
  }
}

// Create a mock client for better error messages
function createMockClient() {
  console.warn('Using mock Prisma client - database operations will fail gracefully');
  
  // This proxy returns graceful errors for all operations
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '$$typeof' || prop === 'then') {
        return undefined;
      }
      
      // Return a function that fails gracefully
      return () => {
        const error = new Error(
          'Database operation failed. Check your DATABASE_URL environment variable.'
        );
        console.error('Mock Prisma client operation failed:', error);
        
        // Return rejected promise for async operations
        return Promise.reject(error);
      };
    }
  });
}

// Initialize the client
const prismaClient = createSafePrismaClient();

// Save to global object in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;
export default prismaClient; 