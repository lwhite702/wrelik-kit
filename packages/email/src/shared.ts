/**
 * Shared types for email operations.
 * @module @wrelik/email/shared
 */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface EmailConfig {
  apiKey: string;
  defaultFrom: string;
}
