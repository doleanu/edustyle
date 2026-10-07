# Eduardo Style: barbershop website with online booking

**Live:** https://www.barberiaeduardostyle.es

Website for Eduardo Style, a barbershop in Los Abrigos, Tenerife.

## What it does

- **4 languages:** Spanish (default), English, German and French, with FAQ structured data per language.
- **Online booking on the owner's Google Calendar.** Free slots come from the calendar's busy times combined with the shop's hours and the length of each service. A confirmed booking becomes a calendar event. If the booking backend isn't configured, the form falls back to WhatsApp.
- **SMS by Twilio:** a confirmation when the client books and a reminder about an hour before the appointment. Phone numbers are normalised to E.164.
- **Reminder scheduling:** a GitHub Actions cron calls a secret-protected endpoint every 10 minutes. A flag on each calendar event makes re-runs safe, so a client never gets a double text.
- **Admin dashboard** (`/admin`): email and password login, a button to connect Google Calendar through OAuth, and the booking settings. Settings and the OAuth refresh token live in Upstash Redis.
- **SEO:** JSON-LD, sitemap and robots. The legal pages exist in every language and are noindexed.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Google Calendar API · Twilio · Upstash Redis · Luxon · GitHub Actions · Vercel

## Run locally

```bash
npm install
npm run dev
```

Without the booking variables the site runs in WhatsApp-only mode. With them, it needs:
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID`, `TWILIO_API_KEY_SECRET` (or `TWILIO_AUTH_TOKEN`), `TWILIO_FROM_NUMBER`
- Upstash Redis: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Admin and site: `OWNER_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`

Pushes to `main` deploy to production on Vercel.

---

Built and maintained by Bogdan & Petruța at [WebHosteleros](https://www.webhosteleros.es). The code is shared as a portfolio sample. The brand, photos and texts belong to Eduardo Style.
