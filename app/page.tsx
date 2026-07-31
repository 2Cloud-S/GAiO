import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LayoutFrame, CTA } from "@/components/page-elements";
import { BlogPostCard } from "@/components/blog-post-card";
import { TeamCard } from "@/components/team-card";
import { Marquee } from "@/components/ui/marquee";
import { CountUp, EngineCloud, HeroGeoMap, Highlighter, KineticText, LineShadowText, MethodFlow, MorphStatement, PixelProof, Text3DFlip, TextReveal } from "@/components/visuals";
import { blogHref, blogListingHref, faqs, methodSteps, proofs, services, team, testimonials } from "@/lib/content";
import { getLatestInsightPosts } from "@/sanity/lib/posts";

export default async function HomePage() {
  const latestInsights = await getLatestInsightPosts(3);

  return <LayoutFrame>
    <section className="hero"><div className="wrap hero-grid"><div className="hero-copy"><p className="eyebrow">Generative Engine Optimization</p><h1 className="display headline"><span className="headline-line">Be the <LineShadowText>answer</LineShadowText></span><span className="headline-line">AI finds.</span></h1><p className="lede">We help your business become clearer, more credible, and more discoverable across generative search and Google’s AI-powered results.</p><MorphStatement /><div className="hero-actions"><Link className="button button-signal" href="/book">Book a strategy call <ArrowRight size={16} /></Link><Link className="button button-ghost" href="/assessment">Run a GEO assessment</Link></div></div><HeroGeoMap /><p className="hero-note"><span className="meta signal">Signal / Proof</span><br />Technical precision, evidence-led content, and a measurement model that does not rely on promises.</p></div></section>

    <section className="section"><div className="wrap"><div className="split-head"><div><p className="eyebrow">The search shift</p><h2 className="display section-title"><Text3DFlip /></h2></div><p className="lede">The new surface is a generated answer. Your job is not simply to appear—it is to give systems enough clarity and evidence to understand when your expertise belongs in the answer.</p></div><TextReveal>GEO helps translate your knowledge into a system that is direct, corroborated, structurally clear, and ready to be evaluated.</TextReveal></div></section>

    <section className="section section-dark"><div className="wrap"><div className="split-head"><div><p className="eyebrow">Engine landscape</p><h2 className="display section-title">One category. Many answer surfaces.</h2></div><p className="lede">We organise the work around the systems your audience actually uses, while keeping the message and evidence consistent across every surface.</p></div><EngineCloud /></div></section>

    <section className="section section-muted"><div className="wrap"><div className="section-intro"><p className="eyebrow">Our GEO operating system</p><h2 className="display section-title">A five-stage path from ambiguity to evidence.</h2></div><MethodFlow steps={methodSteps} /><div className="print-signal"><span className="print-bars"><i /><i /><i /><i /></span> Publish → parse → validate</div></div></section>
    <KineticText text="Make your expertise machine-readable" />

    <section className="section"><div className="wrap"><div className="split-head"><div><p className="eyebrow">What we optimise</p><h2 className="display section-title">The parts of your presence that make a useful answer possible.</h2></div><p className="lede">No generic “AI SEO” package. We create a focused roadmap around your priority topics, claims, sources, and customer decisions.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><span className="service-number">{service.number}</span><div className="orbit-map" aria-hidden="true" /><h3>{service.title}</h3><p>{service.copy}</p><div className="tag-row">{service.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></article>)}</div></div></section>

    <section className="section section-dark"><div className="wrap"><div className="proof-intro"><div><p className="eyebrow">Proof of presence</p><h2 className="display section-title">Show the reasoning. Not a vanity dashboard.</h2></div><p className="lede">The work stays grounded in source coverage, priority questions, implementation progress, and the way your expertise is represented.</p></div><div className="proof-layout"><PixelProof /><div className="proof-side"><div className="metric-card"><span className="sample-label">Method, not a client metric</span><CountUp value={5} suffix=" stages" /><p>Discovery, architecture, <Highlighter action="highlight" color="#e1e1e1" animationDuration={650} iterations={1} multiline={false} padding={1} isView>authority</Highlighter>, validation, and monitoring—one practical operating system.</p></div><div className="sample-card"><span className="sample-label">Evidence discipline</span><p>Every proof surface is designed to distinguish approved evidence from illustrative sample content.</p></div></div></div></div></section>

    <section className="section section-dark">
      <div className="wrap">
        <div className="section-intro">
          <p className="eyebrow">AI-result gallery</p>
          <h2 className="display section-title">How a useful query can lead to a defensible source.</h2>
        </div>
      </div>
      <div className="gallery-marquee">
        <Marquee pauseOnHover className="[--duration:36s] [--gap:var(--space-4)]">
          {proofs.map((proof) => (
            <article className="query-card" key={proof.company}>
              <span className="sample-label">Sample scenario</span>
              <strong>{proof.query}</strong>
              <small>Source: {proof.source}</small>
            </article>
          ))}
        </Marquee>
        <div className="gallery-marquee-fade gallery-marquee-fade-left" aria-hidden="true" />
        <div className="gallery-marquee-fade gallery-marquee-fade-right" aria-hidden="true" />
      </div>
    </section>

    <section className="section"><div className="velocity-tape" aria-hidden="true"><span>CLARITY · CONTEXT · CORROBORATION · CLARITY · CONTEXT · CORROBORATION · </span></div><div className="wrap" style={{ paddingTop: "var(--space-12)" }}><div className="section-intro"><p className="eyebrow">Client perspective</p><h2 className="display section-title">Practical progress, clearly explained.</h2></div><div className="testimonial-grid">{testimonials.map((testimonial) => <article className="testimonial" key={testimonial.name}><blockquote>“{testimonial.quote}”</blockquote><footer><strong>{testimonial.name}</strong><br />{testimonial.role}</footer></article>)}</div></div></section>

    <section className="section section-muted"><div className="wrap"><div className="split-head"><div><p className="eyebrow">The people behind the method</p><h2 className="display section-title">Senior specialists. One shared standard of proof.</h2></div><Link className="button button-ghost" href="/about">Meet the team <ArrowRight size={16} /></Link></div><div className="team-grid">{team.map((person) => <TeamCard key={person.name} name={person.name} role={person.role} about={person.about} initials={person.initials} avatarTone={person.avatarTone} email={person.email} imageSrc={person.imageSrc} imagePosition={person.imagePosition} />)}</div></div></section>

    <section className="section"><div className="wrap"><div className="split-head"><div><p className="eyebrow">Insights</p><h2 className="display section-title">Original thinking for the new search surface.</h2></div><Link className="button button-ghost" href={blogListingHref}>See all insights <ArrowRight size={16} /></Link></div><div className="blog-card-grid">{latestInsights.map((post) => <BlogPostCard key={post._id} title={post.title} subtitle={post.author || post.category} href={blogHref(post.slug)} image={post.imageUrl} likes={post.likes} comments={post.comments} views={post.views} />)}</div></div></section>

    <section className="section"><div className="wrap"><div className="split-head"><div><p className="eyebrow">Questions, answered</p><h2 className="display section-title">GEO should be clear before it becomes complex.</h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    <CTA />
  </LayoutFrame>;
}
