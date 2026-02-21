import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { loadClientConfig } from './index';

describe('@wrelik/config/client', () => {
  it('loads public config values only', () => {
    const config = loadClientConfig(
      {
        EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
      },
      {
        EXPO_PUBLIC_APP_ENV: 'development',
        DATABASE_URL: 'postgres://secret',
      },
    );

    expect(config.EXPO_PUBLIC_APP_ENV).toBe('development');
  });

  it('rejects non-public keys in client schema', () => {
    expect(() =>
      loadClientConfig(
        {
          DATABASE_URL: z.string(),
        },
        {
          DATABASE_URL: 'postgres://secret',
        },
      ),
    ).toThrow(/not public/);
  });
});
