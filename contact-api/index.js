import nodemailer from "nodemailer";
import { createVerificationService, normalizeEmail } from "./verification.js";
import { createContactServer } from "./server.js";

const smtpReady = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.CONTACT_FROM &&
  process.env.CONTACT_TO
);
const port = Number(process.env.PORT || 5184);
const smtpPort = Number(process.env.SMTP_PORT || 465);
const transport = smtpReady
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: { minVersion: "TLSv1.2" },
    })
  : null;
const service = createVerificationService({
  sendMail: transport
    ? async (message) => {
        const result = await transport.sendMail(message);
        if (result.rejected?.length) throw new Error("Delivery rejected");
      }
    : undefined,
  from: smtpReady ? normalizeEmail(process.env.CONTACT_FROM) : undefined,
  to: smtpReady ? normalizeEmail(process.env.CONTACT_TO) : undefined,
});
const allowedOrigins = (
  process.env.CONTACT_ALLOWED_ORIGINS || "https://veshwikjain.embarko.app"
)
  .split(",")
  .map((value) => new URL(value.trim()).origin);
const server = createContactServer({ service, allowedOrigins });
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(port, "0.0.0.0", () =>
  console.log(
    `Contact API listening on port ${port}; email ${smtpReady ? "configured" : "not configured"}.`,
  ),
);
process.on("SIGTERM", () => {
  server.close();
  transport?.close();
});
