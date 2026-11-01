import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

function response(data, ok = true) {
  return { ok, json: async () => data };
}
async function fill(user) {
  await user.type(
    screen.getByRole("textbox", { name: "Name" }),
    "Test Visitor",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "visitor@example.test",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Subject" }),
    "Portfolio test",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Message" }),
    "Synthetic test message for local checks.",
  );
}

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));

describe("contact form interaction without real email", () => {
  it("validates required fields before contacting the backend", async () => {
    render(<ContactForm />);
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Send verification code" }));
    for (const message of [
      "Enter your name.",
      "Enter a valid email address.",
      "Add a subject.",
      "Write a message of at least 10 characters.",
    ])
      expect(screen.getByText(message)).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requests a code, prevents incomplete verification, sends once confirmed, and resets", async () => {
    fetch
      .mockResolvedValueOnce(
        response({ challengeId: "test-id", retryAfter: 60 }),
      )
      .mockResolvedValueOnce(response({ ok: true }));
    render(<ContactForm />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(
      screen.getByRole("button", { name: "Send verification code" }),
    );
    expect(
      await screen.findByRole("textbox", { name: "Six-digit email code" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Resend code in/ }).disabled,
    ).toBe(true);
    await user.click(
      screen.getByRole("button", { name: "Verify & send message" }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Enter the six-digit code",
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    await user.type(
      screen.getByRole("textbox", { name: "Six-digit email code" }),
      "123456",
    );
    await user.click(
      screen.getByRole("button", { name: "Verify & send message" }),
    );
    expect(await screen.findByText("Message sent.")).toBeTruthy();
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({
      email: "visitor@example.test",
      challengeId: "test-id",
      code: "123456",
      subject: "Portfolio test",
    });
    await user.click(
      screen.getByRole("button", { name: "Write another message" }),
    );
    expect(screen.getByRole("textbox", { name: "Email" }).value).toBe("");
  });

  it("invalidates the challenge when the visitor changes their email", async () => {
    fetch.mockResolvedValue(
      response({ challengeId: "test-id", retryAfter: 60 }),
    );
    render(<ContactForm />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(
      screen.getByRole("button", { name: "Send verification code" }),
    );
    await screen.findByRole("textbox", { name: "Six-digit email code" });
    await user.type(screen.getByRole("textbox", { name: "Email" }), "x");
    expect(
      screen.queryByRole("textbox", { name: "Six-digit email code" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Send verification code" }),
    ).toBeTruthy();
  });

  it("shows request failures and permits retry without losing the message", async () => {
    fetch
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce(
        response({ challengeId: "retry-id", retryAfter: 60 }),
      );
    render(<ContactForm />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(
      screen.getByRole("button", { name: "Send verification code" }),
    );
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Message" }).value).toContain(
      "Synthetic test",
    );
    await user.click(
      screen.getByRole("button", { name: "Send verification code" }),
    );
    expect(
      await screen.findByRole("textbox", { name: "Six-digit email code" }),
    ).toBeTruthy();
  });

  it("expires a rejected code and requires a new challenge", async () => {
    fetch
      .mockResolvedValueOnce(
        response({ challengeId: "test-id", retryAfter: 60 }),
      )
      .mockResolvedValueOnce(
        response(
          { error: "Code expired. Request another.", code: "expired" },
          false,
        ),
      );
    render(<ContactForm />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(
      screen.getByRole("button", { name: "Send verification code" }),
    );
    await user.type(
      await screen.findByRole("textbox", { name: "Six-digit email code" }),
      "123456",
    );
    await user.click(
      screen.getByRole("button", { name: "Verify & send message" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("Code expired"),
    );
    expect(
      screen.queryByRole("textbox", { name: "Six-digit email code" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Send verification code" }),
    ).toBeTruthy();
  });
});
