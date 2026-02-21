export type EnvInput = Record<string, string | undefined>;

export const PUBLIC_ENV_PREFIXES = ['NEXT_PUBLIC_', 'EXPO_PUBLIC_'] as const;

export function isPublicEnvKey(key: string): boolean {
  return PUBLIC_ENV_PREFIXES.some((prefix) => key.startsWith(prefix));
}
