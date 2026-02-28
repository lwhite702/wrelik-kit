import { describe, expect, it } from 'vitest';

describe('@wrelik/upstash/client', () => {
  it('fails fast because this wrapper is server-only', async () => {
    await expect(import('./index.js')).rejects.toThrow(/server-only adapter stub/i);
  });
});
