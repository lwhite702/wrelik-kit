/* eslint-disable no-restricted-imports */
import { Inngest } from 'inngest';
import type { JobTrigger } from '../shared';

export function createJobsServer(appId: string) {
  const client = new Inngest({ id: appId });

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
