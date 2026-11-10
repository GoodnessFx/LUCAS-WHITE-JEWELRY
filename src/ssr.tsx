/* Server-side rendering entry for build-time prerendering.
 *
 * Renders the public routes to static HTML strings so crawlers (and the
 * preview server) see real content instead of an empty <div id="root">.
 * The client entry (src/main.tsx) keeps using createBrowserRouter, so this
 * file is only imported by scripts/prerender.mjs during `vite build`.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { About, Contact, GoldTrading, Locations, FAQ } from "@/pages/Info";
import { ProductDetail } from "@/pages/ProductDetail";
import { products } from "@/data/products";

const staticPages = [
  { path: "/", Component: Home },
  { path: "shop", Component: Shop },
  { path: "about", Component: About },
  { path: "contact", Component: Contact },
  { path: "gold-trading", Component: GoldTrading },
  { path: "locations", Component: Locations },
  { path: "faq", Component: FAQ },
];

export function renderRoute(url: string): string {
  const productMatch = url.match(/^\/product\/([^\/]+)$/);
  const product = productMatch ? products.find((p) => p.slug === productMatch[1]) : undefined;

  return renderToString(
    <StaticRouter basename="/" location={url}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {staticPages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<page.Component />}
            />
          ))}
          {product && (
            <Route path="product/:slug" element={<ProductDetail />} />
          )}
        </Route>
      </Routes>
    </StaticRouter>,
  );
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
