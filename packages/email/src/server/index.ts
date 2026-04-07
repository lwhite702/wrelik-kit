import { Resend } from 'resend';
import { ValidationError } from '@wrelik/errors/shared';
import type { SendEmailOptions, TemplateRenderer } from '../shared';
export type { SendEmailOptions, TemplateRenderer } from '../shared';

export interface EmailTransport {
  emails: {
    send: (input: {
      from: string;
      to: string | string[];
      subject: string;
      html?: string;
      text?: string;
      tags?: Array<{ name: string; value: string }>;
      react: null;
    }) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
}

export function createEmailServer(
  config: { apiKey: string; defaultFromAddress: string },
  options?: { transport?: EmailTransport },
) {
  const client: EmailTransport = options?.transport ?? new Resend(config.apiKey);
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

type EmailServerCompat = ReturnType<typeof createEmailServer>;

let emailSingleton: EmailServerCompat | null = null;

function requireEmailSingleton(): EmailServerCompat {
  if (!emailSingleton) {
    throw new Error(
      '@wrelik/email/server compatibility API is not initialized. Call initEmail({ apiKey, defaultFromAddress }) before sendEmail/sendTemplate.',
    );
  }

  return emailSingleton;
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createEmailServer(...) and explicit dependency wiring.
 */
export function initEmail(
  config: { apiKey: string; defaultFromAddress: string },
  options?: Parameters<typeof createEmailServer>[1],
): void {
  emailSingleton = createEmailServer(config, options);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createEmailServer(...).defineTemplate(...)
 */
export function defineTemplate<T>(id: string, renderer: TemplateRenderer<T>): void {
  requireEmailSingleton().defineTemplate(id, renderer);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createEmailServer(...).sendEmail(...)
 */
export function sendEmail(input: SendEmailOptions): Promise<unknown> {
  return requireEmailSingleton().sendEmail(input);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createEmailServer(...).sendTemplate(...)
 */
export function sendTemplate<T>(
  id: string,
  to: string | string[],
  data: T,
  options?: Partial<SendEmailOptions>,
): Promise<unknown> {
  return requireEmailSingleton().sendTemplate(id, to, data, options);
}
