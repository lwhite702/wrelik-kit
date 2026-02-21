import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { assertServerEnvForBuild, loadServerConfig } from './index';

describe('@wrelik/config/server', () => {
  it('throws when required server env vars are missing', () => {
    expect(() =>
      loadServerConfig(
        {
          DATABASE_URL: z.string().url(),
        },
        {},
      ),
    ).toThrow(/Invalid server environment variables/);
  });

  it('validates required vars during build assertions', () => {
    expect(() =>
      assertServerEnvForBuild(
        {
          DATABASE_URL: z.string().url(),
        },
        {
          DATABASE_URL: 'https://db.example.com',
        },
      ),
    ).not.toThrow();
  });
});
