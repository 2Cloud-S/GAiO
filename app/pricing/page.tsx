import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LayoutFrame, PageHero, CTA } from "@/components/page-elements";
import { ComingSoonPanel } from "@/components/coming-soon";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <LayoutFrame>
      <PageHero
        eyebrow="Pricing"
        title="Plans are on the way."
        copy="We are packaging GEO engagements into clear pricing. Until then, start with an assessment or book a strategy call."
        action={false}
      />
      <section className="section section-muted">
        <div className="wrap">
          <ComingSoonPanel
            eyebrow="Coming soon"
            title="Transparent pricing for GEO programs."
            copy="Expect practical tiers aligned to foundation work, content systems, authority, and monitoring—not opaque retainers or placement promises."
          >
            <div className="coming-soon-actions">
              <Link className="button button-signal" href="/assessment">
                Start the assessment <ArrowRight size={16} />
              </Link>
              <Link className="button button-ghost" href="/book">
                Book a strategy call
              </Link>
            </div>
          </ComingSoonPanel>
        </div>
      </section>
      <CTA />
    </LayoutFrame>
  );
}
