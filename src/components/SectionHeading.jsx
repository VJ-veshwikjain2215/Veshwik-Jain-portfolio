import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../animations/variants";

/**
 * Every section opens the same way: a small tracked-out eyebrow
 * label, then a large serif heading, then an optional line of
 * supporting copy. The recurring rhythm is what ties the sections
 * together — not a repeated motif borrowed from a code editor.
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
      <span className="label-caps text-accent">
        {path ? path.replace(/^~\//, "").replace(/-/g, " ") : title}
      </span>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-text">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-text-secondary text-base md:text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
