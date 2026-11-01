import { act, fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteCursor from "./SiteCursor";

let desktop;
let reduced;
let frames;
let nextFrame;
let mediaChange;
function move(x, y, type = "mouse") {
  const event = new MouseEvent("pointermove", {
    bubbles: true,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, "pointerType", { value: type });
  fireEvent(document, event);
}
function flush() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback());
  });
}
beforeEach(() => {
  desktop = true;
  reduced = false;
  frames = new Map();
  nextFrame = 1;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    get matches() {
      return query.includes("prefers-reduced-motion") ? reduced : desktop;
    },
    addEventListener: vi.fn((_event, callback) => {
      mediaChange = callback;
    }),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback) => {
      const id = nextFrame++;
      frames.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id) => frames.delete(id)),
  );
});

describe("site-wide pointer", () => {
  it("positions the CLICK circle on desktop and coalesces repeated moves into one frame", () => {
    render(<SiteCursor />);
    const cursor = document.querySelector(".site-cursor");
    expect(
      document.documentElement.classList.contains("custom-cursor-ready"),
    ).toBe(false);
    move(100, 150);
    expect(cursor.textContent).toBe("CLICK");
    expect(cursor.dataset.visible).toBe("true");
    expect(cursor.style.transform).toContain("100px, 150px");
    expect(
      document.documentElement.classList.contains("custom-cursor-ready"),
    ).toBe(true);
    move(200, 250);
    move(300, 350);
    expect(frames.size).toBe(1);
    flush();
    expect(cursor.style.transform).toContain("300px, 350px");
    expect(cursor.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses immediate tracking without animated frames for reduced motion", () => {
    reduced = true;
    render(<SiteCursor />);
    move(100, 150);
    move(200, 250);
    expect(document.querySelector(".site-cursor").style.transform).toContain(
      "200px, 250px",
    );
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("keeps the native cursor for touch and coarse devices, including media changes", () => {
    render(<SiteCursor />);
    move(20, 30);
    move(40, 50, "touch");
    expect(document.querySelector(".site-cursor").dataset.visible).toBe(
      "false",
    );
    expect(
      document.documentElement.classList.contains("custom-cursor-ready"),
    ).toBe(false);
    desktop = false;
    move(50, 60);
    expect(frames.size).toBe(0);
    desktop = true;
    move(20, 30);
    desktop = false;
    act(() => mediaChange());
    expect(document.querySelector(".site-cursor").dataset.visible).toBe(
      "false",
    );
  });

  it("restores the native pointer for keyboard/window exit and releases all work on unmount", () => {
    const { unmount } = render(<SiteCursor />);
    move(10, 20);
    move(30, 40);
    expect(frames.size).toBe(1);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(frames.size).toBe(0);
    expect(
      document.documentElement.classList.contains("custom-cursor-ready"),
    ).toBe(false);
    move(10, 20);
    fireEvent.blur(window);
    expect(document.querySelector(".site-cursor").dataset.visible).toBe(
      "false",
    );
    move(10, 20);
    fireEvent.pointerOut(document, { relatedTarget: null });
    expect(document.querySelector(".site-cursor").dataset.visible).toBe(
      "false",
    );
    move(10, 20);
    move(30, 40);
    unmount();
    expect(frames.size).toBe(0);
    move(50, 60);
    expect(
      document.documentElement.classList.contains("custom-cursor-ready"),
    ).toBe(false);
    expect(document.querySelector(".site-cursor")).toBeNull();
  });
});
