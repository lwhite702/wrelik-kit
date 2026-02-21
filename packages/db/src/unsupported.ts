/**
 * This entrypoint throws an error when imported in React Native environments.
 * @wrelik/db is server-only and cannot be used in client/mobile environments.
 * 
 * @module @wrelik/db/react-native
 */

const message =
  '@wrelik/db is server-only and cannot be used in client/mobile environments. ' +
  'Access database functionality via a backend API instead.';

export default function unsupported() {
  throw new Error(message);
}

// Named exports that throw when accessed
export const setTenantAccessChecker = () => {
  throw new Error(message);
};

export const assertTenantAccess = () => {
  throw new Error(message);
};

export const withTenant = () => {
  throw new Error(message);
};

export const getPrismaSingleton = () => {
  throw new Error(message);
};

export const createTenantContext = () => {
  throw new Error(message);
};

// Re-export shared types (safe for client)
export type { TenantContext, AccessChecker } from './shared';
