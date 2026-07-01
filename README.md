# Revital Therapy — Website

Single-page presentation website for **Revital Therapy** — cabinet de fizioterapie și masaj terapeutic din Iași.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. Designed for fast loading, accessibility, and strong local SEO.

---

## Features

- 🎨 Warm, professional design (sage green + cream + terracotta palette)
- 📱 Fully mobile responsive
- 🔍 SEO-optimized (meta tags, OpenGraph, JSON-LD structured data, sitemap, robots.txt)
- 📞 Direct contact via phone + WhatsApp (no form, minimal friction)
- ✅ GDPR-compliant (privacy policy, terms)
- ♿ Accessibility-first (WCAG 2.1 AA)
- 💬 Floating WhatsApp button
- 🗺️ Embedded Google Maps
- 📊 Schema.org `LocalBusiness` + `MedicalBusiness` + `PhysicalTherapy`

---

## Project structure

```
revital-therapy/
├── public/                        # Static assets (TODO: add logo, OG image, favicon)
├── src/
│   ├── app/
│   │   ├── politica-confidentialitate/page.tsx
│   │   ├── termeni-conditii/page.tsx
│   │   ├── globals.css            # Tailwind + custom utilities
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── page.tsx               # Home page (composes all sections)
│   │   ├── robots.ts              # /robots.txt
│   │   └── sitemap.ts             # /sitemap.xml
│   ├── components/
│   │   ├── About.tsx
│   │   ├── Contact.tsx            # CTA banner with phone + WhatsApp
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx             # Sticky nav with mobile menu
│   │   ├── Hero.tsx
│   │   ├── JsonLd.tsx             # Schema.org structured data
│   │   ├── Location.tsx           # Map + address + hours
│   │   ├── Services.tsx           # 9 service cards
│   │   ├── Testimonials.tsx
│   │   └── WhyUs.tsx
│   └── lib/
│       └── business.ts            # Single source of truth (name, address, services...)
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup (local development)

### 1. Install dependencies

```bash
cd revital-therapy
npm install
```

### 2. Create a `.env.local` file (optional)

```bash
cp .env.example .env.local
```

Only one env var is needed:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site is live.

---

## Production deployment (Vercel)

### One-time setup

1. **Push to GitHub** (private repo recommended):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/revital-therapy.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repo
   - Framework preset: **Next.js** (auto-detected)
   - Add environment variables (same as `.env.local`)
   - Click **Deploy**

3. **Buy a domain** (recommended: `revitaltherapy.ro`):
   - [RoTLD](https://www.rotld.ro) for `.ro` (~60 RON/year)
   - Or Namecheap / GoDaddy for `.com` (~$15/year)

4. **Connect the domain to Vercel**:
   - In Vercel project: **Settings → Domains → Add**
   - Type your domain → Vercel shows DNS records to add
   - Add the records at your domain registrar
   - Vercel auto-provisions SSL within minutes

5. **Update `NEXT_PUBLIC_SITE_URL`** in Vercel env to your production URL (e.g. `https://revitaltherapy.ro`)

### After deployment

- Add the website to **Google Business Profile** (you got the "Add website" suggestion)
- Submit the sitemap to [Google Search Console](https://search.google.com/search-console)
  - Add your domain as a property
  - Submit sitemap: `https://revitaltherapy.ro/sitemap.xml`
- Test the site with [PageSpeed Insights](https://pagespeed.web.dev/) — should score 90+ on all metrics

---

## TODOs before going live

- [ ] **Add favicon and OG image** to `/public`:
  - `favicon.ico` (32x32)
  - `apple-touch-icon.png` (180x180)
  - `og-image.jpg` (1200x630) — used in social media previews
- [ ] **Replace placeholder testimonials** in `src/components/Testimonials.tsx` with real Google reviews
- [ ] **Verify business hours** in `src/lib/business.ts` (`business.hours`) match Google Business Profile exactly
- [ ] **Verify Instagram handle** is `revital_therapy_` (link in `business.social.instagram`)
- [ ] **Add Facebook URL** in `business.social.facebook` if applicable
- [ ] **Add a logo** (replace text mark in `Header.tsx` and `Footer.tsx` if desired)
- [ ] **Update GDPR policy** in `src/app/politica-confidentialitate/page.tsx` if you collect any additional data (e.g., analytics)
- [ ] Optional: add **Google Analytics 4** or **Plausible** (privacy-friendly)
- [ ] Optional: add **Google Search Console verification** meta tag

---

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (body) + Playfair Display (headings) — both from Google Fonts via `next/font`

---

## Available scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server (after build)
npm run lint         # Lint code
npm run type-check   # TypeScript check without emitting
```

---

## Updating business info

All business details (name, address, phone, services, hours) live in **one file**:

```
src/lib/business.ts
```

Update there and changes propagate everywhere — JSON-LD, footer, contact page, sitemap, etc.

---

## License

Private project for Revital Therapy. All rights reserved.
