import { act, fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScrollStatement from "./ScrollStatement";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("framer-motion", () => ({
  useReducedMotion: () => preference.reduced,
}));

let intersect;
let disconnect;
let frames;
let nextFrame;
function flush() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback());
  });
}
beforeEach(() => {
  preference.reduced = false;
  frames = new Map();
  nextFrame = 1;
  disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (callback) {
      intersect = callback;
      this.observe = vi.fn();
      this.disconnect = disconnect;
    }),
  );
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

describe("scroll statement scheduling", () => {
  it("updates words near the viewport and coalesces scroll/resize events into one frame", () => {
    const { container } = render(
      <ScrollStatement>One two three four</ScrollStatement>,
    );
    const paragraph = container.querySelector("p");
    const bounds = vi.spyOn(paragraph, "getBoundingClientRect");
    bounds.mockReturnValue({ top: window.innerHeight });
    fireEvent.scroll(window);
    expect(frames.size).toBe(0);
    act(() => intersect([{ isIntersecting: true }]));
    flush();
    expect(container.querySelectorAll(".on")).toHaveLength(0);
    bounds.mockReturnValue({ top: window.innerHeight * 0.515 });
    const reads = bounds.mock.calls.length;
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(frames.size).toBe(1);
    expect(bounds.mock.calls.length).toBe(reads);
    flush();
    expect(container.querySelectorAll(".on")).toHaveLength(2);
    bounds.mockReturnValue({ top: 0 });
    fireEvent.scroll(window);
    flush();
    expect(container.querySelectorAll(".on")).toHaveLength(4);
  });

  it("cancels pending work and stops listening offscreen and on unmount", () => {
    const { unmount } = render(
      <ScrollStatement>One two three four</ScrollStatement>,
    );
    act(() => intersect([{ isIntersecting: true }]));
    expect(frames.size).toBe(1);
    act(() => intersect([{ isIntersecting: false }]));
    expect(frames.size).toBe(0);
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(frames.size).toBe(0);
    act(() => intersect([{ isIntersecting: true }]));
    expect(frames.size).toBe(1);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    fireEvent.scroll(window);
    expect(frames.size).toBe(0);
  });

  it("shows every word immediately and schedules no animation for reduced motion", () => {
    preference.reduced = true;
    const { container } = render(
      <ScrollStatement>One two three four</ScrollStatement>,
    );
    expect(container.querySelectorAll(".on")).toHaveLength(4);
    expect(IntersectionObserver).not.toHaveBeenCalled();
    fireEvent.scroll(window);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
