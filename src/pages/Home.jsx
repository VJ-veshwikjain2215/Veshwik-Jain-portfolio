import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import AcademicProgress from "../sections/AcademicProgress"; 
import Achievements from "../sections/Achievements";
import Resume from "../sections/Resume";
import Contact from "../sections/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <AcademicProgress /> 
      <Achievements />
      <Resume />
      <Contact />
      <Footer />
    </>
  );
}
