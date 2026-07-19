import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiDownload, FiFileText } from "react-icons/fi";
import { profile } from "../constants/data";
import { fadeUp, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Modal from "../components/Modal";

export default function Resume() {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <section id="resume" className="py-24 md:py-32 hairline">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeading path="~/resume" title="Résumé" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col md:flex-row items-center gap-8 rounded-xl border border-hairline bg-card p-6 md:p-8 card-shadow"
        >
          <div className="flex h-32 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-hairline bg-bg">
            <FiFileText className="text-primary" size={28} />
            <span className="font-mono text-[10px] text-text-secondary">PDF</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display text-xl font-semibold text-text">{profile.name} — Résumé</h3>
            <p className="mt-1 text-text-secondary text-sm">
              One page. Education, skills, projects and experience, kept current.
            </p>
            <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
              <Button variant="primary" onClick={() => setPreviewOpen(true)} data-cursor-hover>
                <FiEye size={16} /> View résumé
              </Button>
              <Button as="a" href={profile.resumeUrl} download variant="secondary" data-cursor-hover>
                <FiDownload size={16} /> Download
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Résumé preview">
        <div className="aspect-[1/1.3] w-full rounded-lg border border-hairline bg-bg overflow-hidden">
          <object data={profile.resumeUrl} type="application/pdf" className="h-full w-full">
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-text-secondary">
              Add <code className="font-mono text-xs">resume.pdf</code> to the <code className="font-mono text-xs">/public</code> folder to enable the in-page preview.
            </div>
          </object>
        </div>
      </Modal>
    </section>
  );
}
