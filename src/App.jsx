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
const num = (i) => String(i + 1).padStart(2, "0");
function Reveal({ children, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.div>
  );
}
const capabilities = [
  {
    title: "Backend systems",
    note: "APIs, business logic, and reliable data flows",
    icon: "⌘",
    tech: ["Java", "Spring Boot", "REST APIs"],
    copy: "Clear application layers and dependable APIs, built around the problem the software needs to solve.",
  },
  {
    title: "Web applications",
    note: "Useful interfaces, from idea to interaction",
    icon: "↗",
    tech: ["React", "JavaScript", "HTML", "CSS"],
    copy: "Responsive interfaces that connect the system underneath to a clear, useful experience on the screen.",
  },
  {
    title: "Data & storage",
    note: "Structured information, thoughtfully connected",
    icon: "▤",
    tech: ["MySQL", "DBMS", "SQL"],
    copy: "Practical data models, understandable relationships, and the foundations that help an application stay predictable.",
  },
  {
    title: "Developer workflow",
    note: "Version control, tools, and continuous learning",
    icon: "⟷",
    tech: ["Git", "GitHub", "VS Code", "Linux", "Windows", "C/C++"],
    copy: "Small iterations, meaningful checks, and the tools to turn a working idea into something that can be improved.",
  },
];
function ScrollStatement({ children, dark = false }) {
  const ref = useRef(null),
    [progress, setProgress] = useState(0),
    reduce = useReducedMotion();
  const words = children.split(" ");
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setProgress(
          Math.max(
            0,
            Math.min(
              1,
              (window.innerHeight * 0.84 - r.top) / (window.innerHeight * 0.65),
            ),
          ),
        );
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <p ref={ref} className={`statement ${dark ? "statement-dark" : ""}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`${reduce || i < progress * words.length ? "on" : ""} ${["Java,", "reliable", "people.", "learning,"].includes(word) ? "highlight" : ""}`}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
function Nav() {
  const location = useLocation();
  const currentSection =
    location.pathname === "/about"
      ? "about"
      : location.pathname === "/"
        ? location.hash.slice(1) || "home"
        : "";
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link className="brand" to="/" aria-label="Veshwik Jain home">
        <span className="brand-orb">
          <i />
        </span>
        Veshwik<span className="brand-pip">·</span>
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? "Close ×" : "Menu ☰"}
      </button>
      <nav
        className={open ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        {[
          ["Home", "home"],
          ["About", "about"],
          ["Capabilities", "capabilities"],
          ["Toolkit", "skills"],
          ["Projects", "projects"],
          ["Journey", "academics"],
        ].map(([label, id]) => (
          <a
            key={id}
            className={id === currentSection ? "home-link" : ""}
            href={`/#${id}`}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "home-link" : ""}
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
      <Link className="nav-status" to="/contact">
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
function CapabilityScene({ index }) {
  return (
    <div className={`capability-scene scene-${index}`}>
      <span className="eyebrow">
        {
          [
            "APPLICATION FLOW",
            "INTERFACE PREVIEW",
            "DATA MODEL",
            "BUILD WORKFLOW",
          ][index]
        }
      </span>
      <div className="mini-window">
        <div className="mini-toolbar">
          <i />
          <i />
          <i />
          <span>
            {
              [
                "api.veshwik.dev",
                "app.veshwik.dev",
                "data.workspace",
                "project.workspace",
              ][index]
            }
          </span>
        </div>
        {index === 0 ? (
          <>
            <div className="flow-node">
              <span>↗</span>
              <b>Request received</b>
              <small>REST endpoint</small>
            </div>
            <div className="flow-line" />
            <div className="flow-node">
              <span>⌘</span>
              <b>Application logic</b>
              <small>Java · Spring Boot</small>
            </div>
            <div className="flow-line" />
            <div className="flow-node">
              <span>✓</span>
              <b>Response returned</b>
              <small>Clear, structured data</small>
            </div>
          </>
        ) : index === 1 ? (
          <>
            <div className="mock-heading">A clear next step.</div>
            <div className="mock-bars">
              <i />
              <i />
              <i />
            </div>
            <div className="mock-cards">
              <span>Explore →</span>
              <span>Build ↗</span>
            </div>
            <div className="mock-confirm">✓ Responsive by design</div>
          </>
        ) : index === 2 ? (
          <>
            <div className="schema-node">
              <b>Application</b>
              <small>id · name · status</small>
            </div>
            <div className="schema-connector" />
            <div className="schema-pair">
              <div className="schema-node">
                <b>Users</b>
                <small>id · email</small>
              </div>
              <div className="schema-node">
                <b>Records</b>
                <small>id · user_id</small>
              </div>
            </div>
            <div className="mock-confirm">
              Connected. Consistent. Understandable.
            </div>
          </>
        ) : (
          <>
            <div className="workflow-row">
              <span>01</span>
              <b>Define</b>
              <small>Understand the problem</small>
            </div>
            <div className="workflow-row">
              <span>02</span>
              <b>Build</b>
              <small>Small, clear iterations</small>
            </div>
            <div className="workflow-row">
              <span>03</span>
              <b>Check</b>
              <small>Test the real flow</small>
            </div>
            <div className="workflow-row">
              <span>04</span>
              <b>Improve</b>
              <small>Learn from what breaks</small>
            </div>
          </>
        )}
      </div>
      <div className="scene-chips">
        {capabilities[index].tech.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
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
  const [activeSkill, setActiveSkill] = useState(0),
    [activeCapability, setActiveCapability] = useState(0);
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
      <section className="section serve-section" id="skills">
        <div className="serve-side">
          <Heading label="WHAT I BRING">
            See where my
            <br />
            skills fit.
          </Heading>
          <p className="lead">
            Four parts of the software I enjoy building, from the logic behind
            the screen to the experience in front of it.
          </p>
          <div
            className="serve-tabs"
            role="tablist"
            aria-label="Development skills"
            aria-orientation="vertical"
          >
            {capabilities.map((c, i) => (
              <button
                role="tab"
                id={`skill-tab-${i}`}
                aria-controls="skill-panel"
                aria-selected={activeSkill === i}
                tabIndex={activeSkill === i ? 0 : -1}
                key={c.title}
                onClick={() => setActiveSkill(i)}
                onKeyDown={(e) => {
                  if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 3
                          : (i + (e.key === "ArrowDown" ? 1 : -1) + 4) % 4;
                    setActiveSkill(next);
                    e.currentTarget.parentElement
                      .querySelectorAll("button")
                      [next].focus();
                  }
                }}
              >
                <span className="serve-icon">{c.icon}</span>
                <b>{c.title}</b>
                <small>{c.note}</small>
                <i className="serve-progress" />
              </button>
            ))}
          </div>
          <a href="#capabilities" className="button soft">
            Explore my approach <span>↗</span>
          </a>
        </div>
        <div
          className="serve-stage"
          role="tabpanel"
          id="skill-panel"
          aria-labelledby={`skill-tab-${activeSkill}`}
        >
          <div className="serve-stage-copy">
            <h3>{capabilities[activeSkill].title}</h3>
            <p>{capabilities[activeSkill].copy}</p>
          </div>
          <CapabilityScene index={activeSkill} />
        </div>
      </section>
      <section className="section" id="capabilities">
        <div className="sec-head">
          <Heading label="MY CAPABILITIES">
            Four ways I<br />
            turn ideas into code.
          </Heading>
          <p className="lead">
            From the API that powers an application to the interface someone
            uses every day. Thoughtful choices at every layer.
          </p>
        </div>
        <div className="expanding-panels">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className={`expand-card ${activeCapability === i ? "is-open" : ""}`}
            >
              <button
                className="expand-trigger"
                aria-label={`Explore ${c.title}`}
                aria-expanded={activeCapability === i}
                aria-controls={`capability-${i}`}
                onClick={() => setActiveCapability(i)}
              >
                <span>{num(i)}</span>
                <b>{c.title}</b>
                <i>↗</i>
              </button>
              <div
                className="expand-body"
                id={`capability-${i}`}
                hidden={activeCapability !== i}
              >
                <div>
                  <span className="eyebrow">{num(i)} / 04</span>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                  <ul>
                    {c.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <a href="#projects" className="button soft">
                    Explore the projects <span>↗</span>
                  </a>
                </div>
                <CapabilityScene index={i} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section" id="projects">
        <div className="sec-head">
          <Heading label="PROJECT REFERENCE">
            Ideas already
            <br />
            at work.
          </Heading>
          <p className="lead">
            An encryption workbench. A voice authenticity experiment. A
            personal-finance platform. A way to report civic issues.
          </p>
        </div>
        <div className="work-grid">
          {projects.map((p, i) => (
            <Reveal className="work-card" key={p.id}>
              <Link
                className="work-frame"
                to={`/project/${encodeURIComponent(p.id)}`}
                aria-label={`View ${p.title} project`}
              >
                <img
                  src={p.screenshot}
                  alt={`${p.title} application screenshot`}
                  loading="lazy"
                />
                <span className="work-chip">
                  {["AI & Audio", "Security", "Finance", "Civic platform"][i]}
                </span>
                <span className="work-arrow">↗</span>
              </Link>
              <Link to={`/project/${encodeURIComponent(p.id)}`}>
                <h3>{p.title}</h3>
                <p>{p.showcaseDescription}</p>
              </Link>
            </Reveal>
          ))}
        </div>
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
          <p className="eyebrow">HOW I WORK</p>
          <ScrollStatement dark>
            Built with curiosity, then improved through learning, testing and
            attention to the details that matter.
          </ScrollStatement>
          <p className="dark-intro">
            I enjoy software that is predictable, understandable, and useful.
            These are the habits I bring to a project.
          </p>
          <div className="rings">
            <div className="rings-line" />
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
            ].map(([n, title, copy]) => (
              <Reveal className="ring-item" key={n}>
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
        <div className="sec-head">
          <Heading label="THE JOURNEY SO FAR">
            Always learning.
            <br />
            Always building.
          </Heading>
          <p className="lead">
            Engineering coursework, side projects, hackathons, and the small
            discoveries that connect them.
          </p>
        </div>
        <div className="journey-rows">
          {about.timeline.map((t) => (
            <div key={t.year}>
              <span className="journey-icon">↗</span>
              <h3>{t.title}</h3>
              <span className="eyebrow">{t.year}</span>
              <p>{t.detail}</p>
            </div>
          ))}
          {achievements.slice(0, 3).map((a) => (
            <div key={a.title}>
              <span className="journey-icon">✓</span>
              <h3>{a.title}</h3>
              <span className="eyebrow">
                {a.year} · {a.type}
              </span>
              <p>{a.detail}</p>
            </div>
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
        className="detail-image"
        src={p.screenshot}
        alt={`${p.title} application screenshot`}
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
            {p.demo && (
              <a
                className="button"
                href={p.demo}
                target="_blank"
                rel="noreferrer"
              >
                OPEN LIVE SITE ↗
              </a>
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
