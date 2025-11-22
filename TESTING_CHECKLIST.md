# 🧪 WishBloom Testing Checklist
## Comprehensive Testing for Part 8 & Beyond

---

## ✅ Automated Testing Commands

### 1. Type Checking
```bash
npm run type-check
```
**Expected:** ✅ No TypeScript errors  
**Status:** PASSED ✓

### 2. Linting
```bash
npm run lint
```
**Expected:** ✅ No ESLint errors (or only warnings)

### 3. Unit Tests
```bash
npm test
```
**Expected:** ✅ All tests pass

### 4. Build Verification
```bash
npm run build
```
**Expected:** ✅ Build completes successfully  
**Status:** PASSED ✓  
**Build Output:** 18 routes compiled successfully

### 5. Security Audit (Production Dependencies)
```bash
npm audit --production --audit-level=high
```
**Expected:** ✅ No HIGH severity vulnerabilities in production  
**Status:** PASSED ✓ (Only 4 LOW severity issues in auth libs)

### 6. E2E Tests
```bash
npm run test:e2e
```
**Expected:** ✅ All Playwright tests pass

### 7. Accessibility Tests
```bash
npm run test:a11y
```
**Expected:** ✅ No critical accessibility violations

### 8. Bundle Analysis
```bash
ANALYZE=true npm run build
```
**Expected:** ✅ Bundle sizes within acceptable limits  
**Current:** First Load JS: 288 kB (excellent!)

---

## 🔐 Manual Security Testing

### Test 1: Content Security Policy (CSP)
**Goal:** Verify CSP headers are active and blocking malicious scripts

**Steps:**
1. Start development server: `npm run dev`
2. Open browser: http://localhost:3000
3. Open DevTools Console
4. Try to execute inline script:
   ```javascript
   document.write('<script>alert("XSS")</script>')
   ```
5. **Expected:** Script blocked by CSP, error in console:
   ```
   Refused to execute inline script because it violates CSP directive
   ```

**Status:** ⏳ PENDING MANUAL TEST

---

### Test 2: Email Header Injection Prevention
**Goal:** Verify email sanitization blocks header injection

**Steps:**
1. Navigate to: http://localhost:3000/create
2. Fill in form with malicious contributor name:
   ```
   John Doe\r\nBcc: attacker@evil.com
   ```
3. Submit WishBloom
4. Check email sent (if email notifications enabled)
5. **Expected:** Email subject/sender should be:
   ```
   From: John Doe (newlines removed)
   ```

**Status:** ⏳ PENDING MANUAL TEST

---

### Test 3: Session Expiry & Refresh
**Goal:** Verify JWT sessions expire after 7 days and refresh every 24h

**Steps:**
1. Sign in to dashboard: http://localhost:3000/dashboard
2. Check JWT cookie in DevTools > Application > Cookies
3. Verify `Max-Age` is set to 604800 (7 days)
4. Wait 24 hours (or mock system time)
5. **Expected:** Token automatically refreshes

**Status:** ⏳ PENDING MANUAL TEST (Requires time simulation)

---

### Test 4: HTTPS Enforcement (HSTS)
**Goal:** Verify Strict-Transport-Security header is present

**Steps:**
1. Deploy to production
2. Open DevTools > Network tab
3. Check response headers for any request
4. **Expected:** Should contain:
   ```
   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   ```

**Status:** ⏳ PENDING PRODUCTION DEPLOYMENT

---

### Test 5: Frame Embedding Prevention
**Goal:** Verify X-Frame-Options prevents clickjacking

**Steps:**
1. Create a test HTML file:
   ```html
   <iframe src="http://localhost:3000"></iframe>
   ```
2. Open in browser
3. **Expected:** Iframe should be blocked with error:
   ```
   Refused to display in a frame because it set 'X-Frame-Options' to 'deny'
   ```

**Status:** ⏳ PENDING MANUAL TEST

---

## 🚀 Performance Testing

### Test 6: Lighthouse Performance Audit
**Goal:** Verify all performance metrics are in green zone

**Steps:**
```bash
npm run lighthouse
```

**Expected Scores:**
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**Current Baseline:** Unknown (first run after Part 8)

---

### Test 7: Bundle Size Analysis
**Goal:** Ensure no bundle size regressions

**Steps:**
```bash
ANALYZE=true npm run build
```

**Expected:**
- Vendor chunk: < 300 kB
- Common chunk: < 50 kB
- Framer Motion chunk: < 100 kB
- Total First Load JS: < 350 kB

**Current Status:** ✅ 
- Vendor: 286 kB ✓
- Total First Load: 288 kB ✓

---

### Test 8: Database Query Performance
**Goal:** Verify indexes are working correctly

**Steps:**
```bash
npm run test:indexes
```

**Expected:** All index queries execute in < 10ms

---

## 🌐 Browser Compatibility Testing

### Test 9: Cross-Browser Testing
**Goal:** Ensure WishBloom works across major browsers

