import { Heart, Plus } from "lucide-react";
import { Link } from "react-router";
import type { Product } from "@/data/products";
import { money, useStore } from "@/store/useStore";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        </Link>
        {product.flag && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] uppercase tracking-[.2em]">
            {product.flag}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90"
          aria-label={`${wished ? "Remove from" : "Add to"} wishlist`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-black text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus size={17} />
        </button>
      </div>
      <div className="pt-4">
        <p className="mb-1 text-[10px] uppercase tracking-[.2em] text-black/50">
          {product.metal} · {product.purity}
        </p>
        <Link to={`/product/${product.slug}`} className="font-display text-xl hover:text-gold">
          {product.name}
        </Link>
        <p className="mt-1 text-sm">{money(product.price)}</p>
      </div>
    </article>
  );
}
