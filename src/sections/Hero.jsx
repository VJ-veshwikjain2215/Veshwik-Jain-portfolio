import profileImg from "../assets/profile.jpg";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from "react-icons/fi";
import { profile } from "../constants/data";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { staggerContainer, fadeUp } from "../animations/variants";
import Button from "../components/Button";

const SOCIALS = [
  { href: profile.social.github, icon: FiGithub, label: "GitHub" },
  { href: profile.social.linkedin, icon: FiLinkedin, label: "LinkedIn" },
  { href: profile.social.email, icon: FiMail, label: "Email" },
];

const [firstName, ...restName] = profile.name.split(" ");

export default function Hero() {
  const typed = useTypingEffect(profile.roles);

  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Top meta bar — availability + quick facts, echoing the rest of the site's real details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-12 md:mb-16 border-b border-hairline"
        >
          <span className="inline-flex items-center gap-2 label-caps text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Open to backend &amp; full-stack internships
          </span>
          <span className="text-data text-sm text-text-secondary">{profile.location}</span>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start"
        >
          <div className="lg:col-span-7">
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl sm:text-6xl md:text-7xl text-text tracking-tight leading-[1.08]"
            >
              Hi, I&rsquo;m <span className="italic">{firstName}</span> {restName.join(" ")}.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-display text-xl md:text-2xl text-accent italic"
            >
              {typed}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base md:text-lg text-text-secondary leading-relaxed"
            >
              {profile.tagline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="primary"
              >
                View projects
              </Button>
              <Button
                as="a"
                href="#resume"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="secondary"
              >
                View résumé
              </Button>
              <a
                href={profile.resumeUrl}
                download
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors underline underline-offset-4 decoration-hairline hover:decoration-accent"
              >
                Download résumé
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-5">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
                >
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div className="w-full max-w-sm ml-auto bg-card p-2 rounded-lg border border-hairline">
              <div className="aspect-[4/5] w-full overflow-hidden rounded bg-bg">
                <img
                  src={profileImg}
                  alt="Veshwik Jain"
                  className="h-full w-full object-cover grayscale-[10%]"
                />
              </div>
              <div className="mt-2 px-1.5 py-1.5 flex items-center justify-between gap-3">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-text">{profile.name}</span> — {profile.roles[1] ?? profile.roles[0]}
                </p>
                <span className="text-data text-xs text-accent shrink-0">{profile.location}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll to about section"
        className="hidden md:flex mx-auto mt-16 flex-col items-center gap-1 text-text-secondary hover:text-accent transition-colors"
      >
        <span className="label-caps">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <FiChevronDown size={16} />
        </motion.span>
      </motion.button>
    </section>
  );
}
