export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  body: string[];
};

export type SampleProof = {
  company: string;
  query: string;
  source: string;
  note: string;
  sample: true;
};

export const blogListingHref = "/blog";

export function blogHref(slug: string) {
  return `/blog/${slug}`;
}

export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/methodology", label: "Method" },
  { href: "/proof", label: "Proof" },
  { href: blogListingHref, label: "Blog" },
  { href: "/about", label: "About" },
];

export const engines = [
  "Google AI Overviews",
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "Claude",
  "Copilot",
  "Brave Search",
  "You.com",
];

export const services = [
  {
    number: "01",
    title: "GEO foundation",
    copy: "We map how your business, entities, offers, and expertise are currently understood by search and generative systems.",
    tags: ["Entity clarity", "Technical baseline", "Opportunity map"],
  },
  {
    number: "02",
    title: "Answer-ready content",
    copy: "We restructure priority pages so their claims, evidence, and context can be confidently interpreted and cited.",
    tags: ["Information architecture", "Source strength", "Editorial systems"],
  },
  {
    number: "03",
    title: "Authority signals",
    copy: "We strengthen the corroboration around your brand so important facts are easier to verify across the open web.",
    tags: ["Digital PR", "Structured data", "Knowledge consistency"],
  },
  {
    number: "04",
    title: "Presence monitoring",
    copy: "We define the prompts, topics, and evidence patterns that matter—then review visibility as AI search changes.",
    tags: ["Prompt sets", "Citation review", "Iteration roadmap"],
  },
];

export const methodSteps = [
  { index: "01", title: "Discovery", detail: "Find the questions, entities, and competitor narratives shaping your category." },
  { index: "02", title: "Architecture", detail: "Make core pages easier to interpret, connect, and corroborate." },
  { index: "03", title: "Authority", detail: "Build supporting evidence around the expertise you want surfaced." },
  { index: "04", title: "Validation", detail: "Test priority answers and inspect the source patterns behind them." },
  { index: "05", title: "Monitoring", detail: "Keep a focused view of change, opportunity, and next actions." },
];

export const proofs: SampleProof[] = [
  {
    company: "Northline Analytics",
    query: "How do retail teams forecast seasonal demand?",
    source: "A practical seasonal-forecasting guide",
    note: "Illustrative query-to-source scenario. Replace with approved client evidence before launch.",
    sample: true,
  },
  {
    company: "Morrow Health",
    query: "What should a workplace wellbeing program include?",
    source: "An evidence-led implementation checklist",
    note: "Illustrative query-to-source scenario. Replace with approved client evidence before launch.",
    sample: true,
  },
  {
    company: "Fold Studio",
    query: "How do product teams validate positioning?",
    source: "A research synthesis for launch teams",
    note: "Illustrative query-to-source scenario. Replace with approved client evidence before launch.",
    sample: true,
  },
];

export const testimonials = [
  {
    quote: "Sample scenario: the work gave our team a sharper way to connect content decisions to the questions people now ask AI tools.",
    name: "Avery Chen",
    role: "VP Marketing, sample client",
  },
  {
    quote: "Sample scenario: instead of a vague AI-search brief, we left with a staged roadmap that our content and product teams could both use.",
    name: "Jordan Patel",
    role: "Growth Lead, sample client",
  },
  {
    quote: "Sample scenario: the entity and evidence work helped us see where our expertise was clear—and where it needed better proof.",
    name: "Morgan Lee",
    role: "Founder, sample client",
  },
];

export type TeamMember = {
  initials: string;
  name: string;
  role: string;
  specialty: string;
  about: string;
  avatarTone: "ink" | "graphite" | "rule";
  email: string;
  imageSrc?: string;
  /** CSS object-position so each photo frames the face correctly */
  imagePosition?: string;
};

export const team: TeamMember[] = [
  {
    initials: "AK",
    name: "Afnan K.",
    role: "Certified AI Specialist",
    specialty: "AI systems & generative optimization",
    about: "Certified AI Specialist focused on practical generative search and answer-engine strategy.",
    avatarTone: "ink",
    email: "inbox.afnankhan@gmail.com",
    imageSrc: "/team/afnan-k.png",
    imagePosition: "center 22%",
  },
  {
    initials: "WK",
    name: "Waqas K.",
    role: "Certified Senior Developer",
    specialty: "Engineering & technical delivery",
    about: "Certified Senior Developer building reliable technical foundations for discoverability and product delivery.",
    avatarTone: "graphite",
    email: "waqasgfx123@gmail.com",
    imageSrc: "/team/waqas-k.png",
    imagePosition: "center 42%",
  },
];

export const faqs = [
  ["Is GEO the same as SEO?", "No. GEO builds on search fundamentals but focuses on whether systems can interpret, verify, and include your expertise in generated answers."],
  ["Can you guarantee an AI result?", "No responsible agency can guarantee a third-party system's output. We build and measure the conditions that improve discoverability and citation readiness."],
  ["Do we need to understand AI search before starting?", "No. The assessment and methodology are designed for teams beginning from zero, with clear priorities and plain-language reporting."],
  ["What does reporting look like?", "We align reporting to agreed topics, prompts, source coverage, and implementation progress—not vanity metrics or unverified claims."],
];

export const articles: Article[] = [
  {
    slug: "from-keywords-to-knowledge",
    title: "From keywords to knowledge: a practical GEO shift",
    excerpt: "A clear way to move from isolated keyword targeting to evidence-rich, answer-ready content systems.",
    category: "Strategy",
    readTime: "6 min read",
    date: "Sample insight",
    body: [
      "Generative search asks a different question of your content: can a system understand the claim, see the supporting evidence, and connect it to a real-world entity?",
      "The answer is not to publish more generic AI content. It is to identify the topics where your expertise is uniquely useful, then make the logic, sources, and ownership around that expertise easier to inspect.",
      "A useful GEO program creates a narrower, more accountable content system: priority questions, specific sources, clear entities, and a review rhythm that can adapt as the engines change.",
    ],
  },
  {
    slug: "citation-ready-content",
    title: "What makes a page citation-ready?",
    excerpt: "The structural and editorial choices that help a useful page hold up when a system needs to synthesize an answer.",
    category: "Editorial systems",
    readTime: "5 min read",
    date: "Sample insight",
    body: [
      "Citation-ready content is not a formatting trick. It combines a direct answer, transparent reasoning, genuinely useful source material, and context about who is making the claim.",
      "The best pages make it easy to separate what is known, what is recommended, and what depends on the reader's situation. That clarity helps people and systems alike.",
      "The goal is not to manufacture certainty. It is to make responsible expertise legible.",
    ],
  },
  {
    slug: "measuring-ai-presence",
    title: "Measuring AI presence without chasing vanity metrics",
    excerpt: "How to define a focused visibility review around real questions, evidence patterns, and implementation progress.",
    category: "Measurement",
    readTime: "4 min read",
    date: "Sample insight",
    body: [
      "The most useful GEO measurement starts with the decisions your audience needs to make—not a broad list of prompts that look impressive in a report.",
      "Choose a small, meaningful query set. Record the answer patterns, relevant sources, and the ways your own evidence appears or fails to appear.",
      "This creates a feedback loop for better content and stronger proof rather than a promise of permanent rank positions.",
    ],
  },
];

export const bookingSlots = ["09:30", "11:00", "14:00", "15:30"];
