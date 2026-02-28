export const serverOnlyClientStub = (() => {
  throw new Error(
    '@wrelik/db/client is a server-only adapter stub. Use @wrelik/db/server on the backend and call your backend API from client or Expo apps.',
  );
})();
