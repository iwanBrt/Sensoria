import { neon } from '@neondatabase/serverless';

// Vercel Postgres / Neon connection URL
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

export const isDbConfigured = () => {
  return typeof connectionString === 'string' && connectionString.startsWith('postgres');
};

export const getDb = () => {
  if (!isDbConfigured()) {
    return null;
  }
  return neon(connectionString);
};
