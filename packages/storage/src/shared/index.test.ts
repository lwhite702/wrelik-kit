import { describe, expect, it } from 'vitest';
import { validateUpload } from './index';

describe('@wrelik/storage/shared', () => {
  it('validates upload policy', () => {
    const policy = { maxSizeBytes: 100, allowedTypes: ['image/png'] };

    expect(() => validateUpload({ contentType: 'image/png', sizeBytes: 50 }, policy)).not.toThrow();
    expect(() => validateUpload({ contentType: 'image/jpeg', sizeBytes: 50 }, policy)).toThrow(
      /Invalid file type/,
    );
    expect(() => validateUpload({ contentType: 'image/png', sizeBytes: 150 }, policy)).toThrow(
      /File too large/,
    );
  });
});
