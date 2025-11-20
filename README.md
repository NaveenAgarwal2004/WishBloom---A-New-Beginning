# 🌸 WishBloom - Pressed Flower Birthday Memories

A sentimental birthday memory web app that creates beautiful, interactive digital scrapbooks with a "pressed flowers" aesthetic.

![WishBloom Preview](https://via.placeholder.com/800x400?text=WishBloom+Preview) 

## ✨ Features

- 🎨 **Beautiful "Pressed Flowers" Design** - Tactile, analog-inspired aesthetic
- 📸 **Memory Gallery** - Collect and display cherished photos and stories
- ✉️ **Heartfelt Messages** - Letters and poems from loved ones
- 🎂 **Interactive Celebration** - Blow out candles with breath detection
- 🎊 **Confetti & Animations** - Delightful Framer Motion animations
- 📧 **Email Notifications** - Share WishBlooms via Brevo email service
- 🔒 **Secure & Production-Ready** - Full authentication, rate limiting, validation
- ♿ **Accessible** - WCAG 2.1 AA compliant
- ⚡ **Performant** - Optimized for Core Web Vitals

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Cloudinary account
- Brevo (Sendinblue) account

### Installation

```bash
# Clone repository
git clone https://github.com/NaveenAgarwal2004/WishBloom.git
cd WishBloom

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your environment variables in .env.local
```

### Environment Variables

See `.env.example` for all required variables. Key ones:

```env
MONGODB_URI=mongodb://localhost:27017
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_api_key
NEXTAUTH_SECRET=your_32_character_secret
```

### Database Setup

```bash
# Create indexes
npm run db:indexes
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 📚 Documentation

- **[Deployment Guide](./DEPLOY.md)** - Complete deployment instructions
- **[API Documentation](./docs/API.md)** - API endpoint references
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Type check
npm run type-check

# Lint
npm run lint
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Zustand** - State management

### Backend
- **MongoDB** - Database with Mongoose ORM
- **NextAuth.js** - Authentication
- **Zod** - Schema validation
- **Cloudinary** - Image hosting
- **Brevo** - Email service

### DevOps
- **Vercel** - Deployment platform
- **GitHub Actions** - CI/CD
- **Playwright** - E2E testing
- **Jest** - Unit testing
- **Lighthouse CI** - Performance monitoring

## 📁 Project Structure

```
wishbloom/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── [id]/              # Dynamic WishBloom pages
│   └── create/            # Creation flow
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── email/            # Email service
│   ├── mongodb.ts        # Database connection
│   └── ...
├── models/                # Mongoose models
├── schemas/               # Zod validation schemas
├── hooks/                 # Custom React hooks
├── context/               # React context providers
├── store/                 # Zustand stores
├── tests/                 # Test files
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## 🎨 Design System

### Colors
- **Sepia Ink** `#7A5C47` - Primary text
- **Faded Gold** `#D4A373` - Accents
- **Warm Cream** `#FBF7F0` - Backgrounds
- **Rose Petal** `#D4859D` - Highlights
- **Burnt Sienna** `#A0522D` - CTAs

### Typography
- **Heading** - Cormorant Garamond
- **Body** - Spectral
- **Accent** - EB Garamond
- **Mono** - IBM Plex Mono

### Motion
- **Bloom** - `cubic-bezier(0.16, 1, 0.3, 1)`
- **Bounce** - `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Dramatic** - `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

## 🔒 Security Features

- ✅ Input validation with Zod
- ✅ Rate limiting (Upstash Redis)
- ✅ CORS configuration
- ✅ Security headers
- ✅ NextAuth.js authentication
- ✅ Environment variable validation
- ✅ No localStorage usage (memory only)
- ✅ Image upload validation
- ✅ Error message sanitization

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Alt text for images
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Skip to content link
- ✅ Prefers-reduced-motion support

## ⚡ Performance

- ✅ Core Web Vitals optimized
- ✅ Image optimization (Next.js + Cloudinary)
- ✅ Code splitting
- ✅ Dynamic imports
- ✅ Database indexes
- ✅ Connection pooling
- ✅ Bundle analysis

**Lighthouse Scores (Target):**
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Design inspiration: Analog pressed flower scrapbooks
- Built with love for preserving memories

## 📧 Contact

**Naveen Agarwal**
- GitHub: [@NaveenAgarwal2004](https://github.com/NaveenAgarwal2004)
- Project Link: [https://github.com/NaveenAgarwal2004/WishBloom](https://github.com/NaveenAgarwal2004/WishBloom)

---

**Made with 💛 by WishBloom** - Preserving memories, one bloom at a time.
