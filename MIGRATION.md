# Migration Guide

This guide explains how to migrate to the new server/client/shared subpath exports introduced in wrelik-kit.

## Summary of Changes

All packages now follow a consistent export structure:

```
@wrelik/<package>/server   → Server-only code (Node.js)
@wrelik/<package>/client   → Client-safe code (Browser)
@wrelik/<package>/shared   → Types and pure utilities (both)
@wrelik/<package>/react-native → React Native specific code
```

## Why This Matters

1. **No import-time side effects**: Nothing runs automatically when you import a package
2. **Clear boundaries**: Server-only code can never accidentally end up in client bundles
3. **Tree-shaking friendly**: Smaller bundles by only importing what you need
4. **Type safety**: TypeScript properly resolves types for each environment

---

## @wrelik/config

### Breaking Change: No automatic dotenv loading

**Before:**
```ts
import { createEnv } from '@wrelik/config';
// dotenv.config() was called automatically!
```

**After:**
```ts
// Server-side (explicit dotenv loading)
import { createEnv } from '@wrelik/config/server';

const env = createEnv(schema, { loadDotenv: true });

// Or load manually
import { loadEnvFromCwd } from '@wrelik/config/server';
loadEnvFromCwd({ path: '.env.local' });
```

### Client-side usage
```ts
import { loadClientConfig } from '@wrelik/config/client';
// or React Native
import { loadClientConfig } from '@wrelik/config/react-native';

const config = loadClientConfig();
```

### Shared types only
```ts
import { commonSchema, clientSchema } from '@wrelik/config/shared';
```

---

## @wrelik/auth

### Server-side (Node.js)
```ts
// Before
import { fromClerkAuth } from '@wrelik/auth';

// After (recommended)
import { fromClerkAuth } from '@wrelik/auth/server';
```

### Next.js Server Components
```ts
// Before
import { getSession } from '@wrelik/auth/next';

// After (no change needed)
import { getSession } from '@wrelik/auth/next';
```

### Client-side
```ts
// Before
import { mapClerkToSession } from '@wrelik/auth/react-native';

// After (browser)
import { mapClerkToSession } from '@wrelik/auth/client';

// After (React Native)
import { mapClerkToSession } from '@wrelik/auth/react-native';
```

### Shared types
```ts
import { 
  WorkflowSession, 
  requireUser, 
  requireTenant,
  hasRole,
  requireRole 
} from '@wrelik/auth/shared';
```

---

## @wrelik/errors

### Server-side (Node.js)
```ts
// Before
import { captureError, initErrors } from '@wrelik/errors';

// After (recommended)
import { captureError, initErrors } from '@wrelik/errors/server';

initErrors(process.env.SENTRY_DSN);
```

### Client-side (Browser)
```ts
// After
import { captureError, initErrors } from '@wrelik/errors/client';

initErrors(process.env.NEXT_PUBLIC_SENTRY_DSN);
```

### React Native
```ts
// Before
import { captureError, initErrors } from '@wrelik/errors/react-native';

// After (no change needed)
import { captureError, initErrors } from '@wrelik/errors/react-native';
```

### Shared types (safe everywhere)
```ts
import { 
  AppError, 
  AuthRequiredError, 
  TenantRequiredError,
  PermissionDeniedError,
  ValidationError 
} from '@wrelik/errors/shared';
```

---

## @wrelik/db

**This package is server-only.**

### Server-side
```ts
// Before
import { setTenantAccessChecker, getPrismaSingleton } from '@wrelik/db';

// After (recommended)
import { setTenantAccessChecker, getPrismaSingleton } from '@wrelik/db/server';
```

### Shared types (safe for client)
```ts
import { TenantContext, AccessChecker } from '@wrelik/db/shared';
```

### React Native (throws error)
```ts
import { TenantContext } from '@wrelik/db/react-native';
// Only types are exported; functions throw errors
```

---

## @wrelik/email

**This package is server-only.**

### Server-side
```ts
// Before
import { initEmail, sendEmail } from '@wrelik/email';

// After (recommended)
import { initEmail, sendEmail } from '@wrelik/email/server';
```

