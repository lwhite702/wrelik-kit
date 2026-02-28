export const serverOnlyClientStub = (() => {
  throw new Error(
    '@wrelik/upstash/client is a server-only adapter stub. Use @wrelik/upstash/server on the backend.',
  );
})();
