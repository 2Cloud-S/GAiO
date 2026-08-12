import {
  blogHref,
  blogListingHref,
  engines,
  faqs,
  methodSteps,
  services,
  team,
} from "@/lib/content";
import {
  absoluteUrl,
  siteAlternateNames,
  siteDescription,
  siteName,
  siteTagline,
  siteUrl,
} from "@/lib/site";
import { getInsightPosts, type InsightPost } from "@/sanity/lib/posts";

type LinkItem = {
  title: string;
  href: string;
  note: string;
};

function linkLine({ title, href, note }: LinkItem): string {
  return `- [${title}](${absoluteUrl(href)}): ${note}`;
}

function section(title: string, items: LinkItem[]): string {
  if (!items.length) return "";
  return [`## ${title}`, "", ...items.map(linkLine), ""].join("\n");
}

function postNote(post: InsightPost): string {
  const excerpt = post.excerpt?.trim();
  if (excerpt) return excerpt.length > 140 ? `${excerpt.slice(0, 137)}…` : excerpt;
  return `${post.category} insight on generative search and GEO.`;
}

function corePages(): LinkItem[] {
  return [
    {
      title: "Home",
      href: "/",
      note: "Overview of GAiO's GEO practice, method stages, services, team, and FAQs.",
    },
    {
      title: "Services",
      href: "/services",
      note: "GEO foundation, answer-ready content, authority signals, and presence monitoring.",
    },
    {
      title: "Methodology",
      href: "/methodology",
      note: "Five-stage operating system: Discovery, Architecture, Authority, Validation, Monitoring.",
    },
    {
      title: "Proof",
      href: "/proof",
      note: "How GAiO frames evidence, source coverage, and measurement without vanity guarantees.",
    },
    {
      title: "Blog",
      href: blogListingHref,
      note: "Editorial insights on GEO, citation-ready content, and AI search visibility.",
    },
    {
      title: "About",
      href: "/about",
      note: "Agency overview and team (Afnan K., Waqas K.).",
    },
    {
      title: "GEO readiness assessment",
      href: "/assessment",
      note: "Focused assessment to turn site priorities and proof into a practical GEO starting point.",
    },
    {
      title: "Book a strategy call",
      href: "/book",
      note: "Primary contact path for strategy conversations.",
    },
  ];
}

function contactPages(): LinkItem[] {
  return [
    {
      title: "Book a strategy call",
      href: "/book",
      note: "Request a strategy conversation with the GAiO team.",
    },
    {
      title: "GEO readiness assessment",
      href: "/assessment",
      note: "Start with a structured readiness assessment.",
    },
    {
      title: "About / team",
      href: "/about",
      note: "Meet Afnan K. (Certified AI Specialist) and Waqas K. (Certified Senior Developer).",
    },
  ];
}

function referencePages(): LinkItem[] {
  return [
    {
      title: "Sitemap",
      href: "/sitemap.xml",
      note: "Machine-readable list of public URLs.",
    },
    {
      title: "llms-full.txt",
      href: "/llms-full.txt",
      note: "Expanded AI reference with services, method, FAQs, team, and insight excerpts.",
    },
    {
      title: "robots.txt",
      href: "/robots.txt",
      note: "Crawl rules for search and AI agents.",
    },
  ];
}

function insightLinks(posts: InsightPost[]): LinkItem[] {
  return posts.map((post) => ({
    title: post.title,
    href: blogHref(post.slug),
    note: postNote(post),
  }));
}

/** Compact index for agents (llmstxt.org convention). */
export async function buildLlmsTxt(): Promise<string> {
  const posts = await getInsightPosts();

  const parts = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `${siteTagline}`,
    "",
    `Preferred citation: **${siteName}** / **gaioengine.com** (${siteUrl}).`,
    `Also known as: ${siteAlternateNames.join("; ")}.`,
    "",
    "GAiO helps organisations improve discoverability and citation readiness across generative answer surfaces (including Google AI Overviews, ChatGPT, Perplexity, Gemini, Claude, and Copilot). The practice builds on search fundamentals and focuses on entity clarity, evidence, structured content, and measurement—without guaranteeing third-party AI outputs.",
    "",
    section("Core pages", corePages()),
    section("Insights", insightLinks(posts)),
    section("Contact", contactPages()),
    section("Optional", referencePages()),
  ];

  return `${parts.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

/** Deeper companion file for agents that can load more context. */
export async function buildLlmsFullTxt(): Promise<string> {
  const posts = await getInsightPosts();

  const serviceLines = services.map(
    (service) =>
      `- **${service.title}**: ${service.copy} Tags: ${service.tags.join(", ")}.`,
  );

  const methodLines = methodSteps.map(
    (step) => `- **${step.index} ${step.title}**: ${step.detail}`,
  );

  const teamLines = team.map(
    (person) =>
      `- **${person.name}** — ${person.role}. ${person.about} Specialty: ${person.specialty}.`,
  );

  const faqLines = faqs.map(([question, answer]) => {
    return [`### ${question}`, "", answer, ""].join("\n");
  });

  const insightBlocks = posts.map((post) => {
    const lines = [
      `### [${post.title}](${absoluteUrl(blogHref(post.slug))})`,
      "",
      post.excerpt?.trim() || `${post.category} insight from GAiO.`,
      "",
      `Author: ${post.author}. Category: ${post.category}.`,
    ];
    if (post.publishedAt) lines.push(`Published: ${post.publishedAt}.`);
    lines.push("");
    return lines.join("\n");
  });

  const parts = [
    `# ${siteName} — full AI reference`,
    "",
    `> ${siteDescription}`,
    "",
    `Canonical site: ${siteUrl}`,
    `Preferred citation: ${siteName} / gaioengine.com`,
    "",
    "## What GAiO is",
    "",
    "GAiO (Generative AI Optimization) is a Generative Engine Optimization (GEO) agency. GEO builds on SEO fundamentals but focuses on whether systems can interpret, verify, and include an organisation's expertise in generated answers.",
    "",
    "GAiO does not sell placement guarantees. No responsible agency can guarantee a third-party system's output. The work builds and measures conditions that improve discoverability and citation readiness.",
    "",
    `Answer surfaces considered in the practice: ${engines.join(", ")}.`,
    "",
    "## Core pages",
    "",
    ...corePages().map(linkLine),
    "",
    "## Services",
    "",
    ...serviceLines,
    "",
    "## Methodology",
    "",
    ...methodLines,
    "",
    "## Team",
    "",
    ...teamLines,
    "",
    "## Frequently asked questions",
    "",
    ...faqLines,
    "## Insights (citation-ready sources)",
    "",
    ...insightBlocks,
    "## Contact",
    "",
    ...contactPages().map(linkLine),
    "",
    "## Machine-readable indexes",
    "",
    ...referencePages().map(linkLine),
    "",
  ];

  return `${parts.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

export function plainTextResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
