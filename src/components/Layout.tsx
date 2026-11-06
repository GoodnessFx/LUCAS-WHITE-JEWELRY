import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { cart, setDrawer } = useStore();
  const count = cart.reduce((n, x) => n + x.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-white focus:p-3"
      >
        Skip to content
      </a>

      {/* Announcement bar */}
      <div className="bg-black px-4 py-2 text-center text-[10px] uppercase tracking-[.18em] text-white/80">
        Complimentary insured shipping on orders over $500
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-black/10 bg-white/98 shadow-[0_1px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "border-black/8 bg-white/95 backdrop-blur"
        }`}
      >
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
                  `relative text-xs uppercase tracking-[.16em] transition-colors ${
                    isActive ? "text-gold" : "hover:text-gold"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearch(!search)}
              aria-label="Search"
              className="transition-colors hover:text-gold"
            >
              <Search size={19} />
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden transition-colors hover:text-gold sm:block"
            >
              <UserRound size={19} />
            </Link>
            <button
              onClick={() => setDrawer(true)}
              className="relative transition-colors hover:text-gold"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {search && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-black/8"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/shop?q=${encodeURIComponent(term)}`);
                  setSearch(false);
                  setTerm("");
                }}
                className="p-4"
              >
                <div className="mx-auto flex max-w-2xl">
                  <input
                    autoFocus
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search rings, gold, diamonds…"
                    className="w-full border-b border-black bg-transparent px-1 py-3 text-sm outline-none placeholder:text-black/35"
                  />
                  <button className="px-4 text-xs uppercase tracking-widest hover:text-gold transition-colors">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setMenu(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full w-[min(360px,90vw)] flex-col bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setMenu(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-10 flex flex-col">
                {nav.map(([label, to], i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <Link
                      onClick={() => setMenu(false)}
                      to={to}
                      className="block border-b border-black/8 py-5 font-display text-4xl transition-colors hover:text-gold"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: nav.length * 0.07 + 0.1 }}
                >
                  <Link
                    onClick={() => setMenu(false)}
                    to="/account"
                    className="block border-b border-black/8 py-5 font-display text-4xl transition-colors hover:text-gold"
                  >
                    Account
                  </Link>
                </motion.div>
              </nav>
              <div className="mt-auto">
                <p className="text-[10px] uppercase tracking-widest text-black/35">
                  Fine jewellery · Est. 2019
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main" key={location.pathname}>
        <Outlet />
      </main>

      <footer className="bg-[#080808] px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Fine jewellery, precious metals, and considered objects made to endure for generations.
            </p>
            <a
              className="mt-7 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-gold"
              href="https://instagram.com/lucaswhitejewelry"
            >
              <span className="grid h-4 w-4 place-items-center rounded border border-current text-[8px]">
                IG
              </span>
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
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/8 pt-7 text-[10px] text-white/30 sm:flex-row">
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
      <h3 className="mb-5 text-[10px] uppercase tracking-[.22em] text-gold">{title}</h3>
      <div className="flex flex-col gap-3">
        {links.map(([l, t]) => (
          <Link key={t} to={t} className="text-sm text-white/50 transition-colors hover:text-white">
            {l}
          </Link>
        ))}
      </div>
    </div>
  );
}
