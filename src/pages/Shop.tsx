import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import { useStore } from "@/store/useStore";

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const [shown, setShown] = useState(20);
  const { customProducts, hiddenProductIds } = useStore();
  useEffect(() => {
    document.title = "Shop Fine Jewelry & Gold | Lucas White Jewelry";
  }, []);
  const catalog = [
    ...products.filter(
      (p) => !hiddenProductIds.includes(p.id) && !customProducts.some((c) => c.id === p.id),
    ),
    ...customProducts,
  ];
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const metal = params.get("metal") || "";
  const gem = params.get("gem") || "";
  const max = Number(params.get("max") || 8000);
  const sort = params.get("sort") || "popular";

  const set = (key: string, value: string) => {
    const n = new URLSearchParams(params);
    value ? n.set(key, value) : n.delete(key);
    setParams(n);
    setShown(20);
  };

  const results = useMemo(() => {
    const list = catalog.filter(
      (p) =>
        (!category || p.category === category) &&
        (!metal || p.metal === metal) &&
        (!gem || p.gemstone === gem) &&
        p.price <= max &&
        (!q || `${p.name} ${p.description} ${p.metal}`.toLowerCase().includes(q.toLowerCase())),
    );
    return list.sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "newest"
            ? (b.flag === "new" ? 1 : 0) - (a.flag === "new" ? 1 : 0)
            : b.rating - a.rating,
    );
  }, [catalog, category, metal, gem, max, q, sort]);

  const hasFilters = !!(category || metal || gem || q || max < 8000);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#faf7f2] px-6 py-24 text-center">
        <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 liquid-blob bg-gold/8 pointer-events-none opacity-60" />
        <div className="absolute right-1/4 top-1/2 h-48 w-48 -translate-y-1/2 liquid-blob bg-black/4 pointer-events-none opacity-40" style={{ animationDelay: "-5s" }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="eyebrow">The collection</p>
          <h1 className="title text-[clamp(3rem,7vw,6rem)]">Fine jewellery</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/55">
            Objects of beauty and permanence, crafted in precious metals and exceptional stones.
          </p>
        </motion.div>
      </section>

      <div className="section !pt-10">
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between border-y border-black/10 py-4">
          <button
            onClick={() => setFilters(!filters)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:text-gold"
          >
            <SlidersHorizontal size={15} />
            {filters ? "Hide filters" : "Filter"}
          </button>
          <span className="hidden text-xs text-black/40 sm:block">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </span>
          <select
            value={sort}
            onChange={(e) => set("sort", e.target.value)}
            aria-label="Sort products"
            className="bg-transparent text-xs uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="popular">Most popular</option>
            <option value="newest">Newest</option>
            <option value="low">Price low to high</option>
            <option value="high">Price high to low</option>
          </select>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {filters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mb-10 grid gap-6 bg-[#faf7f2] p-6 sm:grid-cols-2 lg:grid-cols-4">
                <Filter
                  label="Category"
                  value={category}
                  onChange={(v) => set("category", v)}
                  options={categories}
                />
                <Filter
                  label="Metal"
                  value={metal}
                  onChange={(v) => set("metal", v)}
                  options={["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Silver"]}
                />
                <Filter
                  label="Gemstone"
                  value={gem}
                  onChange={(v) => set("gem", v)}
                  options={["Diamond", "Emerald", "Sapphire", "Pearl", "Onyx", "None"]}
                />
                <label className="text-xs uppercase tracking-widest">
                  Maximum price <span className="float-right text-gold">${max.toLocaleString()}</span>
                  <input
                    className="mt-4 w-full accent-[#c9a24b]"
                    type="range"
                    min="90"
                    max="8000"
                    step="100"
                    value={max}
                    onChange={(e) => set("max", e.target.value)}
                  />
                  <div className="mt-1 flex justify-between text-[9px] text-black/35">
                    <span>$90</span><span>$8,000</span>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            {category && (
              <Chip label={category} onRemove={() => set("category", "")} />
            )}
            {metal && <Chip label={metal} onRemove={() => set("metal", "")} />}
            {gem && <Chip label={gem} onRemove={() => set("gem", "")} />}
            {max < 8000 && (
              <Chip label={`Under $${max}`} onRemove={() => set("max", "")} />
            )}
            {q && <Chip label={`"${q}"`} onRemove={() => set("q", "")} />}
            <button
              onClick={() => setParams({})}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-black/40 underline hover:text-black"
            >
              <X size={11} /> Clear all
            </button>
          </motion.div>
        )}

        {/* Grid */}
        {results.length ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
              {results.slice(0, shown).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min((i % 4) * 0.07, 0.28),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
            {shown < results.length && (
              <div className="mt-16 text-center">
                <button
                  onClick={() => setShown(shown + 20)}
                  className="group border border-black px-10 py-4 text-xs uppercase tracking-widest transition-all hover:bg-black hover:text-white"
                >
                  Load more
                </button>
                <p className="mt-3 text-xs text-black/35">
                  Showing {Math.min(shown, results.length)} of {results.length}
                </p>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <h2 className="font-display text-4xl">No pieces found</h2>
            <p className="mt-4 text-sm text-black/50">Try broadening your filters or search.</p>
            <button
              onClick={() => setParams({})}
              className="mt-8 border-b border-black pb-1 text-xs uppercase tracking-widest"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-2 border border-black/15 px-3 py-1.5 text-[10px] uppercase tracking-wider">
      {label}
      <button onClick={onRemove} aria-label="Remove filter">
        <X size={10} />
      </button>
    </span>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="text-xs uppercase tracking-widest">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-b border-black/25 bg-transparent py-2 text-sm normal-case tracking-normal outline-none transition focus:border-gold"
      >
        <option value="">All</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}
