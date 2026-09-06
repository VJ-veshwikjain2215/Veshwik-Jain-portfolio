import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useTheme } from "./hooks/useTheme";
import { useActiveSection } from "./hooks/useActiveSection";

const SECTION_IDS = ["home", "about", "skills", "projects", "academics", "achievements", "resume", "contact"];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ScrollProgress />
          <Navbar theme={theme} onToggleTheme={toggleTheme} activeSection={activeSection} />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>

          <BackToTop />
        </motion.div>
      )}
    </>
  );
}
