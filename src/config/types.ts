/** Shape of `src/portfolio.config.ts`. You should not need to edit this file to change content. */

export type SectionId = "about" | "apps" | "projects" | "skills" | "experience" | "contact";
export type AppStatus = "live" | "beta" | "in-development";
export type SocialIcon = "github" | "linkedin" | "twitter" | "youtube" | "instagram" | "globe" | "mail";
export type SkillIcon = "code" | "cloud" | "database" | "wrench" | "palette" | "users" | "chart" | "cpu" | "factory" | "sparkles" | "phone";
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
    /** Used in "Hi, I'm ___". Defaults to the first word of `name`. */
    firstName?: string;
    /** One line describing what you do, in plain words. */
    role: string;
    location: string;
    email: string;
    phone?: string;
    /** Photo in /public (e.g. "/me.jpg"). If empty, your initials are shown. */
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
    /** Big sentence under the greeting. */
    headline: string;
    /** "I build ___" — the words rotate. Leave one word to disable rotation. */
    rotatingLead: string;
    rotatingWords: string[];
    intro: string;
    primaryButton: { label: string; target: SectionId };
    secondaryButton?: { label: string; target: SectionId };
    /** Small number highlights. Only add ones you can stand behind. */
    highlights: { value: string; label: string }[];
  };

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
    /** "What I care about" cards. */
    values: { emoji: string; title: string; text: string }[];
  };

  skills: {
    kicker: string;
    title: string;
    intro: string;
    groups: { title: string; description: string; icon: SkillIcon; items: string[] }[];
  };

  /** Your Android apps. Each one gets a phone showcase with screenshots, features and store links. */
  apps: {
    kicker: string;
    title: string;
    intro: string;
    items: {
      id: string;
      name: string;
      emoji: string;
      /** App colour, e.g. "#7c5cff". Used for the phone mockup and highlights. */
      color: string;
      /** App icon in /public (optional — the emoji is used otherwise). */
      icon?: string;
      tagline: string;
      description: string;
      status: AppStatus;
      year?: string;
      /** Screenshots in /public, e.g. ["/apps/notes-1.png"]. Leave empty for a generated preview. */
      screenshots: string[];
      features: string[];
      tags: string[];
      /** Optional highlights such as { value: "10K+", label: "downloads" }. Only add real numbers. */
      stats: { value: string; label: string }[];
      /** e.g. { label: "Get it on Google Play", url: "https://play.google.com/store/apps/details?id=..." } */
      links: LinkItem[];
    }[];
  };

  projects: {
    kicker: string;
    title: string;
    intro: string;
    items: {
      id: string;
      emoji: string;
      title: string;
      /** One friendly sentence anyone can understand. */
      summary: string;
      category: string;
      year?: string;
      /** Optional cover image in /public. Falls back to a coloured card with the emoji. */
      image?: string;
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
