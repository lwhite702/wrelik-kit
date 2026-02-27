import { describe, expect, it } from 'vitest';

describe('@wrelik/jobs/client', () => {
  it('fails fast with a server-only adapter message', async () => {
    await expect(import('./index.js')).rejects.toThrow(/server-only adapter stub/i);
  });
});
