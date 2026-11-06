import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import { useStore } from "@/store/useStore";

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const [shown, setShown] = useState(16);
  const { customProducts, hiddenProductIds } = useStore();
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
  const max = Number(params.get("max") || 6500);
  const sort = params.get("sort") || "popular";
  const set = (key: string, value: string) => {
    const n = new URLSearchParams(params);
    value ? n.set(key, value) : n.delete(key);
    setParams(n);
    setShown(16);
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
  return (
    <div className="section">
      <div className="mb-12 text-center">
        <p className="eyebrow">The collection</p>
        <h1 className="title text-6xl">Fine jewellery</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60">
          Objects of beauty and permanence, crafted in precious metals and exceptional stones.
        </p>
      </div>
      <div className="mb-8 flex items-center justify-between border-y border-black/10 py-4">
        <button
          onClick={() => setFilters(!filters)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <SlidersHorizontal size={15} /> Filter
        </button>
        <span className="hidden text-xs text-black/50 sm:block">{results.length} pieces</span>
        <select
          value={sort}
          onChange={(e) => set("sort", e.target.value)}
          aria-label="Sort products"
          className="bg-transparent text-xs uppercase tracking-wider outline-none"
        >
          <option value="popular">Most popular</option>
          <option value="newest">Newest</option>
          <option value="low">Price low to high</option>
          <option value="high">Price high to low</option>
        </select>
      </div>
      {filters && (
        <div className="mb-10 grid gap-6 bg-warm p-6 sm:grid-cols-2 lg:grid-cols-4">
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
            Maximum price <span className="float-right">${max}</span>
            <input
              className="mt-4 w-full accent-black"
              type="range"
              min="90"
              max="6500"
              step="100"
              value={max}
              onChange={(e) => set("max", e.target.value)}
            />
          </label>
        </div>
      )}
      {(category || metal || gem || q || max < 6500) && (
        <button
          onClick={() => setParams({})}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <X size={13} /> Clear filters
        </button>
      )}
      {results.length ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
            {results.slice(0, shown).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {shown < results.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setShown(shown + 16)}
                className="border border-black px-8 py-4 text-xs uppercase tracking-widest"
              >
                Load more
              </button>
              <p className="mt-3 text-xs text-black/45">
                Showing {Math.min(shown, results.length)} of {results.length}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center">
          <h2 className="font-display text-3xl">No pieces found</h2>
          <p className="mt-3 text-sm text-black/55">Try broadening your filters or search.</p>
          <button
            onClick={() => setParams({})}
            className="mt-6 border-b text-xs uppercase tracking-widest"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
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
  options: string[];
}) {
  return (
    <label className="text-xs uppercase tracking-widest">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-b border-black/30 bg-transparent py-2 text-sm normal-case tracking-normal outline-none"
      >
        <option value="">All</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}
