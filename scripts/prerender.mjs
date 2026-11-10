import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://lucas-white-jewelry.shop";

const PAGES = [
  {
    path: "/",
    file: "index.html",
    title: "Lucas White Jewelry | Fine Jewelry & Gold Trading",
    desc:
      "Fine jewellery and gold trading from Lucas White Jewelry — exceptional pieces in gold and precious metals, individually inspected and made to endure.",
  },
  {
    path: "/shop",
    file: "shop/index.html",
    title: "Shop Fine Jewelry & Gold | Lucas White Jewelry",
    desc:
      "Browse the fine jewellery collection — solid gold rings, diamond jewels, and precious metals from Lucas White Jewelry, each with a certificate of authenticity.",
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "Our Story | Lucas White Jewelry",
    desc:
      "Lucas White Jewelry is an international fine jewellery and precious metals house. Master craftsmanship from Germany, Singapore, and New York — jewellery made to endure for generations.",
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact | Lucas White Jewelry",
    desc:
      "Get in touch with Lucas White Jewelry for private appointments, aftercare, and precious metals enquiries. Email concierge@lucaswhitejewelry.com.",
  },
  {
    path: "/gold-trading",
    file: "gold-trading/index.html",
    title: "Gold Trading | Lucas White Jewelry",
    desc:
      "Buy and sell raw gold through our international precious metals desk, with transparent evaluations and discreet settlement.",
  },
  {
    path: "/locations",
    file: "locations/index.html",
    title: "Locations | Lucas White Jewelry",
    desc:
      "Visit Lucas White Jewelry in Germany, Singapore, or New York. Private appointments by appointment.",
  },
  {
    path: "/faq",
    file: "faq/index.html",
    title: "FAQ | Lucas White Jewelry",
    desc:
      "Frequently asked questions about fine jewellery, gold trading, shipping, returns, and care at Lucas White Jewelry.",
  },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1).trim() + "…" : str;
}

function injectHead(html, page) {
  let out = html
    // <title>
    .replace(/(<title[^>]*>)[\s\S]*?<\/title>/i, `$1${esc(page.title)}</title>`)
    // <meta name="description">
    .replace(
      /<meta[^>]*\sname=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(page.desc)}" />`,
    )
    // og:title
    .replace(
      /<meta[^>]*\sproperty=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${esc(page.title)}" />`,
    )
    // og:description
    .replace(
      /<meta[^>]*\sproperty=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${esc(page.desc)}" />`,
    );

  const headEnd = out.indexOf("</head>");
  if (headEnd === -1) return out;

  const before = out.slice(0, headEnd);
  const after = out.slice(headEnd);

  let insertion = "";

  // canonical
  if (/<link rel="canonical"[^>]*>/i.test(out)) {
    insertion += out.match(/<link rel="canonical"[^>]*>/i)[0].replace(
      /href="[^"]*"/,
      `href="${SITE}${page.path === "/" ? "" : page.path}"`,
    );
  } else {
    insertion += `<link rel="canonical" href="${SITE}${page.path === "/" ? "" : page.path}" />`;
  }

  // og:image (use page.ogImage if provided, else the site default from site.json)
  if (page.ogImage) {
    if (/<meta[^>]*\sproperty=["']og:image["'][^>]*>/i.test(out)) {
      insertion += out
        .match(/<meta[^>]*\sproperty=["']og:image["'][^>]*>/i)[0]
        .replace(/content="[^"]*"/, `content="${esc(page.ogImage)}"`);
    } else {
      insertion += `<meta property="og:image" content="${esc(page.ogImage)}" />`;
    }
  }

  for (const [prop, content] of [
    ["og:title", page.title],
    ["og:description", page.desc],
  ]) {
    if (!new RegExp(`property=["']${prop}["']`, "i").test(out)) {
      insertion += `<meta property="${prop}" content="${esc(content)}" />`;
    }
  }

  // Injected JSON-LD (if any)
  if (page.jsonLd) {
    const attr = page.jsonLdAttr || "";
    insertion += `<script type="application/ld+json"${attr}>${page.jsonLd}</script>`;
  }

  return before + insertion + after;
}

async function main() {
  if (!fs.existsSync(DIST)) {
    throw new Error(`dist/ not found — run \`vite build\` before prerendering`);
  }

  const server = await createServer({
    configFile: path.join(ROOT, "vite.config.ts"),
    server: { middlewareMode: "ssr" },
  });

  try {
    const { renderRoute, getProduct } = await server.ssrLoadModule("/src/ssr.tsx");
    const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

    for (const page of PAGES) {
      let inner;
      try {
        inner = renderRoute(page.path);
      } catch (err) {
        console.error(`Failed to prerender ${page.path}:`, err);
        continue;
      }
      let html = shell.replace(
        '<div id="root"></div>',
        `<div id="root">${inner}</div>`,
      );
      if (!html.includes('id="root"')) {
        throw new Error(`Could not find <div id="root"> in dist/index.html`);
      }
      html = injectHead(html, page);

      const outDir = page.path === "/" ? DIST : path.join(DIST, page.path);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log(`prerendered ${page.path}`);
    }

    // Product pages
    const { products } = await server.ssrLoadModule("/src/data/products.ts");
    for (const p of products) {
      const url = `/product/${p.slug}`;
      let inner;
      try {
        inner = renderRoute(url);
      } catch (err) {
        console.error(`Failed to prerender ${url}:`, err);
        continue;
      }
      let html = shell.replace(
        '<div id="root"></div>',
        `<div id="root">${inner}</div>`,
      );
      if (!html.includes('id="root"')) {
        throw new Error(`Could not find <div id="root"> in dist/index.html`);
      }

      const productJsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        sku: p.id,
        name: p.name,
        image: p.images,
        description: p.description,
        brand: { "@type": "Brand", name: "Lucas White Jewelry" },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: p.price,
          availability:
            p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      });
      const productJsonLdAttr = ` data-product-schema="${p.id}"`;

      const productPage = {
        path: url,
        file: `product/${p.slug}/index.html`,
        title: `${p.name} | Lucas White Jewelry`,
        desc: truncate(p.description, 160),
        ogImage: p.images[0],
        jsonLd: productJsonLd,
        jsonLdAttr: productJsonLdAttr,
      };
      html = injectHead(html, productPage);

      const outDir = path.join(DIST, "product", p.slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log(`prerendered ${url}`);
    }

    // Sitemap: public pages + every product page
    const publicUrls = PAGES.map((p) =>
      `${SITE}${p.path === "/" ? "" : p.path}`,
    );
    const productUrls = products.map(
      (p) => `${SITE}/product/${p.slug}`,
    );
    const urls = [...publicUrls, ...productUrls];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}
</urlset>
`;
    fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap);
    console.log(`wrote sitemap.xml with ${urls.length} URLs`);
  } finally {
    await server.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("Prerendering failed:", err);
  process.exit(1);
});
