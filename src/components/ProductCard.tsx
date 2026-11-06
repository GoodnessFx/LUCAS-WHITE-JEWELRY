import { Heart, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import type { Product } from "@/data/products";
import { money, useStore } from "@/store/useStore";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 will-change-transform group-hover:scale-[1.06]"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/8" />
        </Link>

        {/* Badge */}
        {product.flag && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-3 top-3 bg-white px-3 py-1 text-[9px] uppercase tracking-[.22em] shadow-sm"
          >
            {product.flag}
          </motion.span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition-all duration-200 ${
            wished ? "bg-black text-white" : "bg-white/90 text-black hover:bg-white"
          }`}
          aria-label={`${wished ? "Remove from" : "Add to"} wishlist`}
        >
          <Heart size={14} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick add */}
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 flex items-center gap-2 translate-y-2 rounded-full bg-black/90 px-4 py-2.5 text-[9px] uppercase tracking-widest text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 hover:bg-black"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus size={11} strokeWidth={2.5} />
          Add
        </button>
      </div>

      <div className="pt-4">
        <p className="mb-1.5 text-[9px] uppercase tracking-[.22em] text-black/40">
          {product.metal} · {product.purity}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="block font-display text-xl leading-tight hover:text-gold transition-colors"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium">{money(product.price)}</p>
          <span className="text-[9px] text-gold tracking-wider">
            {"★".repeat(Math.round(product.rating))}
          </span>
        </div>
      </div>
    </article>
  );
}
