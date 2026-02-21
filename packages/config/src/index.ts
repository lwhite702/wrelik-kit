/**
 * @deprecated Use @wrelik/config/server for server-side config loading
 * or @wrelik/config/client for client-side config loading.
 * 
 * The root export will be removed in a future version.
 * 
 * This entrypoint no longer calls dotenv.config() automatically.
 * Use createEnv(schema, { loadDotenv: true }) to load .env explicitly.
 */
export * from './shared';
export { createEnv, loadServerConfig, loadEnvFromCwd, type CreateEnvOptions } from './server';
