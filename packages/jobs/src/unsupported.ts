/**
 * This entrypoint throws an error when imported in React Native environments.
 * @wrelik/jobs is server-only and cannot be used in client/mobile environments.
 * 
 * @module @wrelik/jobs/react-native
 */

const message =
  '@wrelik/jobs is server-only and cannot be used in client/mobile environments. ' +
  'Trigger jobs via a backend API instead.';

export default function unsupported() {
  throw new Error(message);
}

// Named exports that throw when accessed
export const initJobs = () => {
  throw new Error(message);
};

export const emit = () => {
  throw new Error(message);
};

export const createFunction = () => {
  throw new Error(message);
};

export const inngest = null;

// Re-export shared types (safe for client)
export type { JobConfig, JobTrigger, CronTrigger, JobHandler } from './shared';
