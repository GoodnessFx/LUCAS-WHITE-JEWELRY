import { ChevronDown, Heart, Minus, Plus, Ruler, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { reviewsByProduct } from "@/data/content";
import { money, useStore } from "@/store/useStore";

export function ProductDetail() {
  const { slug } = useParams();
  const { customProducts, hiddenProductIds, addToCart, toggleWishlist, wishlist } = useStore();
  const catalog = [...products, ...customProducts];
  const p = catalog.find((x) => x.slug === slug && !hiddenProductIds.includes(x.id));
  const [image, setImage] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!p) return;
    setSize(p.sizes[0]);
    setImage(0);
    document.title = `${p.name} | Lucas White Jewelry`;
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.productSchema = p.id;
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      sku: p.id,
      name: p.name,
      image: p.images,
      description: p.description,
      brand: { "@type": "Brand", name: "Lucas White Jewelry" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.rating,
        reviewCount: (reviewsByProduct[p.id] || []).length,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: p.price,
        availability:
          p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    });
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [p]);

  if (!p)
    return (
      <div className="section text-center">
        <h1 className="title">Piece not found</h1>
        <Link className="text-link mt-6" to="/shop">
          Return to shop
        </Link>
      </div>
    );

  const reviews = reviewsByProduct[p.id] || [];

  const handleAddToCart = () => {
    addToCart(p, qty, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="section">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-3 sm:grid-cols-[88px_1fr]"
        >
          {/* Thumbnails */}
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {p.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setImage(i)}
                className={`h-24 w-20 overflow-hidden border-2 transition-all ${
                  i === image ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${p.name} view ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="order-1 aspect-[4/5] overflow-hidden bg-stone-50 sm:order-2">
            <AnimatePresence mode="wait">
              <motion.img
                key={image}
                src={p.images[image]}
                alt={p.name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full cursor-zoom-in object-cover transition hover:scale-125"
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="eyebrow">{p.category}</p>
          <h1 className="font-display text-5xl leading-none">{p.name}</h1>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl">{money(p.price)}</p>
            <a href="#reviews" className="text-xs text-black/50 hover:text-black transition-colors">
              <span className="text-gold">{"★".repeat(Math.round(p.rating))}</span>{" "}
              {p.rating} ({reviews.length})
            </a>
          </div>
          <p className="mt-6 text-sm leading-7 text-black/60">{p.description}</p>

          {/* Specs */}
          <div className="mt-7 border-y border-black/8 py-5 space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span className="text-black/50">Metal</span>
              <strong>{p.metal} · {p.purity}</strong>
            </div>
            {p.gemstone !== "None" && (
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-black/50">Stone</span>
                <strong>{p.gemstone}</strong>
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span>Select size</span>
              <button
                onClick={() => setGuide(true)}
                className="flex items-center gap-1.5 text-black/50 hover:text-black transition-colors underline"
              >
                <Ruler size={13} /> Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 border px-3 py-3 text-xs transition-all ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-black/15 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-xs text-emerald-700">
            <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            In stock — {p.stock} available
          </p>

          {/* Quantity + CTA */}
          <div className="mt-5 flex gap-3">
            <div className="flex items-center border border-black/20">
              <button
                className="p-4 hover:bg-black/5 transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                className="p-4 hover:bg-black/5 transition-colors"
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
              >
                <Plus size={13} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-5 text-xs uppercase tracking-widest transition-all ${
                added
                  ? "bg-emerald-700 text-white"
                  : "bg-black text-white hover:bg-gold"
              }`}
            >
              {added ? "Added to bag ✓" : `Add to bag · ${money(p.price * qty)}`}
            </button>
            <button
              onClick={() => toggleWishlist(p.id)}
              className={`border px-4 transition-all ${
                wishlist.includes(p.id)
                  ? "border-black bg-black text-white"
                  : "border-black/20 hover:border-black"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={17} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded bg-[#faf7f2] p-4 text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-2 text-black/60">
              <Truck size={14} className="text-gold" /> Insured delivery
            </span>
            <span className="flex items-center gap-2 text-black/60">
              <ShieldCheck size={14} className="text-gold" /> Certificate included
            </span>
          </div>

          {/* Accordion */}
          <div className="mt-8">
            {["Description", "Details", "Shipping & returns"].map((t) => (
              <div key={t} className="border-t border-black/8">
                <button
                  onClick={() => setTab(tab === t ? "" : t)}
                  className="flex w-full items-center justify-between py-4 text-xs uppercase tracking-widest hover:text-gold transition-colors"
                >
                  {t}
                  <motion.span
                    animate={{ rotate: tab === t ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {tab === t && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden pb-5 text-sm leading-7 text-black/55"
                    >
                      {t === "Description"
                        ? p.description
                        : t === "Details"
                          ? `${p.metal}, ${p.purity} purity. ${p.gemstone === "None" ? "No gemstone." : `${p.gemstone} gemstone.`} Individually inspected and accompanied by a certificate of authenticity.`
                          : "Complimentary insured shipping over $500. Returns accepted within 30 days in original, unworn condition."}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-24 border-t pt-16">
        <div className="grid gap-10 lg:grid-cols-[.4fr_.6fr]">
          <div>
            <p className="eyebrow">Client reviews</p>
            <h2 className="font-display text-5xl">{p.rating}</h2>
            <p className="text-gold text-lg tracking-wider">{"★".repeat(5)}</p>
            <p className="mt-3 text-xs text-black/40">Based on {reviews.length} reviews</p>
          </div>
          <div>
            {reviews.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-b py-6 first:pt-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gold text-sm">{"★".repeat(r.rating)}</span>
                  <time className="text-xs text-black/35">{r.date}</time>
                </div>
                <h3 className="mt-3 font-display text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-black/55">{r.body}</p>
                <p className="mt-3 text-[10px] uppercase tracking-widest text-black/40">{r.name}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mt-24">
        <p className="eyebrow">You may also like</p>
        <h2 className="title mb-10">Consider these</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7">
          {products
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
            .map((x, i) => (
              <motion.div
                key={x.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={x} />
              </motion.div>
            ))}
        </div>
      </section>

      {/* Size guide modal */}
      <AnimatePresence>
        {guide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-5"
            onClick={() => setGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="max-w-lg bg-white p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-3xl">Size guide</h2>
              <p className="mt-4 text-sm leading-7 text-black/55">
                Measure the inside diameter of a ring that fits well.
              </p>
              <table className="mt-6 w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-black/40">
                    <th className="pb-3 font-normal">US Size</th>
                    <th className="pb-3 font-normal">Diameter (mm)</th>
                    <th className="pb-3 font-normal">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/8">
                  {[
                    ["5", "15.7", "49.3"],
                    ["6", "16.5", "51.9"],
                    ["7", "17.3", "54.4"],
                    ["8", "18.2", "57.0"],
                    ["9", "19.0", "59.5"],
                    ["10", "19.8", "62.1"],
                    ["11", "20.6", "64.6"],
                  ].map(([s, d, c]) => (
                    <tr key={s} className={size === s ? "bg-[#faf7f2]" : ""}>
                      <td className="py-2.5">{s}</td>
                      <td className="py-2.5">{d}</td>
                      <td className="py-2.5">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setGuide(false)}
                className="mt-6 bg-black px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-gold transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
