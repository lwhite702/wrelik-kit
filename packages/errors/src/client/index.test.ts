import { describe, expect, it } from 'vitest';
import { normalizeError } from './index';

describe('@wrelik/errors/client', () => {
  it('exposes error normalization but not server capture helpers', async () => {
    const mod = await import('./index.js');

    expect(typeof mod.normalizeError).toBe('function');
    expect('captureError' in mod).toBe(false);
    expect('initErrors' in mod).toBe(false);
  });

  it('normalizes errors with a client-safe entrypoint', () => {
    const normalized = normalizeError(new Error('client-boom'));
    expect(normalized.code).toBe('INTERNAL_ERROR');
    expect(normalized.message).toBe('client-boom');
  });
});
