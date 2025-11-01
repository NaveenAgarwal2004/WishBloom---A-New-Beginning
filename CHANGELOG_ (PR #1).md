# Changelog

## [PR #1] Critical Security & Configuration Fixes - 2024-11-01

### 🔒 Security
- **BREAKING**: Replaced wildcard CORS (`*`) with environment-based origin validation
- Added comprehensive input validation using Zod for all API routes
- Enabled React Strict Mode to catch potential bugs early
- Added security headers (CSP, X-Frame-Options, HSTS, etc.)
- Removed overly permissive CORS headers from non-API routes

### ⚙️ Configuration
- **BREAKING**: Removed duplicate `app/layout.tsx`, unified under TypeScript
- **BREAKING**: Deleted `jsconfig.json`, using `tsconfig.json` exclusively
- Re-enabled Next.js image optimization (removed `unoptimized: true`)
- Added proper Cloudinary domain configuration for image optimization
- Configured MongoDB connection pooling (min: 2, max: 10 connections)
- Added graceful shutdown handler for MongoDB connections

### ✅ Validation
- Created comprehensive Zod schemas for:
  - Contributors
  - Memories (with date format, character limits)
  - Messages (letters and poems)
  - WishBloom creation and updates
  - Email sending
  - Image uploads
- Added environment variable validation on startup
- Created `.env.example` documenting all required variables

### 🏗️ Infrastructure
- Migrated `lib/mongodb.js` → `lib/mongodb.ts` with proper typing
- Migrated `app/api/wishblooms/route.js` → `route.ts` with validation
- Added `lib/env.ts` for centralized environment management
- Improved error messages (user-friendly + detailed for development)
- Added proper TypeScript configuration with strict mode

### 🧪 Testing
- Added unit tests for Zod schemas
- Created test utilities and helpers
- Added npm scripts: `test`, `test:watch`, `type-check`

### 📚 Documentation
- Created `.env.example` with detailed variable descriptions
- Added verification steps document for PR review
- Documented rollback procedures

### 🎨 Design Preservation
- ✅ Zero changes to color palette
- ✅ Zero changes to typography
- ✅ Zero changes to animation timings
- ✅ Zero changes to component layouts
- ✅ All custom Tailwind tokens preserved

### Migration Guide

#### For Developers
1. Delete `app/layout.tsx` if it exists
2. Install new dependency: `npm install zod@^3.22.4`
3. Copy `.env.example` to `.env.local`
4. Fill in all required environment variables
5. Run `npm run type-check` to verify TypeScript setup
6. Run `npm test` to verify all tests pass

#### Environment Variables (New Requirements)
All environment variables are now validated on startup. Missing or invalid variables will prevent the application from starting.

Required variables:
- `MONGODB_URI` - Must be a valid MongoDB connection string
- `DB_NAME` - Database name
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXT_PUBLIC_BASE_URL` - Full application URL
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

See `.env.example` for complete list and descriptions.

### Breaking Changes
1. **CORS**: API routes now only accept requests from configured origins
2. **Validation**: Invalid API requests return 422 with detailed error messages
3. **Environment**: App will not start with missing/invalid environment variables
4. **TypeScript**: Project is now fully TypeScript (except config files)

### Non-Breaking Changes
- All existing functionality preserved
- No UI/UX changes
- No animation changes
- Backwards compatible with existing WishBloom documents in database