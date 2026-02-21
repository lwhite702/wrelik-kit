import { z } from 'zod';
import { isPublicEnvKey, type EnvInput } from '../shared';

function formatIssues(issues: z.ZodIssue[]): string {
  return issues.map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`).join('; ');
}

export function loadClientConfig<T extends z.ZodRawShape>(
  schema: T,
  env: EnvInput = process.env as EnvInput,
): z.infer<z.ZodObject<T>> {
  const schemaKeys = Object.keys(schema);

  for (const key of schemaKeys) {
    if (!isPublicEnvKey(key)) {
      throw new Error(`Client config key "${key}" is not public. Use NEXT_PUBLIC_* or EXPO_PUBLIC_*.`);
    }
  }

  const publicEnv = Object.fromEntries(schemaKeys.map((key) => [key, env[key]]));
  const parsed = z.object(schema).strict().safeParse(publicEnv);

  if (!parsed.success) {
    throw new Error(`Invalid client environment variables: ${formatIssues(parsed.error.issues)}`);
  }

  return parsed.data;
}
