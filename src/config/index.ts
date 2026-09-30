import { config } from "../portfolio.config";
import { resolveConfig } from "./resolve";
import { validateConfig } from "./validate";

if (import.meta.env.DEV) {
  const problems = validateConfig(config);
  if (problems.length) console.warn(`portfolio.config.ts has ${problems.length} problem(s):\n• ${problems.join("\n• ")}`);
}

/** The resolved, ready-to-render content. Import this in components. */
export const site = resolveConfig(config, import.meta.env.PROD);
export type { PortfolioConfig, SectionId } from "./types";
