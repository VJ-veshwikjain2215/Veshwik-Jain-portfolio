import { motion } from "framer-motion";
import { FiAward, FiCode, FiUsers, FiGitPullRequest, FiTarget } from "react-icons/fi";
import { achievements } from "../constants/data";
import { staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import TimelineItem from "../components/TimelineItem";

const TYPE_ICONS = {
  Hackathon: FiTarget,
  Certification: FiAward,
  Competition: FiCode,
  Leadership: FiUsers,
  "Open Source": FiGitPullRequest,
};

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 md:py-32 hairline">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeading
          path="~/achievements"
          title="Milestones along the way"
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {achievements.map((item, i) => {
            const Icon = TYPE_ICONS[item.type] ?? FiAward;
            return (
              <TimelineItem
                key={item.title}
                marker={`${item.year} · ${item.type}`}
                title={item.title}
                meta={item.org}
                detail={item.detail}
                icon={<Icon size={14} />}
                isLast={i === achievements.length - 1}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
