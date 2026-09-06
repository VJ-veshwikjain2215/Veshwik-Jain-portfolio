export default function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded border border-hairline bg-bg px-2.5 py-1 text-xs text-text-secondary transition-colors duration-200 ${className}`}
    >
      {children}
    </span>
  );
}
