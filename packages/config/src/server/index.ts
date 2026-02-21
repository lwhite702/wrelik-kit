import { z } from 'zod';
import type { EnvInput } from '../shared';

function formatIssues(issues: z.ZodIssue[]): string {
  return issues.map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`).join('; ');
}

export function loadServerConfig<T extends z.ZodRawShape>(
  schema: T,
  env: EnvInput = process.env as EnvInput,
): z.infer<z.ZodObject<T>> {
  const parsed = z.object(schema).safeParse(env);

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables: ${formatIssues(parsed.error.issues)}`);
  }

  return parsed.data;
}

export function assertServerEnvForBuild<T extends z.ZodRawShape>(
  schema: T,
  env: EnvInput = process.env as EnvInput,
): void {
  loadServerConfig(schema, env);
}
