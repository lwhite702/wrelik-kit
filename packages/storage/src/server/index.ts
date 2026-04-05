import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ValidationError } from '@wrelik/errors/shared';

export interface StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

export interface StorageServer {
  putObject: (
    body: Buffer | Uint8Array | Blob | string,
    key: string,
    contentType: string,
    metadata?: Record<string, string>,
  ) => Promise<unknown>;
  getSignedUploadUrl: (key: string, contentType: string, expiresIn?: number) => Promise<string>;
  getSignedDownloadUrl: (key: string, expiresIn?: number) => Promise<string>;
}

export interface StorageServerDependencies {
  client?: {
    send: (command: unknown) => Promise<unknown>;
  };
  signUrl?: (client: unknown, command: unknown, options: { expiresIn: number }) => Promise<string>;
}

function assertNonEmpty(value: string, field: string): void {
  if (!value?.trim()) {
    throw new ValidationError(`${field} is required`);
  }
}

function assertExpiresIn(expiresIn: number): void {
  if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
    throw new ValidationError('expiresIn must be a positive integer');
  }
}

export function createStorageServer(config: StorageConfig, deps?: StorageServerDependencies): StorageServer {
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  const client =
    deps?.client ??
    new S3Client({
      region: config.region ?? 'auto',
      endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  const signUrl =
    deps?.signUrl ??
    ((client: unknown, command: unknown, options: { expiresIn: number }) =>
      getSignedUrl(client as S3Client, command as PutObjectCommand | GetObjectCommand, options));

  return {
    putObject(body, key, contentType, metadata) {
      assertNonEmpty(key, 'key');
      assertNonEmpty(contentType, 'contentType');
      return client.send(
        new PutObjectCommand({
          Bucket: config.bucketName,
          Key: key,
          Body: body,
          ContentType: contentType,
          Metadata: metadata,
        }),
      );
    },

    getSignedUploadUrl(key, contentType, expiresIn = 3600) {
      assertNonEmpty(key, 'key');
      assertNonEmpty(contentType, 'contentType');
      assertExpiresIn(expiresIn);
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        ContentType: contentType,
      });
      return signUrl(client, command, { expiresIn });
    },

    getSignedDownloadUrl(key, expiresIn = 3600) {
      assertNonEmpty(key, 'key');
      assertExpiresIn(expiresIn);
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      });
      return signUrl(client, command, { expiresIn });
    },
  };
}

let storageSingleton: StorageServer | null = null;

function requireStorageSingleton(): StorageServer {
  if (!storageSingleton) {
    throw new Error(
      '@wrelik/storage/server compatibility API is not initialized. Call initStorage(config) before putObject/getSignedUploadUrl/getSignedDownloadUrl.',
    );
  }

  return storageSingleton;
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createStorageServer(...) and explicit dependency wiring.
 */
export function initStorage(config: StorageConfig, deps?: StorageServerDependencies): void {
  storageSingleton = createStorageServer(config, deps);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createStorageServer(...).putObject(...)
 */
export function putObject(
  body: Parameters<StorageServer['putObject']>[0],
  key: string,
  contentType: string,
  metadata?: Record<string, string>,
): ReturnType<StorageServer['putObject']> {
  return requireStorageSingleton().putObject(body, key, contentType, metadata);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createStorageServer(...).getSignedUploadUrl(...)
 */
export function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn?: number,
): ReturnType<StorageServer['getSignedUploadUrl']> {
  return requireStorageSingleton().getSignedUploadUrl(key, contentType, expiresIn);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createStorageServer(...).getSignedDownloadUrl(...)
 */
export function getSignedDownloadUrl(key: string, expiresIn?: number): ReturnType<StorageServer['getSignedDownloadUrl']> {
  return requireStorageSingleton().getSignedDownloadUrl(key, expiresIn);
}
