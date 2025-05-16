/**
 * Dedicated Prisma client initialization file
 * This helps ensure the Prisma client is correctly generated and available
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton instance of the PrismaClient
const prisma = new PrismaClient();

export default prisma; 