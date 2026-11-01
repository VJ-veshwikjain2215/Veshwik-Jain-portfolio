import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  })),
});
window.scrollTo = vi.fn();
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// DOM tests exercise scene controls and lifecycle, not Canvas drawing or layout.
vi.mock("../lib/particleStage", () => ({
  PARTICLE_SCENES: [
    "Veshwik",
    "Backend systems",
    "Web platforms",
    "Mobile apps",
    "Websites",
  ],
  createParticleStage: vi.fn((_canvas, options) => ({
    select: vi.fn((index) => options.onScene(index)),
    destroy: vi.fn(),
  })),
}));
