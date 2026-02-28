import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValidationError } from '@wrelik/errors/shared';
import { createStorageServer } from './index';

const config = {
  accountId: 'acct',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  bucketName: 'bucket',
};

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/storage/server', () => {
  it('generates signed URL shapes with configured signer', async () => {
    const signUrl = vi.fn(async (_client, command, options: { expiresIn: number }) => {
      const input = (command as { input: { Key: string } }).input;
      return `https://signed.example/${input.Key}?expiresIn=${options.expiresIn}`;
    });

    const storage = createStorageServer(config, {
      client: { send: vi.fn() },
      signUrl,
    });

    await expect(storage.getSignedUploadUrl('uploads/a.png', 'image/png', 60)).resolves.toBe(
      'https://signed.example/uploads/a.png?expiresIn=60',
    );
    await expect(storage.getSignedDownloadUrl('uploads/a.png', 120)).resolves.toBe(
      'https://signed.example/uploads/a.png?expiresIn=120',
    );
  });

  it('validates signed URL input rules', async () => {
    const storage = createStorageServer(config, {
      client: { send: vi.fn() },
      signUrl: vi.fn(async () => 'https://signed.example/ok'),
    });

    expect(() => storage.getSignedUploadUrl('', 'image/png')).toThrow(ValidationError);
    expect(() => storage.getSignedUploadUrl('a.png', '', 60)).toThrow(ValidationError);
    expect(() => storage.getSignedDownloadUrl('a.png', 0)).toThrow(/positive integer/);
  });

  it('compatibility singleton throws before initStorage', async () => {
    const mod = await import('./index.js');
    expect(() => mod.getSignedDownloadUrl('uploads/a.png', 60)).toThrow(/initStorage/i);
  });

  it('compatibility singleton delegates after initStorage', async () => {
    const send = vi.fn(async () => ({ etag: 'etag_1' }));
    const signUrl = vi.fn(async (_client, command, options: { expiresIn: number }) => {
      const input = (command as { input: { Key: string } }).input;
      return `https://signed.example/${input.Key}?expiresIn=${options.expiresIn}`;
    });
    const mod = await import('./index.js');

    mod.initStorage(config, { client: { send }, signUrl });

    await mod.putObject('body', 'uploads/a.png', 'image/png');
    await expect(mod.getSignedUploadUrl('uploads/a.png', 'image/png', 30)).resolves.toBe(
      'https://signed.example/uploads/a.png?expiresIn=30',
    );

    expect(send).toHaveBeenCalledTimes(1);
    expect(signUrl).toHaveBeenCalledTimes(1);
  });
});
