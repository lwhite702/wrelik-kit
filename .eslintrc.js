module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['@wrelik/eslint-config'],
  settings: {
    next: {
      rootDir: ['packages/*/'],
    },
  },
};
