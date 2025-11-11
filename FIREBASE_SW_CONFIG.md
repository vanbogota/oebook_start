# Firebase Configuration for Service Worker

## Overview

The Service Worker (`public/sw.js`) requires Firebase configuration to handle push notifications. Instead of hardcoding credentials, we generate the configuration from environment variables.

## How it works

1. **Environment variables** are defined in `.env` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

2. **Build script** (`scripts/generate-firebase-config.js`) reads these variables and generates `public/firebase-config.js`

3. **Service Worker** loads the configuration using `importScripts('/firebase-config.js')`

## Automatic Generation

The configuration file is automatically generated before:
- Development: `npm run dev`
- Production build: `npm run build`

You can also manually generate it:
```bash
npm run generate-firebase-config
```

## Important Notes

- `public/firebase-config.js` is **git-ignored** (contains sensitive data)
- The file must be regenerated on deployment or when environment variables change
- If you see Firebase errors in Service Worker, ensure the config file is generated

## Deployment

Make sure your deployment platform (Vercel, etc.) has:
1. All Firebase environment variables configured
2. Build command runs the generation script (automatic with `prebuild` hook)
