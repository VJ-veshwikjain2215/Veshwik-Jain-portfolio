import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
  rootMargin: "-35% 0px -55% 0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

/**
 * Observes a list of section ids and returns the one currently most
 * visible in the viewport. Powers active-link highlighting in the
 * navbar and the current-section readout in the status bar.
 */
export function useActiveSection(sectionIds, options) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    }, options ?? DEFAULT_OPTIONS);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return activeId;
}
