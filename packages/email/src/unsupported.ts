/**
 * This entrypoint throws an error when imported in React Native environments.
 * @wrelik/email is server-only and cannot be used in client/mobile environments.
 * 
 * @module @wrelik/email/react-native
 */

const message =
  '@wrelik/email is server-only and cannot be used in client/mobile environments. ' +
  'Send emails via a backend API instead.';

export default function unsupported() {
  throw new Error(message);
}

// Named exports that throw when accessed
export const initEmail = () => {
  throw new Error(message);
};

export const sendEmail = () => {
  throw new Error(message);
};

export const defineTemplate = () => {
  throw new Error(message);
};

export const sendTemplate = () => {
  throw new Error(message);
};

// Re-export shared types (safe for client)
export type { SendEmailOptions, EmailConfig } from './shared';
