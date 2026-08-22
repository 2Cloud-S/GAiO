import { LayoutFrame, PageHero, CTA } from "@/components/page-elements";
import { changelogEntries } from "@/lib/content";

export const metadata = { title: "Changelog" };

export default function ChangelogPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Changelog"
        title="What changed on GAiO Engine."
        copy="A short record of site and product updates—kept honest and useful, not a marketing feed."
        action={false}
      />
      <section className="section section-muted">
        <div className="wrap">
          <div className="changelog-list">
            {changelogEntries.map((entry) => (
              <article className="changelog-entry" key={`${entry.date}-${entry.title}`}>
                <p className="meta">{entry.date}</p>
                <h2>{entry.title}</h2>
                <p>{entry.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </LayoutFrame>
  );
}
