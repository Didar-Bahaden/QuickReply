# QuickReply

A mobile-first PWA snippet manager for solopreneurs and online sellers. Organize your most frequent customer responses into categories, copy them instantly, and close conversations faster.

## Features

- 📱 **Mobile-first PWA** — installable on iOS & Android
- 🗂️ **Custom categories** with emoji tags
- 🔍 **Fast search** with `Ctrl+K` shortcut
- 🔗 **Share snippets** via link
- 📤 **Import / Export** JSON backup
- 🌐 **Web Share Target** — share text from any app directly into QuickReply
- ✦ **Dynamic placeholders** — use `{customer_name}` to fill values before copying
- 📊 **Most Used sorting** — surfaces your top snippets automatically
- ⚡ **Fully offline** — service worker precaches the app shell

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Phosphor Icons](https://phosphoricons.com/)
- TypeScript (strict mode)
- PWA / Service Worker

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. No environment variables are required — all data is stored client-side in `localStorage`.
4. Click **Deploy**.

> **Note:** The app is fully client-side with no server-side data storage. No database or backend API is needed.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## License

MIT