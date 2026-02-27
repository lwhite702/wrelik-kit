import { afterEach, describe, expect, it, vi } from 'vitest';
import { createJobsServer } from './index';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/jobs/server', () => {
  it('registers functions with the wrapped client and preserves handler signature', async () => {
    const createFunction = vi.fn((_config, _trigger, handler) => handler({ event: { data: { ok: true } } }));
    const send = vi.fn(async () => ({ ids: ['evt_1'] }));
    const jobs = createJobsServer('drx', {
      client: {
        send,
        createFunction,
      },
    });

    const handler = vi.fn(async (args: unknown) => args);
    const result = await jobs.createFunction('sync-user', { event: 'user/sync' }, handler);

    expect(createFunction).toHaveBeenCalledWith({ id: 'sync-user' }, { event: 'user/sync' }, handler);
    expect(handler).toHaveBeenCalledWith({ event: { data: { ok: true } } });
    expect(result).toEqual({ event: { data: { ok: true } } });
  });

  it('sends events through the wrapped client', async () => {
    const send = vi.fn(async () => ({ ids: ['evt_1'] }));
    const jobs = createJobsServer('drx', {
      client: {
        send,
        createFunction: vi.fn(),
      },
    });

    await jobs.emit('user.created', { userId: 'u1' });
    expect(send).toHaveBeenCalledWith({ name: 'user.created', data: { userId: 'u1' } });
  });

  it('compatibility singleton throws before initJobs', async () => {
    const mod = await import('./index.js');
    expect(() => mod.emit('user.created', { userId: 'u1' })).toThrow(/initJobs/i);
  });

  it('compatibility singleton delegates after initJobs', async () => {
    const send = vi.fn(async () => ({ ids: ['evt_99'] }));
    const createFunction = vi.fn((_config, _trigger, handler) => handler({ event: { data: { ok: true } } }));
    const mod = await import('./index.js');

    mod.initJobs('drx-primary', {
      client: {
        send,
        createFunction,
      },
    });

    const handler = vi.fn(async (args: unknown) => args);
    await mod.emit('user.created', { userId: 'u1' });
    const result = await mod.createFunction('sync-user', { event: 'user/sync' }, handler);

    expect(send).toHaveBeenCalledWith({ name: 'user.created', data: { userId: 'u1' } });
    expect(createFunction).toHaveBeenCalledWith({ id: 'sync-user' }, { event: 'user/sync' }, handler);
    expect(result).toEqual({ event: { data: { ok: true } } });
  });
});
