import { Link } from "react-router";
export function NotFound() {
  return (
    <div className="section min-h-[60vh] text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-7xl">This page has moved.</h1>
      <p className="mt-5 text-sm text-black/50">Let us guide you back to the collection.</p>
      <Link
        to="/"
        className="mt-8 inline-block bg-black px-8 py-4 text-xs uppercase tracking-widest text-white"
      >
        Return home
      </Link>
    </div>
  );
}
