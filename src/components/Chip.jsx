export default function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-hairline bg-card px-3 py-1.5 text-sm text-text-secondary transition-colors duration-200 ${className}`}
    >
      {children}
    </span>
  );
}
