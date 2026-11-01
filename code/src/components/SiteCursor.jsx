import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SiteCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const cursor = ref.current;
    const root = document.documentElement;
    const desktop = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      cursor.dataset.visible = "false";
      root.classList.remove("custom-cursor-ready");
    };
    const move = (event) => {
      if (!desktop.matches || event.pointerType === "touch") {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      // Position before hiding the native pointer, including after keyboard use.
      if (reduced.matches || cursor.dataset.visible !== "true") {
        cancelAnimationFrame(frame);
        paint();
      } else if (!frame) frame = requestAnimationFrame(paint);
      cursor.dataset.visible = "true";
      root.classList.add("custom-cursor-ready");
    };
    const leave = (event) => {
      if (!event.relatedTarget) hide();
    };
    const key = (event) => {
      if (event.key === "Tab") hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };
    const preference = () => {
      if (!desktop.matches) hide();
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    desktop.addEventListener("change", preference);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
      desktop.removeEventListener("change", preference);
    };
  }, []);
  return createPortal(
    <span
      className="site-cursor"
      ref={ref}
      data-visible="false"
      aria-hidden="true"
    >
      CLICK
    </span>,
    document.body,
  );
}
