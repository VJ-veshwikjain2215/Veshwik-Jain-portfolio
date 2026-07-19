import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl border border-hairline bg-card p-8 card-shadow-lg"
      >
        <div className="flex items-center gap-1.5 pb-4 mb-4 border-b border-hairline">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-text-secondary">bash</span>
        </div>
        <p className="font-mono text-sm text-left text-text-secondary">
          <span className="text-primary">$</span> cd /requested-page
        </p>
        <p className="font-mono text-sm text-left text-red-400 mt-1">
          bash: cd: /requested-page: No such file or directory
        </p>
        <h1 className="mt-6 font-display text-4xl font-semibold text-text">404</h1>
        <p className="mt-2 text-text-secondary">
          This page doesn't exist. Let's get you back on the main path.
        </p>
        <Button as={Link} to="/" variant="primary" className="mt-6">
          Back to home
        </Button>
      </motion.div>
    </main>
  );
}
