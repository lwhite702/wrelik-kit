import { Inngest } from 'inngest';
import type { JobTrigger } from '../shared';
export type { JobTrigger } from '../shared';

export interface JobsClient {
  send: (payload: { name: string; data: unknown }) => Promise<unknown>;
  createFunction: (config: { id: string }, trigger: JobTrigger, handler: (args: unknown) => Promise<unknown>) => unknown;
}

export function createJobsServer(
  appId: string,
  options?: { client?: JobsClient; createClient?: (appId: string) => JobsClient },
) {
  const client =
    options?.client ??
    options?.createClient?.(appId) ??
    ((new Inngest({ id: appId }) as unknown) as JobsClient);

  return {
    emit(eventName: string, payload: unknown) {
      return client.send({
        name: eventName,
        data: payload,
      });
    },

    createFunction(name: string, trigger: JobTrigger, handler: (args: unknown) => Promise<unknown>) {
      return client.createFunction({ id: name }, trigger, handler);
    },
  };
}

type JobsServerCompat = ReturnType<typeof createJobsServer>;

let jobsSingleton: JobsServerCompat | null = null;

function requireJobsSingleton(): JobsServerCompat {
  if (!jobsSingleton) {
    throw new Error(
      '@wrelik/jobs/server compatibility API is not initialized. Call initJobs(appId) before emit/createFunction.',
    );
  }

  return jobsSingleton;
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createJobsServer(...) and explicit dependency wiring.
 */
export function initJobs(appId: string, options?: Parameters<typeof createJobsServer>[1]): void {
  jobsSingleton = createJobsServer(appId, options);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createJobsServer(...).emit(...)
 */
export function emit(eventName: string, payload: unknown): Promise<unknown> {
  return requireJobsSingleton().emit(eventName, payload);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createJobsServer(...).createFunction(...)
 */
export function createFunction(
  name: string,
  trigger: JobTrigger,
  handler: (args: unknown) => Promise<unknown>,
): unknown {
  return requireJobsSingleton().createFunction(name, trigger, handler);
}
