import { Link } from "react-router";
import logoImg from "@/assets/logo.jpg";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 ${light ? "text-white" : "text-black"}`}
      aria-label="Lucas White Jewelry home"
    >
      <img
        src={logoImg}
        alt="Lucas White Jewelry"
        className="h-10 w-auto object-contain"
      />
      <span className="hidden leading-none sm:block">
        <span className="block font-display text-[17px] tracking-[.12em]">LUCAS WHITE</span>
        <span className="mt-1 block text-[8px] tracking-[.5em]">JEWELRY</span>
      </span>
    </Link>
  );
}
