import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { projects } from "../constants/data";
import { staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import ProjectVisual from "../components/ProjectVisual";
import Chip from "../components/Chip";
import Modal from "../components/Modal";
import Button from "../components/Button";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="projects" className="py-24 md:py-32 hairline">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          path="~/projects"
          title="Things I've built"
          description="A mix of shipped side projects and work in progress. The featured build is the one I'd point you to first."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={project.featured}
              onExpand={setActiveProject}
            />
          ))}
        </motion.div>
      </div>

      <Modal
        open={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title ?? ""}
      >
        {activeProject && (
          <div>

            {activeProject.screenshot ? (
              <img
                src={activeProject.screenshot}
                alt={activeProject.title}
                className="w-full aspect-[16/10] object-cover rounded-lg border border-hairline"
              />
              ) : (
              <ProjectVisual seed={activeProject.id} featured />
            )}
            
            <p className="mt-5 text-text-secondary leading-relaxed">{activeProject.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeProject.tech.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              {activeProject.github && (
                <Button as="a" href={activeProject.github} target="_blank" rel="noopener noreferrer" variant="secondary">
                  <FiGithub size={16} /> View code
                </Button>
              )}
              {activeProject.demo && (
                <Button as="a" href={activeProject.demo} target="_blank" rel="noopener noreferrer" variant="primary">
                  <FiExternalLink size={16} /> Live demo
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
