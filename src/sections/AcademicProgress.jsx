import { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiEye } from "react-icons/fi";
import { academicProgress } from "../constants/data";
import { fadeUp, staggerContainer, viewportOnce } from "../animations/variants";
import SectionHeading from "../components/SectionHeading";
import Chip from "../components/Chip";
import Button from "../components/Button";
import Modal from "../components/Modal";

export default function AcademicProgress() {
  const [previewSem, setPreviewSem] = useState(null);

  return (
    <section id="academics" className="py-24 md:py-32 hairline">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          path="~/academics"
          title="Semester-wise progress"
          description={academicProgress.intro}
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {academicProgress.semesters.map((sem) => {
            const isUpcoming = sem.status === "Upcoming";
            return (
              <motion.div
                key={sem.sem}
                variants={fadeUp}
                className="rounded-lg border border-hairline bg-card p-6 transition-colors duration-300 hover:border-text-secondary"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-baseline gap-1.5 font-display text-2xl text-text">
                    {sem.sem}
                    <span className="label-caps text-text-secondary">Sem</span>
                  </span>
                  <span
                    className={`label-caps rounded-full px-3 py-1 ${
                      isUpcoming
                        ? "border border-hairline text-text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {sem.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 divide-x divide-hairline rounded border border-hairline bg-bg">
                  <div className="px-4 py-3 text-center">
                    <p className="font-display text-xl text-text">{sem.sgpa ?? "—"}</p>
                    <p className="mt-0.5 label-caps text-text-secondary">SGPA</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="font-display text-xl text-text">{sem.cgpa ?? "—"}</p>
                    <p className="mt-0.5 label-caps text-text-secondary">CGPA</p>
                  </div>
                </div>

                {sem.subjects.length > 0 && (
                  <div className="mt-5">
                    <p className="label-caps text-text-secondary mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sem.subjects.map((s) => (
                        <Chip key={s} className="text-xs py-1">
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <Button
                    as="a"
                    href={sem.marksheetUrl || undefined}
                    download
                    variant="secondary"
                    size="sm"
                    disabled={!sem.marksheetUrl}
                    className="flex-1"
                  >
                    <FiFileText size={14} /> Marksheet
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!sem.marksheetUrl}
                    onClick={() => setPreviewSem(sem)}
                    className="flex-1"
                  >
                    <FiEye size={14} /> Preview
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <Modal
        open={!!previewSem}
        onClose={() => setPreviewSem(null)}
        title={previewSem ? `Semester ${previewSem.sem} — Marksheet` : ""}
      >
        {previewSem && (
          <div className="aspect-[1/1.3] w-full rounded-lg border border-hairline bg-bg overflow-hidden">
            <object data={previewSem.marksheetUrl} type="application/pdf" className="h-full w-full">
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-text-secondary">
                Add the marksheet PDF to <code className="text-data text-xs">/public{previewSem.marksheetUrl}</code> to enable preview.
              </div>
            </object>
          </div>
        )}
      </Modal>
    </section>
  );
}