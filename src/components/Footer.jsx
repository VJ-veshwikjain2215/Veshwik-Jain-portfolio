import { profile } from "../constants/data";

export default function Footer() {
  return (
    <footer className="hairline py-8 pb-10">
      <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-secondary">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Designed &amp; built with React and Tailwind CSS</span>
      </div>
    </footer>
  );
}
