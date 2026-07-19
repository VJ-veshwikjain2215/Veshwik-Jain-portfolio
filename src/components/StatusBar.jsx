const SECTION_LABELS = {
  home: "~/home",
  about: "~/about",
  skills: "~/skills",
  projects: "~/projects",
  achievements: "~/achievements",
  resume: "~/resume",
  contact: "~/contact",
};

/**
 * The one deliberately "loud" idea in this design: a persistent
 * status bar, styled after a code editor's, that reports where the
 * visitor is on the page the way an IDE reports where you are in a
 * file. It doubles as functional wayfinding (current section) and
 * as the site's visual signature.
 */
export default function StatusBar({ activeSection, theme }) {
  const label = SECTION_LABELS[activeSection] ?? "~/home";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[65] hidden sm:flex items-center justify-between border-t border-hairline bg-card/95 backdrop-blur px-4 h-8 font-mono text-[11px] text-text-secondary"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          available for internships
        </span>
        <span className="hidden md:inline">branch: main</span>
      </div>
      <div className="flex items-center gap-4">
        <span>{label}</span>
        <span className="hidden md:inline">{theme === "dark" ? "theme: dark" : "theme: light"}</span>
        <span className="hidden lg:inline">UTF-8 · LF · Java</span>
      </div>
    </div>
  );
}
