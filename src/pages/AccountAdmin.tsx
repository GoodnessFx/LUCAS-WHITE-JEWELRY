import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { Product, products } from "@/data/products";
import { money, useStore } from "@/store/useStore";

type User = { name: string; email: string };

export function Account() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("lw-user") || "null");
    } catch {
      return null;
    }
  });
  const [mode, setMode] = useState<"login" | "signup">("login"),
    [tab, setTab] = useState("orders"),
    [message, setMessage] = useState("");
  const { orders, wishlist } = useStore();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const u = { name: String(d.get("name") || "Client"), email: String(d.get("email")) };
    localStorage.setItem("lw-user", JSON.stringify(u));
    setUser(u);
  };
  if (!user)
    return (
      <div className="section max-w-lg">
        <div className="text-center">
          <p className="eyebrow">Private client</p>
          <h1 className="title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        </div>
        <form onSubmit={submit} className="mt-9 space-y-5">
          {mode === "signup" && <Input name="name" label="Full name" />}
          <Input name="email" label="Email" type="email" />
          <Input name="password" label="Password" type="password" />
          <button className="w-full bg-black py-4 text-xs uppercase tracking-widest text-white">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-xs uppercase tracking-widest underline"
        >
          {mode === "login" ? "New client? Create an account" : "Already registered? Sign in"}
        </button>
        <p className="mt-8 text-center text-[11px] leading-5 text-black/45">
          This preview stores the account in this browser. Connect the managed backend for secure
          cross-device authentication.
        </p>
      </div>
    );
  const wished = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="section">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-8">
        <div>
          <p className="eyebrow">Private client</p>
          <h1 className="title">Welcome, {user.name}.</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("lw-user");
            setUser(null);
          }}
          className="text-xs uppercase tracking-widest underline"
        >
          Sign out
        </button>
      </div>
      <div className="mt-8 flex gap-7 overflow-auto border-b">
        {[
          ["orders", "Orders"],
          ["wishlist", "Wishlist"],
          ["addresses", "Addresses"],
        ].map((x) => (
          <button
            key={x[0]}
            onClick={() => setTab(x[0])}
            className={`whitespace-nowrap border-b-2 pb-4 text-xs uppercase tracking-widest ${tab === x[0] ? "border-black" : "border-transparent text-black/45"}`}
          >
            {x[1]}
          </button>
        ))}
      </div>
      {tab === "orders" &&
        (orders.length ? (
          <div className="mt-8">
            {orders.map((o) => (
              <div key={o.id} className="grid gap-4 border-b py-6 sm:grid-cols-4">
                <div>
                  <small>Order</small>
                  <p>{o.id}</p>
                </div>
                <div>
                  <small>Date</small>
                  <p>{new Date(o.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <small>Status</small>
                  <p>{o.status}</p>
                </div>
                <div className="sm:text-right">
                  <strong>{money(o.total)}</strong>
                  <br />
                  <Link to={`/track?id=${o.id}`} className="text-xs underline">
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No orders yet" link="/shop" label="Explore the collection" />
        ))}
      {tab === "wishlist" &&
        (wished.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {wished.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <Empty title="Your wishlist is empty" link="/shop" label="Find something enduring" />
        ))}
      {tab === "addresses" && (
        <div className="mt-9 max-w-xl">
          <h2 className="font-display text-2xl">Saved address</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Address saved in this browser.");
            }}
            className="mt-5 space-y-4"
          >
            <Input name="address" label="Street address" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="city" label="City" />
              <Input name="postal" label="Postal code" />
            </div>
            <Input name="country" label="Country" />
            <button className="bg-black px-6 py-4 text-xs uppercase tracking-widest text-white">
              Save address
            </button>
            {message && <p className="text-sm text-green-700">{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("lw-admin") === "yes"),
    [error, setError] = useState(""),
    [editing, setEditing] = useState<Product | null>(null);
  const { orders, updateOrder, customProducts, hiddenProductIds, saveProduct, deleteProduct } =
    useStore();
  const catalog = [
    ...products.filter(
      (p) => !hiddenProductIds.includes(p.id) && !customProducts.some((c) => c.id === p.id),
    ),
    ...customProducts,
  ];
  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const p = new FormData(e.currentTarget).get("password");
    if (p === "LWGOLD") {
      sessionStorage.setItem("lw-admin", "yes");
      setAuthed(true);
    } else setError("Incorrect password");
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name"));
    const existing = editing;
    saveProduct({
      id: existing?.id || `CUSTOM-${Date.now()}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: String(d.get("category")),
      metal: String(d.get("metal")),
      purity: String(d.get("purity")),
      gemstone: String(d.get("gemstone")),
      price: Number(d.get("price")),
      description: String(d.get("description")),
      sizes: (String(d.get("sizes")) || "One size").split(",").map((x) => x.trim()),
      stock: Number(d.get("stock")),
      rating: existing?.rating || 5,
      images: existing?.images || products[0].images,
      flag: "new",
    });
    setEditing(null);
  };
  if (!authed)
    return (
      <div className="section max-w-md text-center">
        <p className="eyebrow">Restricted</p>
        <h1 className="title">Administration</h1>
        <form onSubmit={login} className="mt-8">
          <Input name="password" label="Admin password" type="password" />
          {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
          <button className="mt-5 w-full bg-black py-4 text-xs uppercase tracking-widest text-white">
            Unlock dashboard
          </button>
        </form>
        <p className="mt-6 text-[11px] text-black/45">
          Preview password: LWGOLD. Replace with server authentication before launch.
        </p>
      </div>
    );
  return (
    <div className="section">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Lucas White</p>
          <h1 className="title">Admin dashboard</h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("lw-admin");
            setAuthed(false);
          }}
          className="text-xs uppercase tracking-widest underline"
        >
          Lock
        </button>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          ["Products", catalog.length],
          ["Orders", orders.length],
          ["Revenue", money(orders.reduce((n, o) => n + o.total, 0))],
        ].map((x) => (
          <div key={x[0] as string} className="bg-warm p-6">
            <p className="text-xs uppercase tracking-widest text-black/50">{x[0]}</p>
            <strong className="mt-3 block font-display text-4xl">{x[1]}</strong>
          </div>
        ))}
      </div>
      <section className="mt-14">
        <h2 className="font-display text-3xl">{editing ? "Edit product" : "Add a product"}</h2>
        <form
          key={editing?.id || "new"}
          onSubmit={submit}
          className="mt-6 grid gap-4 border p-6 sm:grid-cols-3"
        >
          <Input name="name" label="Product name" defaultValue={editing?.name} />
          <Input name="price" label="Price USD" type="number" defaultValue={editing?.price} />
          <Input name="stock" label="Stock" type="number" defaultValue={editing?.stock} />
          <Input name="category" label="Category" defaultValue={editing?.category || "Rings"} />
          <Input name="metal" label="Metal" defaultValue={editing?.metal || "Yellow Gold"} />
          <Input name="purity" label="Purity" defaultValue={editing?.purity || "18K"} />
          <Input name="gemstone" label="Gemstone" defaultValue={editing?.gemstone || "None"} />
          <Input
            name="sizes"
            label="Sizes, comma separated"
            defaultValue={editing?.sizes.join(", ") || "One size"}
          />
          <Input name="description" label="Description" defaultValue={editing?.description} />
          <div className="flex gap-2 sm:col-span-3">
            <button className="bg-black px-6 py-3 text-xs uppercase tracking-widest text-white">
              {editing ? "Save changes" : "Add product"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border px-6 text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="mt-14">
        <h2 className="font-display text-3xl">Products</h2>
        <div className="mt-5 overflow-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider">
                <th className="py-4">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-4">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className="text-right">
                    <button onClick={() => setEditing(p)} className="mr-4 underline">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="text-red-700 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-14">
        <h2 className="font-display text-3xl">Orders</h2>
        {orders.length ? (
          <div className="mt-5 overflow-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wider">
                  <th className="py-4">Order</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b">
                    <td className="py-4">{o.id}</td>
                    <td>{o.email}</td>
                    <td>{money(o.total)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrder(o.id, e.target.value)}
                        className="border px-3 py-2"
                      >
                        <option>Confirmed</option>
                        <option>Preparing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-sm text-black/50">No orders have been placed in this browser.</p>
        )}
      </section>
    </div>
  );
}
function Input({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block text-xs uppercase tracking-widest">
      {label}
      <input
        required
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full border px-4 py-3 text-sm normal-case tracking-normal outline-none focus:border-black"
      />
    </label>
  );
}
function Empty({ title, link, label }: { title: string; link: string; label: string }) {
  return (
    <div className="py-20 text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      <Link to={link} className="text-link mt-5">
        {label}
      </Link>
    </div>
  );
}
