import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

/*
  FOUNDER IMAGES
  --------------
  This section is wired to use the two founder portrait images attached to this project.

  To use the real founder images:
  1. Save the first portrait (suit, no tie) to:
     C:\Users\Admin\Desktop\lucas-white-jewelry-shop\public\images\founder-portrait.jpg
  2. Save the second portrait (shirt, tie, glasses) to:
     C:\Users\Admin\Desktop\lucas-white-jewelry-shop\public\images\founder-tie.jpg
  3. Replace the `src` URLs below (currently Unsplash placeholders) with:
     src="/images/founder-portrait.jpg"
     src="/images/founder-tie.jpg"
*/

export function FounderSection() {
  return (
    <section className="section bg-warm">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1fr] items-center">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">The founder</p>
          <h2 className="title">Lucas White</h2>
          <p className="text-sm leading-7 text-black/65">
            Lucas White founded the house on a simple conviction: that luxury should be lasting,
            transparent, and deeply personal. Trained in the workshops of Germany and refined in the
            ateliers of Singapore and New York, he brings together master craftsmanship, responsible
            material selection, and attentive private service.
          </p>
          <p className="text-sm leading-7 text-black/65">
            Every piece bears his signature standard—individually inspected, accompanied by a
            certificate of authenticity, and supported by lifetime polishing. Jewellery made to be
            worn, not locked away.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-black pb-1"
          >
            Our story <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid gap-6 lg:gap-10">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85"
            alt="Lucas White, founder"
            className="aspect-[4/5] w-full object-cover rounded-sm shadow-xl"
          />
          <img
            src="https://images.unsplash.com/photo-1518573167487-1d87c4f0d3f3?auto=format&fit=crop&w=900&q=85"
            alt="Lucas White at the bench"
            className="aspect-[4/5] w-full object-cover rounded-sm shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
