import { createServer } from "node:http";
import { ContactError } from "./verification.js";

export function createContactServer({ service, allowedOrigins }) {
  const origins = new Set(allowedOrigins);
  return createServer(async (req, res) => {
    const origin = req.headers.origin;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Vary", "Origin");
    const json = (status, body) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(body));
    };
    if (req.url === "/health" && req.method === "GET")
      return json(200, { ok: true, emailConfigured: service.configured });
    if (!origins.has(origin))
      return json(403, {
        error: "This request is not allowed.",
        code: "origin",
      });
    res.setHeader("Access-Control-Allow-Origin", origin);
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== "POST")
      return json(405, { error: "Use POST for this request.", code: "method" });
    const action =
      req.url === "/api/contact/request-code"
        ? "request"
        : req.url === "/api/contact/submit"
          ? "submit"
          : null;
    if (!action) return json(404, { error: "Not found.", code: "not_found" });
    if (
      !req.headers["content-type"]?.toLowerCase().startsWith("application/json")
    )
      return json(415, { error: "Send JSON data.", code: "content_type" });
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size <= 20000) chunks.push(chunk);
      }
      if (size > 20000)
        throw new ContactError(413, "too_large", "Your message is too long.");
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        throw new ContactError(
          400,
          "invalid",
          "Check your form and try again.",
        );
      }
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new ContactError(
          400,
          "invalid",
          "Check your form and try again.",
        );
      json(200, await service[action](body));
    } catch (error) {
      if (!res.writableEnded)
        json(error instanceof ContactError ? error.status : 500, {
          error:
            error instanceof ContactError
              ? error.message
              : "Unable to process your request. Please try later.",
          code: error instanceof ContactError ? error.code : "internal",
        });
    }
  });
}
