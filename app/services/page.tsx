import { LayoutFrame, PageHero, CTA } from "@/components/page-elements";
import { services } from "@/lib/content";

export const metadata = { title: "GEO Services" };

const serviceAnchors: Record<string, string> = {
  "GEO foundation": "geo-foundation",
  "Answer-ready content": "answer-ready-content",
  "Authority signals": "authority-signals",
  "Presence monitoring": "presence-monitoring",
};

export default function ServicesPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Services"
        title="Work that makes your expertise easier to find and trust."
        copy="A focused GEO program for teams that need a clear path from existing web presence to stronger generative-search readiness."
      />
      <section className="section">
        <div className="wrap">
          <div className="service-grid">
            {services.map((service) => (
              <article
                className="service-card"
                id={serviceAnchors[service.title]}
                key={service.number}
              >
                <span className="service-number">{service.number}</span>
                <div className="orbit-map" aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <div className="tag-row">
                  {service.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </LayoutFrame>
  );
}
