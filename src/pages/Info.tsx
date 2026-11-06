import { Check, ChevronDown, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { business } from "@/config/business";
import { FounderSection } from "@/components/FounderSection";
import { money, useStore } from "@/store/useStore";

/* ─── Shared Hero ─────────────────────────────────────────── */
function Hero({ title, eyebrow, dark = false }: { title: string; eyebrow: string; dark?: boolean }) {
  return (
    <section
      className={`relative overflow-hidden px-6 py-24 text-center ${
        dark ? "bg-[#0a0a0a] text-white" : "bg-[#faf7f2]"
      }`}
    >
      {dark && (
        <div className="absolute left-1/3 top-1/2 h-72 w-72 -translate-y-1/2 liquid-blob bg-gold/8 pointer-events-none" />
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <p className={`eyebrow ${dark ? "text-gold" : ""}`}>{eyebrow}</p>
        <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-light leading-[.92]">
          {title}
        </h1>
      </motion.div>
    </section>
  );
}

/* ─── Shared form field ───────────────────────────────────── */
function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="text-xs uppercase tracking-widest">
      {label}
      <input
        required
        type={type}
        className="mt-2 w-full border-b border-black/20 py-3 text-sm normal-case outline-none transition focus:border-gold"
      />
    </label>
  );
}

/* ─── Success state ───────────────────────────────────────── */
function Success({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid min-h-64 place-items-center bg-[#faf7f2] p-8 text-center"
    >
      <div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15"
        >
          <Check className="text-gold" size={28} />
        </motion.div>
        <h3 className="mt-5 font-display text-3xl">Thank you.</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{text}</p>
      </div>
    </motion.div>
  );
}

/* ─── Gold Trading ────────────────────────────────────────── */
export function GoldTrading() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="relative overflow-hidden bg-[#0a0a0a] px-6 py-24 text-white">
        <div className="absolute left-[8%] top-[20%] h-80 w-80 liquid-blob bg-gold/8 pointer-events-none" />
        <div className="absolute right-[5%] bottom-[15%] h-56 w-56 liquid-blob bg-yellow-600/5 pointer-events-none" style={{ animationDelay: "-4s" }} />
        <div className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-gold">Precious metals</p>
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[.92]">
              Gold trading,
              <br />
              <em>made clear.</em>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/55">
              Buy and sell raw gold through our international precious metals desk, with transparent
              evaluations and discreet settlement.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="self-end border border-white/15 p-8 backdrop-blur-sm glass-card"
          >
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Indicative spot price
            </span>
            <div className="mt-3 flex items-end justify-between">
              <strong className="font-display text-6xl font-light">
                ${business.goldPricePerGram.toFixed(2)}
              </strong>
              <span className="text-sm text-green-400">▲ +0.42%</span>
            </div>
            <p className="mt-3 text-xs text-white/35">
              USD per gram · Configurable reference · Updated for display
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="grid gap-12 lg:grid-cols-3">
          {[
            ["01", "Request a quote", "Tell us the form, purity, and approximate weight of your gold — or the quantity you wish to acquire."],
            ["02", "Expert evaluation", "Our precious metals team verifies purity and provides a transparent market-linked valuation."],
            ["03", "Secure settlement", "Accept your quote and complete insured delivery, collection, and payment discreetly."],
          ].map((x, i) => (
            <motion.div
              key={x[0]}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-t-2 border-gold pt-5"
            >
              <span className="text-xs text-gold">{x[0]}</span>
              <h2 className="mt-5 font-display text-3xl">{x[1]}</h2>
              <p className="mt-4 text-sm leading-7 text-black/55">{x[2]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#faf7f2]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
          <div className="p-8 lg:p-16">
            <p className="eyebrow">Buy or sell</p>
            <h2 className="title">Request a private quote</h2>
            <p className="mt-5 text-sm leading-7 text-black/55">
              Our desk will review your request and contact you within one business day.
            </p>
          </div>
          <div className="bg-white p-8 lg:p-16">
            {sent ? (
              <Success text="Your request has been received. Our precious metals desk will be in touch shortly." />
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="grid gap-5 sm:grid-cols-2"
              >
                <Field label="Full name" />
                <Field label="Email" type="email" />
                <Field label="Phone" />
                <label className="text-xs uppercase tracking-widest">
                  I want to
                  <select className="mt-2 w-full border-b border-black/20 py-3 text-sm normal-case outline-none transition focus:border-gold">
                    <option>Sell gold</option>
                    <option>Buy gold</option>
                  </select>
                </label>
                <Field label="Approximate weight (grams)" />
                <Field label="Purity / karat" />
                <label className="sm:col-span-2 text-xs uppercase tracking-widest">
                  Details
                  <textarea
                    required
                    className="mt-2 min-h-28 w-full border border-black/15 p-3 text-sm normal-case outline-none transition focus:border-gold"
                    placeholder="Tell us about the material, quantity, and location."
                  />
                </label>
                <button className="sm:col-span-2 bg-black py-4 text-xs uppercase tracking-widest text-white transition hover:bg-gold">
                  Request quote
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── About ───────────────────────────────────────────────── */
export function About() {
  return (
    <>
      <Hero title="Jewellery with integrity." eyebrow="Our story" />
      <FounderSection />
      <section className="section grid gap-12 lg:grid-cols-2">
        <motion.h2
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl leading-none"
        >
          A modern house, built on enduring values.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-5 text-sm leading-7 text-black/60"
        >
          <p>
            Lucas White Jewelry is an international fine jewellery and precious metals house founded
            on a simple conviction: luxury should be lasting, transparent, and deeply personal.
          </p>
          <p>
            From our headquarters in Germany to Singapore and New York, we bring together master
            craftsmanship, responsible material selection, and attentive private service. Alongside
            our jewellery collections, our precious metals desk supports the secure buying and
            selling of raw gold.
          </p>
          <p>
            Every piece is individually inspected, accompanied by a certificate of authenticity, and
            supported by lifetime polishing.
          </p>
        </motion.div>
      </section>
      <section className="bg-[#faf7f2] px-6 py-20">
        <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-3">
          {[
            ["Integrity", "Clear sourcing, honest materials, and transparent service from consultation to delivery."],
            ["Craft", "Exacting hands, balanced proportions, and enduring construction across every price point."],
            ["Permanence", "Pieces designed to gather meaning, passed down and worn through generations."],
          ].map((x, i) => (
            <motion.div
              key={x[0]}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-l-2 border-gold pl-6"
            >
              <h3 className="font-display text-4xl">{x[0]}</h3>
              <p className="mt-3 text-sm leading-6 text-black/55">{x[1]}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ─── Locations ───────────────────────────────────────────── */
export function Locations() {
  return (
    <>
      <Hero title="Three cities. One standard." eyebrow="Our locations" />
      <section className="section">
        <div className="grid gap-6 lg:grid-cols-3">
          {business.locations.map((l, i) => (
            <motion.article
              key={l.city}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="border border-black/10 p-7 transition-shadow hover:shadow-lg"
            >
              <MapPin className="text-gold" strokeWidth={1.2} />
              <p className="eyebrow mt-8">{l.type}</p>
              <h2 className="font-display text-4xl">{l.city}</h2>
              <p className="mt-1 text-sm text-black/60">{l.country}</p>
              <p className="mt-6 text-sm text-black/40">{l.address}</p>
              <Link to="/contact" className="text-link mt-7 hover:text-gold hover:border-gold transition-colors">
                Request an appointment
              </Link>
              <iframe
                title={`Map of ${l.city}`}
                className="mt-7 h-52 w-full border-0 grayscale"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  i === 0
                    ? "13.30%2C52.45%2C13.50%2C52.57"
                    : i === 1
                      ? "103.75%2C1.23%2C103.93%2C1.39"
                      : "-74.05%2C40.68%2C-73.90%2C40.83"
                }&layer=mapnik`}
              />
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

/* ─── Contact ─────────────────────────────────────────────── */
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Hero title="We are here to help." eyebrow="Contact" />
      <section className="section grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl">Client services</h2>
          <p className="mt-4 text-sm leading-7 text-black/55">
            For product guidance, private appointments, aftercare, or precious metals enquiries, our
            team responds within one business day.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <a
              href={`mailto:${business.email}`}
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <Mail size={16} className="text-gold" />
              {business.email}
            </a>
            {business.phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replaceAll(" ", "")}`}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Phone size={16} className="text-gold" />
                {p}
              </a>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {sent ? (
            <Success text="Thank you. A client advisor will reply within one business day." />
          ) : (
            <form
              onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true); }}
              className="grid gap-5 sm:grid-cols-2"
            >
              <Field label="First name" />
              <Field label="Last name" />
              <Field label="Email" type="email" />
              <Field label="Phone" />
              <label className="sm:col-span-2 text-xs uppercase tracking-widest">
                Enquiry
                <select className="mt-2 w-full border-b border-black/20 py-3 text-sm normal-case outline-none transition focus:border-gold">
                  <option>Product enquiry</option>
                  <option>Private appointment</option>
                  <option>Order support</option>
                  <option>Gold trading</option>
                </select>
              </label>
              <label className="sm:col-span-2 text-xs uppercase tracking-widest">
                Message
                <textarea
                  required
                  className="mt-2 min-h-32 w-full border border-black/15 p-3 text-sm normal-case outline-none transition focus:border-gold"
                />
              </label>
              <button className="sm:col-span-2 bg-black py-4 text-xs uppercase tracking-widest text-white transition hover:bg-gold">
                Send message
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────── */
const faqs = [
  ["Are your diamonds certified?", "Significant diamonds are accompanied by an independent grading report. Every Lucas White piece includes our certificate of authenticity."],
  ["Do you offer international shipping?", "Yes. We ship insured to most international destinations. Duties and taxes are shown where available or collected by the destination authority."],
  ["How long does delivery take?", "In-stock pieces generally dispatch within two business days. Standard insured delivery takes 3–5 business days."],
  ["Can I return an item?", "Unworn, unaltered pieces may be returned within 30 days. Engraved, bespoke, and bullion products are final sale."],
  ["How should I care for fine jewellery?", "Store pieces separately, avoid harsh chemicals, and clean with a soft cloth. We include lifetime professional polishing."],
  ["How is gold priced?", "Bullion and raw gold prices follow a configurable market reference plus a product-specific premium covering fabrication, assay, and secure handling."],
  ["Can I request custom engraving?", "Yes, most rings and signet pieces can be engraved. Contact our concierge team to discuss options, timelines, and pricing."],
  ["Do you offer private appointments?", "Private showroom appointments are available at all three locations. Contact us to arrange a time that suits you."],
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <Hero title="Questions, answered." eyebrow="Client care" />
      <section className="section max-w-4xl">
        {faqs.map((x, i) => (
          <motion.div
            key={x[0]}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="border-b border-black/8"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-start justify-between py-6 text-left font-display text-2xl hover:text-gold transition-colors"
            >
              {x[0]}
              <motion.span
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 ml-4 shrink-0"
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden max-w-2xl pb-6 text-sm leading-7 text-black/55"
                >
                  {x[1]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>
    </>
  );
}

/* ─── Policies ────────────────────────────────────────────── */
export function Policy({ type }: { type: "shipping" | "privacy" | "terms" }) {
  const copy = {
    shipping: {
      eyebrow: "Client care",
      title: "Shipping & returns",
      sections: [
        ["Insured delivery", "Every order travels fully insured and requires a signature. Standard shipping is complimentary on orders over $500; otherwise it is $25. Priority service is $45."],
        ["Returns", "Eligible unworn pieces may be returned within 30 days of delivery in original packaging with all documentation."],
        ["Exceptions", "Engraved, resized, bespoke, and bullion products are final sale unless defective."],
        ["Aftercare", "Every jewellery purchase includes a certificate of authenticity and lifetime professional polishing."],
      ],
    },
    privacy: {
      eyebrow: "Legal",
      title: "Privacy policy",
      sections: [
        ["Information we collect", "We collect information you provide during checkout, account creation, enquiries, and newsletter registration."],
        ["How we use it", "We use your information to fulfill orders, provide support, prevent fraud, and — only with consent — share collection updates."],
        ["Your choices", "You may request access, correction, or deletion of eligible personal information by contacting our client services team."],
        ["Security", "We use reasonable technical and organizational measures. Payment details are processed by certified payment providers and are not stored by Lucas White Jewelry."],
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms & conditions",
      sections: [
        ["Orders", "Orders are accepted when payment is authorized and we issue confirmation. We may decline an order where availability or pricing is incorrect."],
        ["Product information", "Natural gemstones and hand-finished metals may show subtle variations. Measurements and colors are represented as accurately as reasonably possible."],
        ["Pricing", "Prices are shown in USD. Applicable tax, shipping, and duties are calculated at checkout or by the destination authority."],
        ["Liability", "Nothing in these terms limits rights that cannot lawfully be excluded. Otherwise, liability is limited to the value of the relevant order."],
      ],
    },
  }[type];

  return (
    <>
      <Hero title={copy.title} eyebrow={copy.eyebrow} />
      <section className="section max-w-4xl">
        <p className="mb-10 text-xs text-black/35">Last updated January 12, 2026</p>
        {copy.sections.map((x, i) => (
          <motion.div
            key={x[0]}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="grid gap-3 border-t border-black/8 py-7 sm:grid-cols-[220px_1fr]"
          >
            <h2 className="font-display text-2xl">{x[0]}</h2>
            <p className="text-sm leading-7 text-black/55">{x[1]}</p>
          </motion.div>
        ))}
      </section>
    </>
  );
}

/* ─── Track ───────────────────────────────────────────────── */
export function Track() {
  const [params] = useSearchParams();
  const [id, setId] = useState(params.get("id") || "");
  const [searched, setSearched] = useState(Boolean(params.get("id")));
  const order = useStore((s) => s.orders.find((o) => o.id.toLowerCase() === id.toLowerCase()));

  return (
    <>
      <Hero title="Follow your order." eyebrow="Order tracking" />
      <section className="section max-w-2xl">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearched(true); }}
          className="flex"
        >
          <input
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Order number, e.g. LW12345678"
            className="w-full border border-r-0 border-black/20 px-4 py-4 outline-none transition focus:border-gold"
          />
          <button className="bg-black px-6 text-xs uppercase tracking-widest text-white transition hover:bg-gold">
            Track
          </button>
        </form>
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {order ? (
                <div className="mt-10 bg-[#faf7f2] p-7">
                  <p className="eyebrow">Order {order.id}</p>
                  <h2 className="font-display text-3xl">{order.status}</h2>
                  <div className="mt-8 flex justify-between">
                    {["Confirmed", "Preparing", "Shipped", "Delivered"].map((s, i) => {
                      const statuses = ["Confirmed", "Preparing", "Shipped", "Delivered"];
                      const done = statuses.indexOf(order.status) >= i;
                      return (
                        <div key={s} className="flex-1 text-center">
                          <div
                            className={`mx-auto h-3 w-3 rounded-full transition-colors ${
                              done ? "bg-gold" : "bg-black/10"
                            }`}
                          />
                          <p className="mt-2 text-[10px] uppercase tracking-wider">{s}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-8 border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  We couldn't find that order. Check the number in your confirmation and try again.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
