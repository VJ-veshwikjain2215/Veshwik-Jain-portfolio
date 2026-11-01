import test from "node:test";
import assert from "node:assert/strict";
import { createVerificationService, normalizeEmail } from "./verification.js";
import { createContactServer } from "./server.js";

function fixture(options = {}) {
  let time = 1000000;
  const sent = [];
  const service = createVerificationService({
    from: "sender@example.com",
    to: "owner@example.com",
    now: () => time,
    sendMail: async (mail) => {
      sent.push(mail);
    },
    ...options,
  });
  return {
    service,
    sent,
    advance: (ms) => {
      time += ms;
    },
    code: () =>
      sent
        .findLast((mail) => mail.to === "visitor@example.com")
        ?.text.match(/code is: (\d{6})/)[1],
  };
}
const fields = {
  name: "Visitor",
  email: "visitor@example.com",
  subject: "An internship",
  message: "I would like to discuss a role.",
};
const rejects = (action, code) =>
  assert.rejects(action, (error) => error.code === code);

test("only a confirmed code sends a message; a successful code cannot be replayed", async () => {
  const f = fixture(),
    challenge = await f.service.request({ email: fields.email });
  assert.equal(f.sent.length, 1);
  assert.equal(f.sent[0].to, fields.email);
  assert.ok(!JSON.stringify(challenge).includes(f.code()));
  const wrong = String((Number(f.code()) + 1) % 1000000).padStart(6, "0");
  await rejects(
    () =>
      f.service.submit({
        ...fields,
        challengeId: challenge.challengeId,
        code: wrong,
      }),
    "code",
  );
  assert.equal(f.sent.length, 1);
  const payload = {
    ...fields,
    challengeId: challenge.challengeId,
    code: f.code(),
  };
  assert.deepEqual(await f.service.submit(payload), { sent: true });
  assert.equal(f.sent[1].to, "owner@example.com");
  assert.equal(f.sent[1].replyTo, fields.email);
  await rejects(() => f.service.submit(payload), "expired");
  assert.equal(f.sent.length, 2);
});
test("changing the email, expiry, and five incorrect guesses prevent sending", async () => {
  const f = fixture(),
    challenge = await f.service.request({ email: fields.email });
  await rejects(
    () =>
      f.service.submit({
        ...fields,
        email: "other@example.com",
        challengeId: challenge.challengeId,
        code: f.code(),
      }),
    "expired",
  );
  const wrong = String((Number(f.code()) + 1) % 1000000).padStart(6, "0");
  for (let i = 0; i < 5; i++)
    await rejects(
      () =>
        f.service.submit({
          ...fields,
          challengeId: challenge.challengeId,
          code: wrong,
        }),
      i === 4 ? "expired" : "code",
    );
  await rejects(
    () =>
      f.service.submit({
        ...fields,
        challengeId: challenge.challengeId,
        code: f.code(),
      }),
    "expired",
  );
  f.advance(60001);
  const next = await f.service.request({ email: fields.email });
  f.advance(600001);
  await rejects(
    () =>
      f.service.submit({
        ...fields,
        challengeId: next.challengeId,
        code: f.code(),
      }),
    "expired",
  );
  assert.equal(
    f.sent.filter((mail) => mail.to === "owner@example.com").length,
    0,
  );
});
test("resends are cooled down and invalidate the older challenge", async () => {
  const f = fixture(),
    first = await f.service.request({ email: fields.email });
  await rejects(() => f.service.request({ email: fields.email }), "rate_limit");
  f.advance(60001);
  await f.service.request({ email: fields.email });
  await rejects(
    () =>
      f.service.submit({
        ...fields,
        challengeId: first.challengeId,
        code: f.code(),
      }),
    "expired",
  );
});
test("requests without SMTP fail closed and malformed addresses are rejected", async () => {
  await rejects(
    () => createVerificationService().request({ email: fields.email }),
    "unavailable",
  );
  for (const value of [
    "bad",
    "a..b@example.com",
    "a@-bad.com",
    "x@example.com\r\nBcc:a@b.com",
  ])
    assert.throws(() => normalizeEmail(value));
  assert.equal(normalizeEmail("  Visitor@Example.com  "), fields.email);
});
test("provider failures do not mark messages sent and delivery can be retried", async () => {
  let failing = true;
  const f = fixture({
    sendMail: async (mail) => {
      if (mail.to === "owner@example.com" && failing)
        throw Error("private-provider-error");
      f.sent.push(mail);
    },
  });
  const c = await f.service.request({ email: fields.email });
  const payload = { ...fields, challengeId: c.challengeId, code: f.code() };
  await rejects(() => f.service.submit(payload), "unavailable");
  failing = false;
  await f.service.submit(payload);
  assert.equal(f.sent.length, 2);
});
test("daily email budget limits both codes and notifications", async () => {
  const f = fixture({ maxMailsPerDay: 2 }),
    c = await f.service.request({ email: fields.email });
  await f.service.submit({
    ...fields,
    challengeId: c.challengeId,
    code: f.code(),
  });
  await rejects(
    () => f.service.request({ email: "other@example.com" }),
    "rate_limit",
  );
  assert.equal(f.sent.length, 2);
});
test("concurrent submits cannot deliver the same message twice", async () => {
  let release;
  const f = fixture({
    sendMail: async (mail) => {
      if (mail.to === "owner@example.com")
        await new Promise((resolve) => {
          release = resolve;
        });
      f.sent.push(mail);
    },
  });
  const c = await f.service.request({ email: fields.email }),
    payload = { ...fields, challengeId: c.challengeId, code: f.code() };
  const first = f.service.submit(payload);
  await rejects(() => f.service.submit(payload), "busy");
  release();
  await first;
  assert.equal(
    f.sent.filter((mail) => mail.to === "owner@example.com").length,
    1,
  );
});
test("HTTP API enforces origin, JSON, size limits, and the complete code/message flow", async (t) => {
  const f = fixture(),
    origin = "https://portfolio.example.com";
  const server = createContactServer({
    service: f.service,
    allowedOrigins: [origin],
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body, headers = {}) =>
    fetch(url + path, {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  assert.equal(
    (
      await post(
        "/api/contact/request-code",
        { email: fields.email },
        { Origin: "https://attacker.example" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await post(
        "/api/contact/request-code",
        {},
        { "Content-Type": "text/plain" },
      )
    ).status,
    415,
  );
  assert.equal(
    (await post("/api/contact/request-code", { excess: "a".repeat(20001) }))
      .status,
    413,
  );
  const requested = await post("/api/contact/request-code", {
    email: fields.email,
  });
  assert.equal(requested.status, 200);
  const { challengeId } = await requested.json();
  const response = await post("/api/contact/submit", {
    ...fields,
    message: "A Unicode message: नमस्ते — hello!",
    challengeId,
    code: f.code(),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(f.sent[1].replyTo, fields.email);
});
