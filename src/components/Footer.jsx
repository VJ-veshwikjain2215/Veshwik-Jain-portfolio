import { profile } from "../constants/data";

export default function Footer() {
  return (
    <footer className="hairline py-8 pb-14 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-text-secondary">
        <span>© {new Date().getFullYear()} {profile.name}. Built from scratch, no template.</span>
        <span>designed &amp; developed with React + Tailwind</span>
      </div>
    </footer>
  );
}
