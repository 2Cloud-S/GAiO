import { team } from "@/lib/content";
import {
  absoluteUrl,
  siteAlternateNames,
  siteDescription,
  siteEmails,
  siteName,
  siteTagline,
  siteUrl,
} from "@/lib/site";

/** Sitewide Organization / WebSite / ProfessionalService graph for AI + search grounding. */
export function buildSiteJsonLd() {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const serviceId = `${siteUrl}/#professionalservice`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        alternateName: [...siteAlternateNames],
        url: siteUrl,
        description: siteDescription,
        slogan: siteTagline,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icons/icon-192.png"),
          width: 192,
          height: 192,
        },
        email: siteEmails.connect,
        employee: team.map((person) => ({
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
          description: person.about,
          email: person.email,
          url: absoluteUrl("/about"),
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteEmails.connect,
            url: absoluteUrl("/book"),
            availableLanguage: ["English"],
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: siteEmails.support,
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        alternateName: [...siteAlternateNames],
        url: siteUrl,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: `${siteName} — Generative Engine Optimization`,
        alternateName: "GEO agency",
        url: siteUrl,
        description: siteDescription,
        serviceType: [
          "Generative Engine Optimization",
          "GEO",
          "Answer Engine Optimization",
          "AI search visibility consulting",
        ],
        provider: { "@id": organizationId },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${siteName} GEO services`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "GEO foundation",
                description:
                  "Map how a business, entities, offers, and expertise are understood by search and generative systems.",
                url: absoluteUrl("/services"),
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Answer-ready content",
                description:
                  "Restructure priority pages so claims, evidence, and context can be interpreted and cited.",
                url: absoluteUrl("/services"),
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Authority signals",
                description:
                  "Strengthen corroboration so important facts are easier to verify across the open web.",
                url: absoluteUrl("/services"),
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Presence monitoring",
                description:
                  "Define prompts, topics, and evidence patterns—then review visibility as AI search changes.",
                url: absoluteUrl("/services"),
              },
            },
          ],
        },
      },
    ],
  };
}
