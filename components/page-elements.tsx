import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Globe } from "@/components/ui/globe";

export function LayoutFrame({ children }: { children: ReactNode }) {
  return <div className="site-shell"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}

export function PageHero({ eyebrow, title, copy, action = true }: { eyebrow: string; title: string; copy: string; action?: boolean }) {
  return (
    <section className="page-hero">
      <div className="wrap section-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display headline">{title}</h1>
        <p className="lede">{copy}</p>
        {action && (
          <Link className="button button-signal" href="/assessment">
            Start your GEO assessment <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-panel">
          <div className="cta-globe" aria-hidden="true">
            <Globe className="cta-globe-visual" />
          </div>
          <div className="cta-copy">
            <p className="eyebrow">The next useful question</p>
            <h2 className="display section-title">What should AI search understand about you first?</h2>
            <p className="lede">Start with a focused assessment. We will turn your current site, priorities, and proof into a practical GEO starting point.</p>
            <div className="hero-actions">
              <Link className="button button-signal" href="/assessment">Start the assessment <ArrowRight size={16} /></Link>
              <Link className="button button-ghost" href="/book">Book a strategy call</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
