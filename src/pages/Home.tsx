import { ArrowRight, Gem, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { ProductCard } from "@/components/ProductCard";
import { testimonials } from "@/data/content";
import { products } from "@/data/products";
import { business } from "@/config/business";

export function Home() {
  const [quote, setQuote] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section className="relative min-h-[78svh] overflow-hidden bg-[#eee9e1]">
        <img
          src="https://images.unsplash.com/photo-1615974570340-b01904376f91?auto=format&fit=crop&w=1800&q=90"
          alt="Fine gold rings from Lucas White Jewelry"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-[1400px] items-center px-6 py-24 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <p className="mb-5 text-[11px] uppercase tracking-[.28em]">The new heirlooms</p>
            <h1 className="font-display text-6xl leading-[.88] sm:text-7xl lg:text-[100px]">
              Crafted for a<br />
              <em className="font-light">lifetime.</em>
            </h1>
            <p className="mt-7 max-w-md text-sm leading-6 text-white/85">
              Exceptional jewellery and precious metals, thoughtfully sourced and finished by master
              hands.
            </p>
            <Link
              to="/shop"
              className="mt-9 inline-flex items-center gap-3 bg-white px-7 py-4 text-[11px] uppercase tracking-[.18em] text-black"
            >
              Explore the collection <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
      <TrustBar />
      <section className="section">
        <Heading eyebrow="Curated for you" title="Enduring essentials" link="/shop" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-7">
          {products
            .filter((p) => p.flag === "bestseller")
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="grid bg-warm lg:grid-cols-2">
        <div className="min-h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?auto=format&fit=crop&w=1400&q=90"
            alt="Gold ring crafted with precision"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center px-8 py-20 lg:px-20">
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
            <Link to="/about" className="text-link mt-8">
              Our story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <Heading eyebrow="The collection" title="Objects of permanence" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Rings", products[3].images[0]],
            ["Necklaces", products[14].images[0]],
            ["Bracelets", products[23].images[0]],
          ].map(([name, image]) => (
            <Link
              key={name}
              to={`/shop?category=${name}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <img
                src={image}
                alt={`${name} collection`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-7 left-7 font-display text-4xl text-white">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
          <div className="px-7 py-20 lg:px-12 lg:py-28">
            <p className="eyebrow text-gold">Precious metals desk</p>
            <h2 className="font-display text-5xl leading-none sm:text-6xl">Gold, with clarity.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
              Buy and sell raw gold with confidence. Transparent market-linked pricing, secure
              evaluation, and discreet international service.
            </p>
            <div className="mt-10 flex max-w-md items-end justify-between border-b border-white/20 pb-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Indicative gold price / gram
                </span>
                <div className="mt-2 font-display text-4xl">
                  ${business.goldPricePerGram.toFixed(2)}
                </div>
              </div>
              <span className="mb-1 text-xs text-green-400">+0.42% today</span>
            </div>
            <Link
              to="/gold-trading"
              className="mt-9 inline-flex items-center gap-3 border border-white px-6 py-4 text-[11px] uppercase tracking-widest"
            >
              Explore gold trading <ArrowRight size={14} />
            </Link>
          </div>
          <div className="min-h-[500px] bg-[radial-gradient(circle_at_50%_45%,#d8b65c_0,#947226_18%,#15120c_48%,#000_70%)] p-12 grid place-items-center">
            <div className="relative h-64 w-44 rotate-6 rounded-xl border border-yellow-200/50 bg-gradient-to-br from-[#f5dc8b] via-[#ae8127] to-[#f2d675] shadow-[0_40px_80px_#000]">
              <div className="absolute inset-5 rounded border border-black/30 text-center text-black/70">
                <div className="mt-10 text-xs tracking-widest">LUCAS WHITE</div>
                <div className="my-5 text-5xl">LW</div>
                <div className="text-xs tracking-widest">
                  FINE GOLD
                  <br />
                  999.9
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section text-center">
        <p className="eyebrow">Client stories</p>
        <div className="mx-auto max-w-4xl">
          <div className="text-gold">★★★★★</div>
          <blockquote className="mt-7 font-display text-3xl leading-snug sm:text-5xl">
            “{testimonials[quote][4]}”
          </blockquote>
          <p className="mt-7 text-xs uppercase tracking-widest">
            {testimonials[quote][0]} · {testimonials[quote][1]}, {testimonials[quote][2]}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuote(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === quote ? "w-8 bg-black" : "w-1.5 bg-black/20"}`}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-warm px-6 py-16">
        <div className="mx-auto grid max-w-[1400px] gap-7 md:grid-cols-3">
          {business.locations.map((l) => (
            <div key={l.city} className="border-l border-gold pl-5">
              <span className="text-[10px] uppercase tracking-widest text-black/50">{l.type}</span>
              <h3 className="mt-2 font-display text-3xl">{l.city}</h3>
              <p className="text-sm">{l.country}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section text-center">
        <p className="eyebrow">Private notes</p>
        <h2 className="title">Join our world</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-black/60">
          New collections, private appointments, and considered stories—sent sparingly.
        </p>
        {subscribed ? (
          <p className="mt-8 font-display text-2xl text-gold">Thank you. You’re on the list.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
            className="mx-auto mt-8 flex max-w-lg border-b border-black"
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent py-4 outline-none"
            />
            <button className="text-xs uppercase tracking-widest">Subscribe</button>
          </form>
        )}
      </section>
    </>
  );
}

function TrustBar() {
  return (
    <div className="border-b border-black/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
        {[
          [Truck, "Insured shipping"],
          [ShieldCheck, "30-day returns"],
          [Gem, "Authenticity guaranteed"],
          [Sparkles, "Lifetime polishing"],
        ].map(([Icon, text]) => {
          const I = Icon as typeof Truck;
          return (
            <div
              key={text as string}
              className="flex items-center justify-center gap-3 border-r border-black/10 px-3 py-5 text-[10px] uppercase tracking-[.14em] last:border-r-0"
            >
              <I size={17} strokeWidth={1.3} />
              {text as string}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Heading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-link hidden sm:flex">
          Shop all <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
