/**
 * Shared types for job operations.
 * @module @wrelik/jobs/shared
 */

export interface JobConfig {
  appId: string;
}

export interface JobTrigger {
  event: string;
}

export interface CronTrigger {
  cron: string;
}

export type JobHandler<T = unknown> = (args: { data: T }) => Promise<unknown>;
