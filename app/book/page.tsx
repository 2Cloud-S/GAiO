import { LayoutFrame, PageHero } from "@/components/page-elements";
import { CalEmbed } from "@/components/cal-embed";
import { siteEmails } from "@/lib/site";

export const metadata = { title: "Book a Strategy Call" };

export default function BookPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Strategy call"
        title="Find a useful starting point together."
        copy="Pick a time that works for you. We will walk through your current visibility in AI search and identify a practical next step."
        action={false}
      />
      <section className="section section-muted">
        <div className="wrap">
          <div className="prose book-contact">
            <p>
              Prefer email? Write{" "}
              <a className="prose-link" href={`mailto:${siteEmails.connect}`} aria-label={`Connect at ${siteEmails.connect}`}>
                {siteEmails.connect}
              </a>{" "}
              for new conversations, or{" "}
              <a className="prose-link" href={`mailto:${siteEmails.support}`} aria-label={`Support at ${siteEmails.support}`}>
                {siteEmails.support}
              </a>{" "}
              for existing work.
            </p>
          </div>
          <CalEmbed />
        </div>
      </section>
    </LayoutFrame>
  );
}
