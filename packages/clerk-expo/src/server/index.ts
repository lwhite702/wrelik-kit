export const clientOnlyServerStub = (() => {
  throw new Error(
    '@wrelik/clerk-expo/server is a client-only adapter stub. Use @wrelik/clerk-expo/client in Expo apps.',
  );
})();
