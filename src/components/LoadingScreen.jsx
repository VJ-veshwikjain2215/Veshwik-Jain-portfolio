import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "booting portfolio.exe",
  "loading profile: Aarav Sharma",
  "mounting sections/",
  "ready.",
];

export default function LoadingScreen({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (lineIndex < BOOT_LINES.length - 1) {
      const t = setTimeout(() => setLineIndex((i) => i + 1), 260);
      return () => clearTimeout(t);
    }
    const exit = setTimeout(() => setVisible(false), 420);
    return () => clearTimeout(exit);
  }, [lineIndex]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-bg"
        >
          <div className="font-mono text-sm text-dark-text-secondary">
            {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
              <div key={line} className="flex items-center gap-2">
                <span className="text-dark-accent">$</span>
                <span className={i === lineIndex && i === BOOT_LINES.length - 1 ? "text-dark-text" : ""}>
                  {line}
                </span>
              </div>
            ))}
            <span className="caret-blink text-dark-accent">▍</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
