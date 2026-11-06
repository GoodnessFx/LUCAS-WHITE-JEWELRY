import { ArrowRight, Gem, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { testimonials } from "@/data/content";
import { products } from "@/data/products";
import { business } from "@/config/business";

/* ─── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("visible"),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── Marquee ticker ─────────────────────────────────────────── */
const tickerItems = [
  "Fine Jewellery",
  "Precious Metals",
  "Handcrafted",
  "Certificate of Authenticity",
  "Lifetime Polishing",
  "Insured Shipping",
  "Master Craftsmanship",
  "Lucas White",
];

function Ticker() {
  const repeated = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden border-y border-black/8 bg-[#faf7f2] py-3.5 select-none">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-8 text-[10px] uppercase tracking-[.25em] text-black/55">
            {item}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Parallax hero ──────────────────────────────────────────── */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[92svh] overflow-hidden bg-[#0d0c09]">
      {/* Parallax image */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1615974570340-b01904376f91?auto=format&fit=crop&w=1800&q=90"
          alt="Fine gold rings from Lucas White Jewelry"
          className="h-full w-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Liquid blobs */}
      <div className="absolute right-[8%] top-[15%] h-72 w-72 liquid-blob bg-gold/10 opacity-30 will-change-transform" />
      <div className="absolute right-[20%] bottom-[20%] h-48 w-48 liquid-blob bg-white/5 opacity-20 will-change-transform" style={{ animationDelay: "-4s" }} />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto flex min-h-[92svh] max-w-[1400px] items-center px-6 py-24 lg:px-10"
      >
        <div className="max-w-3xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 text-[10px] uppercase tracking-[.32em] text-white/60"
          >
            The new heirlooms · Est. 2019
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(4rem,10vw,8.5rem)] leading-[.88] font-light"
          >
            Crafted for a<br />
            <em className="font-light italic">lifetime.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-md text-sm leading-7 text-white/75 font-light"
          >
            Exceptional jewellery and precious metals, thoughtfully sourced and finished by master hands.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-white px-8 py-4 text-[11px] uppercase tracking-[.2em] text-black transition-all hover:bg-gold hover:text-white"
            >
              Explore the collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/gold-trading"
              className="inline-flex items-center gap-3 border border-white/40 px-8 py-4 text-[11px] uppercase tracking-[.2em] text-white/80 transition-all hover:border-white hover:text-white"
            >
              Gold trading
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[.3em] text-white/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ─── Trust bar ─────────────────────────────────────────────── */
function TrustBar() {
  return (
    <div className="border-b border-black/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
        {(
          [
            [Truck, "Insured shipping"],
            [ShieldCheck, "30-day returns"],
            [Gem, "Authenticity guaranteed"],
            [Sparkles, "Lifetime polishing"],
          ] as const
        ).map(([Icon, text]) => (
          <div
            key={text}
            className="group flex items-center justify-center gap-3 border-r border-black/10 px-3 py-5 text-[10px] uppercase tracking-[.14em] last:border-r-0 transition-colors hover:bg-[#faf7f2]"
          >
            <Icon size={17} strokeWidth={1.3} className="transition-colors group-hover:text-gold" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section heading ───────────────────────────────────────── */
function Heading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return (
    <div className="mb-12 flex items-end justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-link group hidden sm:flex">
          Shop all
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/* ─── Bestsellers ────────────────────────────────────────────── */
function Bestsellers() {
  const ref = useReveal();
  return (
    <section className="section">
      <div ref={ref} className="reveal">
        <Heading eyebrow="Curated for you" title="Enduring essentials" link="/shop" />
      </div>
      <div className="reveal-stagger grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-7" ref={useReveal(0.05)}>
        {products
          .filter((p) => p.flag === "bestseller")
          .slice(0, 4)
          .map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
    </section>
  );
}

/* ─── Craft editorial ────────────────────────────────────────── */
function CraftEditorial() {
  const ref = useReveal();
  const imgRef = useReveal();
  return (
    <section className="grid bg-[#faf7f2] lg:grid-cols-2">
      <div ref={imgRef} className="reveal min-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?auto=format&fit=crop&w=1400&q=90"
          alt="Gold ring crafted with precision"
          className="h-full w-full object-cover transition duration-[1200ms] hover:scale-105"
        />
      </div>
      <div ref={ref} className="reveal flex items-center px-8 py-20 lg:px-20">
        <div className="max-w-lg">
          <p className="eyebrow">The Lucas White standard</p>
          <h2 className="title">
            Made with meaning,
            <br />
            <em>kept for generations.</em>
          </h2>
          <p className="mt-7 text-sm leading-7 text-black/65">
            We believe true luxury is measured in integrity. Every piece begins with responsibly
            sourced materials and is shaped by craftspeople who understand that the smallest
            details become the lasting ones.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              ["18K+", "Gold purity standard"],
              ["3", "Global locations"],
              ["100%", "Certified authentic"],
              ["∞", "Lifetime polishing"],
            ].map(([stat, label]) => (
              <div key={label} className="border-l-2 border-gold pl-4">
                <div className="font-display text-3xl">{stat}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-black/50">{label}</div>
              </div>
            ))}
          </div>
          <Link to="/about" className="text-link mt-10 group">
            Our story
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Category showcase ──────────────────────────────────────── */
function CategoryShowcase() {
  const ref = useReveal();
  const categories = [
    { name: "Rings", image: products[3].images[0], desc: "Bands & solitaires" },
    { name: "Necklaces", image: products[18].images[0], desc: "Chains & pendants" },
    { name: "Bracelets", image: products[31].images[0], desc: "Bangles & cuffs" },
    { name: "Earrings", image: products[43].images[0], desc: "Studs & hoops" },
  ];
  return (
    <section className="section">
      <div ref={ref} className="reveal">
        <Heading eyebrow="The collection" title="Objects of permanence" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/shop?category=${cat.name}`}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <img
                src={cat.image}
                alt={`${cat.name} collection`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition duration-500 group-hover:from-black/75" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="block font-display text-3xl text-white">{cat.name}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-widest text-white/60 transition-all duration-300 group-hover:text-white/90">
                  {cat.desc}
                </span>
                <span className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/0 transition-all duration-300 group-hover:text-white/80">
                  Explore <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Gold desk (liquid effect) ─────────────────────────────── */
function GoldDesk() {
  const ref = useReveal();
  return (
    <section className="bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background liquid blobs */}
      <div className="absolute left-[10%] top-[20%] h-96 w-96 liquid-blob bg-gold/8 pointer-events-none" />
      <div className="absolute right-[5%] bottom-[10%] h-64 w-64 liquid-blob bg-yellow-600/5 pointer-events-none" style={{ animationDelay: "-3s" }} />

      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2 relative">
        <div ref={ref} className="reveal px-7 py-20 lg:px-12 lg:py-28">
          <p className="eyebrow text-gold">Precious metals desk</p>
          <h2 className="font-display text-5xl leading-none sm:text-7xl font-light">
            Gold,<br />
            <em>with clarity.</em>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
            Buy and sell raw gold with confidence. Transparent market-linked pricing, secure
            evaluation, and discreet international service.
          </p>
          <div className="mt-10 flex max-w-md items-end justify-between border-b border-white/15 pb-5">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                Indicative gold price / gram
              </span>
              <div className="mt-2 font-display text-5xl">
                ${business.goldPricePerGram.toFixed(2)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-green-400">▲ +0.42%</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">Today</span>
            </div>
          </div>
          <Link
            to="/gold-trading"
            className="mt-9 inline-flex items-center gap-3 border border-white/30 px-7 py-4 text-[11px] uppercase tracking-widest transition-all hover:border-gold hover:text-gold"
          >
            Explore gold trading <ArrowRight size={14} />
          </Link>
        </div>

        {/* Animated gold bar visual */}
        <div className="min-h-[500px] bg-[radial-gradient(circle_at_50%_45%,#d8b65c_0,#947226_18%,#15120c_48%,#000_70%)] p-12 grid place-items-center">
          <motion.div
            animate={{ rotateY: [0, 8, 0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-64 w-44 rotate-6 rounded-xl border border-yellow-200/50 bg-gradient-to-br from-[#f5dc8b] via-[#ae8127] to-[#f2d675] shadow-[0_40px_80px_rgba(0,0,0,0.8)] gold-shine"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-5 rounded border border-black/30 text-center text-black/70">
              <div className="mt-10 text-xs tracking-widest">LUCAS WHITE</div>
              <div className="my-5 font-display text-5xl font-light">LW</div>
              <div className="text-xs tracking-widest">
                FINE GOLD
                <br />
                999.9
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── New arrivals horizontal scroll ────────────────────────── */
function NewArrivals() {
  const newItems = products.filter((p) => p.flag === "new").slice(0, 6);
  const ref = useReveal();
  return (
    <section className="py-20 overflow-hidden">
      <div className="section !pb-0">
        <div ref={ref} className="reveal">
          <Heading eyebrow="Just arrived" title="New pieces" link="/shop?sort=newest" />
        </div>
      </div>
      <div className="px-6 lg:px-10">
        <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {newItems.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[260px] snap-start sm:min-w-[300px]"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const [quote, setQuote] = useState(0);
  const ref = useReveal();

  useEffect(() => {
    const t = setInterval(() => setQuote((q) => (q + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section text-center">
      <div ref={ref} className="reveal">
        <p className="eyebrow">Client stories</p>
        <div className="mx-auto max-w-4xl">
          <div className="text-gold text-xl tracking-widest">★★★★★</div>
          <motion.blockquote
            key={quote}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 font-display text-3xl leading-snug sm:text-5xl font-light"
          >
            "{testimonials[quote][4]}"
          </motion.blockquote>
          <motion.p
            key={`name-${quote}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-7 text-xs uppercase tracking-widest text-black/50"
          >
            {testimonials[quote][0]} · {testimonials[quote][1]}, {testimonials[quote][2]}
          </motion.p>
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuote(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === quote ? "w-8 bg-black" : "w-1.5 bg-black/20 hover:bg-black/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Locations strip ────────────────────────────────────────── */
function LocationsStrip() {
  const ref = useReveal(0.1);
  return (
    <section className="bg-[#faf7f2] px-6 py-16">
      <div ref={ref} className="reveal-stagger mx-auto grid max-w-[1400px] gap-7 md:grid-cols-3">
        {business.locations.map((l) => (
          <div key={l.city} className="group border-l-2 border-gold pl-6 transition-all hover:pl-8">
            <span className="text-[10px] uppercase tracking-widest text-black/40">{l.type}</span>
            <h3 className="mt-2 font-display text-4xl">{l.city}</h3>
            <p className="mt-1 text-sm text-black/60">{l.country}</p>
            <Link
              to="/locations"
              className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold opacity-0 transition-all group-hover:opacity-100"
            >
              Visit <ArrowRight size={10} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter ─────────────────────────────────────────────── */
function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const ref = useReveal();
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-6 py-24 text-white">
      {/* Decorative blobs */}
      <div className="absolute left-1/3 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 liquid-blob bg-gold/8 pointer-events-none" />

      <div ref={ref} className="reveal relative mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold">Private notes</p>
        <h2 className="font-display text-5xl font-light sm:text-6xl">Join our world</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/50">
          New collections, private appointments, and considered stories — sent sparingly.
        </p>
        {subscribed ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 font-display text-3xl text-gold"
          >
            Thank you. You're on the list.
          </motion.p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
            className="mx-auto mt-10 flex max-w-lg border-b border-white/25 focus-within:border-gold transition-colors"
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-white/30"
            />
            <button className="text-[10px] uppercase tracking-widest text-white/60 hover:text-gold transition-colors">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <Ticker />
      <Bestsellers />
      <CraftEditorial />
      <CategoryShowcase />
      <GoldDesk />
      <NewArrivals />
      <Testimonials />
      <LocationsStrip />
      <Newsletter />
    </>
  );
}
