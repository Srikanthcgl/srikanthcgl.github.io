/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "./src/portfolio.config";
import { isPlaceholder } from "./src/config/resolve";



const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Fills <title>, description, Open Graph tags and JSON-LD in index.html from portfolio.config.ts. */
function seoFromConfig(): Plugin {
  return {
    name: "seo-from-config",
    transformIndexHtml(html) {
      const { meta, person, social } = config;
      const url = isPlaceholder(meta.url) ? "" : meta.url.replace(/\/$/, "");
      const image = meta.ogImage && !isPlaceholder(meta.ogImage) ? (url ? url + meta.ogImage : meta.ogImage) : "";
      const sameAs = social.filter(s => !isPlaceholder(s.url)).map(s => s.url);
      const tags = [
        `<meta name="description" content="${esc(meta.description)}" />`,
        url && `<link rel="canonical" href="${esc(url)}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${esc(meta.title)}" />`,
        `<meta property="og:description" content="${esc(meta.description)}" />`,
        url && `<meta property="og:url" content="${esc(url)}/" />`,
        image && `<meta property="og:image" content="${esc(image)}" />`,
        `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
        `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org", "@type": "Person", name: person.name, jobTitle: person.role,
          description: meta.description, ...(url && { url }), ...(sameAs.length && { sameAs }),
        })}</script>`,
      ].filter(Boolean).join("\n    ");
      return html
        .replace("<!--SEO-->", tags)
        .replace("%TITLE%", esc(meta.title))
        .replace("%LANG%", esc(meta.language));
    },
  };
}

export default defineConfig({
  plugins: [react(), seoFromConfig()],
  build: { sourcemap: false, target: "es2022" },
  test: { environment: "node" },
  base: "/",
});
