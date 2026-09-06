# BuildeHive Store

BuildeHive Store is a Next.js 14 application for construction-material ordering, vendor management, inventory, payments, and delivery workflows.

## Requirements

- Node.js 20 or newer
- PostgreSQL database
- Optional: Redis, Cloudinary, Firebase, Razorpay, SMTP, and SMS provider credentials

## Localhost Testing

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   copy .env.example .env.local
   ```

   On macOS/Linux use `cp .env.example .env.local` instead.

3. Set at least these values in `.env.local`:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
   JWT_SECRET=use-a-long-random-local-secret
   JWT_REFRESH_SECRET=use-another-long-random-local-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Generate Prisma Client and update the local database schema:

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. For a production-like local test, run `npm run build` and then `npm start`.

## Vercel Deployment

1. Import the GitHub repository into Vercel and keep the framework as **Next.js**.
2. Set the environment variables from `.env.example` in Vercel Project Settings. Use production credentials and hosted PostgreSQL.
3. Set `NEXT_PUBLIC_APP_URL` to the final Vercel URL, such as `https://your-app.vercel.app`.
4. Deploy. Vercel runs `npm run build`, which generates Prisma Client before building Next.js.
5. Run `npx prisma db push` from a trusted machine or CI job against the production `DATABASE_URL` before using database-backed pages. Do not run `prisma migrate dev` in a production build.

## Render Deployment

The repository includes `render.yaml` for a Render Web Service.

1. In Render, choose **New > Blueprint** and select this repository.
2. Add the secret values marked `sync: false` in the Render dashboard. Add other variables from `.env.example` for the features you enable.
3. Use hosted PostgreSQL and set its connection string as `DATABASE_URL`.
4. Apply the schema once before first production use with `npx prisma db push`.

The Render start command uses Render's assigned `PORT` automatically and binds to `0.0.0.0`.

## Environment Conditions

- `DATABASE_URL` is required for users, products, carts, orders, and admin APIs.
- `JWT_SECRET` and `JWT_REFRESH_SECRET` must be long, unique production secrets.
- Never commit `.env`, `.env.local`, API keys, database URLs, or private Firebase admin keys.
- Razorpay, Cloudinary, Redis, SMTP, Firebase Admin, and SMS variables are required only for their related features.
- `NEXT_PUBLIC_*` values are exposed to the browser; never put private API secrets there.