**Browsers to Test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Test Pages:**
- [ ] Homepage (/)
- [ ] Create Flow (/create)
- [ ] View WishBloom (/[id])
- [ ] Dashboard (/dashboard)

---

## 📱 Responsive Testing

### Test 10: Mobile Responsiveness
**Goal:** Verify UI works on all screen sizes

**Devices to Test:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667) - iPhone SE
- [ ] Mobile (390x844) - iPhone 12/13
- [ ] Mobile (393x851) - Pixel 5

**Test Steps:**
1. Open DevTools > Toggle Device Toolbar
2. Test each viewport size
3. **Expected:** No horizontal scroll, all content visible

---

## 🔄 Continuous Integration Testing

### Test 11: CI/CD Pipeline Verification
**Goal:** Ensure GitHub Actions CI passes

**Steps:**
1. Push changes to `main` or `develop` branch
2. Check GitHub Actions: https://github.com/[your-repo]/actions
3. **Expected:** All jobs pass:
   - ✅ Lint & Type Check
   - ✅ Unit Tests
   - ✅ Security Audit
   - ✅ Build
   - ✅ E2E Tests (main branch only)

**Current Status:** ⏳ PENDING PUSH TO GITHUB

---

## 🛠️ API Endpoint Testing

### Test 12: API Security & Functionality
**Goal:** Verify all API endpoints work correctly and securely

#### A. Create WishBloom
```bash
curl -X POST http://localhost:3000/api/wishblooms \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Test User",
    "age": 25,
    "introMessage": "Happy Birthday!",
    "createdBy": {
      "id": "test123",
      "name": "Creator",
      "email": "test@example.com"
    }
  }'
```
**Expected:** 201 Created with WishBloom object

#### B. Get WishBloom
```bash
curl http://localhost:3000/api/wishblooms/[unique-url]
```
**Expected:** 200 OK with WishBloom data

#### C. Upload Image
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-image.jpg" \
  -F "type=memory"
```
**Expected:** 200 OK with Cloudinary URL

#### D. Rate Limiting Test
```bash
# Run this 15 times rapidly
for i in {1..15}; do
  curl http://localhost:3000/api/wishblooms
done
```
**Expected:** After 10 requests, receive 429 Too Many Requests

---

## 🎨 Visual Regression Testing

### Test 13: Screenshot Comparison
**Goal:** Ensure UI hasn't broken after Part 8 changes

**Steps:**
1. Take baseline screenshots before changes
2. Take screenshots after Part 8
3. Use Playwright to compare:
```bash
npm run test:e2e -- --update-snapshots
```

**Status:** ⏳ PENDING E2E TEST SETUP

---

## 📊 Testing Summary

| Test Category | Tests | Passed | Failed | Pending |
|---------------|-------|--------|--------|---------|
| Automated     | 8     | 2      | 0      | 6       |
| Security      | 5     | 0      | 0      | 5       |
| Performance   | 3     | 1      | 0      | 2       |
| Browser       | 1     | 0      | 0      | 1       |
| Responsive    | 1     | 0      | 0      | 1       |
| CI/CD         | 1     | 0      | 0      | 1       |
| API           | 1     | 0      | 0      | 1       |
| Visual        | 1     | 0      | 0      | 1       |
| **TOTAL**     | **21**| **3**  | **0**  | **18**  |

---

## 🚀 Quick Test All (Automated Only)
```bash
#!/bin/bash
echo "🧪 Running WishBloom Comprehensive Tests..."
echo ""

echo "1. Type Checking..."
npm run type-check || exit 1

echo "2. Linting..."
npm run lint || exit 1

echo "3. Unit Tests..."
npm test || exit 1

echo "4. Build Verification..."
npm run build || exit 1

echo "5. Security Audit..."
npm audit --production --audit-level=high || exit 1

echo ""
echo "✅ All automated tests passed!"
echo "📝 Manual tests pending - see TESTING_CHECKLIST.md"
```

**Save as:** `test-all.sh`  
**Run:** `chmod +x test-all.sh && ./test-all.sh`

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All automated tests pass (`./test-all.sh`)
- [ ] Manual security tests completed
- [ ] CSP headers verified in production
- [ ] Performance scores meet targets (≥90)
- [ ] Mobile responsiveness verified
- [ ] All API endpoints tested
- [ ] Environment variables set correctly
- [ ] Database indexes created (`npm run db:indexes`)
- [ ] Monitoring/error tracking configured
- [ ] Backup strategy in place

---

## 🐛 Found a Bug?

1. **Document:** Add details to issue tracker
2. **Reproduce:** Create minimal test case
3. **Fix:** Implement solution
4. **Test:** Run relevant tests
5. **Verify:** Check all related functionality

---

**Last Updated:** November 22, 2024  
**Testing Framework:** Jest, Playwright, Lighthouse CI  
**CI/CD:** GitHub Actions
