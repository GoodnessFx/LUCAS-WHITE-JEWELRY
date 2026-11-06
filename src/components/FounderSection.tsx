import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

/*
  FOUNDER IMAGES
  --------------
  To use the real founder images:
  1. Save portrait 1 (company logo / CEO) to: public/images/founder-portrait.jpg
  2. Save portrait 2 (CEO with tie) to:      public/images/founder-tie.jpg
  Then replace the `src` values below with:
     src="/images/founder-portrait.jpg"
     src="/images/founder-tie.jpg"
*/

export function FounderSection() {
  return (
    <section className="overflow-hidden bg-[#faf7f2] py-20 px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <p className="eyebrow">The founder</p>
          <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[.92] font-light">
            Lucas White
          </h2>
          <p className="text-sm leading-7 text-black/60">
            Lucas White founded the house on a simple conviction: that luxury should be lasting,
            transparent, and deeply personal. Trained in the workshops of Germany and refined in the
            ateliers of Singapore and New York, he brings together master craftsmanship, responsible
            material selection, and attentive private service.
          </p>
          <p className="text-sm leading-7 text-black/60">
            Every piece bears his signature standard — individually inspected, accompanied by a
            certificate of authenticity, and supported by lifetime polishing. Jewellery made to be
            worn, not locked away.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 self-start border-b border-black pb-1 text-[11px] uppercase tracking-widest group hover:text-gold hover:border-gold transition-colors"
          >
            Our story <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85"
              alt="Lucas White, founder"
              className="aspect-[3/4] w-full object-cover shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://images.unsplash.com/photo-1518573167487-1d87c4f0d3f3?auto=format&fit=crop&w=900&q=85"
              alt="Lucas White at the bench"
              className="aspect-[3/4] w-full object-cover shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
