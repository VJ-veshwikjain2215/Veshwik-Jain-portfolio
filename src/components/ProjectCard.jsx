import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { fadeUp } from "../animations/variants";
import ProjectVisual from "./ProjectVisual";
import Chip from "./Chip";

export default function ProjectCard({ project, featured = false, onExpand }) {
  return (
    <motion.article
      variants={fadeUp}
      className={`group flex flex-col rounded-lg border border-hairline bg-card p-4 md:p-5 transition-colors duration-300 hover:border-text-secondary ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onExpand(project)}
        className="text-left"
        aria-label={`View details for ${project.title}`}
      >
        {project.screenshot ? (
          <img
            src={project.screenshot}
            alt={project.title}
            className={`w-full ${featured ? "aspect-[16/10]" : "aspect-[16/11]"} object-cover rounded border border-hairline`}
          />
        ) : (
          <ProjectVisual seed={project.id} featured={featured} />
        )}
      </button>

      <div className="mt-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl text-text">{project.title}</h3>
            <p className="text-sm text-text-secondary mt-0.5">{project.subtitle}</p>
          </div>
          {project.placeholder && (
            <span className="label-caps shrink-0 rounded border border-hairline px-2.5 py-1 text-text-secondary">
              In progress
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-text-secondary leading-relaxed">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Chip key={t} className="text-data text-xs py-1">
              {t}
            </Chip>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4 pt-4 border-t border-hairline">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              <FiGithub size={15} /> Code
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary/50">
              <FiGithub size={15} /> Code
            </span>
          )}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              <FiExternalLink size={15} /> Live demo
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary/50">
              <FiExternalLink size={15} /> Live demo
            </span>
          )}
          <button
            type="button"
            onClick={() => onExpand(project)}
            className="ml-auto inline-flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Details <FiArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
