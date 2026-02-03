# Mobile Support (Expo)

wrelik-kit is designed to support DRX Mobile apps built with Expo.

## Policy

### Environment Variables

- **Allowed**: `EXPO_PUBLIC_*` variables are embedded at build time.
- **Forbidden**: `DATABASE_URL`, `RESEND_API_KEY`, `INNGEST_SIGNING_KEY` etc. must **never** be present in the mobile bundle.
- use `@wrelik/config/react-native` to load config safely.

### Storage

Mobile apps must not use AWS SDK credentials directly.
**Flow**:

1. Mobile requests Signed URL from Backend API.
2. Backend generates Signed URL using `@wrelik/storage` (Node).
3. Mobile uploads/downloads using Signed URL via `@wrelik/storage/react-native` helpers.

### Authentication

Start with Clerk Expo SDK. Use `@wrelik/auth/react-native` to map Clerk user objects to `WrelikSession` for consistent role checking.

## Usage Examples

### Config

```ts
import { loadClientConfig } from '@wrelik/config/react-native';

const config = loadClientConfig({
  EXPO_PUBLIC_API_URL: z.string().url(),
});
```

### Analytics

```ts
import { capture } from '@wrelik/analytics/react-native';

capture('user.clicked_button', { buttonId: 'submit' });
```
