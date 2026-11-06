# Lucas White Jewelry

Production-oriented React storefront for Lucas White Jewelry, built with Vite, TypeScript, Tailwind CSS v4, React Router, Zustand, and Motion.

## Local setup

```bash
pnpm install
pnpm dev
```

Figma Make starts the development server automatically. Production verification:

```bash
pnpm build
pnpm format
```

## Commerce configuration

- Product content: `src/data/products.ts` (exactly 50 launch products)
- Sample reviews and testimonials: `src/data/content.ts`
- Business details, locations, shipping threshold, and display gold price: `src/config/business.ts`
- Preview admin password: `LWGOLD`
- Stripe test card: `4242 4242 4242 4242`, any future expiry and any CVC

This browser-only build uses localStorage for the cart, wishlist, order records, catalog overrides, and preview account. Before a public launch, connect the managed backend and move authentication, orders, product management, contact submissions, inventory, and Stripe secret-key operations to the server.

## Stripe

The checkout UI and order adapter are structured around a server-created Stripe Checkout or Payment Intent integration. A production integration requires server-side `STRIPE_SECRET_KEY`, webhook verification, and a public `VITE_STRIPE_PUBLISHABLE_KEY`. Never expose a Stripe secret key in Vite client code.

## Vercel deployment

1. Import the repository into Vercel.
2. Select **Vite** as the framework preset.
3. Set the build command to `pnpm build` and output directory to `dist`.
4. Add production environment values after the server payment adapter is connected.
5. Configure a SPA rewrite from `/(.*)` to `/index.html`.
6. Deploy and update the canonical domain in `public/sitemap.xml`.

## Launch checklist

- Replace all content in `src/data/content.ts` with real customer-approved reviews.
- Replace location address placeholders in `src/config/business.ts`.
- Connect the managed backend for secure accounts, orders, inventory, admin, and submissions.
- Enable server-side Stripe Checkout and verified webhooks.
- Replace the preview admin password with role-based server authentication.
- Confirm taxes, duties, terms, and privacy language with qualified advisors.
