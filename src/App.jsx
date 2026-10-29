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
    const canvas = ref.current,
      ctx = canvas.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    canvas.width = 680;
    canvas.height = 680;
    let frame,
      previous = 0,
      visible = true;
    const draw = (time) => {
      if (!visible) return;
      if (!reduce && time - previous < 40) {
        frame = requestAnimationFrame(draw);
        return;
      }
      previous = time;
      const turn = reduce ? 0.45 : time / 14000;
      ctx.clearRect(0, 0, 680, 680);
      const dots = [];
      for (let ring = 0; ring < 110; ring++) {
        const u = (ring / 110) * Math.PI * 2;
        for (let side = 0; side < 20; side++) {
          const v = (side / 20) * Math.PI * 2;
          const x = (188 + 61 * Math.cos(v)) * Math.cos(u),
            y = (188 + 61 * Math.cos(v)) * Math.sin(u),
            z = 61 * Math.sin(v);
          const rx = x * Math.cos(turn) + z * Math.sin(turn),
            rz = -x * Math.sin(turn) + z * Math.cos(turn);
          const ry = y * 0.86 - rz * 0.51,
            depth = y * 0.51 + rz * 0.86;
          const perspective = 730 / (730 + depth);
          dots.push({
            x: 340 + (rx * 0.91 - ry * 0.25) * perspective,
            y: 340 + (rx * 0.25 + ry * 0.91) * perspective,
            depth,
            size: 2.5 * perspective,
          });
        }
      }
      dots.sort((a, b) => b.depth - a.depth);
      for (const p of dots) {
        const shade = Math.round(85 + (p.depth + 160) * 0.26);
        ctx.fillStyle = `rgb(30,${shade},78)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (!visible) cancelAnimationFrame(frame);
      else if (!wasVisible) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return <canvas ref={ref} className="dither" aria-hidden="true" />;
}
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link className="brand" to="/" aria-label="Veshwik Jain home">
        <span className="brand-icon">
          v<span>.</span>
        </span>
        veshwik<span className="brand-dot">.</span>
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
          ["About", "about"],
          ["Toolkit", "skills"],
          ["Projects", "projects"],
          ["Journey", "academics"],
        ].map(([label, id]) => (
          <a href={`/#${id}`} key={id} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-status" href="/#contact" onClick={() => setOpen(false)}>
        Let's talk <span>↗</span>
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
        <Link className="brand" to="/">
          veshwik<span className="brand-dot">.</span>
        </Link>
        <p>
          Thoughtful code. Useful systems.
          <br />
          Built with curiosity in Indore, India.
        </p>
        <div className="footer-links">
          <a href={profile.social.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={profile.social.email}>Email ↗</a>
        </div>
      </div>
      <div className="footer-wordmark">
        Let's build <span>something good.</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Veshwik Jain</span>
        <span>Java · Spring Boot · React</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
function Home() {
  const [activeSkill, setActiveSkill] = useState(0);
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
      const start = section.getBoundingClientRect().top + window.scrollY - 104;
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
          Math.min(1, (104 - section.getBoundingClientRect().top) / distance),
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
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> VESHWIK JAIN · BACKEND & FULL-STACK
            DEVELOPER
          </p>
          <h1>
            Good ideas.
            <br />
            Thoughtful code.
            <br />
            <span>Real impact.</span>
          </h1>
          <p className="hero-description">
            I'm Veshwik, an engineering student turning curious ideas into
            dependable APIs and useful web experiences. Built with care, from
            the data layer to the details you see.
          </p>
          <div className="actions">
            <a href="#contact" className="button dark">
              Let's talk <span>↗</span>
            </a>
            <a href="#projects" className="button soft">
              Explore my work <span>↗</span>
            </a>
          </div>
          <div className="hero-availability">
            <span className="status-dot" /> Open to backend & full-stack
            internships
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <Dither />
          <div className="floating-chip chip-top">
            <span className="chip-symbol">↗</span>
            <div>
              Always building.<small>Always learning.</small>
            </div>
          </div>
          <div className="floating-chip chip-bottom">
            <span className="status-dot" />
            <span>Indore, India</span>
            <span className="chip-time">{time} IST</span>
          </div>
        </div>
        <a className="hero-scroll eyebrow" href="#about">
          A LITTLE MORE ABOUT ME <span>↓</span>
        </a>
      </section>
      <section className="section about-section" id="about">
        <Reveal>
          <p className="eyebrow">THE PERSON BEHIND THE CODE</p>
          <h2 className="about-statement">
            Curious by nature.
            <br />
            <span>Builder by choice.</span>
          </h2>
          <div className="about-grid">
            <p className="about-lead">
              I enjoy the part of software you don't always see—the logic, the
              data, and the small decisions that make a system work.
            </p>
            <div className="body-copy">
              {about.summary.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              <a
                className="text-link"
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get to know my journey · Résumé ↗
              </a>
            </div>
          </div>
        </Reveal>
        <div className="profile-ribbon">
          <span>
            <strong>Java & Spring Boot</strong>Backend at heart
          </span>
          <span>
            <strong>
              {String(projects.length).padStart(2, "0")} selected builds
            </strong>
            Learning by shipping
          </span>
          <span>
            <strong>Indore, India</strong>Open to opportunities
          </span>
        </div>
      </section>
      <section className="section toolkit-section" id="skills">
        <Reveal>
          <Heading label="WHAT I WORK WITH">
            The right tools.
            <br />
            <span>A thoughtful approach.</span>
          </Heading>
          <p className="section-intro">
            From the first line of Java to the interface people interact with.
            Here's what I bring to a build.
          </p>
        </Reveal>
        <div className="toolkit-layout">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Technical toolkit"
            className="toolkit-tabs"
          >
            {skillCategories.map((group, i) => (
              <button
                key={group.label}
                role="tab"
                id={`skill-tab-${i}`}
                aria-selected={activeSkill === i}
                aria-controls={`skill-panel-${i}`}
                tabIndex={activeSkill === i ? 0 : -1}
                onClick={() => setActiveSkill(i)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? skillCategories.length - 1
                          : (i +
                              (event.key === "ArrowDown" ? 1 : -1) +
                              skillCategories.length) %
                            skillCategories.length;
                    setActiveSkill(next);
                    event.currentTarget.parentElement
                      .querySelectorAll("button")
                      [next].focus();
                  }
                }}
              >
                <small>{num(i)}</small>
                <span>{group.label}</span>
                <b>↗</b>
              </button>
            ))}
          </div>
          <div
            className="toolkit-panel"
            role="tabpanel"
            id={`skill-panel-${activeSkill}`}
            aria-labelledby={`skill-tab-${activeSkill}`}
          >
            <span className="eyebrow">MY TOOLKIT / {num(activeSkill)}</span>
            <div className="toolkit-art" aria-hidden="true">
              <span>{["{ }", "↔", "▤", "⌘", ">_"][activeSkill]}</span>
              <i />
              <i />
              <i />
            </div>
            <h3>{skillCategories[activeSkill].label}</h3>
            <p>
              Tools I use to learn, experiment, and turn ideas into working
              applications.
            </p>
            <div className="tags">
              {skillCategories[activeSkill].skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        id="projects"
        className="section project-showcase"
        ref={projectSection}
      >
        <div className="project-pin">
          <Reveal>
            <Heading label="SELECTED WORK">
              Ideas made real.
              <br />
              Selected work.
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

      <section className="section build-process">
        <Reveal>
          <Heading label="HOW I THINK">
            Make it clear.
            <br />
            <span>Then make it work.</span>
          </Heading>
        </Reveal>
        <div className="process-grid">
          {[
            [
              "01",
              "Understand the problem",
              "Start with the person using it, the data it needs, and the smallest useful thing to build.",
            ],
            [
              "02",
              "Build with intention",
              "Clear layers, practical choices, and an interface that makes the next step obvious.",
            ],
            [
              "03",
              "Test, learn, improve",
              "Check real flows, understand what breaks, and make the next version better.",
            ],
          ].map(([number, title, copy]) => (
            <Reveal className="process-card" key={number}>
              <span className="process-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section journey-section" id="academics">
        <Reveal>
          <Heading label="LEARNING, EVERY DAY">
            A work in progress.
            <br />
            <span>And proud of it.</span>
          </Heading>
        </Reveal>
        <div className="journey-grid">
          <div className="journey-timeline">
            <h3>The journey so far</h3>
            {about.timeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <span className="eyebrow">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="academic-card">
            <div className="academic-header">
              <span className="eyebrow">ACADEMIC RECORD</span>
              <span>↗</span>
            </div>
            {academicProgress.semesters.map((semester) => (
              <div className="semester" key={semester.sem}>
                <div>
                  <span className="eyebrow">
                    SEMESTER {num(semester.sem - 1)}
                  </span>
                  <small>{semester.status}</small>
                </div>
                <strong>
                  {semester.sgpa ?? "—"}
                  <small> SGPA</small>
                </strong>
                <span className="semester-cgpa">
                  CGPA {semester.cgpa ?? "—"}
                </span>
                {semester.marksheetUrl && (
                  <a
                    href={semester.marksheetUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Marksheet ↗
                  </a>
                )}
                {semester.subjects?.length > 0 && (
                  <details className="semester-subjects">
                    <summary>Subjects</summary>
                    <p>{semester.subjects.join(" · ")}</p>
                  </details>
                )}
              </div>
            ))}
            <a
              className="text-link"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              View full résumé ↗
            </a>
          </div>
        </div>
        <h3 className="milestone-heading">A few moments along the way.</h3>
        <div className="milestone-grid">
          {achievements.map((item) => (
            <Reveal className="achievement" key={item.title}>
              <span className="eyebrow">
                {item.year} · {item.type ?? "MILESTONE"}
              </span>
              <h3>{item.title}</h3>
              <p className="achievement-org">{item.org}</p>
              <p>{item.detail ?? item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">LET'S CONNECT</p>
            <h2>
              Have something
              <br />
              <span>good in mind?</span>
            </h2>
            <p className="contact-copy">
              An internship, a useful idea, or a good conversation about
              building things. I'd love to hear from you.
            </p>
            <a className="contact-email" href={profile.social.email}>
              {profile.email} ↗
            </a>
            <div className="contact-details">
              <span>Indore, India</span>
              <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>
                {profile.phone}
              </a>
            </div>
            <div className="social-pills">
              <a href={profile.social.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Résumé ↗
              </a>
            </div>
          </div>
          <div className="contact-form">
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
