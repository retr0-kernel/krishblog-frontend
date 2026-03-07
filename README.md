# Krish Blog — Frontend

Next.js 16 App Router · TypeScript · TailwindCSS · Framer Motion · shadcn/ui

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=https://krishblog-production.up.railway.app
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Krish Blog
```

## Deployment

Deploy to Vercel:

```bash
vercel
# Set env vars in Vercel dashboard
```

## Structure

```
app/
  (public)/         ← reader site (/, /section/[slug], /post/[slug])
  (admin)/          ← admin dashboard (/admin/...)
components/
  layout/           ← Navbar, Footer
  reader/           ← ReadingProgress, ToC, ShareButtons, PostBody
  home/             ← Hero
  shared/           ← PostCard, Providers
lib/                ← api client, utils
hooks/              ← useReadingProgress, useScrollAnalytics
types/              ← TypeScript interfaces
```
# krishblog-frontend
