import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { useStore } from "@/store/useStore";

const nav = [
  ["Shop", "/shop"],
  ["Gold Trading", "/gold-trading"],
  ["Our Story", "/about"],
  ["Locations", "/locations"],
];

export function Layout() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [term, setTerm] = useState("");
  const { cart, setDrawer } = useStore();
  const count = cart.reduce((n, x) => n + x.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <div className="bg-black px-4 py-2 text-center text-[10px] uppercase tracking-[.16em] text-white">
        Complimentary insured shipping on orders over $500
      </div>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <button className="lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {nav.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[.16em] ${isActive ? "text-gold" : "hover:text-gold"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearch(!search)} aria-label="Search">
              <Search size={19} />
            </button>
            <Link to="/account" aria-label="Account" className="hidden sm:block">
              <UserRound size={19} />
            </Link>
            <button
              onClick={() => setDrawer(true)}
              className="relative"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        {search && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/shop?q=${encodeURIComponent(term)}`);
              setSearch(false);
            }}
            className="border-t border-black/10 p-4"
          >
            <div className="mx-auto flex max-w-2xl">
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search rings, gold, diamonds…"
                className="w-full border-b border-black bg-transparent px-1 py-3 outline-none"
              />
              <button className="px-4 text-xs uppercase tracking-widest">Search</button>
            </div>
          </form>
        )}
      </header>
      {menu && (
        <div className="fixed inset-0 z-50 bg-white p-6">
          <div className="flex justify-between">
            <Logo />
            <button onClick={() => setMenu(false)} aria-label="Close menu">
              <X />
            </button>
          </div>
          <nav className="mt-16 flex flex-col">
            {nav.map(([label, to]) => (
              <Link
                onClick={() => setMenu(false)}
                key={to}
                to={to}
                className="border-b border-black/10 py-5 font-display text-4xl"
              >
                {label}
              </Link>
            ))}
            <Link
              onClick={() => setMenu(false)}
              to="/account"
              className="border-b border-black/10 py-5 font-display text-4xl"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
      <main id="main" key={location.pathname}>
        <Outlet />
      </main>
      <footer className="bg-black px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">
              Fine jewellery, precious metals, and considered objects made to endure for
              generations.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest"
              href="https://instagram.com/lucaswhitejewelry"
            >
              <span
                aria-hidden="true"
                className="grid h-4 w-4 place-items-center rounded border text-[8px]"
              >
                IG
              </span>{" "}
              @lucaswhitejewelry
            </a>
          </div>
          <FooterList
            title="Explore"
            links={[
              ["Shop all", "/shop"],
              ["Gold trading", "/gold-trading"],
              ["Our story", "/about"],
              ["Locations", "/locations"],
            ]}
          />
          <FooterList
            title="Client care"
            links={[
              ["Contact", "/contact"],
              ["FAQ", "/faq"],
              ["Shipping & returns", "/shipping-returns"],
              ["Track order", "/track"],
            ]}
          />
          <FooterList
            title="Legal"
            links={[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Admin", "/admin"],
            ]}
          />
        </div>
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/15 pt-7 text-[11px] text-white/50 sm:flex-row">
          <span>© 2026 Lucas White Jewelry. All rights reserved.</span>
          <span>Secure checkout · Insured delivery · 30-day returns</span>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}

function FooterList({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="mb-5 text-xs uppercase tracking-[.2em] text-gold">{title}</h3>
      <div className="flex flex-col gap-3">
        {links.map(([l, t]) => (
          <Link key={t} to={t} className="text-sm text-white/65 hover:text-white">
            {l}
          </Link>
        ))}
      </div>
    </div>
  );
}
