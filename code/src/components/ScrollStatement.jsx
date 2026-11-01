import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function ScrollStatement({ children, dark = false }) {
  const ref = useRef(null);
  const [visibleWords, setVisibleWords] = useState(0);
  const reduce = useReducedMotion();
  const words = children.split(" ");

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    let listening = false;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!ref.current) return;
        const { top } = ref.current.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight * 0.84 - top) / (window.innerHeight * 0.65),
          ),
        );
        setVisibleWords(Math.ceil(progress * words.length));
      });
    };
    const stop = () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
      frame = 0;
      listening = false;
    };
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "80px 0px" },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduce, words.length]);

  return (
    <p ref={ref} className={`statement ${dark ? "statement-dark" : ""}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`${reduce || i < visibleWords ? "on" : ""} ${["Java,", "reliable", "people.", "learning,"].includes(word) ? "highlight" : ""}`}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
