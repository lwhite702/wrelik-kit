import { z } from 'zod';
import { commonSchema } from './shared';

export * from './shared';

export function loadEnvFromCwd(options?: { path?: string }) {
  const dotenv = require('dotenv');
  const path = require('path');
  
  const envPath = options?.path || path.resolve(process.cwd(), '.env');
  return dotenv.config({ path: envPath });
}

export interface CreateEnvOptions {
  loadDotenv?: boolean;
  dotenvPath?: string;
}

export function createEnv<T extends z.ZodRawShape>(
  schema: T,
  options: CreateEnvOptions = {},
) {
  const { loadDotenv = false, dotenvPath } = options;

  if (loadDotenv) {
    loadEnvFromCwd({ path: dotenvPath });
  }

  const envSchema = z.object({ ...commonSchema, ...schema });
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

export function loadServerConfig(options?: CreateEnvOptions) {
  return createEnv({}, options);
}
