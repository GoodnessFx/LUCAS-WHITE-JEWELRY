import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Minus,
  Plus,
  Tag,
  Truck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { business } from "@/config/business";
import { money, useStore } from "@/store/useStore";

const totalsFor = (subtotal: number, express = false, discount = 0) => {
  const shipping = express ? 45 : subtotal >= business.freeShippingThreshold ? 0 : 25;
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * 0.0825;
  return { shipping, tax, total: taxable + shipping + tax };
};

export function Cart() {
  const { cart, setQuantity, removeFromCart } = useStore();
  const [code, setCode] = useState(""),
    [applied, setApplied] = useState(false),
    [error, setError] = useState("");
  const subtotal = cart.reduce((n, x) => n + x.product.price * x.quantity, 0),
    discount = applied ? subtotal * 0.1 : 0;
  const totals = totalsFor(subtotal, false, discount);
  const apply = () => {
    if (code.trim().toUpperCase() === "WELCOME10") {
      setApplied(true);
      setError("");
    } else {
      setError("That code is not valid. Try WELCOME10.");
    }
  };
  if (!cart.length)
    return (
      <div className="section min-h-[60vh] text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="title">Nothing here yet</h1>
        <p className="mt-4 text-sm text-black/55">Discover something made to last.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-black px-8 py-4 text-xs uppercase tracking-widest text-white"
        >
          Explore the collection
        </Link>
      </div>
    );
  return (
    <div className="section">
      <p className="eyebrow">Your selection</p>
      <h1 className="title">Shopping bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          {cart.map((x) => (
            <div
              key={`${x.product.id}${x.size}`}
              className="grid grid-cols-[100px_1fr] gap-5 border-b py-6 sm:grid-cols-[140px_1fr_auto]"
            >
              <img
                src={x.product.images[0]}
                alt={x.product.name}
                className="aspect-[4/5] w-full object-cover"
              />
              <div>
                <Link to={`/product/${x.product.slug}`} className="font-display text-2xl">
                  {x.product.name}
                </Link>
                <p className="mt-1 text-xs text-black/50">
                  {x.product.metal} · Size {x.size}
                </p>
                <div className="mt-6 inline-flex items-center border">
                  <button
                    className="p-2"
                    onClick={() => setQuantity(x.product.id, x.size, x.quantity - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center text-xs">{x.quantity}</span>
                  <button
                    className="p-2"
                    onClick={() => setQuantity(x.product.id, x.size, x.quantity + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(x.product.id, x.size)}
                  className="ml-5 text-[10px] uppercase tracking-wider underline"
                >
                  Remove
                </button>
              </div>
              <strong className="col-start-2 text-sm sm:col-auto">
                {money(x.product.price * x.quantity)}
              </strong>
            </div>
          ))}
        </div>
        <aside className="h-fit bg-warm p-7">
          <h2 className="font-display text-3xl">Order summary</h2>
          <div className="mt-6 flex">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Promo code"
              className="w-full border bg-white px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={apply}
              className="bg-black px-4 text-xs uppercase tracking-wider text-white"
            >
              Apply
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
          {applied && <p className="mt-2 text-xs text-green-700">WELCOME10 applied — 10% off</p>}
          <div className="mt-6 space-y-3 border-y border-black/10 py-5 text-sm">
            <Row l="Subtotal" v={money(subtotal)} />
            {discount > 0 && <Row l="Discount" v={`−${money(discount)}`} />}
            <Row l="Estimated shipping" v={totals.shipping ? "$25.00" : "Complimentary"} />
            <Row l="Estimated tax" v={money(totals.tax)} />
          </div>
          <div className="flex justify-between py-5 text-lg">
            <strong>Total</strong>
            <strong>{money(totals.total)}</strong>
          </div>
          <Link
            to="/checkout"
            className="flex w-full items-center justify-center gap-2 bg-black py-4 text-xs uppercase tracking-widest text-white"
          >
            Secure checkout <LockKeyhole size={14} />
          </Link>
          <Link
            to="/shop"
            className="mt-5 block text-center text-xs uppercase tracking-widest underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function Checkout() {
  const { cart, placeOrder } = useStore(),
    navigate = useNavigate();
  const [express, setExpress] = useState(false),
    [loading, setLoading] = useState(false),
    [errors, setErrors] = useState<Record<string, string>>({});
  const subtotal = cart.reduce((n, x) => n + x.product.price * x.quantity, 0),
    totals = totalsFor(subtotal, express);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const needed = ["email", "first", "last", "address", "city", "postal", "country", "card"];
    const errs = Object.fromEntries(
      needed.filter((k) => !String(data.get(k) || "").trim()).map((k) => [k, "Required"]),
    );
    if (
      String(data.get("email")).trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email")))
    )
      errs.email = "Enter a valid email";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const id = `LW${Date.now().toString().slice(-8)}`;
      placeOrder({
        id,
        date: new Date().toISOString(),
        total: totals.total,
        status: "Confirmed",
        items: cart,
        email: String(data.get("email")),
        address: `${data.get("address")}, ${data.get("city")}, ${data.get("country")} ${data.get("postal")}`,
      });
      navigate(`/order/${id}`);
    }, 900);
  };
  if (!cart.length)
    return (
      <div className="section text-center">
        <h1 className="title">Your bag is empty</h1>
        <Link className="text-link mt-6" to="/shop">
          Return to shop
        </Link>
      </div>
    );
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to bag
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <form onSubmit={submit} noValidate className="space-y-8">
            <section className="bg-white p-6 sm:p-8">
              <Step n="1" title="Contact information" />
              <Field name="email" label="Email address" type="email" error={errors.email} />
              <label className="mt-4 flex gap-3 text-xs text-black/60">
                <input type="checkbox" /> Email me private releases and collection notes
              </label>
            </section>
            <section className="bg-white p-6 sm:p-8">
              <Step n="2" title="Shipping address" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="first" label="First name" error={errors.first} />
                <Field name="last" label="Last name" error={errors.last} />
                <div className="sm:col-span-2">
                  <Field name="address" label="Street address" error={errors.address} />
                </div>
                <Field name="city" label="City" error={errors.city} />
                <Field name="postal" label="Postal code" error={errors.postal} />
                <div className="sm:col-span-2">
                  <Field name="country" label="Country" error={errors.country} />
                </div>
              </div>
            </section>
            <section className="bg-white p-6 sm:p-8">
              <Step n="3" title="Delivery" />
              <label
                className={`flex cursor-pointer items-center justify-between border p-4 ${!express ? "border-black" : "border-black/15"}`}
              >
                <span className="flex gap-3">
                  <input type="radio" checked={!express} onChange={() => setExpress(false)} />
                  <span>
                    <b className="block text-sm">Insured standard</b>
                    <small className="text-black/50">3–5 business days</small>
                  </span>
                </span>
                <b className="text-sm">{subtotal >= 500 ? "Complimentary" : "$25"}</b>
              </label>
              <label
                className={`mt-3 flex cursor-pointer items-center justify-between border p-4 ${express ? "border-black" : "border-black/15"}`}
              >
                <span className="flex gap-3">
                  <input type="radio" checked={express} onChange={() => setExpress(true)} />
                  <span>
                    <b className="block text-sm">Priority insured</b>
                    <small className="text-black/50">1–2 business days</small>
                  </span>
                </span>
                <b className="text-sm">$45</b>
              </label>
            </section>
            <section className="bg-white p-6 sm:p-8">
              <Step n="4" title="Payment" />
              <div className="mb-5 flex items-center gap-2 text-xs text-black/50">
                <LockKeyhole size={14} /> Encrypted and secure · Stripe test mode
              </div>
              <Field
                name="card"
                label="Card number"
                placeholder="4242 4242 4242 4242"
                error={errors.card}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field name="expiry" label="Expiry" placeholder="12/30" />
                <Field name="cvc" label="CVC" placeholder="123" />
              </div>
              <p className="mt-4 text-[11px] leading-5 text-black/45">
                Test checkout: use card 4242 4242 4242 4242 with any future date and CVC. The
                payment adapter is ready to be replaced with a server-created Stripe Checkout
                Session.
              </p>
            </section>
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-black py-5 text-xs uppercase tracking-widest text-white disabled:opacity-60"
            >
              {loading ? (
                "Processing securely…"
              ) : (
                <>
                  Place order · {money(totals.total)} <LockKeyhole size={14} />
                </>
              )}
            </button>
          </form>
          <aside className="order-first h-fit bg-white p-6 lg:order-last lg:sticky lg:top-8">
            {cart.map((x) => (
              <div key={x.product.id + x.size} className="flex gap-4 border-b py-4">
                <div className="relative">
                  <img
                src={x.product.images[0]}
                alt={x.product.name}
                className="h-20 w-16 object-cover"
              />
                  <span className="absolute -right-2 -top-2 rounded-full bg-black px-1.5 py-.5 text-[10px] text-white">
                    {x.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg">{x.product.name}</p>
                  <p className="text-xs text-black/45">Size {x.size}</p>
                </div>
                <span className="text-sm">{money(x.product.price * x.quantity)}</span>
              </div>
            ))}
            <div className="space-y-3 py-5 text-sm">
              <Row l="Subtotal" v={money(subtotal)} />
              <Row l="Shipping" v={totals.shipping ? money(totals.shipping) : "Complimentary"} />
              <Row l="Tax" v={money(totals.tax)} />
            </div>
            <div className="flex justify-between border-t pt-5 text-lg">
              <strong>Total</strong>
              <strong>{money(totals.total)} USD</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function Confirmation() {
  const { id } = useParams(),
    order = useStore((s) => s.orders.find((o) => o.id === id));
  if (!order)
    return (
      <div className="section text-center">
        <h1 className="title">Order not found</h1>
        <Link to="/track" className="text-link mt-5">
          Track an order
        </Link>
      </div>
    );
  return (
    <div className="section max-w-3xl text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-gold">
        <Check size={30} />
      </div>
      <p className="eyebrow mt-7">Order {order.id}</p>
      <h1 className="title">Thank you for your order.</h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-black/60">
        A confirmation has been prepared for {order.email}. Your pieces will be carefully inspected
        and dispatched with full insurance.
      </p>
      <div className="mt-10 bg-warm p-7 text-left">
        <h2 className="font-display text-2xl">Order summary</h2>
        {order.items.map((x) => (
          <div key={x.product.id + x.size} className="flex justify-between border-b py-4 text-sm">
            <span>
              {x.product.name} × {x.quantity} <small className="text-black/45">({x.size})</small>
            </span>
            <span>{money(x.product.price * x.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-5">
          <strong>Total paid</strong>
          <strong>{money(order.total)}</strong>
        </div>
        <p className="mt-5 text-xs text-black/50">Shipping to: {order.address}</p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to={`/track?id=${order.id}`}
          className="bg-black px-7 py-4 text-xs uppercase tracking-widest text-white"
        >
          Track order
        </Link>
        <Link
          to="/shop"
          className="border border-black px-7 py-4 text-xs uppercase tracking-widest"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
function Row({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-black/55">{l}</span>
      <span>{v}</span>
    </div>
  );
}
function Step({ n, title }: { n: string; title: string }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 font-display text-2xl">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-xs text-white">
        {n}
      </span>
      {title}
    </h2>
  );
}
function Field({
  name,
  label,
  error,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-[11px] uppercase tracking-wider">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`mt-2 w-full border px-4 py-3 text-sm normal-case tracking-normal outline-none focus:border-black ${error ? "border-red-600" : "border-black/20"}`}
      />
      {error && (
        <span className="mt-1 block text-[11px] normal-case tracking-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
