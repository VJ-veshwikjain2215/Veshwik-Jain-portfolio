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
        className="w-full max-w-md"
      >
        <span className="label-caps text-accent">Error 404</span>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-text">
          Page not found
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The page you're looking for doesn't exist, or may have moved.
          Let's get you back to the portfolio.
        </p>
        <Button as={Link} to="/" variant="primary" className="mt-8">
          Back to home
        </Button>
      </motion.div>
    </main>
  );
}
