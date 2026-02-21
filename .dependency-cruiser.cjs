/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {
        path: '^packages/',
      },
      to: {
        circular: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    includeOnly: '^packages/',
    exclude: ['(^|/)dist/', '\\.test\\.ts$'],
    tsPreCompilationDeps: true,
  },
};
