import { describe, expect, it } from 'vitest';

describe('@wrelik/sentry-next/server', () => {
  it('fails fast because this wrapper is client-only', async () => {
    await expect(import('./index.js')).rejects.toThrow(/client-only adapter stub/i);
  });
});
