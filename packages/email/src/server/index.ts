/* eslint-disable no-restricted-imports */
import { Resend } from 'resend';
import { ValidationError } from '@wrelik/errors/shared';
import type { SendEmailOptions, TemplateRenderer } from '../shared';

export function createEmailServer(config: { apiKey: string; defaultFromAddress: string }) {
  const client = new Resend(config.apiKey);
  const templates = new Map<string, TemplateRenderer<unknown>>();
  const sendEmail = async ({ to, subject, html, text, from, tags }: SendEmailOptions) => {
    const result = await client.emails.send({
      from: from ?? config.defaultFromAddress,
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
  };

  return {
    sendEmail,

    defineTemplate<T>(id: string, renderer: TemplateRenderer<T>) {
      templates.set(id, renderer as TemplateRenderer<unknown>);
    },

    async sendTemplate<T>(id: string, to: string | string[], data: T, options?: Partial<SendEmailOptions>) {
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
    },
  };
}
