/**
 * Shared button component. Flat, bordered surfaces with a restrained
 * color shift on hover — no ripples, glows, or shadow pop.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-bg hover:bg-accent",
    secondary: "bg-transparent text-text border border-hairline hover:bg-card hover:border-text-secondary",
    ghost: "bg-transparent text-text-secondary hover:text-accent",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm md:text-base px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
