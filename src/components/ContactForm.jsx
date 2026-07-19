import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheck } from "react-icons/fi";
import Button from "./Button";

const initialValues = { name: "", email: "", subject: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Add a subject.";
  if (!values.message.trim()) {
    errors.message = "Write a short message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

const FIELD_CLASS =
  "w-full rounded-lg border bg-bg px-4 py-3 text-sm text-text placeholder:text-text-secondary/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name]) {
      setErrors(validate({ ...values, [name]: value }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xnjedlpn", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("sent");
      setValues(initialValues);
      setTouched({});
      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      setStatus("idle");
      alert("Something went wrong. Please try again or email me directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-text-secondary">
            name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${FIELD_CLASS} ${errors.name && touched.name ? "border-red-400" : "border-hairline"}`}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-text-secondary">
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${FIELD_CLASS} ${errors.email && touched.email ? "border-red-400" : "border-hairline"}`}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block font-mono text-xs text-text-secondary">
          subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="What's this about?"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`${FIELD_CLASS} ${errors.subject && touched.subject ? "border-red-400" : "border-hairline"}`}
        />
        {errors.subject && touched.subject && (
          <p id="subject-error" className="mt-1.5 text-xs text-red-500">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-text-secondary">
          message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell me a bit about the role, project, or question..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${FIELD_CLASS} resize-none ${errors.message && touched.message ? "border-red-400" : "border-hairline"}`}
        />
        {errors.message && touched.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" disabled={status === "sending"} data-cursor-hover>
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <FiCheck size={16} /> Message sent
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <FiSend size={16} /> {status === "sending" ? "Sending..." : "Send message"}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <span className="text-xs text-text-secondary">I usually reply within a day or two.</span>
      </div>
    </form>
  );
}
