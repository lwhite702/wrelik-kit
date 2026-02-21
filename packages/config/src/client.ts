import { z } from 'zod';
import { clientSchema, commonSchema } from './shared';

export * from './shared';

export function loadClientConfig<T extends z.ZodRawShape>(
  extraSchema: T = {} as T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: Record<string, any> = typeof process !== 'undefined' ? process.env : {},
): z.infer<z.ZodObject<{ [K in keyof typeof commonSchema & keyof typeof clientSchema & keyof T]: (typeof commonSchema & typeof clientSchema & T)[K] }>> {
  const mergedSchema = z.object({
    ...commonSchema,
    ...clientSchema,
    ...extraSchema,
  });

  const result = mergedSchema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid client environment variables:', result.error.format());
    throw new Error('Invalid client environment variables');
  }

  return result.data;
}
