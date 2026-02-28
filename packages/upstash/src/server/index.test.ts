import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/upstash/server', () => {
  it('re-exports Redis and Ratelimit server classes', async () => {
    const Redis = vi.fn();
    const Ratelimit = vi.fn();

    vi.doMock('@upstash/redis', () => ({ Redis }));
    vi.doMock('@upstash/ratelimit', () => ({ Ratelimit }));

    const mod = await import('./index.js');
    expect(mod.Redis).toBe(Redis);
    expect(mod.Ratelimit).toBe(Ratelimit);
  });
});
