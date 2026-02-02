import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function createEnv<T extends z.ZodRawShape>(schema: T) {
  const envSchema = z.object(schema);
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

// Common schemas
export const commonSchema = {
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
};
