# NEL Photography

An editorial photography portfolio built with Next.js, TypeScript, and the App Router. It is configured for zero-config deployment on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize before launch

The primary site copy, portfolio entries, contact details, and social links are in `components/portfolio.tsx`. Metadata and social sharing text are in `app/layout.tsx`. Optimized portfolio images live in `public/images`; high-resolution originals remain in the ignored `assets` archive.

## Deploy to Vercel

```bash
npx vercel
```

Vercel detects Next.js automatically. No environment variables are required for this initial version.
