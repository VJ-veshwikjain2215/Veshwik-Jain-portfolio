import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../animations/variants";

/**
 * Every section opens the same way: a mono-font "path" eyebrow that
 * doubles as the section's real anchor id, then a large display
 * heading. This is the recurring structural device of the design —
 * it reads as a directory the visitor is moving through.
 */
export default function SectionHeading({ path, title, description, align = "left" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center mx-auto" : ""}`}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs md:text-sm text-primary">
        <span aria-hidden="true">$</span>
        <span>cd {path}</span>
      </span>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-text-secondary text-base md:text-lg ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
