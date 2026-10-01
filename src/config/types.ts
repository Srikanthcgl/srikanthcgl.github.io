/** Shape of `src/portfolio.config.ts`. You should not need to edit this file to change content. */

export type SectionId = "about" | "projects" | "skills" | "experience" | "contact";
export type SocialIcon = "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "globe" | "mail";
export type SkillIcon = "code" | "cloud" | "database" | "wrench" | "palette" | "users" | "chart" | "cpu" | "factory" | "sparkles";
export type Availability = "open" | "busy" | "closed";

export interface LinkItem { label: string; url: string }

export interface PortfolioConfig {
  /** Browser tab title, search-engine description and share-card details. */
  meta: {
    title: string;
    description: string;
    /** Public URL once deployed, e.g. "https://yourname.dev". Leave "" until you know it. */
    url: string;
    /** Optional share image, placed in /public, e.g. "/og.png" (1200×630). */
    ogImage?: string;
    language: string;
  };

  person: {
    name: string;
    firstName?: string;
    /** Shown as the eyebrow line above the headline, e.g. "Systems Engineer · System Architect". */
    role: string;
    location: string;
    email: string;
    phone?: string;
    photo?: string;
    initials: string;
    /** Path to a résumé in /public (e.g. "/resume.pdf"). Empty hides the button. */
    resume?: string;
    availability: { status: Availability; text: string };
  };

  social: { label: string; url: string; icon: SocialIcon }[];

  /** Order of the sections below the hero. Remove an id to hide that section. */
  sections: SectionId[];

  /** Short names shown in the top menu. */
  navLabels: Record<SectionId, string>;

  hero: {
    greeting: string;
    headline: string;
    /** "I work across ___" — the words rotate. */
    rotatingLead: string;
    rotatingWords: string[];
    intro: string;
    primaryButton: { label: string; target: SectionId };
    secondaryButton?: { label: string; target: SectionId };
    /** Small number highlights. Only add ones you can stand behind. */
    highlights: { value: string; label: string }[];
    /**
     * The nodes around the system core in the hero visualization.
     * Hover / tap reveals `techs`; clicking scrolls to `target`.
     */
    domains: { id: string; label: string; code: string; summary: string; techs: string[]; target: SectionId }[];
  };

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
    /** Principles. `emoji` is optional and not shown in the current design. */
    values: { emoji?: string; title: string; text: string }[];
    /** The blueprint schematic: how you move from a requirement to a running system. */
    method: {
      title: string;
      phases: { id: string; label: string; detail: string; covers: string[] }[];
      /** Caption on the loop that returns from the last phase to the first. */
      feedback: string;
    };
  };

  skills: {
    kicker: string;
    title: string;
    intro: string;
    /** Capabilities. Technologies listed in more than one group are drawn as shared links between them. */
    groups: { id: string; title: string; description: string; icon: SkillIcon; items: string[] }[];
    /** Which capabilities work closely together (pairs of group ids). */
    relations: [string, string][];
  };

  projects: {
    kicker: string;
    title: string;
    intro: string;
    items: {
      id: string;
      /** Optional; not shown in the current design. */
      emoji?: string;
      title: string;
      summary: string;
      category: string;
      year?: string;
      image?: string;
      /** The system path, left to right, e.g. ["Robots", "MQTT", "Fleet manager", "Dashboard"]. Shown as a signal chain. */
      flow: string[];
      whatItIs: string;
      whyItMatters: string;
      myRole: string;
      results: string[];
      /** Technologies. Terms listed in `glossary` get a hover explanation. */
      tags: string[];
      links?: LinkItem[];
    }[];
  };

  experience: {
    kicker: string;
    title: string;
    intro?: string;
    jobs: { role: string; org: string; period: string; summary: string; highlights: string[] }[];
    educationTitle: string;
    education: { school: string; degree: string; period: string }[];
  };

  contact: {
    kicker: string;
    title: string;
    text: string;
    buttonLabel: string;
  };

  footer: { note: string };

  /** Plain-language explanations for jargon. Matching tags show a "?" with a hover / tap explanation. */
  glossary: Record<string, string>;
}
