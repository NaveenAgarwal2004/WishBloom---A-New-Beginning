# 🌸 WishBloom — Pressed Flower Birthday Keepsakes & Heirlooms

> *A full-stack, open-source web application for creating timeless, interactive digital birthday scrapbooks. Blends nostalgic botanical aesthetics with modern web technologies: collaborative group messages, microphone breath-extinguished candles, voice recordings, AI-assisted poetry, and print-ready PDF heirlooms.*

<div align="center">

[![Live Application](https://img.shields.io/badge/Live-wishblooms.in-E28C8C?style=for-the-badge&logo=googlechrome&logoColor=white)](https://wishblooms.in)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20%20LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![CI Status](https://img.shields.io/badge/CI%2FCD-Ubuntu%2022.04%20Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-F5A623?style=for-the-badge)](./LICENSE)

[🌐 Explore Live Site](https://wishblooms.in) • [📖 Read Blog](https://wishblooms.in/blog) • [✨ How It Works](https://wishblooms.in/how-it-works) • [🌿 Our Story](https://wishblooms.in/about) • [🐛 Report Bug](https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning/issues)

</div>

---

## 📑 Table of Contents

- [🌸 Overview & Design Philosophy](#-overview--design-philosophy)
- [✨ Key Features](#-key-features)
  - [1. 6-Step Keepsake Creation Wizard](#1-6-step-keepsake-creation-wizard)
  - [2. Interactive Microphone Breath Detection](#2-interactive-microphone-breath-detection)
  - [3. Voice Message Keepsakes](#3-voice-message-keepsakes)
  - [4. AI-Powered Creative Assistant](#4-ai-powered-creative-assistant)
  - [5. Public Collaborative Guestbook](#5-public-collaborative-guestbook)
  - [6. High-Fidelity PDF Heirloom Export](#6-high-fidelity-pdf-heirloom-export)
  - [7. Editorial Blog & Publication Engine](#7-editorial-blog--publication-engine)
  - [8. Admin Command Center & Google Search Console Hub](#8-admin-command-center--google-search-console-hub)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Initialize Database Indexes](#4-initialize-database-indexes)
  - [5. Start Development Server](#5-start-development-server)
- [📡 API Architecture & Endpoints](#-api-architecture--endpoints)
- [🗄️ Database Schemas & Data Models](#️-database-schemas--data-models)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🚢 Production Deployment](#-production-deployment)
- [🔒 Security & Privacy Standards](#-security--privacy-standards)
- [🤝 Contributing](#-contributing)
- [📄 License & Authors](#-license--authors)

---

## 🌸 Overview & Design Philosophy

Traditional greeting cards are discarded after a week. Chat messages get buried under notifications. Photo albums collect dust in camera rolls.

**WishBloom** bridges physical memory keepsakes and digital web experiences. Designed around a warm **pressed-flower aesthetic**, it lets friends and families across the globe collaborate on a single interactive digital memory book:

```
Warm Cream (#FDFBF7) • Sepia Ink (#7A5C47) • Faded Gold (#D4A373) • Dried Rose (#D4859D) • Pressed Leaf (#4A5F4C)
```

### Core Design Principles:
1. **Physical Intimacy in a Digital Medium:** Elegant typography (*Cormorant Garamond* & *Lora*), textured card decks, and botanical pressed-flower motifs that feel like leafing through a treasured family scrapbook.
2. **Interactive Wonder:** Celebrating isn't just scrolling. Recipients interact with animated candle flames extinguished through real microphone breath analysis, trigger confetti explosions, and experience a virtual cake-cutting ceremony.
3. **Zero-Friction Collaboration:** Friends contribute photos, heartfelt letters, and voice notes without mandatory sign-ups or paywalls.
4. **Permanent Keepsakes:** Publish with instant unique URLs (`nanoid`), auto-save drafts to prevent lost sentiments, and download high-resolution multi-page printable PDFs for physical archiving.

---

## ✨ Key Features

### 1. 6-Step Keepsake Creation Wizard
A step-by-step creation flow (`/create`) designed to guide users from blank page to finished heirloom without friction:
- **Step 1: Recipient Profile** — Name, milestone age, and personalized opening prologue.
- **Step 2: Memory Gallery** — Photo uploads with Cloudinary optimization, storytelling narratives, contributor tags, and date stamps.
- **Step 3: Heartfelt Letters & Poems** — Formatted rich prose with AI assistance for finding the right words.
- **Step 4: Celebration Wishes** — Floating blessing tags and dynamic celebration confetti phrases.
- **Step 5: Interactive Preview** — Exact recipient-view simulator with smooth page scrolling.
- **Step 6: Publish & Share** — Generates secure nanoid URLs with instant copy-to-clipboard, WhatsApp/email sharing, and QR code access.

### 2. Interactive Microphone Breath Detection
- **Web Audio API & Fast Fourier Transform (FFT):** Analyzes real-time microphone audio input within the low-frequency breath band (0–500 Hz).
- **Realistic Candle Simulation:** Custom SVG candles with physics-driven flicker animations extinguish in real-time as the recipient blows into their device mic.
- **Accessible Fallback:** Device microphone blocked or unsupported? A tactile "Blow Candles" touch/click button ensures no recipient is ever left out.
- **Celebration Finale:** Extinguishing all candles triggers particle confetti (`canvas-confetti`) and transitions into a virtual cake-cutting experience.

### 3. Voice Message Keepsakes
- **In-Browser Audio Recording:** Integrated `MediaRecorder` API captures high-fidelity audio up to 3 minutes.
- **Automatic Audio Transcoding:** Audio streams are uploaded to Cloudinary, auto-transcoded to compressed WebM/MP4, and delivered via CDN.
- **Custom Aesthetic Player:** Embedded botanical audio player with playback scrubbers, duration counters, and waveform visuals.

### 4. AI-Powered Creative Assistant
- **Google Gemini Integration:** Accessible in the creation wizard for when users experience writer's block.
- **Relationship & Tone Customization:** Tailor wishes for 6 relationships (*Mom, Dad, Bestie, Friend, Sibling, Partner*) across 4 distinct vibes (*Sentimental, Poetic, Funny, Inspirational*).
- **Graceful Offline Mocks:** Falls back to curated hand-crafted templates if API quotas are reached or when developing locally without an active Gemini key.

### 5. Public Collaborative Guestbook
- **Zero-Login Contributions:** Anyone with the keepsake link can leave warm birthday wishes.
- **Color Palettes:** Contributors pick from 4 flower-inspired stationery themes (*Rose Petal, Sunset Amber, Dried Sage, Lavender Press*).
- **Safety First:** Automated profanity filtering, XSS string escaping, and Upstash Redis rate limiting prevent spam.

### 6. High-Fidelity PDF Heirloom Export
- **Multi-Page Layout Engine:** Powered by `@react-pdf/renderer` for client-side generation of print-ready A4 booklets.
- **Custom Typography:** Loads remote TTF versions of Cormorant Garamond and Lora.
- **Archival Quality:** Includes cover art, two-column memory grids, full-page letters, guestbook compendium, and vector floral borders.

### 7. Editorial Blog & Publication Engine
- **Public Publication Hub:** Fully responsive blog index (`/blog`) and article reader (`/blog/[slug]`) optimized for SEO and readability.
- **TipTap Rich Text Editor:** Admin blog editor supporting headings, formatted lists, blockquotes, hyperlinks, images, and raw HTML Source Code toggles.
- **Engineered for Search Engines:** Dynamic Article & FAQ JSON-LD schemas, automated reading time estimation, custom keyword tags, and Open Graph previews.
- **High-Ranking Live Articles:** Pre-seeded with industry-leading editorial guides (*"Free Kudoboard Alternative 2026"*, *"15 Best Virtual Birthday Gift Ideas in 2026"*).

### 8. Admin Command Center & Google Search Console Hub
- **Authentication Guard:** Protected with `requireBlogAdmin` ensuring only verified administrator accounts access editorial and indexing tools.
- **Direct Google Search Console (GSC) Integration:** `/admin/gsc` communicates directly with Google's URL Inspection API via Google Service Account RSA-SHA256 JWT tokens.
- **Live Search Status:** Real-time visibility into Google indexing state, crawl timestamps, robots.txt status, canonical URL verification, and rich results eligibility across all static pages and blog posts.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER                              │
│    Next.js 14 App Router  •  React 18  •  Tailwind CSS  •  Framer Motion│
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS
┌────────────────────────────────────▼────────────────────────────────────┐
│                        EDGE / MIDDLEWARE (Vercel)                       │
│      Route Guards  •  Strict CSP Headers  •  CORS  •  Security Policies │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                          NEXT.JS API ROUTES                             │
│  /api/wishblooms  •  /api/blog  •  /api/admin/gsc  •  /api/ai/generate  │
│  /api/guestbook   •  /api/drafts • /api/upload    •  /api/email         │
└──────┬───────────────┬──────────────┬───────────────┬────────────────┬──┘
       │               │              │               │                │
┌──────▼──────┐ ┌──────▼──────┐┌──────▼──────┐ ┌──────▼──────┐  ┌──────▼──────┐
│   MongoDB   │ │  Cloudinary ││   Upstash   │ │Google Gemini│  │Brevo / GSC  │
│    Atlas    │ │ Media CDN   ││ Redis Cache ││  Flash AI   │  │Transactional│
│  (Database) │ │(Image/Audio)││(Rate Limits)│ │ (Creativity)│  │ & Search API│
└─────────────┘ └─────────────┘└─────────────┘ └─────────────┘  └─────────────┘
```

---

## 🛠️ Tech Stack

### Core Framework & UI
- **Framework:** [Next.js 14.2](https://nextjs.org/) (App Router, Server Actions, Dynamic Routes)
- **Language:** [TypeScript 5.4](https://www.typescriptlang.org/) (Strict type checking)
- **Styling:** [Tailwind CSS 3.3](https://tailwindcss.com/) + `@tailwindcss/typography`
- **Animations:** [Framer Motion 12](https://www.framer.com/motion/) + Canvas Confetti
- **Components:** [Radix UI](https://www.radix-ui.com/) accessible primitives + [Lucide React](https://lucide.dev/) icons
- **Rich Text:** [TipTap 3](https://tiptap.dev/) (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`)
- **PDF Generation:** [`@react-pdf/renderer` 4.3](https://react-pdf.org/)
- **State Management:** [Zustand 5](https://github.com/pmndrs/zustand) + [React Hook Form 7](https://react-hook-form.com/) + [Zod 3.25](https://zod.dev/)

### Backend, Database & Infrastructure
- **Runtime:** Node.js 20 LTS
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) via [Mongoose 8.19](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js 4](https://next-auth.js.org/) (Credentials + Google OAuth provider)
- **Media CDN:** [Cloudinary 2.8](https://cloudinary.com/) (Signed uploads, image optimization, audio transcoding)
- **Transactional Email:** [Brevo](https://www.brevo.com/) REST API
- **Artificial Intelligence:** [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/) REST client
- **Search Console:** Google Webmasters / Search Console API v3 via native RSA-SHA256 JWT

### DevOps, Quality & Tooling
- **CI/CD:** GitHub Actions runner pinned to `ubuntu-22.04` LTS
- **Linter:** ESLint 9 (Flat Config `eslint.config.mjs`) with zero-warning threshold
- **Unit Testing:** Jest 30 + `@testing-library/react`
- **E2E Testing:** Playwright 1.56 (Chromium)
- **Accessibility:** Axe-core Playwright integration (`@axe-core/playwright`)
- **Performance:** Lighthouse CI (`@lhci/cli`)

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js:** 20.x LTS ([Download Node.js](https://nodejs.org/))
- **npm:** 10.x+
- **MongoDB:** MongoDB Atlas account or local MongoDB instance (v6.0+)
- **Git:** Installed on your system

### 1. Clone Repository
```bash
git clone https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning.git
cd WishBloom---A-New-Beginning
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and populate your keys:

```env
# ========================================
# DATABASE (Required)
# ========================================
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=wishbloom

# ========================================
# CLOUDINARY (Required for photo/audio uploads)
# ========================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ========================================
# EMAIL SERVICE (Required for share notifications)
# ========================================
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@wishblooms.in
BREVO_SENDER_NAME=WishBloom

# ========================================
# AUTHENTICATION (Required)
# Generate with: openssl rand -base64 32
# ========================================
NEXTAUTH_SECRET=your_super_secret_at_least_32_characters_long
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ========================================
# AI CREATIVITY (Optional - has mock fallback)
# ========================================
GEMINI_API_KEY=your_gemini_api_key

# ========================================
# RATE LIMITING (Optional)
# ========================================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# ========================================
# GOOGLE SEARCH CONSOLE ADMIN (Optional)
# ========================================
GSC_SITE_URL=sc-domain:wishblooms.in
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# ========================================
# APPLICATION SETTINGS
# ========================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Initialize Database Indexes
Run the automated index builder script to configure MongoDB indexes:
```bash
npm run db:indexes
```

Verify index health:
```bash
npm run test:indexes
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Architecture & Endpoints

| Endpoint | Methods | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/wishblooms` | `GET`, `POST` | Optional / Required | Create new keepsake, list author's keepsakes |
| `/api/wishblooms/[id]`| `GET`, `PATCH`, `DELETE`| Public GET, Auth for edits | Retrieve published keepsake by nanoid / ID |
| `/api/blog` | `GET`, `POST` | Public GET, Admin POST | List published posts or publish new blog article |
| `/api/blog/[slug]` | `GET`, `PUT`, `DELETE`| Public GET, Admin write | Retrieve article by slug or perform editorial edits |
| `/api/admin/gsc` | `GET` | Admin Only | Inspect URL indexation and search health via Google API |
| `/api/ai/generate` | `POST` | No (Rate-limited) | Generate birthday poems and messages with Gemini |
| `/api/guestbook` | `GET`, `POST` | No (Rate-limited) | Fetch and append public contributor wishes |
| `/api/upload` | `POST` | Authenticated | Signed multipart upload to Cloudinary CDN |
| `/api/email` | `POST` | Authenticated | Dispatch keepsake link notifications via Brevo |
| `/api/drafts` | `GET`, `POST` | Authenticated | Auto-save and retrieve work-in-progress drafts |
| `/api/analytics` | `POST` | No | Record anonymous view count and celebration metrics |
| `/api/auth/[...nextauth]`| `*` | No | NextAuth.js session and OAuth token workflows |

---

## 🗄️ Database Schemas & Data Models

### 1. `WishBloom` Model (`models/WishBloom.ts`)
The core memory book document:
```typescript
interface IWishBloom {
  recipientName: string;
  age?: number;
  creativeAgeDescription?: string;
  introMessage: string;
  uniqueUrl: string; // Unique nanoid slug
  createdBy: { name: string; email?: string };
  contributors: Array<{ name: string; email?: string }>;
  memories: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    contributor: { name: string };
  }>;
  messages: Array<{
    id: string;
    type: 'letter' | 'poem';
    content: string;
    signature: string;
    audioUrl?: string;
    contributor: { name: string };
  }>;
  celebrationWishPhrases: string[];
  guestbook: Array<{
    id: string;
    name: string;
    message: string;
    color: string;
    createdAt: Date;
  }>;
  viewCount: number;
  isArchived: boolean;
}
```

### 2. `BlogPost` Model (`models/BlogPost.ts`)
The editorial publication document:
```typescript
interface IBlogPost {
  title: string;
  slug: string; // Unique URL slug
  description: string;
  content: string; // Full HTML / TipTap content
  coverImage?: string;
  published: boolean;
  publishedAt?: Date | null;
  tier: 1 | 2 | 3;
  readTime: string;
  keywords?: string[];
  faqSchema?: Record<string, unknown>; // Structured FAQ JSON-LD
  author: { name: string; email: string };
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. `Draft` Model (`models/Draft.ts`)
Automatic debounced client drafts storing wizard state with TTL expiration (30 days).

### 4. `User` Model (`models/User.ts`)
NextAuth accounts with hashed passwords, profile roles, and social provider links.

---

## 🧪 Testing & Quality Assurance

WishBloom maintains a strict verification pipeline. Every test must pass before deployment:

```bash
# 1. Static Type Checking
npm run type-check

# 2. Strict Code Quality & Purity Lint
npm run lint

# 3. Unit & Integration Tests (Jest)
npm test -- --runInBand

# 4. End-to-End User Flow Tests (Playwright)
npm run test:e2e

# 5. Accessibility Audits (Axe-Core)
npm run test:a11y

# 6. Production Build Verification
npm run build
```

---

## 🚢 Production Deployment

### Recommended: Vercel
1. Fork or push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Next.js App Router settings will be automatically detected.
4. Set your production environment variables (ensure `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` match your live custom domain, e.g., `https://wishblooms.in`).
5. Deploy! Continuous deployment automatically builds and checks every push to `main`.

### Continuous Integration (GitHub Actions)
Our `.github/workflows/ci.yml` pipeline runs on every push and pull request across 6 distinct jobs:
1. **Lint & Type Check:** Runs ESLint 9 and TypeScript compiler with 0 warnings allowed.
2. **Unit Tests:** Executes Jest test suites, verifies schemas, and uploads code coverage.
3. **Build:** Compiles Next.js standalone static routes and dynamic bundles.
4. **E2E Tests:** Launches headless Chromium on Ubuntu 22.04 LTS to verify the creation wizard and celebratory interactions.
5. **Accessibility Tests:** Runs automated WCAG 2.1 AA audits using Axe-core.
6. **Lighthouse CI:** Measures Core Web Vitals, performance, and SEO scores.

---

## 🔒 Security & Privacy Standards

- **Strict Content Security Policy (CSP):** Configured in `next.config.mjs` with strict script, font, frame, and media origin whitelisting.
- **Double Validation Barrier:** All inputs are validated on both client (React Hook Form) and server (Zod schemas) before hitting the database.
- **Automated Content Moderation:** Sanitizes user-generated text against profanity and malicious HTML payloads.
- **Microphone Privacy:** Audio captured during breath detection is processed strictly inside an in-memory client-side `AudioContext` buffer and is **never** recorded or transmitted to any server.
- **Role-Based Admin Protection:** Protected admin routes verify Google session emails on the server before granting access to blog creation or Google Search Console inspection APIs.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/BotanicalTheme`)
3. Run verification checks (`npm run type-check && npm run lint && npm test`)
4. Commit your Changes (`git commit -m 'feat: add lavender botanical border theme'`)
5. Push to the Branch (`git push origin feature/BotanicalTheme`)
6. Open a Pull Request

---

## 📄 License & Authors

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more details.

**Lead Architect & Maintainer:**  
**Naveen Agarwal**  
- **Website:** [wishblooms.in](https://wishblooms.in)  
- **GitHub:** [@NaveenAgarwal2004](https://github.com/NaveenAgarwal2004)  
- **Repository:** [WishBloom — A New Beginning](https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning)

---

<div align="center">
  <sub>Preserving scattered memories into timeless botanical heirlooms. Built with 💛 for friends, families, and long-distance loved ones.</sub>
</div>
