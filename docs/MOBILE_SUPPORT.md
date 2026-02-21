# Mobile Support (Expo)

wrelik-kit is designed to support DRX Mobile apps built with Expo.

## Policy

### Environment Variables

- **Allowed**: `EXPO_PUBLIC_*` variables are embedded at build time.
- **Forbidden**: `DATABASE_URL`, `RESEND_API_KEY`, `INNGEST_SIGNING_KEY` etc. must **never** be present in the mobile bundle.
- use `@wrelik/config/client` to load config safely.

### Storage

Mobile apps must not use AWS SDK credentials directly.
**Flow**:

1. Mobile requests Signed URL from Backend API.
2. Backend generates Signed URL using `@wrelik/storage/server` (Node).
3. Mobile uploads/downloads using Signed URL via `@wrelik/storage/client` helpers.

### Authentication

Start with Clerk Expo SDK. Use `@wrelik/auth/client` to map Clerk user objects into shared session shape.

## Usage Examples

### Config

```ts
import { loadClientConfig } from '@wrelik/config/client';

const config = loadClientConfig({
  EXPO_PUBLIC_API_URL: z.string().url(),
});
```

### Analytics

```ts
import { createAnalyticsClient } from '@wrelik/analytics/client';
import PostHog from 'posthog-react-native';

PostHog.initAsync('public_key');
const analytics = createAnalyticsClient(PostHog);
analytics.capture('user.clicked_button', { buttonId: 'submit' });
```
