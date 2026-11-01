import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuCheck,
  LuPlus,
  LuWorkflow,
  LuPanelsTopLeft,
  LuShieldCheck,
} from "react-icons/lu";
import { developmentOutcomes } from "../constants/experience";
import { projects } from "../constants/data";
import Reveal from "./Reveal";

const icons = [LuWorkflow, LuPanelsTopLeft, LuShieldCheck];

function Evidence({ evidence }) {
  const project = projects.find((item) => item.id === evidence.projectId);
  const title = project?.title || evidence.title;
  return (
    <Link
      className="outcome-evidence"
      to={
        project ? `/project/${encodeURIComponent(project.id)}` : evidence.href
      }
    >
      {project ? (
        <img
          src={project.screenshot}
          alt=""
          loading="lazy"
          width="112"
          height="84"
        />
      ) : (
        <span className="evidence-monogram" aria-hidden="true">
          VJ<span>↗</span>
        </span>
      )}
      <span>
        <strong>{title}</strong>
        <span>{evidence.detail}</span>
      </span>
      <LuArrowUpRight aria-hidden="true" className="evidence-arrow" />
    </Link>
  );
}

export default function Capabilities() {
  const [open, setOpen] = useState(developmentOutcomes[0].id);
  return (
    <section
      className="section outcomes-section"
      id="capabilities"
      aria-labelledby="outcomes-title"
    >
      <Reveal className="sec-head">
        <div className="section-heading">
          <p className="eyebrow">WHAT I CAN BUILD</p>
          <h2 id="outcomes-title">
            Useful outcomes.
            <br />
            Working examples.
          </h2>
        </div>
        <p className="lead">
          A stack is a starting point. These are the practical development
          strengths behind my projects, with examples you can explore.
        </p>
      </Reveal>
      <div className="outcome-list">
        {developmentOutcomes.map((outcome, index) => {
          const Icon = icons[index];
          const expanded = open === outcome.id;
          return (
            <Reveal key={outcome.id} delay={index * 0.05}>
              <article className={`outcome${expanded ? " is-open" : ""}`}>
                <h3>
                  <button
                    className="outcome-trigger"
                    type="button"
                    id={`outcome-trigger-${outcome.id}`}
                    aria-expanded={expanded}
                    aria-controls={`outcome-${outcome.id}`}
                    onClick={() => setOpen(expanded ? null : outcome.id)}
                  >
                    <span className="outcome-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="outcome-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="outcome-label">
                      <strong>{outcome.title}</strong>
                      <span>{outcome.summary}</span>
                    </span>
                    <LuPlus aria-hidden="true" className="outcome-toggle" />
                  </button>
                </h3>
                <div
                  className="outcome-body"
                  id={`outcome-${outcome.id}`}
                  role="region"
                  aria-labelledby={`outcome-trigger-${outcome.id}`}
                  hidden={!expanded}
                >
                  <div className="outcome-delivery">
                    <p className="label-caps">WHAT THIS DELIVERS</p>
                    <p>{outcome.description}</p>
                    <ul>
                      {outcome.deliverables.map((item) => (
                        <li key={item}>
                          <LuCheck aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="outcome-proof">
                    <p className="label-caps">SEE IT IN THE WORK</p>
                    {outcome.evidence.map((evidence) => (
                      <Evidence
                        key={evidence.projectId || evidence.href}
                        evidence={evidence}
                      />
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
