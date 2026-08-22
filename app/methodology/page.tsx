import { LayoutFrame, PageHero, CTA } from "@/components/page-elements";
import { MethodFlow } from "@/components/visuals";
import { methodSteps } from "@/lib/content";

export const metadata = { title: "GEO Methodology" };

export default function MethodologyPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Methodology"
        title="A GEO system that remains useful after the first report."
        copy="We turn a complicated category into a staged program your leadership, editorial, product, and technical teams can understand."
      />
      <section className="section section-muted">
        <div className="wrap">
          <MethodFlow steps={methodSteps} />
          <div className="print-signal">
            <span className="print-bars">
              <i />
              <i />
              <i />
              <i />
            </span>{" "}
            Publish → parse → validate
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="prose">
            <p className="eyebrow">How the work holds together</p>
            <h2 className="display section-title">A clear claim needs a clear system around it.</h2>
            <p>
              Each stage creates a practical artifact: an opportunity map, an implementation roadmap,
              an evidence model, a validation view, and an ongoing review rhythm.
            </p>
            <p>This makes GEO a working discipline—not an opaque collection of AI-search tactics.</p>
          </div>
        </div>
      </section>
      <CTA />
    </LayoutFrame>
  );
}
