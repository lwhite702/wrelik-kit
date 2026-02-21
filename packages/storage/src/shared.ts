/**
 * Shared storage types and helpers.
 * @module @wrelik/storage/shared
 */
import { ValidationError } from '@wrelik/errors';

export function validateUpload(
  file: { contentType: string; sizeBytes: number },
  policy: { maxSizeBytes: number; allowedTypes: string[] },
) {
  if (file.sizeBytes > policy.maxSizeBytes) {
    throw new ValidationError(`File too large. Max ${policy.maxSizeBytes} bytes.`);
  }
  if (!policy.allowedTypes.includes(file.contentType)) {
    throw new ValidationError(`Invalid file type ${file.contentType}`);
  }
  return true;
}

export interface StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

export interface UploadPolicy {
  maxSizeBytes: number;
  allowedTypes: string[];
}
