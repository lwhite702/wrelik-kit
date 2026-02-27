# Mobile Support (Expo)

wrelik-kit supports Expo through client-safe runtime entrypoints.

## Import Rules

Expo apps may import only:

- `@wrelik/*/client`
- `@wrelik/*/shared`

Do not import `@wrelik/*/server` from Expo code.

## Usable Client Entrypoints (Expo-safe)

- `@wrelik/auth/client`
- `@wrelik/config/client`
- `@wrelik/errors/client` (error normalization only; no Sentry server capture)
- `@wrelik/analytics/client`
- `@wrelik/storage/client`

## Fail-fast Client Stubs (intentional)

These packages expose `/client` for a consistent surface, but they throw immediately when imported because they are server-only adapters:

- `@wrelik/db/client`
- `@wrelik/email/client`
- `@wrelik/jobs/client`

Use your backend API for those operations.

## Security/Bundle Policy

- Allowed: `EXPO_PUBLIC_*` variables only
- Forbidden in mobile bundles: database credentials, Resend keys, Inngest keys, S3/R2 credentials, server secrets
- Vendor SDK imports must stay inside `@wrelik/*` packages, not app code

## Example: Auth session mapping

```ts
import { mapClerkToSession } from '@wrelik/auth/client';

const session = mapClerkToSession(clerkPayload);
```

## Example: Storage upload flow

```ts
import { uploadToSignedUrl } from '@wrelik/storage/client';

await uploadToSignedUrl({
  url: signedUploadUrl,
  file,
  contentType: file.type,
});
```

## Example: Analytics client wrapper

```ts
import { createAnalyticsClient } from '@wrelik/analytics/client';
import PostHog from 'posthog-react-native';

await PostHog.initAsync('public_key');
const analytics = createAnalyticsClient(PostHog);
analytics.capture('drx.tap.button', { id: 'submit' });
```

## Example: Error normalization in UI

```ts
import { normalizeError } from '@wrelik/errors/client';

try {
  // ... UI action
} catch (error) {
  const normalized = normalizeError(error);
  console.warn(normalized.code, normalized.message);
}
```
