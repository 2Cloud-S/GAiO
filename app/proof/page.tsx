import { AiOverviewProof } from "@/components/ai-overview-proof";
import { AuraFeaturedBadge } from "@/components/aura-featured-badge";
import { LayoutFrame, PageHero, CTA } from "@/components/page-elements";
import { CountUp, Highlighter, PixelProof } from "@/components/visuals";
import { proofs } from "@/lib/content";

export const metadata = { title: "Proof and Reporting" };

export default function ProofPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Proof"
        title="Evidence over inflated AI-search claims."
        copy="Our proof system separates real progress and approved examples from illustrations, so everyone knows what is known, observed, or still being tested."
      />
      <section className="section section-dark">
        <div className="wrap">
          <div className="proof-layout">
            <PixelProof />
            <div className="proof-side">
              <div className="metric-card" style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}>
                <span className="sample-label">Method count</span>
                <CountUp value={5} suffix=" stages" />
                <p>This number describes the methodology, not a client result.</p>
              </div>
              <div className="sample-card">
                <span className="sample-label">Reporting principle</span>
                <p>We use a compact priority query set, source coverage, implementation checks, and clear distinctions between signal and hypothesis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="wrap">
          <div className="section-intro">
            <p className="eyebrow">Citation readiness</p>
            <h2 className="display section-title">When evidence surfaces in generative search.</h2>
            <p className="lede">
              Approved proof from a live Google AI Overview—distinct from the illustrative sample scenarios below.
            </p>
          </div>
          <AiOverviewProof variant="evidence" />
          <AuraFeaturedBadge className="aura-featured-inline" tone="light" />
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-intro">
            <p className="eyebrow">Illustrative scenarios</p>
            <h2 className="display section-title">Sample query-to-source patterns.</h2>
          </div>
          <div className="card-grid">
            {proofs.map((proof) => (
              <article className="article-card" key={proof.company}>
                <span className="sample-label">Sample scenario</span>
                <h3>{proof.query}</h3>
                <p>
                  <Highlighter action="highlight" color="#e1e1e1" animationDuration={600} isView>
                    Source concept:
                  </Highlighter>{" "}
                  {proof.source}
                </p>
                <p>{proof.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </LayoutFrame>
  );
}
