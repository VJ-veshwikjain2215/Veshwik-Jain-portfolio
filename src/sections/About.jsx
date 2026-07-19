import { motion } from "framer-motion";
import { about } from "../constants/data";
import { fadeUp, staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import TimelineItem from "../components/TimelineItem";
import Chip from "../components/Chip";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading path="~/about" title="About me" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {about.summary.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-text-secondary leading-relaxed mb-5 text-base md:text-lg"
              >
                {para}
              </motion.p>
            ))}

            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="font-mono text-xs text-primary mb-3">// what I enjoy building</h3>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((interest) => (
                  <Chip key={interest}>{interest}</Chip>
                ))}
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-8 text-text-secondary leading-relaxed border-l-2 border-primary pl-4">
              {about.goals}
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {about.timeline.map((item, i) => (
              <TimelineItem
                key={item.title}
                marker={item.year}
                title={item.title}
                meta={item.place}
                detail={item.detail}
                isLast={i === about.timeline.length - 1}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
