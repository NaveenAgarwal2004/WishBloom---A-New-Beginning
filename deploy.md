# 🚀 WishBloom Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set in your deployment platform:

```bash
# Required
MONGODB_URI=mongodb+srv://...
DB_NAME=wishbloom
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=WishBloom
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production

# Optional (for production rate limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Optional (for OAuth)
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### 2. Database Setup

```bash
# Connect to MongoDB and create indexes
npm run db:indexes

# Verify indexes
npm run test:indexes
```

### 3. Pre-Deployment Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Type check
npm run type-check

# Lint
npm run lint

# Build test
npm run build
```

## Vercel Deployment (Recommended)

### Initial Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Ensure `NODE_ENV=production` is set

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL`
4. Update `ALLOWED_ORIGINS` to include your domain

## Docker Deployment

### Build Docker Image

```bash
docker build -t wishbloom:latest .
```

### Run with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  wishbloom:
    image: wishbloom:latest
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check API health
curl https://yourdomain.com/api/root

# Check database connection
curl https://yourdomain.com/api/wishblooms
```

### 2. Monitor Performance

- Set up monitoring with Vercel Analytics or Google Analytics
- Check Web Vitals in production
- Monitor error logs

### 3. Test Critical Paths

1. Homepage loads correctly
2. Create flow works end-to-end
3. Viewing a WishBloom works
4. Email notifications send successfully
5. Image uploads work

## Rollback Plan

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Database Rollback

- Keep database backups (MongoDB Atlas automatic backups)
- Document schema changes for each deployment

## Monitoring & Alerts

### Error Tracking

- Use Vercel logs for errors
- Consider Sentry for comprehensive error tracking

### Performance Monitoring

- Vercel Analytics (built-in)
- Google Lighthouse CI
- Custom Web Vitals endpoint at `/api/analytics/vitals`

### Uptime Monitoring

- Use UptimeRobot or similar
- Monitor key endpoints:
  - `/` (homepage)
  - `/api/root` (API health)
  - `/create` (create flow)

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured (check next.config.js)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment secrets never committed
- [ ] Database has strong password
- [ ] NextAuth secret is secure (32+ characters)
- [ ] API routes have proper authentication
- [ ] Input validation enabled (Zod schemas)

## Performance Optimization

### Edge Caching

```typescript
// For static pages
export const revalidate = 3600 // 1 hour
```

### Image Optimization

- Images auto-optimized via Next.js
- Cloudinary handles transformations
- Use `next/image` component everywhere

### Database Optimization

- Indexes created via `npm run db:indexes`
- Connection pooling configured
- Queries optimized with proper indexes

## Backup Strategy

### Database Backups

- MongoDB Atlas: Automatic continuous backups
- Manual backup: `mongodump --uri="mongodb+srv://..."`

### Code Backups

- Git repository (GitHub)
- Vercel deployment history

## Troubleshooting

### Common Issues

**Build fails:**
- Check TypeScript errors: `npm run type-check`
- Check environment variables are set
- Verify all dependencies installed

**Database connection fails:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Images not loading:**
- Verify Cloudinary credentials
- Check CORS settings
- Ensure domains whitelisted in next.config.js

**Rate limiting too strict:**
- Adjust rate limits in lib/rate-limit.ts
- Consider upgrading Upstash Redis plan
- Use authenticated endpoints for higher limits

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review application logs
3. Check database connection
4. Verify environment variables

---

**Last Updated:** 2025-01-15