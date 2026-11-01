import { useRef, useState } from "react";
import { toolkitCategories } from "../constants/experience";
import Reveal from "./Reveal";
import TechnologyLabel from "./TechnologyLabel";
import "./experience.css";

const filters = [{ id: "all", title: "All tools" }, ...toolkitCategories];

export default function Toolkit() {
  const [active, setActive] = useState("all");
  const tabs = useRef([]);
  const visible = toolkitCategories.filter(
    (category) => active === "all" || category.id === active,
  );
  const count = visible.reduce(
    (sum, category) => sum + category.tools.length,
    0,
  );

  function navigate(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? filters.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + filters.length) %
            filters.length;
    setActive(filters[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section
      className="section toolkit-section"
      id="skills"
      aria-labelledby="toolkit-title"
    >
      <Reveal className="sec-head">
        <div className="section-heading">
          <p className="eyebrow">MY TOOLKIT</p>
          <h2 id="toolkit-title">
            The tools behind
            <br />
            the work.
          </h2>
        </div>
        <p className="lead">
          Languages I write, frameworks I build with, and tools used across my
          projects. Explore the stack by category.
        </p>
      </Reveal>
      <div
        className="toolkit-filters"
        role="tablist"
        aria-label="Technology categories"
      >
        {filters.map((filter, index) => (
          <button
            type="button"
            role="tab"
            key={filter.id}
            id={`toolkit-tab-${filter.id}`}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            aria-controls="toolkit-panel"
            aria-selected={active === filter.id}
            tabIndex={active === filter.id ? 0 : -1}
            onClick={() => setActive(filter.id)}
            onKeyDown={(event) => navigate(event, index)}
          >
            {filter.title}
          </button>
        ))}
      </div>
      <p className="toolkit-count" role="status">
        {count} technologies ·{" "}
        {active === "all"
          ? "Across the stack"
          : filters.find((filter) => filter.id === active).title}
      </p>
      <div
        role="tabpanel"
        id="toolkit-panel"
        aria-labelledby={`toolkit-tab-${active}`}
        tabIndex={0}
      >
        <div
          className={`toolkit-grid${active !== "all" ? " is-filtered" : ""}`}
        >
          {visible.map((category, index) => (
            <Reveal
              key={category.id}
              className="toolkit-card"
              data-theme={category.theme}
              delay={index * 0.04}
            >
              <div className="toolkit-card-heading">
                <span className="toolkit-index" aria-hidden="true">
                  {String(toolkitCategories.indexOf(category) + 1).padStart(
                    2,
                    "0",
                  )}
                </span>
                <h3>{category.title}</h3>
                <p>{category.note}</p>
              </div>
              <ul
                className="toolkit-tools"
                aria-label={`${category.title} technologies`}
              >
                {category.tools.map((name) => (
                  <li key={name}>
                    <TechnologyLabel name={name} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
      <a className="toolkit-next" href="#capabilities">
        See what I build with them <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
