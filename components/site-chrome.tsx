"use client";

import Link from "next/link";
import { ArrowUpRight, AtSign, Menu, Send, X } from "lucide-react";
import { useState } from "react";
import { ShareParticleCard } from "@/components/share-particle-card";
import { navItems } from "@/lib/content";
import { siteEmails } from "@/lib/site";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="GAiO home">
      GAiO
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Brand />
        <button className="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
        <Link className="button button-signal header-cta" href="/book">Book a strategy call <ArrowUpRight size={16} /></Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Brand />
          <p className="footer-blurb">A practical GEO partner for organisations that want their expertise to be understood, evidenced, and discoverable in generative search.</p>
          <div className="socials" aria-label="Social links">
            <a href="#social-linkedin" aria-label="Professional social placeholder"><Send size={16} /></a>
            <a href="#social-instagram" aria-label="Social profile placeholder"><AtSign size={16} /></a>
          </div>
        </div>
        <nav className="footer-links" aria-label="Explore">
          <span className="meta">Explore</span>
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <Link href="/assessment">Readiness assessment</Link>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/llms.txt">llms.txt</a>
        </nav>
        <nav className="footer-links footer-contact" aria-label="Contact">
          <span className="meta">Contact</span>
          <a href={`mailto:${siteEmails.connect}`} aria-label={`Connect at ${siteEmails.connect}`}>
            <span>Connect</span>
            <span className="footer-contact-address">{siteEmails.connect}</span>
          </a>
          <a href={`mailto:${siteEmails.support}`} aria-label={`Support at ${siteEmails.support}`}>
            <span>Support</span>
            <span className="footer-contact-address">{siteEmails.support}</span>
          </a>
        </nav>
        <ShareParticleCard />
      </div>
    </footer>
  );
}
