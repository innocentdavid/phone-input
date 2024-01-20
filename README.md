This is a [Next.js](https://nextjs.org/) project + Shadcn.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## How it works

When the page loads it automatically detects the user's location using [`ipinfo`](https://ipinfo.io) this provides the user's country
- The provided country is then used to get the country's flagEmoji using [`countries-list`](https://www.npmjs.com/package/countries-list) and also get the country's calling code
- List of all countries was also provided by the **country-list** package.

*-* The phone number gets validated as you type <br>
*-* OnSubmit I used [`phone`]() package to properly validate the phone number


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
