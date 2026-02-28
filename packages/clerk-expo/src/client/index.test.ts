import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/clerk-expo/client', () => {
  it('re-exports the expo clerk client helpers', async () => {
    const ClerkProvider = vi.fn();
    const useAuth = vi.fn();
    const useSignIn = vi.fn();
    const useUser = vi.fn();

    vi.doMock('@clerk/clerk-expo', () => ({
      ClerkProvider,
      useAuth,
      useSignIn,
      useUser,
    }));

    const mod = await import('./index.js');
    expect(mod.ClerkProvider).toBe(ClerkProvider);
    expect(mod.useAuth).toBe(useAuth);
    expect(mod.useUser).toBe(useUser);
  });
});
