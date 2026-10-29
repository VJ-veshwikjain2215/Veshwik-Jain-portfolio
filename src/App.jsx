import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  profile,
  about,
  projects,
  skillCategories,
  achievements,
  academicProgress,
} from "./constants/data";
import ContactForm from "./components/ContactForm";
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
function Dither() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current,
      ctx = c.getContext("2d"),
      reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame,
      last = 0;
    c.width = 640;
    c.height = 560;
    function draw(time) {
      if (time - last < 45 && !reduce) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = time;
      const t = reduce ? 0 : time / 3500;
      ctx.clearRect(0, 0, 640, 560);
      for (let y = 0; y < 560; y += 7)
        for (let x = 0; x < 640; x += 7) {
          const dx = (x - 325) / 220,
            dy = (y - 270) / 215,
            r = Math.hypot(dx, dy),
            a = Math.atan2(dy, dx),
            edge = 1 + 0.09 * Math.sin(5 * a + t) + 0.04 * Math.cos(9 * a - t);
          if (r > edge) continue;
          const wave = Math.sin(r * 15 - t * 2 + Math.sin(a * 3 + t) * 2),
            light = 0.45 + 0.3 * wave + 0.2 * Math.cos(a - t),
            threshold = ((((x / 7) % 4) * 3 + ((y / 7) % 4) * 5) % 16) / 16;
          if (light > threshold) {
            ctx.fillStyle = `rgba(232,232,224,${0.45 + 0.5 * (1 - r / 1.3)})`;
            ctx.fillRect(x, y, 4, 4);
          }
        }
      if (!reduce) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} className="dither" aria-hidden="true" />;
}
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link className="brand" to="/">
        VESHWIK.JAIN
      </Link>
      <nav
        aria-label="Main navigation"
        className={open ? "nav-links open" : "nav-links"}
      >
        {[
          ["ABOUT", "about"],
          ["PROJECTS", "projects"],
          ["ACADEMICS", "academics"],
          ["CONTACT", "contact"],
        ].map(([label, id], i) => (
          <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            <small>{num(i)}</small> {label}
          </a>
        ))}
      </nav>
      <Link className="monogram" to="/" aria-label="Veshwik Jain home">
        VJ
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? "CLOSE −" : "MENU +"}
      </button>
      <a className="nav-status" href="/#contact">
        LET'S TALK ↗
      </a>
    </header>
  );
}
function Heading({ label, children }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{label}</span>
      <h2>{children}</h2>
    </div>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <span className="footer-logo">
          VJ<span>✳</span>
        </span>
        <div>
          <p className="eyebrow">BACKEND & FULL-STACK DEVELOPER</p>
          <p>
            Useful systems. Thoughtful code.
            <br />
            Built in Indore, India.
          </p>
        </div>
        <div className="footer-links">
          <a href={profile.social.github} target="_blank" rel="noreferrer">
            GITHUB ↗
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
            LINKEDIN ↗
          </a>
          <a href={profile.social.email}>EMAIL ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VESHWIK JAIN</span>
        <span>DESIGN & CODE · REACT / MOTION</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
function Home() {
  const projectSection = useRef(null);
  const projectTrack = useRef(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isProjectPinned, setProjectPinned] = useState(false);
  const reduceMotion = useReducedMotion();
  const pinnedProjects = () =>
    window.matchMedia("(min-width: 760px) and (min-height: 700px)").matches;
  const moveProject = (direction) => {
    const section = projectSection.current;
    const track = projectTrack.current;
    if (!track || !section) return;
    const index = Math.max(
      0,
      Math.min(projects.length - 1, activeProject + direction),
    );
    if (pinnedProjects()) {
      const pin = section.querySelector(".project-pin");
      const start = section.getBoundingClientRect().top + window.scrollY - 66;
      const distance = section.offsetHeight - pin.offsetHeight;
      window.scrollTo({
        top: start + ((index + 0.35) / projects.length) * distance,
        behavior: reduceMotion ? "instant" : "smooth",
      });
    } else {
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: reduceMotion ? "instant" : "smooth",
      });
      setActiveProject(index);
    }
  };
  const syncProject = () => {
    const track = projectTrack.current;
    if (track && !pinnedProjects())
      setActiveProject(
        Math.max(
          0,
          Math.min(
            projects.length - 1,
            Math.round(track.scrollLeft / track.clientWidth),
          ),
        ),
      );
  };
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = projectSection.current;
        const pinned = pinnedProjects();
        setProjectPinned(pinned);
        if (!section) return;
        if (!pinned) {
          const track = projectTrack.current;
          if (track)
            setActiveProject(
              Math.max(
                0,
                Math.min(
                  projects.length - 1,
                  Math.round(track.scrollLeft / track.clientWidth),
                ),
              ),
            );
          return;
        }
        const pin = section.querySelector(".project-pin");
        const distance = section.offsetHeight - pin.offsetHeight;
        const progress = Math.max(
          0,
          Math.min(1, (66 - section.getBoundingClientRect().top) / distance),
        );
        setActiveProject(
          Math.min(projects.length - 1, Math.floor(progress * projects.length)),
        );
        if (projectTrack.current) projectTrack.current.scrollLeft = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const [time, setTime] = useState("");
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const frame = requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView(),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, []);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-meta">
          <span>
            VESHWIK JAIN
            <br />
            <em>PORTFOLIO © {new Date().getFullYear()}</em>
          </span>
          <span>
            INDORE
            <br />
            <em>MADHYA PRADESH, INDIA</em>
          </span>
          <span>
            BACKEND & FULL-STACK DEVELOPER
            <br />
            <em>JAVA · SPRING BOOT · REACT</em>
          </span>
          <span className="local-time">
            LOCAL TIME
            <br />
            <strong>{time} IST</strong>
          </span>
        </div>
        <div className="hero-stage">
          <Dither />
          <div className="hero-title">
            <p className="eyebrow">
              <span className="status-dot" /> [ 00 ] · OPEN TO INTERNSHIPS
            </p>
            <h1>
              BUILDING
              <br />
              RELIABLE
              <br />
              BACKEND SYSTEMS.
            </h1>
          </div>
          <div className="hero-intro">
            <p>
              I'm Veshwik, an engineering student building dependable APIs and
              full-stack applications. From the data layer to the details people
              see.
            </p>
            <div className="actions">
              <a className="button" href="#projects">
                SEE PROJECTS ↙
              </a>
              <a className="button light" href="#contact">
                GET IN TOUCH ↗
              </a>
            </div>
          </div>
        </div>
        <div className="wordmark">
          VESHWIK<span>JAIN</span>
        </div>
        <div className="hero-bottom eyebrow">
          <span>
            JAVA DEVELOPER & PROBLEM SOLVER — {new Date().getFullYear()}
          </span>
          <a href="#about">SCROLL ↓</a>
        </div>
      </section>
      <section className="process-strip" aria-label="My working process">
        <div className="process-steps">
          {["DESIGN", "BUILD", "DEPLOY"].map((step, i) => (
            <div className="process-step" key={step}>
              <span className="eyebrow">{num(i)}</span>
              <span className="process-name">{step}</span>
              <span className="process-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          ))}
        </div>
        <p className="eyebrow">FROM A GOOD IDEA TO A SYSTEM THAT WORKS.</p>
      </section>
      <section id="about" className="section">
        <Reveal>
          <Heading label="01 / ABOUT">
            FROM CODE
            <br />
            TO REAL-WORLD SYSTEMS.
          </Heading>
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="about-lead">
              Engineering student. Java developer. Curious about everything
              underneath the interface.
            </p>
            {about.summary.map((p) => (
              <p className="body-copy" key={p}>
                {p}
              </p>
            ))}
            <p className="body-copy">{about.goals}</p>
          </Reveal>
          <Reveal className="profile-panel corner">
            <p className="eyebrow">+ PROFILE</p>
            {[
              ["BASED IN", "INDORE, INDIA"],
              ["FOCUS", "BACKEND / FULL-STACK"],
              ["CORE STACK", "JAVA · SPRING BOOT"],
              ["STATUS", "SEEKING INTERNSHIPS"],
            ].map(([k, v]) => (
              <div className="profile-row" key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <a
              className="button light"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              VIEW RÉSUMÉ ↗
            </a>
            <a className="button" href={profile.resumeUrl} download>
              DOWNLOAD RÉSUMÉ ↓
            </a>
          </Reveal>
        </div>
        <div className="expertise">
          {[
            [
              "01",
              "BACKEND ARCHITECTURE",
              "Dependable APIs, clear application layers, and thoughtful data models.",
            ],
            [
              "02",
              "FULL-STACK DEVELOPMENT",
              "Connecting Spring Boot services to useful, responsive React interfaces.",
            ],
            [
              "03",
              "LEARNING BY BUILDING",
              "Hackathons, side projects, and working through the details that make systems reliable.",
            ],
          ].map(([n, title, desc]) => (
            <Reveal key={n} className="expertise-item">
              <span className="graphic-symbol">
                {n === "01" ? "⌘" : n === "02" ? "⌁" : "✳"}
              </span>
              <p className="eyebrow"># {n} / FOCUS</p>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
        <div id="skills" className="skills">
          <div className="subheading">
            <h3>THE TOOLKIT</h3>
            <span className="eyebrow">LANGUAGES / FRAMEWORKS / SYSTEMS</span>
          </div>
          {skillCategories.map((c, i) => (
            <Reveal className="skill-row" key={c.label}>
              <span className="eyebrow">{num(i)}</span>
              <h4>{c.label}</h4>
              <div>
                {c.skills.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <span>+</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section
        id="projects"
        className="section project-showcase"
        ref={projectSection}
      >
        <div className="project-pin">
          <Reveal>
            <Heading label="02 / SELECTED WORK">
              THINGS I'VE
              <br />
              BUILT & SHIPPED.
            </Heading>
            <p className="section-intro">
              Security tools, AI experiments, and full-stack applications.
              Explore the thinking and technology behind each build.
            </p>
          </Reveal>
          <div className="project-navigation">
            <span className="eyebrow" aria-live="polite" aria-atomic="true">
              {num(activeProject)} / {String(projects.length).padStart(2, "0")}{" "}
              · SCROLL TO CHANGE PROJECT
            </span>
            <div className="project-navigation-buttons">
              <button
                type="button"
                aria-label="Previous project"
                aria-controls="project-track"
                disabled={activeProject === 0}
                onClick={() => moveProject(-1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next project"
                aria-controls="project-track"
                disabled={activeProject === projects.length - 1}
                onClick={() => moveProject(1)}
              >
                →
              </button>
            </div>
          </div>
          <div className="project-window">
            <div
              className="projects"
              id="project-track"
              ref={projectTrack}
              role="region"
              aria-label="Selected projects carousel"
              tabIndex={0}
              style={{ "--active-project": activeProject }}
              onScroll={syncProject}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  moveProject(event.key === "ArrowRight" ? 1 : -1);
                }
              }}
            >
              {projects.map((p, i) => (
                <article
                  className="project"
                  key={p.id}
                  aria-label={p.title}
                  inert={isProjectPinned && activeProject !== i}
                >
                  <Link
                    className="project-image"
                    to={`/project/${encodeURIComponent(p.id)}`}
                    aria-label={`View ${p.title} project`}
                  >
                    <img
                      src={p.screenshot}
                      alt={`${p.title} application screenshot`}
                      loading="lazy"
                    />
                    <span className="image-index">
                      {num(i)} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span className="image-arrow">↗</span>
                  </Link>
                  <div className="project-info">
                    <span className="eyebrow">{num(i)} / SELECTED PROJECT</span>
                    <h3>
                      <Link to={`/project/${encodeURIComponent(p.id)}`}>
                        {p.title}
                      </Link>
                    </h3>
                    <p className="project-subtitle">
                      {p.subtitle.replace(/^ — /, "")}
                    </p>
                    <p className="project-summary">{p.showcaseDescription}</p>
                    <span className="eyebrow project-stack-label">
                      TECH STACK
                    </span>
                    <div className="tags">
                      {p.tech.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="project-actions">
                      <Link to={`/project/${encodeURIComponent(p.id)}`}>
                        EXPLORE PROJECT ↗
                      </Link>
                      <a href={p.github} target="_blank" rel="noreferrer">
                        CODE ↗
                      </a>
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer">
                          LIVE SITE ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="academics" className="section">
        <Reveal>
          <Heading label="03 / THE JOURNEY">
            ALWAYS
            <br />A WORK IN PROGRESS.
          </Heading>
        </Reveal>
        <div className="journey-grid">
          <div>
            <h3 className="subheading">LEARNING & BUILDING</h3>
            {about.timeline.map((t) => (
              <Reveal className="timeline-item" key={t.year}>
                <span className="eyebrow">{t.year}</span>
                <h4>{t.title}</h4>
                <p>{t.detail}</p>
              </Reveal>
            ))}
          </div>
          <div>
            <h3 className="subheading">ACADEMIC RECORD</h3>
            {academicProgress.semesters.map((s) => (
              <div className="semester" key={s.sem}>
                <span className="eyebrow">SEM / 0{s.sem}</span>
                <strong>
                  {s.sgpa ?? "—"} <small>SGPA</small>
                </strong>
                <span className="eyebrow">
                  {s.status} · CGPA {s.cgpa ?? "—"}
                </span>
                {s.marksheetUrl && (
                  <a
                    href={s.marksheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View semester ${s.sem} marksheet`}
                  >
                    MARKSHEET ↗
                  </a>
                )}
                {s.subjects.length > 0 && (
                  <p className="semester-subjects">{s.subjects.join(" / ")}</p>
                )}
              </div>
            ))}
            <a
              className="button light"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              VIEW FULL RÉSUMÉ ↗
            </a>
          </div>
        </div>
        <div className="achievements">
          <h3 className="subheading">MILESTONES</h3>
          {achievements.map((a, i) => (
            <Reveal className="achievement" key={a.title}>
              <span className="eyebrow">
                {num(i)} / {a.year}
              </span>
              <div>
                <h4>{a.title}</h4>
                <p>{a.org}</p>
                <p>{a.detail}</p>
              </div>
              <span className="eyebrow">{a.type}</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section id="contact" className="section contact">
        <Reveal>
          <Heading label="04 / CONTACT">
            LET'S BUILD
            <br />
            SOMETHING USEFUL.
          </Heading>
        </Reveal>
        <div className="contact-grid">
          <div>
            <a className="contact-email" href={profile.social.email}>
              {profile.email} ↗
            </a>
            <p>
              Open to backend and full-stack internships, thoughtful projects,
              and good conversations.
            </p>
            <div className="contact-details">
              <span className="eyebrow">BASE</span>
              <span>{profile.location}</span>
              <span className="eyebrow">PHONE</span>
              <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>
                {profile.phone}
              </a>
              <span className="eyebrow">ELSEWHERE</span>
              <div>
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GITHUB ↗
                </a>{" "}
                /{" "}
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LINKEDIN ↗
                </a>
              </div>
            </div>
          </div>
          <div className="contact-form corner">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
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
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route
            path="*"
            element={
              <section className="section">
                <h1>PAGE NOT FOUND.</h1>
                <Link className="button" to="/">
                  BACK HOME ↗
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
