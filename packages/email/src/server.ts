/**
 * Server-side email helpers using Resend.
 * @module @wrelik/email/server
 */
// eslint-disable-next-line no-restricted-imports
import { Resend } from 'resend';
import { ValidationError } from '@wrelik/errors';
import type { SendEmailOptions, EmailConfig } from './shared';

export * from './shared';

let client: Resend;
let defaultFrom: string;

export function initEmail(config: EmailConfig) {
  client = new Resend(config.apiKey);
  defaultFrom = config.defaultFrom;
}

function getClient() {
  if (!client) throw new Error('Email not initialized. Call initEmail first.');
  return client;
}

export async function sendEmail({ to, subject, html, text, from, tags }: SendEmailOptions) {
  const result = await getClient().emails.send({
    from: from || defaultFrom,
    to,
    subject,
    html,
    text,
    tags,
    react: null,
  });

  if (result.error) {
    throw new Error(`Failed to send email: ${result.error.message}`);
  }

  return result.data;
}

// Template Registry
type TemplateRenderer<T> = (data: T) => { subject: string; html: string; text?: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templates = new Map<string, TemplateRenderer<any>>();

export function defineTemplate<T>(id: string, renderer: TemplateRenderer<T>) {
  templates.set(id, renderer);
}

export async function sendTemplate<T>(
  id: string,
  to: string | string[],
  data: T,
  options?: Partial<SendEmailOptions>,
) {
  const renderer = templates.get(id);
  if (!renderer) {
    throw new ValidationError(`Template ${id} not found`);
  }

  const { subject, html, text } = renderer(data);
  return sendEmail({
    to,
    subject,
    html,
    text,
    ...options,
  });
}
