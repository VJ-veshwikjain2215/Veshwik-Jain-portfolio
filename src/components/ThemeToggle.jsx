import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      className="relative h-7 rounded-full border border-hairline bg-bg transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ width: "3.25rem" }}
    >
      <span
        className="absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-bg transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(1.75rem)" : "translateX(0.125rem)" }}
      >
        {isDark ? <FiMoon size={11} /> : <FiSun size={11} />}
      </span>
    </button>
  );
}
