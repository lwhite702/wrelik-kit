/* eslint-disable no-restricted-imports */
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

export function createStorageServer(config: StorageConfig): StorageServer {
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  const client = new S3Client({
    region: config.region ?? 'auto',
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return {
    putObject(body, key, contentType, metadata) {
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
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        ContentType: contentType,
      });
      return getSignedUrl(client, command, { expiresIn });
    },

    getSignedDownloadUrl(key, expiresIn = 3600) {
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      });
      return getSignedUrl(client, command, { expiresIn });
    },
  };
}
