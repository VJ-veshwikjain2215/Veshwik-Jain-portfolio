import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      className="relative h-8 w-14 rounded-full border border-hairline bg-card transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        className="absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(26px)" : "translateX(2px)" }}
      >
        {isDark ? <FiMoon size={13} /> : <FiSun size={13} />}
      </span>
    </button>
  );
}
