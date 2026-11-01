import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

export class ContactError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export function normalizeEmail(value) {
  if (typeof value !== "string")
    throw new ContactError(400, "email", "Enter a valid email address.");
  const email = value.trim().toLowerCase();
  const parts = email.split("@");
  if (
    email.length > 254 ||
    parts.length !== 2 ||
    !parts[0] ||
    parts[0].length > 64 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(parts[0]) ||
    parts[0].startsWith(".") ||
    parts[0].endsWith(".") ||
    parts[0].includes("..") ||
    !parts[1].includes(".") ||
    parts[1]
      .split(".")
      .some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
  ) {
    throw new ContactError(400, "email", "Enter a valid email address.");
  }
  return email;
}
const unavailable = () =>
  new ContactError(
    503,
    "unavailable",
    "Email verification is unavailable right now. Please email Veshwik directly.",
  );
const invalidCode = () =>
  new ContactError(
    401,
    "code",
    "The code is incorrect. Check your inbox and try again.",
  );
const expiredCode = () =>
  new ContactError(
    410,
    "expired",
    "This code has expired or was already used. Request a new one.",
  );
const tooMany = () =>
  new ContactError(
    429,
    "rate_limit",
    "Too many requests. Please wait and try again later.",
  );

export function createVerificationService({
  sendMail,
  from,
  to,
  now = Date.now,
  secret = randomBytes(32),
  maxMailsPerDay = 100,
} = {}) {
  const challenges = new Map(),
    limits = new Map();
  const ttl = 10 * 60 * 1000;
  let day = -1,
    sentToday = 0;
  const configured = typeof sendMail === "function" && !!from && !!to;
  const digest = (id, email, code) =>
    createHmac("sha256", secret)
      .update(JSON.stringify([id, email, code]))
      .digest();
  const cleanup = () => {
    for (const [id, entry] of challenges)
      if (entry.expires <= now()) challenges.delete(id);
    for (const [email, entry] of limits)
      if (entry.start + 3600000 <= now()) limits.delete(email);
  };
  async function deliver(message) {
    if (!configured) throw unavailable();
    const today = Math.floor(now() / 86400000);
    if (day !== today) {
      day = today;
      sentToday = 0;
    }
    if (sentToday >= maxMailsPerDay) throw tooMany();
    sentToday++;
    try {
      await sendMail(message);
    } catch {
      throw unavailable();
    }
  }
  return {
    configured,
    async request({ email, website = "" } = {}) {
      if (!configured) throw unavailable();
      if (website)
        throw new ContactError(
          400,
          "invalid",
          "Unable to process this request.",
        );
      email = normalizeEmail(email);
      cleanup();
      const rate = limits.get(email);
      if (rate && (now() - rate.last < 60000 || rate.count >= 3))
        throw tooMany();
      if ((!rate && limits.size >= 1000) || challenges.size >= 500)
        throw tooMany();
      limits.set(email, {
        start: rate?.start ?? now(),
        last: now(),
        count: (rate?.count ?? 0) + 1,
      });
      const id = randomBytes(24).toString("hex"),
        code = String(randomInt(0, 1000000)).padStart(6, "0");
      const entry = {
        email,
        hash: digest(id, email, code),
        expires: now() + ttl,
        attempts: 0,
        state: "sending_code",
      };
      challenges.set(id, entry);
      try {
        await deliver({
          from,
          to: email,
          subject: "Your Veshwik Jain portfolio verification code",
          text: `Your verification code is: ${code}\n\nEnter it on Veshwik Jain's portfolio to confirm your email and send your message. It expires in 10 minutes.\n\nIf you did not request this code, ignore this email. No message will be accepted without confirmation.`,
        });
      } catch (error) {
        challenges.delete(id);
        throw error;
      }
      for (const [key, other] of challenges)
        if (key !== id && other.email === email) challenges.delete(key);
      entry.state = "ready";
      return { challengeId: id, expiresIn: 600, retryAfter: 60 };
    },
    async submit({
      challengeId,
      code,
      name,
      email,
      subject,
      message,
      website = "",
    } = {}) {
      if (!configured) throw unavailable();
      if (website)
        throw new ContactError(
          400,
          "invalid",
          "Unable to process this request.",
        );
      email = normalizeEmail(email);
      const fields = {
        name: [name, 1, 100],
        subject: [subject, 1, 160],
        message: [message, 10, 4000],
      };
      for (const [field, [value, min, max]] of Object.entries(fields)) {
        if (
          typeof value !== "string" ||
          value.trim().length < min ||
          value.length > max ||
          value.includes("\0") ||
          (field !== "message" && /[\r\n]/.test(value))
        )
          throw new ContactError(
            400,
            field,
            `Check the ${field} field and try again.`,
          );
      }
      cleanup();
      const entry =
        typeof challengeId === "string" ? challenges.get(challengeId) : null;
      if (!entry || entry.email !== email) throw expiredCode();
      if (entry.state !== "ready")
        throw new ContactError(
          409,
          "busy",
          "Your request is already being processed. Please wait.",
        );
      if (
        typeof code !== "string" ||
        !/^\d{6}$/.test(code) ||
        !timingSafeEqual(entry.hash, digest(challengeId, email, code))
      ) {
        entry.attempts++;
        if (entry.attempts >= 5) {
          challenges.delete(challengeId);
          throw expiredCode();
        }
        throw invalidCode();
      }
      entry.state = "sending_message";
      try {
        await deliver({
          from,
          to,
          replyTo: email,
          subject: `[Portfolio] ${subject.trim()}`,
          text: `Verified contact message\n\nFrom: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}`,
        });
      } catch (error) {
        entry.state = "ready";
        throw error;
      }
      challenges.delete(challengeId);
      return { sent: true };
    },
  };
}
