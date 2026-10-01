import { useState } from "react";
import type { ReactElement } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectDialog } from "./components/ProjectDialog";
import type { Project } from "./components/ProjectDialog";
import { StateRail } from "./components/StateRail";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { site } from "./config";
import type { SectionId } from "./config";
import { AmbientField } from "./engine/AmbientField";
import { CursorField } from "./engine/CursorField";
import { ThemeController } from "./engine/ThemeController";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  const [project, setProject] = useState<Project | null>(null);
  useReveal();

  const renderers: Record<SectionId, () => ReactElement> = {
    about: () => <About />,
    projects: () => <Projects onOpen={setProject} />,
    skills: () => <Skills />,
    experience: () => <Experience />,
    contact: () => <Contact />,
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ThemeController />
      <AmbientField />
      <CursorField />
      <Header />
      <StateRail />
      <main id="main">
        <Hero />
        {site.sections.map(id => <div key={id}>{renderers[id]()}</div>)}
      </main>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </>
  );
}
