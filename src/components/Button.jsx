import { useState } from "react";

let rippleId = 0;

/**
 * Shared button component. Handles its own click-ripple so every
 * call site gets the same tasteful micro-interaction for free.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden font-medium rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-white hover:brightness-110 active:brightness-95 shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
    secondary:
      "bg-transparent text-text border border-hairline hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-text-secondary hover:text-primary",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm md:text-base px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    const size = Math.max(rect.width, rect.height) * 2;
    const newRipple = {
      id,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples((r) => [...r, newRipple]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 650);
    onClick?.(e);
  }

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_650ms_ease-out]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </Component>
  );
}
