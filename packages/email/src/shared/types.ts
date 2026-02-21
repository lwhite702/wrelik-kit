export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  tags?: Array<{ name: string; value: string }>;
}

export type TemplateRenderer<T> = (data: T) => { subject: string; html: string; text?: string };
