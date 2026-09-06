import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin } from "react-icons/fi";
import { contactInfo, profile } from "../constants/data";
import { fadeUp, slideInLeft, staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import ContactForm from "../components/ContactForm";

const CARDS = [
  { icon: FiMapPin, label: "Location", value: contactInfo.location, href: undefined },
  { icon: FiMail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: FiPhone, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s+/g, "")}` },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 hairline sm:pb-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          path="~/contact"
          title="Let's talk"
          description="Open to backend and full-stack internship opportunities. Reach out and I'll get back to you within a day or two."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            {CARDS.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <div className="flex items-center gap-4 rounded-lg border border-hairline bg-card p-5 transition-colors duration-200 hover:border-text-secondary">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent/10 text-accent">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="label-caps text-text-secondary">{label}</p>
                    <p className="text-sm font-medium text-text">{value}</p>
                  </div>
                </div>
              );
              return (
                <motion.div key={label} variants={fadeUp}>
                  {href ? (
                    <a href={href} className="block">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })}

            <motion.div variants={fadeUp} className="flex gap-3 mt-2">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-text-secondary hover:text-accent hover:border-accent transition-colors"
              >
                <FiGithub size={16} />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-text-secondary hover:text-accent hover:border-accent transition-colors"
              >
                <FiLinkedin size={16} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="rounded-lg border border-hairline bg-card p-6 md:p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
