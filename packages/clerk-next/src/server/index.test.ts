import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/clerk-next/server', () => {
  it('re-exports the nextjs server clerk helpers', async () => {
    const auth = vi.fn();
    const clerkClient = vi.fn();
    const clerkMiddleware = vi.fn();
    const createRouteMatcher = vi.fn();

    vi.doMock('@clerk/nextjs/server', () => ({
      auth,
      clerkClient,
      clerkMiddleware,
      createRouteMatcher,
    }));

    const mod = await import('./index.js');
    expect(mod.auth).toBe(auth);
    expect(mod.clerkClient).toBe(clerkClient);
    expect(mod.clerkMiddleware).toBe(clerkMiddleware);
    expect(mod.createRouteMatcher).toBe(createRouteMatcher);
  });
});
