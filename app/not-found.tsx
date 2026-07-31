import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="signal-lost">
      <div className="lost-orbit" aria-hidden="true" />
      <div className="section-intro">
        <p className="eyebrow">404 · Signal lost</p>
        <h1 className="display headline">This answer is not in the index.</h1>
        <p className="lede">The page may have moved, but the useful routes are still available.</p>
        <div className="hero-actions">
          <Link className="button button-signal" href="/">
            Return home <ArrowRight size={16} />
          </Link>
          <Link className="button button-ghost" href="/blog">
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
