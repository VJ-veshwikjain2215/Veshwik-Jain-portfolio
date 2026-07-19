const PALETTE = ["#F87171", "#FBBF24", "#34D399"];

/**
 * Until real screenshots are added, each project card shows a small
 * generated "code window" seeded from the project id, so every card
 * looks distinct without relying on stock imagery or gradients.
 */
export default function ProjectVisual({ seed = "project", featured = false }) {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const lineWidths = [88, 62, 74, 40, 68, 52, 80, 46];
  const rotated = lineWidths.map((_, i) => lineWidths[(i + hash) % lineWidths.length]);

  return (
    <div
      className={`relative w-full ${featured ? "aspect-[16/10]" : "aspect-[16/11]"} rounded-lg border border-hairline bg-bg overflow-hidden`}
    >
      <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2 bg-card">
        {PALETTE.map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c, opacity: 0.85 }} />
        ))}
        <span className="ml-2 font-mono text-[10px] text-text-secondary">{seed}.java</span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {rotated.map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-text-secondary/20"
            style={{ width: `${w}%`, marginLeft: i % 3 === 0 ? 0 : 12 }}
          />
        ))}
      </div>
    </div>
  );
}
