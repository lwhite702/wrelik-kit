export const serverOnlyClientStub = (() => {
  throw new Error(
    '@wrelik/jobs/client is a server-only adapter stub. Use @wrelik/jobs/server on the backend and call your backend API from client or Expo apps.',
  );
})();
