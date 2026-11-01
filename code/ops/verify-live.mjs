import assert from "node:assert/strict";

const base = "https://veshwikjain.embarko.app";
let checks = 0;
function check(condition, label) {
  assert.ok(condition, label);
  checks++;
  console.log(`PASS ${label}`);
}
async function get(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(35000) });
}

const homepage = await get(base);
check(homepage.ok, "portfolio homepage loads");
const html = await homepage.text();
const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map(
  (match) => match[1],
);
check(scripts.length > 0, "production JavaScript entry exists");
let bundle = "";
for (const script of scripts) {
  const reply = await get(new URL(script, base));
  check(
    reply.ok && /javascript/.test(reply.headers.get("content-type")),
    "JavaScript asset loads with the correct type",
  );
  bundle += await reply.text();
}
for (const [url, title] of [
  ["https://countcheck.embarko.app/", /CountCheck/i],
  ["https://veshwik-truevoice.embarko.app/", /TrueVoice/i],
  ["https://veshwik-secure-crypt.embarko.app/", /SecureCrypt/i],
  ["https://veshwik-civic-reporter.embarko.app/", /Civic Issue Reporter/i],
]) {
  check(bundle.includes(url), `published bundle contains ${url}`);
  const reply = await get(url);
  const body = await reply.text();
  check(
    reply.ok &&
      title.test(body.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] || ""),
    `live project loads the expected application: ${url}`,
  );
}
for (const old of [
  "true-voice-nine.vercel.app",
  "civic-issue-reporter-1-zxms.onrender.com",
])
  check(!bundle.includes(old), `obsolete destination removed: ${old}`);
check(
  bundle.includes("https://github.com/VJ-veshwikjain2215/FlowFund") &&
    bundle.includes("No public live site"),
  "FlowFund source and unavailable-deployment explanation are shipped",
);

for (const path of [
  "/about",
  "/contact",
  "/project/CountCheck",
  "/project/TrueVoice",
  "/project/Secure-Crypt",
  "/project/RupeeRakshak",
  "/project/Civic%20Issue%20Reporter",
  "/missing",
  "/project/missing",
]) {
  const reply = await get(base + path);
  check(
    reply.ok && (await reply.text()).includes(scripts[0]),
    `direct route serves the current SPA: ${path}`,
  );
}
for (const path of [
  "/resume.pdf",
  "/marksheets/1st_sem.pdf",
  "/marksheets/2nd_sem.pdf",
  "/marksheets/3rd_sem.pdf",
]) {
  const reply = await get(base + path);
  const bytes = new Uint8Array(await reply.arrayBuffer());
  check(
    reply.ok && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-",
    `document is a real PDF: ${path}`,
  );
}
const styles = [...html.matchAll(/href="([^"]+\.css)"/g)].map(
  (match) => match[1],
);
check(styles.length > 0, "production stylesheet exists");
for (const path of styles) {
  const reply = await get(new URL(path, base));
  check(
    reply.ok && /text\/css/.test(reply.headers.get("content-type")),
    "production stylesheet loads",
  );
}
const images = new Set(
  [
    ...bundle.matchAll(
      /(?:["'`])((?:\/assets\/)[^"'`]+\.(?:png|jpg))(?:["'`])/g,
    ),
  ].map((match) => match[1]),
);
check(images.size >= 5, "all five project screenshots are bundled");
for (const path of images) {
  const reply = await get(base + path);
  check(
    reply.ok && reply.headers.get("content-type")?.startsWith("image/"),
    `image loads: ${path}`,
  );
}
for (const path of ["/favicon.svg", "/og-cover.svg", "/robots.txt"]) {
  const reply = await get(base + path);
  check(
    reply.ok && !/text\/html/.test(reply.headers.get("content-type")),
    `public asset loads: ${path}`,
  );
}

const contact = "https://veshwikjain-contact.embarko.app";
const health = await get(contact + "/health");
const info = await health.json();
check(
  health.ok && info.ok && info.emailConfigured,
  "contact backend is healthy with SMTP configured",
);
const preflight = await get(contact + "/api/contact/request-code", {
  method: "OPTIONS",
  headers: {
    Origin: base,
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type",
  },
});
check(
  preflight.status === 204 &&
    preflight.headers.get("access-control-allow-origin") === base,
  "contact backend allows the portfolio origin",
);
const blocked = await get(contact + "/api/contact/request-code", {
  method: "OPTIONS",
  headers: { Origin: "https://untrusted.example" },
});
check(
  blocked.status === 403 && !blocked.headers.has("access-control-allow-origin"),
  "contact backend rejects unrelated origins",
);
// Invalid payloads exercise validation and cannot request email or submit a message.
for (const action of ["request-code", "submit"]) {
  const reply = await get(contact + "/api/contact/" + action, {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: "{}",
  });
  check(
    reply.status === 400 && (await reply.json()).code === "email",
    `contact rejects empty ${action} payload without sending email`,
  );
}
console.log(
  `Completed ${checks} live HTTP checks. DOM interactions are covered separately; this script does not verify visual layout, Canvas rendering, or real email delivery.`,
);
