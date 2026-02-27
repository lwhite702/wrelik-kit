export const clientOnlyServerStub = (() => {
  throw new Error(
    '@wrelik/sentry-next/server is a client-only adapter stub. Use @wrelik/sentry-next/client in Next.js client instrumentation files.',
  );
})();
