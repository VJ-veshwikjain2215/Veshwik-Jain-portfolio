import { useEffect, useRef, useState } from "react";

/**
 * A restrained custom cursor: a small dot that follows the pointer
 * exactly, plus a trailing ring that eases toward it and grows over
 * interactive elements. Skipped entirely on touch devices and when
 * the user prefers reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!isTouch && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let mouseX = ringX;
    let mouseY = ringY;
    let raf;

    function handleMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      const target = e.target;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
    }

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute h-1.5 w-1.5 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="absolute rounded-full border border-primary/50 -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200 ease-out"
        style={{
          width: hovering ? 46 : 28,
          height: hovering ? 46 : 28,
        }}
      />
    </div>
  );
}
