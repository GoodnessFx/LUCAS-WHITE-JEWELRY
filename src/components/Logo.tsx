import { Link } from "react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 ${light ? "text-white" : "text-black"}`}
      aria-label="Lucas White Jewelry home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center border border-current font-display text-xl tracking-[-.08em]">
        LW
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rotate-45 bg-gold" />
      </span>
      <span className="hidden leading-none sm:block">
        <span className="block font-display text-[17px] tracking-[.12em]">LUCAS WHITE</span>
        <span className="mt-1 block text-[8px] tracking-[.5em]">JEWELRY</span>
      </span>
    </Link>
  );
}
