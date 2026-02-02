# Architecture Decisions

## Vendor Selection

| Domain | Vendor | Package | Reason |
| key | value | | |
| Auth | Clerk | `@wrelik/auth` | Best-in-class Next.js support and developer experience. |
| Database | Neon (Prisma) | `@wrelik/db` | Serverless Postgres scaling and great DX with Prisma. |
| Storage | Cloudflare R2 | `@wrelik/storage` | S3 compatible, no egress fees. |
| Analytics | PostHog | `@wrelik/analytics` | Open source, strong product analytics. |
| Errors | Sentry | `@wrelik/errors` | Industry standard for error tracking. |
| Email | Resend | `@wrelik/email` | Modern API, React-based templates. |
| Jobs | Inngest | `@wrelik/jobs` | Serverless-friendly event-driven queue. |

## Why Wrappers?

We wrap all vendor SDKs to:

1. **Reduce Lock-in**: Switching vendors only requires updating the adapter package, not every app file.
2. **Enforce Best Practices**: We can enforce naming conventions (e.g. analytics events) and error handling centrally.
3. **Simplify API**: We expose only the functionality we use, reducing API surface area for app developers.
