import { motion } from "framer-motion";
import { skillCategories } from "../constants/data";
import { fadeUp, staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 hairline">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          path="~/skills"
          title="What I work with"
          description="Tools and technologies I reach for regularly, grouped the way I'd organize them in a project's dependency list."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.label}
              variants={fadeUp}
              className="rounded-lg border border-hairline bg-card p-6 transition-colors duration-300 hover:border-text-secondary"
            >
              <span className="label-caps text-accent">{category.label}</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-hairline px-3 py-1.5 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
