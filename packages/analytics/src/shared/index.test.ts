import { describe, expect, it } from 'vitest';
import { validateEventName } from './index';

describe('@wrelik/analytics/shared', () => {
  it('accepts valid event names', () => {
    expect(() => validateEventName('app.page.view')).not.toThrow();
  });

  it('rejects invalid event names', () => {
    expect(() => validateEventName('invalid')).toThrow(/must follow/);
  });
});
