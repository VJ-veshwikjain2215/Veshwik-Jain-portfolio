import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A brief, quiet mark-and-line loader — a monogram settling into
 * place with a thin rule drawing underneath it. No boot sequence,
 * no simulated console output.
 */
export default function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exit = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(exit);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark-bg"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl text-dark-text tracking-tight"
          >
            VJ
          </motion.span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 h-px w-10 origin-center bg-dark-accent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
