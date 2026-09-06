/**
 * Until a real screenshot is added, each project shows a quiet
 * abstract placeholder — the project's initial in a warm serif,
 * seeded to a subtle geometric backdrop. No fake code, no window
 * chrome, nothing borrowed from an editor UI.
 */
export default function ProjectVisual({ seed = "project", featured = false }) {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const initial = seed.trim().charAt(0).toUpperCase();
  const angle = (hash % 6) * 12 - 12;

  return (
    <div
      className={`relative w-full ${featured ? "aspect-[16/10]" : "aspect-[16/11]"} rounded border border-hairline bg-bg overflow-hidden flex items-center justify-center`}
    >
      <span
        aria-hidden="true"
        className="absolute rounded-full border border-hairline"
        style={{
          width: "62%",
          height: "62%",
          transform: `rotate(${angle}deg)`,
        }}
      />
      <span className="relative font-display text-6xl md:text-7xl text-text-secondary/40 select-none">
        {initial}
      </span>
    </div>
  );
}
