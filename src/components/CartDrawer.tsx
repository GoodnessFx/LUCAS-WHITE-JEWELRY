import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { money, useStore } from "@/store/useStore";

export function CartDrawer() {
  const { cart, drawerOpen, setDrawer, setQuantity, removeFromCart } = useStore();
  const subtotal = cart.reduce((n, x) => n + x.product.price * x.quantity, 0);
  if (!drawerOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/35" onMouseDown={() => setDrawer(false)}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b pb-5">
          <h2 className="font-display text-3xl">Your bag</h2>
          <button onClick={() => setDrawer(false)} aria-label="Close cart">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-5">
          {!cart.length ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingBagIcon />
                <h3 className="mt-5 font-display text-2xl">Your bag is empty</h3>
                <Link
                  onClick={() => setDrawer(false)}
                  to="/shop"
                  className="mt-5 inline-block border-b border-black pb-1 text-xs uppercase tracking-widest"
                >
                  Discover the collection
                </Link>
              </div>
            </div>
          ) : (
            cart.map((x) => (
              <div key={`${x.product.id}${x.size}`} className="flex gap-4 border-b py-5">
                <img
                  src={x.product.images[0]}
                  alt={x.product.name}
                  className="h-28 w-24 object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        onClick={() => setDrawer(false)}
                        to={`/product/${x.product.slug}`}
                        className="font-display text-lg"
                      >
                        {x.product.name}
                      </Link>
                      <p className="text-xs text-black/50">{x.size}</p>
                    </div>
                    <span className="text-sm">{money(x.product.price * x.quantity)}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        className="p-2"
                        onClick={() => setQuantity(x.product.id, x.size, x.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-xs">{x.quantity}</span>
                      <button
                        className="p-2"
                        onClick={() => setQuantity(x.product.id, x.size, x.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      className="text-[10px] uppercase tracking-widest underline"
                      onClick={() => removeFromCart(x.product.id, x.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {!!cart.length && (
          <div className="border-t pt-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p className="mt-2 text-xs text-black/50">Taxes and shipping calculated at checkout.</p>
            <Link
              onClick={() => setDrawer(false)}
              to="/checkout"
              className="mt-5 flex w-full items-center justify-center gap-3 bg-black py-4 text-xs uppercase tracking-widest text-white"
            >
              Checkout securely <ArrowRight size={15} />
            </Link>
            <Link
              onClick={() => setDrawer(false)}
              to="/cart"
              className="mt-4 block text-center text-xs uppercase tracking-widest underline"
            >
              View bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
function ShoppingBagIcon() {
  return (
    <div className="mx-auto h-16 w-14 border border-black/20 border-t-0 before:mx-auto before:block before:h-7 before:w-7 before:-translate-y-3 before:rounded-t-full before:border before:border-b-0 before:border-black/20" />
  );
}
