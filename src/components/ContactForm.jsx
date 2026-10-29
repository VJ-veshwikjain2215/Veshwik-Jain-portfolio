import { useEffect, useState } from "react";
import Button from "./Button";
import { CONTACT_API_URL } from "../config";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};
const FIELD_CLASS =
  "w-full rounded border bg-bg px-4 py-3 text-sm text-text placeholder:text-text-secondary/60 transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent";
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.subject.trim()) errors.subject = "Add a subject.";
  if (values.message.trim().length < 10)
    errors.message = "Write a message of at least 10 characters.";
  return errors;
}
async function contactRequest(path, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${CONTACT_API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(
        data.error || "Unable to process your request. Please try again.",
      );
      error.code = data.code;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
export default function ContactForm() {
  const [values, setValues] = useState(initialValues),
    [errors, setErrors] = useState({}),
    [touched, setTouched] = useState({});
  const [challenge, setChallenge] = useState(null),
    [code, setCode] = useState(""),
    [status, setStatus] = useState("idle"),
    [notice, setNotice] = useState(""),
    [seconds, setSeconds] = useState(0);
  const busy = status === "requesting" || status === "sending";
  useEffect(() => {
    if (!challenge) {
      setSeconds(0);
      return;
    }
    const tick = () =>
      setSeconds(
        Math.max(0, Math.ceil((challenge.resendAt - Date.now()) / 1000)),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [challenge]);
  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    setNotice("");
    if (
      name === "email" &&
      value.trim().toLowerCase() !== values.email.trim().toLowerCase()
    ) {
      setChallenge(null);
      setCode("");
    }
    if (touched[name]) setErrors(validate(next));
  }
  function handleBlur(event) {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validate(values));
  }
  async function requestCode() {
    setStatus("requesting");
    setNotice("");
    try {
      const result = await contactRequest("request-code", {
        email: values.email.trim(),
        website: values.website,
      });
      setChallenge({
        id: result.challengeId,
        resendAt: Date.now() + result.retryAfter * 1000,
      });
      setCode("");
    } catch (error) {
      setNotice(
        error.code
          ? error.message
          : "Unable to send a code right now. Please try later or email Veshwik directly.",
      );
    } finally {
      setStatus("idle");
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const validation = validate(values);
    setErrors(validation);
    setTouched({ name: true, email: true, subject: true, message: true });
    setNotice("");
    if (Object.keys(validation).length) return;
    if (!challenge) {
      await requestCode();
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setNotice("Enter the six-digit code from your email.");
      return;
    }
    setStatus("sending");
    try {
      await contactRequest("submit", {
        ...values,
        email: values.email.trim(),
        challengeId: challenge.id,
        code,
      });
      setValues(initialValues);
      setChallenge(null);
      setCode("");
      setTouched({});
      setErrors({});
      setStatus("sent");
    } catch (error) {
      if (error.code === "expired") {
        setChallenge(null);
        setCode("");
      }
      setNotice(
        error.code
          ? error.message
          : "Unable to confirm delivery. Please try again or email Veshwik directly.",
      );
      setStatus("idle");
    }
  }
  if (status === "sent")
    return (
      <div role="status" className="flex flex-col gap-5">
        <h3>Message sent.</h3>
        <p>
          Your email was confirmed and your message has been sent. Thank you for
          getting in touch.
        </p>
        <Button type="button" onClick={() => setStatus("idle")}>
          Write another message
        </Button>
      </div>
    );
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <fieldset
        disabled={busy}
        className="flex flex-col gap-5 min-w-0 border-0 p-0 m-0"
      >
        <legend className="sr-only">Contact Veshwik Jain</legend>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Leave this blank</label>
          <input
            id="website"
            name="website"
            value={values.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            ["name", "Name", "text", "Your name", 100],
            ["email", "Email", "email", "you@example.com", 254],
          ].map(([name, label, type, placeholder, maxLength]) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="label-caps mb-1.5 block text-text-secondary"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                maxLength={maxLength}
                autoComplete={name === "name" ? "name" : "email"}
                value={values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                aria-invalid={!!(errors[name] && touched[name])}
                aria-describedby={
                  errors[name] && touched[name] ? `${name}-error` : undefined
                }
                className={FIELD_CLASS}
              />
              {errors[name] && touched[name] && (
                <p id={`${name}-error`} className="mt-1.5 text-xs text-red-500">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div>
          <label
            htmlFor="subject"
            className="label-caps mb-1.5 block text-text-secondary"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            maxLength={160}
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="What's this about?"
            aria-invalid={!!(errors.subject && touched.subject)}
            aria-describedby={
              errors.subject && touched.subject ? "subject-error" : undefined
            }
            className={FIELD_CLASS}
          />
          {errors.subject && touched.subject && (
            <p id="subject-error" className="mt-1.5 text-xs text-red-500">
              {errors.subject}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="message"
            className="label-caps mb-1.5 block text-text-secondary"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={4000}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell me a bit about the role, project, or question..."
            aria-invalid={!!(errors.message && touched.message)}
            aria-describedby={
              errors.message && touched.message ? "message-error" : undefined
            }
            className={`${FIELD_CLASS} resize-none`}
          />
          {errors.message && touched.message && (
            <p id="message-error" className="mt-1.5 text-xs text-red-500">
              {errors.message}
            </p>
          )}
        </div>
        {challenge && (
          <div className="flex flex-col gap-3">
            <p id="code-help" role="status" className="text-sm">
              A verification code was sent to {values.email}. Enter it below to
              confirm your inbox and send your message. It expires in 10
              minutes.
            </p>
            <label
              htmlFor="verification-code"
              className="label-caps block text-text-secondary"
            >
              Six-digit email code
            </label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                setNotice("");
              }}
              aria-describedby="code-help code-delivery-help"
              className={FIELD_CLASS}
            />
            <p id="code-delivery-help" className="text-sm text-text-secondary">
              Can't find the code? Check your Spam or Junk folder.
            </p>
            <button
              type="button"
              disabled={seconds > 0}
              onClick={requestCode}
              className="text-sm underline self-start disabled:opacity-50"
            >
              {seconds > 0
                ? `Resend code in ${seconds}s`
                : "Resend verification code"}
            </button>
          </div>
        )}
        <div className="flex flex-col items-start gap-3">
          <Button type="submit" variant="primary" disabled={busy}>
            {status === "requesting"
              ? "Sending code..."
              : status === "sending"
                ? "Verifying & sending..."
                : challenge
                  ? "Verify & send message"
                  : "Send verification code"}
          </Button>
          <span className="text-xs text-text-secondary">
            {challenge
              ? "Your message is sent only after the code is confirmed."
              : "First, confirm your email with a one-time code."}
          </span>
        </div>
      </fieldset>
      {notice && (
        <p role="alert" className="text-sm text-red-600">
          {notice}
        </p>
      )}
    </form>
  );
}
