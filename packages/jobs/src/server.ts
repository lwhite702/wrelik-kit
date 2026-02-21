/**
 * Server-side job helpers using Inngest.
 * @module @wrelik/jobs/server
 */
// eslint-disable-next-line no-restricted-imports
import { Inngest } from 'inngest';
import type { JobConfig, JobTrigger, CronTrigger, JobHandler } from './shared';

export * from './shared';

let client: Inngest | null = null;

export function initJobs(config: JobConfig) {
  client = new Inngest({ id: config.appId });
}

function getClient() {
  if (!client) throw new Error('Jobs not initialized. Call initJobs first.');
  return client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function emit(eventName: string, payload: any) {
  return getClient().send({
    name: eventName,
    data: payload,
  });
}

export function createFunction<T = unknown>(
  name: string,
  trigger: JobTrigger | CronTrigger,
  handler: JobHandler<T>,
) {
  return getClient().createFunction({ id: name }, trigger, handler);
}

export { client as inngest };
