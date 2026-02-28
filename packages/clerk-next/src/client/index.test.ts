import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/clerk-next/client', () => {
  it('re-exports the nextjs client clerk helpers', async () => {
    const ClerkProvider = vi.fn();
    const SignIn = vi.fn();
    const SignUp = vi.fn();
    const Waitlist = vi.fn();
    const useUser = vi.fn();
    const useAuth = vi.fn();
    const useSignIn = vi.fn();
    const useOrganization = vi.fn();
    const useOrganizationList = vi.fn();
    const OrganizationSwitcher = vi.fn();
    const SignOutButton = vi.fn();
    const UserButton = vi.fn();

    vi.doMock('@clerk/nextjs', () => ({
      ClerkProvider,
      SignIn,
      SignUp,
      Waitlist,
      useUser,
      useAuth,
      useSignIn,
      useOrganization,
      useOrganizationList,
      OrganizationSwitcher,
      SignOutButton,
      UserButton,
    }));

    const mod = await import('./index.js');
    expect(mod.ClerkProvider).toBe(ClerkProvider);
    expect(mod.useAuth).toBe(useAuth);
    expect(mod.UserButton).toBe(UserButton);
  });
});
