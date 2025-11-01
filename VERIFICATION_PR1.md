# PR #1 Verification Steps

## Prerequisites
```bash
# Install dependencies
npm install

# Add new dependency
npm install zod@^3.22.4
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and fill in ALL required values:
# - MONGODB_URI
# - DB_NAME
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# - NEXT_PUBLIC_BASE_URL
# - ALLOWED_ORIGINS
```

## Type Check
```bash
# This should pass with no errors
npm run type-check
```

## Run Tests
```bash
# Install Jest if not present
npm install --save-dev jest @jest/globals ts-jest @types/jest

# Run schema validation tests
npm test
```
Expected output: All tests pass ✓

## Start Development Server
```bash
npm run dev
```

## Manual Smoke Tests

### 1. Homepage Loads
- Visit http://localhost:3000
- ✅ Hero section visible
- ✅ Fonts load correctly (Cormorant Garamond for headings)
- ✅ Custom colors match design (sepia, warm cream tones)
- ✅ No console errors related to layout

### 2. Environment Validation
- Stop server
- Remove MONGODB_URI from .env.local
- Try to start server
- ✅ Should see error: "❌ Invalid environment variables"
- Restore MONGODB_URI

### 3. API Validation Test
```bash
# Test creating WishBloom with invalid data
curl -X POST http://localhost:3000/api/wishblooms \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "",
    "introMessage": "Short",
    "memories": []
  }'
```
✅ Should return 422 status with validation errors

### 4. API Validation Test (Valid Data)
```bash
curl -X POST http://localhost:3000/api/wishblooms \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Emma",
    "introMessage": "Dear Emma, this is a special message for you...",
    "createdBy": {"name": "Sarah"},
    "memories": [
      {"title": "Memory 1", "description": "Description 1", "date": "2023-01-01", "contributor": {"name": "John"}},
      {"title": "Memory 2", "description": "Description 2", "date": "2023-02-01", "contributor": {"name": "Jane"}},
      {"title": "Memory 3", "description": "Description 3", "date": "2023-03-01", "contributor": {"name": "Bob"}}
    ],
    "messages": [
      {"type": "letter", "content": "Happy birthday Emma!", "signature": "Sarah", "date": "2024-01-01", "contributor": {"name": "Sarah"}}
    ]
  }'
```
✅ Should return 201 status with created WishBloom

## UI/Animation Preservation Checks

### Visual Design (No Changes Expected)
- ✅ Color palette unchanged (check Hero background gradient)
- ✅ Typography unchanged (check h1, h2, body text)
- ✅ Spacing/padding unchanged
- ✅ Shadow styles unchanged (check MemoryCard hover)

### Animation Timing (No Changes Expected)
- ✅ Hero title animation (~1s bloom-in)
- ✅ Memory cards stagger animation on scroll
- ✅ Confetti particles (when implemented)
- ✅ No jank or layout shifts

### Functional Tests
- ✅ Navigate to /create page
- ✅ All forms render correctly
- ✅ Image upload still works (Cloudinary)
- ✅ Background music toggle works
- ✅ No broken imports or missing files

## Build Test
```bash
npm run build
```
✅ Should complete successfully with no errors

## Rollback Plan
If issues occur:
```bash
# Revert all changes
git checkout main
git branch -D fix/hardening/critical-security

# Or revert specific files
git checkout main -- next.config.js
git checkout main -- app/layout.tsx
```

## Files Changed Summary
```
DELETED:
- app/layout.tsx (duplicate)
- jsconfig.json (replaced by tsconfig.json)

ADDED:
- lib/env.ts (environment validation)
- schemas/wishbloom.schema.ts (Zod schemas)
- .env.example (documentation)
- __tests__/schemas/wishbloom.test.ts (tests)

MODIFIED:
- next.config.js (security headers, strict mode)
- lib/mongodb.js → lib/mongodb.ts (TypeScript + pooling)
- app/layout.js → app/layout.tsx (unified layout)
- app/api/wishblooms/route.js → route.ts (validation)
- tsconfig.json (stricter settings)
- package.json (added zod)
```

## Success Criteria
- [ ] All tests pass
- [ ] Type check passes
- [ ] Dev server runs without errors
- [ ] Build completes successfully
- [ ] Environment validation works
- [ ] API validation blocks invalid requests
- [ ] UI/animations unchanged
- [ ] No console errors in browser