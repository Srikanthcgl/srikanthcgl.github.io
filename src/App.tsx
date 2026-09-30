import { useState } from "react";
import type { ReactElement } from "react";
import { Apps } from "./components/Apps";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectDialog } from "./components/ProjectDialog";
import type { Project } from "./components/ProjectDialog";
import { About, Contact, Experience, Footer, Projects, Skills } from "./components/Sections";
import { site } from "./config";
import type { SectionId } from "./config";
import { useReveal } from "./hooks/useReveal";
import { useSpotlight } from "./hooks/useSpotlight";
import { Backdrop } from "./scenery/Backdrop";

export default function App() {
  const [project, setProject] = useState<Project | null>(null);
  useReveal();
  useSpotlight();

  const renderers: Record<SectionId, () => ReactElement> = {
    about: () => <About />,
    apps: () => <Apps />,
    projects: () => <Projects onOpen={setProject} />,
    skills: () => <Skills />,
    experience: () => <Experience />,
    contact: () => <Contact />,
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Backdrop />
      <div className="veil" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        {site.sections.map(id => <div key={id}>{renderers[id]()}</div>)}
      </main>
      <Footer />
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </>
  );
}
