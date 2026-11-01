import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  profile,
  about,
  projects,
  achievements,
  academicProgress,
} from "./constants/data";
import ContactForm from "./components/ContactForm";
import HeroParticles from "./components/HeroParticles";
import ScrollStatement from "./components/ScrollStatement";
import Reveal from "./components/Reveal";
import SiteCursor from "./components/SiteCursor";
import ProjectGrid from "./components/ProjectGrid";
import Toolkit from "./components/Toolkit";
import Capabilities from "./components/Capabilities";
const num = (i) => String(i + 1).padStart(2, "0");
function Nav() {
  const location = useLocation();
  const currentSection =
    location.pathname === "/about"
      ? "about"
      : location.pathname === "/"
        ? location.hash.slice(1) || "home"
        : "";
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  const menu = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menu.current?.focus();
    };
    const onPointerDown = (event) => {
      if (!header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);
  return (
    <header className="nav" ref={header}>
      <Link
        className="brand"
        to="/"
        aria-label="Veshwik Jain home"
        onClick={() => setOpen(false)}
      >
        <span className="brand-orb">
          <i />
        </span>
        Veshwik<span className="brand-pip">·</span>
      </Link>
      <button
        className="menu-toggle"
        ref={menu}
        aria-controls="main-navigation"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? "Close ×" : "Menu ☰"}
      </button>
      <nav
        className={open ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
        id="main-navigation"
      >
        {[
          ["Home", "home"],
          ["About", "about"],
          ["Toolkit", "skills"],
          ["Capabilities", "capabilities"],
          ["Projects", "projects"],
          ["Journey", "academics"],
        ].map(([label, id]) => (
          <a
            key={id}
            className={id === currentSection ? "home-link" : ""}
            href={`/#${id}`}
            aria-current={id === currentSection ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "home-link" : ""}
          aria-current={location.pathname === "/contact" ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          Contact
        </Link>
      </nav>
      <a
        className="nav-resume"
        href={profile.resumeUrl}
        target="_blank"
        rel="noreferrer"
      >
        Résumé ↗
      </a>
      <Link className="nav-status" to="/contact" onClick={() => setOpen(false)}>
        Let's talk <span>↗</span>
      </Link>
    </header>
  );
}
function Heading({ label, children }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{children}</h2>
    </div>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Link className="brand" to="/">
            <span className="brand-orb">
              <i />
            </span>
            Veshwik<span className="brand-pip">·</span>
          </Link>
          <p>
            Backend & full-stack development.
            <br />
            Useful applications, built with Java, Spring Boot, and a curious
            mind.
          </p>
        </div>
        <div>
          <h4>EXPLORE</h4>
          <a href="/#home">Home</a>
          <a href="/#about">About</a>
          <a href="/#capabilities">Capabilities</a>
          <a href="/#projects">Projects</a>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>RESOURCES</h4>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
          <a href="/#academics">Academic record</a>
          <a href="/#faq">Questions</a>
          <a href={profile.social.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
        <div>
          <h4>CONTACT</h4>
          <a href={profile.social.email}>{profile.email}</a>
          <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>
            {profile.phone}
          </a>
          <p>
            Indore, Madhya Pradesh
            <br />
            India
          </p>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
      <div className="footer-tagline">
        <p className="eyebrow">JAVA · SPRING BOOT · REACT · INDORE</p>
        <p>
          Your next
          <br />
          <span>backend developer.</span>
        </p>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Veshwik Jain. All rights reserved.
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
function Home() {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const frame = requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView(),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, []);
  const faqs = [
    [
      "What kind of role are you looking for?",
      "I am open to backend and full-stack internships where I can work with Java, Spring Boot, APIs, and real application problems.",
    ],
    [
      "What do you enjoy building?",
      "Dependable backend systems and useful web applications. My projects explore encryption, voice authenticity, personal finance, and civic reporting.",
    ],
    [
      "Where can I see the code?",
      "Each project links to its GitHub repository. You can also visit my GitHub profile to explore the source, documentation, and recent work.",
    ],
    [
      "Are the project demos available?",
      "Available demos are linked from the project cards. Some projects need backend services or sign-in; the project pages explain their context and technology.",
    ],
    [
      "How can we get in touch?",
      "Use the contact page, email me directly, or connect on LinkedIn. My résumé is also available from the navigation.",
    ],
  ];
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-dust" aria-hidden="true">
          {Array.from({ length: 35 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 61) % 100}%`,
                background: ["#3db663", "#b07040", "#353639", "#e5ba97"][i % 4],
                animationDelay: `-${i * 0.7}s`,
                width: 3 + (i % 5),
                height: 3 + (i % 5),
              }}
            />
          ))}
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <i /> JAVA · SPRING BOOT · FULL-STACK DEVELOPMENT · INDIA
          </p>
          <h1>
            Your next
            <br />
            <span className="hero-role">backend developer.</span>
            <br />
            <span>Veshwik Jain.</span>
          </h1>
          <p className="hero-description">
            I turn ideas, complex requirements and everyday problems into
            dependable APIs, useful web applications and thoughtful digital
            experiences. Built around the people using them, with Java and
            Spring Boot at the core.
          </p>
          <div className="actions">
            <Link className="button dark" to="/contact">
              Let's talk <span>↗</span>
            </Link>
            <a className="button soft" href="#projects">
              See my work <span>↗</span>
            </a>
          </div>
          <div className="hero-tags">
            <span>Open to internships</span>
            <span>Based in Indore, India</span>
          </div>
        </div>
        <div className="hero-visual">
          <HeroParticles />
        </div>
        <a href="#about" className="hero-hint">
          <b />
          SCROLL
        </a>
      </section>
      <section className="section statement-section" id="about">
        <p className="eyebrow">WHO I AM</p>
        <ScrollStatement>
          I turn curious ideas into reliable backend systems and useful web
          applications. Built with Java, clear thinking and a focus on the
          people using them.
        </ScrollStatement>
        <Link className="button soft" to="/about">
          More about Veshwik <span>↗</span>
        </Link>
      </section>
      <Toolkit />
      <Capabilities />
      <section className="section" id="projects">
        <div className="sec-head">
          <Heading label="PROJECT REFERENCE">
            Ideas already
            <br />
            at work.
          </Heading>
          <p className="lead">
            Inventory counts you can review. An encryption workbench. A voice
            authenticity experiment. Personal finance and civic reporting.
          </p>
        </div>
        <ProjectGrid projects={projects} />
        <a
          className="button soft work-more"
          href={profile.social.github}
          target="_blank"
          rel="noreferrer"
        >
          All projects on GitHub <span>↗</span>
        </a>
      </section>
      <section className="dark-section">
        <div className="section">
          <Reveal className="work-introduction">
            <p className="eyebrow">HOW I WORK</p>
            <ScrollStatement dark>
              Built with curiosity, then improved through learning, testing and
              attention to the details that matter.
            </ScrollStatement>
            <p className="dark-intro">
              I enjoy software that is predictable, understandable, and useful.
              These are the habits I bring to a project.
            </p>
          </Reveal>
          <div className="rings">
            <motion.div
              className="rings-line"
              aria-hidden="true"
              initial={reducedMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left center" }}
            />
            {[
              [
                "01",
                "Understand before building",
                "Start with the problem, the person using the system, and what a useful first version needs to do.",
              ],
              [
                "02",
                "Make thoughtful choices",
                "Keep the structure clear. Choose practical tools. Make the next step easier for whoever works on the code.",
              ],
              [
                "03",
                "Keep learning after launch",
                "Check the real flow, understand what breaks, document what changed, and improve the next version.",
              ],
            ].map(([n, title, copy], index) => (
              <Reveal className="ring-item" key={n} delay={index * 0.08}>
                <div className="ring-num">
                  <b>{n}</b>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section journey-section" id="academics">
        <Reveal className="sec-head">
          <Heading label="THE JOURNEY SO FAR">
            Always learning.
            <br />
            Always building.
          </Heading>
          <p className="lead">
            Engineering coursework, side projects, hackathons, and the small
            discoveries that connect them.
          </p>
        </Reveal>
        <div className="journey-rows">
          {about.timeline.map((t, index) => (
            <Reveal
              className="journey-item"
              key={t.year}
              delay={(index % 3) * 0.06}
            >
              <span className="journey-icon">↗</span>
              <h3>{t.title}</h3>
              <span className="eyebrow">{t.year}</span>
              <p>{t.detail}</p>
            </Reveal>
          ))}
          {achievements.slice(0, 3).map((a, index) => (
            <Reveal
              className="journey-item"
              key={a.title}
              delay={(index % 3) * 0.06}
            >
              <span className="journey-icon">✓</span>
              <h3>{a.title}</h3>
              <span className="eyebrow">
                {a.year} · {a.type}
              </span>
              <p>{a.detail}</p>
            </Reveal>
          ))}
        </div>
        <details className="record-details">
          <summary>
            Academic record, subjects & marksheets <span>+</span>
          </summary>
          <div className="semester-list">
            {academicProgress.semesters.map((s) => (
              <div className="semester" key={s.sem}>
                <b>Semester {s.sem}</b>
                <span>{s.status}</span>
                <strong>
                  {s.sgpa ?? "—"} <small>SGPA</small>
                </strong>
                <span>CGPA {s.cgpa ?? "—"}</span>
                {s.marksheetUrl && (
                  <a href={s.marksheetUrl} target="_blank" rel="noreferrer">
                    Marksheet ↗
                  </a>
                )}
                <p>{s.subjects?.join(" · ")}</p>
              </div>
            ))}
          </div>
        </details>
      </section>
      <div className="values-marquee" aria-hidden="true">
        <div>
          Curious by nature · Thoughtful by design · Always building · Curious
          by nature · Thoughtful by design · Always building ·
        </div>
      </div>
      <section className="section location-section">
        <div>
          <Heading label="BASED IN INDORE">
            Building from Indore.
            <br />
            Open to what’s next.
          </Heading>
          <p className="lead">
            I'm an engineering student looking for a backend or full-stack
            internship—somewhere I can contribute, learn from a team, and work
            on useful software.
          </p>
          <a
            className="button soft"
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Explore my résumé <span>↗</span>
          </a>
        </div>
        <div
          className="location-map"
          aria-label="Indore connected to my areas of work"
        >
          <svg viewBox="0 0 600 400" aria-hidden="true">
            <defs>
              <pattern
                id="mapdots"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#799387" opacity=".45" />
              </pattern>
            </defs>
            <path
              d="M115 80l80-30 65 15 30-30 70 35 25 70 75 15-25 65-65 10-20 65-45 70-35-65-30-35-65-10-30-65-50-20z"
              fill="url(#mapdots)"
            />
            <path
              d="M275 185Q155 60 100 100M275 185Q420 70 485 100M275 185Q410 300 490 320"
              fill="none"
              stroke="#3db663"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <circle cx="275" cy="185" r="30" fill="#3db663" opacity=".12" />
            <circle cx="275" cy="185" r="8" fill="#3db663" />
            <circle cx="100" cy="100" r="5" fill="#b07040" />
            <circle cx="485" cy="100" r="5" fill="#3db663" />
            <circle cx="490" cy="320" r="5" fill="#3db663" />
          </svg>
          <span className="map-home">● Indore, India</span>
          <span className="map-label label-one">Backend systems</span>
          <span className="map-label label-two">Useful applications</span>
          <span className="map-label label-three">Continuous learning</span>
        </div>
      </section>
      <section className="section faq-section" id="faq">
        <div>
          <Heading label="A FEW THINGS YOU MIGHT ASK">
            Straight answers.
            <br />
            Before we talk.
          </Heading>
          <p className="lead">
            Want to know a little more? Start here, or send me a message.
          </p>
          <Link className="button soft" to="/contact">
            Ask me anything <span>↗</span>
          </Link>
        </div>
        <div className="faq">
          {faqs.map(([question, answer], i) => (
            <details key={question} name="portfolio-faq" open={i === 0}>
              <summary>
                {question}
                <span className="plus-minus" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="section cta-wrap">
        <div className="cta">
          <div className="cta-orb" />
          <div className="cta-row">
            <div>
              <p className="eyebrow">LET'S TALK</p>
              <h2>
                Have something
                <br />
                good in mind?
              </h2>
              <div className="actions">
                <Link className="button green" to="/contact">
                  Let's talk <span>↗</span>
                </Link>
                <a className="button outline" href={profile.social.email}>
                  Email me <span>↗</span>
                </a>
              </div>
            </div>
            <div className="contact-lines">
              <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>
                {profile.phone}
              </a>
              <a href={profile.social.email}>{profile.email}</a>
              <span>Indore, Madhya Pradesh, India</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <section className="section contact-page about-page">
      <p className="eyebrow">A LITTLE MORE ABOUT ME</p>
      <div className="contact-intro">
        <h1>
          Curious about
          <br />
          what’s underneath.
        </h1>
        <p className="body-copy">{profile.tagline}</p>
      </div>
      <div className="detail-grid">
        <h2>Hello, I’m Veshwik.</h2>
        <div>
          {about.summary.map((text) => (
            <p className="body-copy" key={text}>
              {text}
            </p>
          ))}
          <h3>What I’m working towards</h3>
          <p className="body-copy">{about.goals}</p>
          <div className="tags">
            {about.interests.map((text) => (
              <span className="tag" key={text}>
                {text}
              </span>
            ))}
          </div>
          <div className="actions">
            <a
              className="button"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Explore my résumé <span>↗</span>
            </a>
            <Link className="button soft" to="/contact">
              Let’s talk <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="section-head">
        <h2>Learning along the way.</h2>
      </div>
      <div className="journey-rows">
        {achievements.map((item) => (
          <div key={item.title}>
            <span className="journey-icon">✓</span>
            <h3>{item.title}</h3>
            <p className="eyebrow">
              {item.year} · {item.type}
            </p>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <section className="section contact-page">
      <Heading label="LET'S CONNECT">
        Tell me what
        <br />
        you have in mind.
      </Heading>
      <div className="contact-grid">
        <div>
          <p className="lead">
            An internship, a useful idea, or a conversation about building
            things. I'd love to hear from you.
          </p>
          <a className="contact-email" href={profile.social.email}>
            {profile.email} ↗
          </a>
          <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>
            {profile.phone}
          </a>
          <p>Indore, Madhya Pradesh, India</p>
          <div className="actions">
            <a
              className="button soft"
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span>↗</span>
            </a>
            <a
              className="button soft"
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span>↗</span>
            </a>
          </div>
        </div>
        <div className="contact-form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
function ProjectPage() {
  const { id } = useParams(),
    p = projects.find((p) => p.id === id);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);
  if (!p)
    return (
      <section className="section">
        <h1>PROJECT NOT FOUND</h1>
        <Link className="button" to="/">
          BACK HOME ↗
        </Link>
      </section>
    );
  return (
    <article className="section project-page">
      <Link className="eyebrow" to="/#projects">
        ← ALL PROJECTS
      </Link>
      <p className="eyebrow project-kicker">
        SELECTED WORK / {num(projects.indexOf(p))}
      </p>
      <h1>{p.title}</h1>
      <p className="project-subtitle">{p.subtitle.replace(/^ — /, "")}</p>
      <img
        className={`detail-image${p.illustration ? " project-illustration" : ""}`}
        src={p.screenshot}
        alt={p.imageAlt || `${p.title} application screenshot`}
      />
      <div className="detail-grid">
        <h2>THE BUILD.</h2>
        <div>
          <p className="body-copy">
            {p.description.replace(/\s+/g, " ").trim()}
          </p>
          <h3 className="eyebrow">TECHNOLOGIES</h3>
          <div className="tags">
            {p.tech.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div className="actions">
            <a
              className="button light"
              href={p.github}
              target="_blank"
              rel="noreferrer"
            >
              VIEW CODE ↗
            </a>
            {p.demo ? (
              <a
                className="button"
                href={p.demo}
                target="_blank"
                rel="noreferrer"
              >
                OPEN LIVE SITE ↗
              </a>
            ) : (
              <p className="project-availability">
                No public live site is available for this project. Explore the
                source code above.
              </p>
            )}
          </div>
        </div>
      </div>
      <Link
        className="button"
        to={`/project/${encodeURIComponent(projects[(projects.indexOf(p) + 1) % projects.length].id)}`}
      >
        NEXT PROJECT →
      </Link>
    </article>
  );
}

export default function App() {
  return (
    <div className="site-frame" id="top">
      <SiteCursor />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route
            path="*"
            element={
              <section className="section page-recovery">
                <h1>Page not found.</h1>
                <Link className="button soft" to="/">
                  Back home ↗
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
      <div className="floating-actions">
        <button
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          ↑
        </button>
        <a href={profile.social.email} aria-label="Email Veshwik Jain">
          ✉
        </a>
      </div>
    </div>
  );
}
