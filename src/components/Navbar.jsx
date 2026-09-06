import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "academics", label: "Academics" },
  { id: "achievements", label: "Achievements" },
  { id: "resume", label: "Résumé" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ theme, onToggleTheme, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(id) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur border-b border-hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8 h-16 md:h-20">
        <button
          onClick={() => handleNavClick("home")}
          className="font-display text-xl tracking-tight text-text"
          aria-label="Go to home section"
        >
          Veshwik <span className="text-accent">Jain</span>
        </button>

        <div className="hidden lg:flex items-center gap-7 text-sm">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative py-2 transition-colors duration-200 ${
                activeSection === link.id ? "text-accent" : "text-text-secondary hover:text-text"
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden flex h-9 w-9 items-center justify-center text-text hover:text-accent"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-bg border-b border-hairline"
          >
            <div className="flex flex-col px-5 py-5 gap-1 font-display text-2xl">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2.5 transition-colors ${
                    activeSection === link.id ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
