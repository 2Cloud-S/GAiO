import { LayoutFrame, PageHero } from "@/components/page-elements";
import { BookingDemo } from "@/components/interactive";
import { siteEmails } from "@/lib/site";

export const metadata = { title: "Book a Strategy Call" };

export default function BookPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Strategy call"
        title="Find a useful starting point together."
        copy="Choose a demonstration slot to see the branded scheduling experience. A real provider can be connected in the launch configuration."
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
          <BookingDemo />
        </div>
      </section>
    </LayoutFrame>
  );
}
