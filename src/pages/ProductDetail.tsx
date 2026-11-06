import { ChevronDown, Heart, Minus, Plus, Ruler, ShieldCheck, Truck } from "lucide-react";
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
  const [image, setImage] = useState(0),
    [size, setSize] = useState(""),
    [qty, setQty] = useState(1),
    [tab, setTab] = useState("Description"),
    [guide, setGuide] = useState(false);
  useEffect(() => {
    if (!p) return;
    setSize(p.sizes[0]);
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
        availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
  return (
    <div className="section">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {p.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setImage(i)}
                className={`h-24 w-20 overflow-hidden border ${i === image ? "border-black" : "border-transparent"}`}
              >
                <img
                  src={img}
                  alt={`${p.name} view ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="order-1 aspect-[4/5] overflow-hidden bg-stone-100 sm:order-2">
            <img
              src={p.images[image]}
              alt={p.name}
              className="h-full w-full cursor-zoom-in object-cover transition hover:scale-125"
            />
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{p.category}</p>
          <h1 className="font-display text-5xl leading-none">{p.name}</h1>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg">{money(p.price)}</p>
            <a href="#reviews" className="text-xs">
              <span className="text-gold">★★★★★</span> {p.rating} ({reviews.length})
            </a>
          </div>
          <p className="mt-7 text-sm leading-7 text-black/65">{p.description}</p>
          <div className="mt-7 border-y border-black/10 py-5">
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span>Metal</span>
              <strong>
                {p.metal} · {p.purity}
              </strong>
            </div>
            {p.gemstone !== "None" && (
              <div className="mt-3 flex justify-between text-xs uppercase tracking-widest">
                <span>Stone</span>
                <strong>{p.gemstone}</strong>
              </div>
            )}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span>Select size</span>
              <button onClick={() => setGuide(true)} className="flex gap-2 underline">
                <Ruler size={14} /> Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 border px-3 py-3 text-xs ${size === s ? "border-black bg-black text-white" : "border-black/20"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-5 text-xs text-green-700">● In stock — {p.stock} available</p>
          <div className="mt-5 flex gap-3">
            <div className="flex items-center border">
              <button className="p-4" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus size={14} />
              </button>
              <span className="w-7 text-center">{qty}</span>
              <button className="p-4" onClick={() => setQty(Math.min(p.stock, qty + 1))}>
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => addToCart(p, qty, size)}
              className="flex-1 bg-black px-5 text-xs uppercase tracking-widest text-white"
            >
              Add to bag · {money(p.price * qty)}
            </button>
            <button
              onClick={() => toggleWishlist(p.id)}
              className="border px-4"
              aria-label="Add to wishlist"
            >
              <Heart size={18} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Truck size={16} /> Insured delivery
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Certificate included
            </span>
          </div>
          <div className="mt-8">
            {["Description", "Details", "Shipping & returns"].map((t) => (
              <div key={t} className="border-t border-black/10">
                <button
                  onClick={() => setTab(tab === t ? "" : t)}
                  className="flex w-full justify-between py-4 text-xs uppercase tracking-widest"
                >
                  {t}
                  <ChevronDown size={15} />
                </button>
                {tab === t && (
                  <p className="pb-5 text-sm leading-6 text-black/60">
                    {t === "Description"
                      ? p.description
                      : t === "Details"
                        ? `${p.metal}, ${p.purity} purity. ${p.gemstone === "None" ? "No gemstone" : `${p.gemstone} gemstone`}. Individually inspected and accompanied by a certificate of authenticity.`
                        : "Complimentary insured shipping over $500. Returns accepted within 30 days in original, unworn condition."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <section id="reviews" className="mt-24 border-t pt-16">
        <div className="grid gap-10 lg:grid-cols-[.4fr_.6fr]">
          <div>
            <p className="eyebrow">Client reviews</p>
            <h2 className="title">{p.rating} out of 5</h2>
            <p className="text-gold">★★★★★</p>
            <p className="mt-3 text-xs text-black/50">Based on {reviews.length} sample reviews</p>
          </div>
          <div>
            {reviews.map((r) => (
              <article key={r.id} className="border-b py-6 first:pt-0">
                <div className="flex justify-between">
                  <span className="text-gold">{"★".repeat(r.rating)}</span>
                  <time className="text-xs text-black/40">{r.date}</time>
                </div>
                <h3 className="mt-3 font-display text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{r.body}</p>
                <p className="mt-3 text-xs uppercase tracking-wider">{r.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-24">
        <p className="eyebrow">You may also like</p>
        <h2 className="title mb-9">Consider these</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7">
          {products
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
      {guide && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-5"
          onClick={() => setGuide(false)}
        >
          <div className="max-w-lg bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-3xl">Size guide</h2>
            <p className="mt-4 text-sm leading-6 text-black/60">
              Measure the inside diameter of a ring that fits. US 5: 15.7mm · US 6: 16.5mm · US 7:
              17.3mm · US 8: 18.1mm · US 9: 18.9mm · US 10: 19.8mm · US 11: 20.6mm.
            </p>
            <button
              onClick={() => setGuide(false)}
              className="mt-6 bg-black px-6 py-3 text-xs uppercase tracking-widest text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
