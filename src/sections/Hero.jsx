import profileImg from "../assets/profile.jpg";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiChevronDown, FiUser } from "react-icons/fi";
import { profile } from "../constants/data";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { staggerContainer, fadeUp } from "../animations/variants";
import Button from "../components/Button";

const SOCIALS = [
  { href: profile.social.github, icon: FiGithub, label: "GitHub" },
  { href: profile.social.linkedin, icon: FiLinkedin, label: "LinkedIn" },
  { href: profile.social.email, icon: FiMail, label: "Email" },
];

export default function Hero() {
  const typed = useTypingEffect(profile.roles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center pt-24 pb-16 md:pt-16"
    >
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-[1fr_320px] lg:items-center"
      >
        <div>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 font-mono text-sm text-primary"
          >
            <span aria-hidden="true">$</span> whoami
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text leading-[1.05]"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-5 h-9 font-mono text-lg md:text-2xl text-text-secondary"
          >
            <span className="text-accent">&gt;</span> {typed}
            <span className="caret-blink ml-0.5 text-accent">▍</span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base md:text-lg text-text-secondary leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              as="a"
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="primary"
              data-cursor-hover
            >
              View résumé
            </Button>
            <Button
              as="a"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="secondary"
              data-cursor-hover
            >
              View projects
            </Button>
            <a
              href={profile.resumeUrl}
              download
              data-cursor-hover
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors underline underline-offset-4 decoration-hairline hover:decoration-primary"
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
                data-cursor-hover
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-text-secondary hover:text-primary hover:border-primary transition-colors duration-200"
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative mx-auto lg:mx-0">
          <div className="relative aspect-[4/5] w-56 md:w-72 rounded-xl border border-hairline bg-card card-shadow-lg overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-400/80" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-[10px] text-text-secondary">veshwikjain.png</span>
            </div>

            <div className="h-[calc(100%-33px)] w-full overflow-hidden bg-bg">
              <img
                src={profileImg}
                alt="Veshwik Jain"
                className="h-full w-full object-cover"
             />
            </div>

          </div>
          <span className="absolute -bottom-3 -left-3 rounded-md border border-hairline bg-card px-3 py-1.5 font-mono text-xs text-primary card-shadow">
            {profile.location}
          </span>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-secondary hover:text-primary transition-colors"
      >
        <span className="font-mono text-[11px]">scroll</span>
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
