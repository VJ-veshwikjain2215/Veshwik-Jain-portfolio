import { motion } from "framer-motion";
import { slideInLeft } from "../animations/variants";

export default function TimelineItem({ marker, title, meta, detail, isLast = false, icon }) {
  return (
    <motion.div variants={slideInLeft} className="relative flex gap-5 md:gap-6 pb-10 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[15px] top-8 bottom-0 w-px bg-hairline"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-primary">
        {icon ?? <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </div>
      <div className="pt-0.5">
        <span className="font-mono text-xs text-primary">{marker}</span>
        <h4 className="mt-1 font-display text-lg font-semibold text-text">{title}</h4>
        {meta && <p className="text-sm text-text-secondary">{meta}</p>}
        {detail && <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xl">{detail}</p>}
      </div>
    </motion.div>
  );
}
