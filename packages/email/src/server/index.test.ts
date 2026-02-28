import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValidationError } from '@wrelik/errors/shared';
import { createEmailServer } from './index';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/email/server', () => {
  it('registers templates and applies default sender in sendTemplate', async () => {
    const send = vi.fn(async () => ({ data: { id: 'msg_1' }, error: null }));
    const email = createEmailServer(
      { apiKey: 'rk_test', defaultFromAddress: 'hello@wrelik.com' },
      { transport: { emails: { send } } },
    );

    email.defineTemplate('welcome', (data: { name: string }) => ({
      subject: `Welcome ${data.name}`,
      html: `<p>${data.name}</p>`,
      text: data.name,
    }));

    const result = await email.sendTemplate('welcome', 'lee@example.com', { name: 'Lee' });

    expect(result).toEqual({ id: 'msg_1' });
    expect(send).toHaveBeenCalledWith({
      from: 'hello@wrelik.com',
      to: 'lee@example.com',
      subject: 'Welcome Lee',
      html: '<p>Lee</p>',
      text: 'Lee',
      tags: undefined,
      react: null,
    });
  });

  it('throws a validation error when template is missing', async () => {
    const email = createEmailServer(
      { apiKey: 'rk_test', defaultFromAddress: 'hello@wrelik.com' },
      { transport: { emails: { send: vi.fn() } } },
    );

    await expect(email.sendTemplate('missing', 'a@b.com', {})).rejects.toThrow(ValidationError);
  });

  it('surfaces provider errors from sendEmail', async () => {
    const email = createEmailServer(
      { apiKey: 'rk_test', defaultFromAddress: 'hello@wrelik.com' },
      {
        transport: {
          emails: {
            send: vi.fn(async () => ({ data: null, error: { message: 'provider down' } })),
          },
        },
      },
    );

    await expect(
      email.sendEmail({
        to: 'a@b.com',
        subject: 'Hello',
        html: '<p>hi</p>',
      }),
    ).rejects.toThrow(/provider down/);
  });

  it('compatibility singleton throws before initEmail', async () => {
    const mod = await import('./index.js');
    expect(() =>
      mod.sendEmail({
        to: 'a@b.com',
        subject: 'Hello',
        html: '<p>hi</p>',
      }),
    ).toThrow(/initEmail/i);
  });

  it('compatibility singleton delegates after initEmail', async () => {
    const send = vi.fn(async () => ({ data: { id: 'msg_2' }, error: null }));
    const mod = await import('./index.js');

    mod.initEmail(
      { apiKey: 'rk_test', defaultFromAddress: 'hello@wrelik.com' },
      { transport: { emails: { send } } },
    );
    mod.defineTemplate('receipt', (data: { total: number }) => ({
      subject: `Receipt ${data.total}`,
      html: `<p>${data.total}</p>`,
      text: String(data.total),
    }));

    await mod.sendTemplate('receipt', 'lee@example.com', { total: 42 });
    await mod.sendEmail({ to: 'lee@example.com', subject: 'Ping', text: 'pong' });

    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenNthCalledWith(1, {
      from: 'hello@wrelik.com',
      to: 'lee@example.com',
      subject: 'Receipt 42',
      html: '<p>42</p>',
      text: '42',
      tags: undefined,
      react: null,
    });
    expect(send).toHaveBeenNthCalledWith(2, {
      from: 'hello@wrelik.com',
      to: 'lee@example.com',
      subject: 'Ping',
      html: undefined,
      text: 'pong',
      tags: undefined,
      react: null,
    });
  });
});