### Shared types (safe for client)
```ts
import { SendEmailOptions, EmailConfig } from '@wrelik/email/shared';
```

---

## @wrelik/jobs

**This package is server-only.**

### Server-side
```ts
// Before
import { initJobs, emit, createFunction } from '@wrelik/jobs';

// After (recommended)
import { initJobs, emit, createFunction } from '@wrelik/jobs/server';
```

### Shared types (safe for client)
```ts
import { JobConfig, JobTrigger, CronTrigger, JobHandler } from '@wrelik/jobs/shared';
```

---

## @wrelik/analytics

### Server-side
```ts
// Before
import { initAnalytics, capture, identify } from '@wrelik/analytics';

// After (recommended)
import { initAnalytics, capture, identify } from '@wrelik/analytics/server';
```

### Client-side (Browser)
```ts
import { initAnalytics, capture, identify } from '@wrelik/analytics/client';
```

### React Native
```ts
// Before
import { initAnalytics, capture } from '@wrelik/analytics/react-native';

// After (no change needed)
import { initAnalytics, capture } from '@wrelik/analytics/react-native';
```

### Shared types
```ts
import { validateEventName, AnalyticsConfig } from '@wrelik/analytics/shared';
```

---

## @wrelik/storage

### Server-side
```ts
// Before
import { initStorage, putObject, getSignedUploadUrl } from '@wrelik/storage';

// After (recommended)
import { initStorage, putObject, getSignedUploadUrl } from '@wrelik/storage/server';
```

### Client-side (signed URL uploads)
```ts
import { uploadToSignedUrl, downloadFromSignedUrl } from '@wrelik/storage/client';
```

### React Native
```ts
import { uploadToSignedUrl, downloadFromSignedUrl } from '@wrelik/storage/react-native';
```

### Shared types
```ts
import { validateUpload, StorageConfig, UploadPolicy } from '@wrelik/storage/shared';
```

---

## ESLint Enforcement

The updated `@wrelik/eslint-config` now enforces:

1. **No vendor SDK imports in apps**
   ```ts
   // ❌ Error
   import { auth } from '@clerk/nextjs';
   
   // ✅ Correct
   import { getSession } from '@wrelik/auth/next';
   ```

2. **No server imports in client components**
   ```ts
   // ❌ Error in files with 'use client'
   import { setTenantAccessChecker } from '@wrelik/db';
   import { fromClerkAuth } from '@wrelik/auth/server';
   ```

3. **No Node.js built-ins in client code**
   ```ts
   // ❌ Error in client code
   import fs from 'fs';
   import path from 'path';
   ```

---

## CI Enforcement

New CI checks automatically:

1. **Circular Dependency Detection**: Fails if packages have circular imports
2. **Bundle Scanning**: Fails if forbidden Node modules are found in client bundles
3. **Smoke Tests**: Validates all export maps resolve correctly

---

## Deprecation Timeline

| Version | Status |
|---------|--------|
| 0.x | Root imports still work but show deprecation warnings |
| 1.0.0 | Root imports will be removed; subpaths required |

---

## Quick Reference

| Package | Root Import | Server | Client | React Native | Shared |
|---------|-------------|--------|--------|--------------|--------|
| @wrelik/config | ⚠️ deprecated | `/server` | `/client` | `/react-native` | `/shared` |
| @wrelik/auth | ⚠️ deprecated | `/server` | `/client` | `/react-native` | `/shared` |
| @wrelik/errors | ⚠️ deprecated | `/server` | `/client` | `/react-native` | `/shared` |
| @wrelik/analytics | ⚠️ deprecated | `/server` | `/client` | `/react-native` | `/shared` |
| @wrelik/storage | ⚠️ deprecated | `/server` | `/client` | `/react-native` | `/shared` |
| @wrelik/db | ⚠️ server-only | `/server` | ❌ | types only | `/shared` |
| @wrelik/email | ⚠️ server-only | `/server` | ❌ | types only | `/shared` |
| @wrelik/jobs | ⚠️ server-only | `/server` | ❌ | types only | `/shared` |
