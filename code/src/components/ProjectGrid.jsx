import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function ProjectGrid({ projects }) {
  const [active, setActive] = useState(projects[0]?.id);
  const grid = useRef(null);
  const rows = Array.from(
    { length: Math.ceil(projects.length / 2) },
    (_, index) => projects.slice(index * 2, index * 2 + 2),
  );
  function restoreFocus() {
    const focused = document.activeElement?.closest("[data-project-id]");
    setActive(
      focused && grid.current.contains(focused)
        ? focused.dataset.projectId
        : projects[0]?.id,
    );
  }
  return (
    <div
      className="work-grid"
      ref={grid}
      onMouseLeave={restoreFocus}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(projects[0]?.id);
      }}
    >
      {rows.map((row) => (
        <div className="work-row" key={row[0].id}>
          {row.map((project, index) => (
            <Reveal
              className={`work-card${active === project.id ? " is-expanded" : ""}`}
              key={project.id}
              data-project-id={project.id}
              onMouseEnter={() => setActive(project.id)}
              onFocusCapture={() => setActive(project.id)}
              delay={index * 0.08}
            >
              <div className="work-media">
                <Link
                  className={`work-frame${project.illustration ? " project-illustration" : ""}${project.imageFit === "contain" ? " image-contain" : ""}`}
                  to={`/project/${encodeURIComponent(project.id)}`}
                  aria-label={`View ${project.title} project`}
                >
                  <img
                    src={project.screenshot}
                    alt={
                      project.imageAlt ||
                      `${project.title} application screenshot`
                    }
                    loading="lazy"
                  />
                  <span className="work-chip">{project.category}</span>
                  <span className="work-arrow">↗</span>
                </Link>
              </div>
              <Link
                className="work-summary"
                to={`/project/${encodeURIComponent(project.id)}`}
              >
                <h3>{project.title}</h3>
                <p>{project.showcaseDescription}</p>
              </Link>
              <div className="actions project-links">
                {project.demo ? (
                  <a
                    className="button soft"
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} live site`}
                  >
                    Live site ↗
                  </a>
                ) : (
                  <span className="project-availability">
                    No public live site
                  </span>
                )}
                <a
                  className="button soft"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} source code`}
                >
                  View code ↗
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      ))}
    </div>
  );
}
