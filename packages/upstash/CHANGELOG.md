# @wrelik/upstash

## 1.1.0

### Minor Changes

- Add platform wrapper packages for Clerk (Next/Expo), Next Sentry client instrumentation, and Upstash server SDK access so apps can avoid direct vendor imports while staying inside the `@wrelik/*` boundary.

  Add temporary deprecated server-side compatibility singleton exports to analytics, email, jobs, and storage to support DRX migration from root-import convenience APIs to runtime subpaths in one cutover.
