export const serverOnlyClientStub = (() => {
  throw new Error(
    '@wrelik/email/client is a server-only adapter stub. Use @wrelik/email/server on the backend and call your backend API from client or Expo apps.',
  );
})();
