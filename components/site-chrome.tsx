"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  GitBranch,
  Globe2,
  LayoutTemplate,
  Map,
  Menu,
  Phone,
  Radar,
  Search,
  Shield,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ShareParticleCard } from "@/components/share-particle-card";
import { SocialsCard } from "@/components/socials-card";
import {
  companyMegaItems,
  engineMegaItems,
  footerExploreLinks,
  resourcesMegaItems,
  solutionsMegaItems,
  type MegaNavItem,
} from "@/lib/content";
import { siteEmails, siteName } from "@/lib/site";

const megaIcons: Record<MegaNavItem["icon"], LucideIcon> = {
  map: Map,
  "file-text": FileText,
  shield: Shield,
  radar: Radar,
  clipboard: ClipboardList,
  search: Search,
  layout: LayoutTemplate,
  "badge-check": BadgeCheck,
  "check-circle": CheckCircle2,
  activity: Activity,
  globe: Globe2,
  "book-open": BookOpen,
  wrench: Wrench,
  phone: Phone,
  users: Users,
  "git-branch": GitBranch,
};

type MegaKey = "solutions" | "engine" | "resources";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label={`${siteName} home`}>
      {siteName}
    </Link>
  );
}

function MegaIcon({ name }: { name: MegaNavItem["icon"] }) {
  const Icon = megaIcons[name];
  return (
    <span className="mega-item-icon" aria-hidden="true">
      <Icon size={18} strokeWidth={1.75} />
    </span>
  );
}

function MegaItemLink({
  item,
  onNavigate,
}: {
  item: MegaNavItem;
  onNavigate: () => void;
}) {
  return (
    <Link className="mega-item" href={item.href} onClick={onNavigate}>
      <MegaIcon name={item.icon} />
      <span className="mega-item-copy">
        <span className="mega-item-title">{item.title}</span>
        <span className="mega-item-desc">{item.description}</span>
      </span>
    </Link>
  );
}

function SolutionsPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mega-panel mega-panel-solutions">
      <div className="mega-panel-main">
        <p className="mega-panel-label">Solutions</p>
        <div className="mega-grid mega-grid-2">
          {solutionsMegaItems.map((item) => (
            <MegaItemLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EnginePanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mega-panel mega-panel-engine">
      <div className="mega-panel-main">
        <p className="mega-panel-label">Engine</p>
        <div className="mega-grid mega-grid-2">
          {engineMegaItems.map((item) => (
            <MegaItemLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
      <aside className="mega-featured">
        <p className="mega-featured-eyebrow">GEO operating system</p>
        <h3 className="mega-featured-title">Five stages from ambiguity to evidence.</h3>
        <p className="mega-featured-copy">
          Discovery through monitoring—one practical system your teams can run.
        </p>
        <Link className="mega-featured-link" href="/methodology" onClick={onNavigate}>
          View methodology <ArrowUpRight size={15} />
        </Link>
      </aside>
    </div>
  );
}

function ResourcesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mega-panel mega-panel-resources">
      <div className="mega-panel-main">
        <p className="mega-panel-label">Resources</p>
        <div className="mega-grid mega-grid-2">
          {resourcesMegaItems.map((item) => (
            <MegaItemLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
      <aside className="mega-side">
        <p className="mega-panel-label">Company</p>
        <div className="mega-side-list">
          {companyMegaItems.map((item) => (
            <Link key={item.href} className="mega-side-link" href={item.href} onClick={onNavigate}>
              <MegaIcon name={item.icon} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}

function MegaTrigger({
  id,
  label,
  expanded,
  controls,
  onToggle,
  onKeyDown,
}: {
  id: string;
  label: string;
  expanded: boolean;
  controls: string;
  onToggle: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      className={`nav-mega-trigger${expanded ? " is-open" : ""}`}
      aria-expanded={expanded}
      aria-haspopup="true"
      aria-controls={controls}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      {label}
      <ChevronDown size={14} className="nav-mega-chevron" aria-hidden="true" />
    </button>
  );
}

export function SiteHeader() {
  const reduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MegaKey | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<MegaKey | null>(null);
  const baseId = useId();

  const panelIds: Record<MegaKey, string> = {
    solutions: `${baseId}-solutions`,
    engine: `${baseId}-engine`,
    resources: `${baseId}-resources`,
  };
  const triggerIds: Record<MegaKey, string> = {
    solutions: `${baseId}-solutions-trigger`,
    engine: `${baseId}-engine-trigger`,
    resources: `${baseId}-resources-trigger`,
  };

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeAll = useCallback(() => {
    clearCloseTimer();
    setOpenMega(null);
    setMobileOpen(false);
    setMobileAccordion(null);
  }, [clearCloseTimer]);

  const closeMega = useCallback(() => {
    clearCloseTimer();
    setOpenMega(null);
  }, [clearCloseTimer]);

  const scheduleCloseMega = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMega(null), 140);
  }, [clearCloseTimer]);

  const openMegaMenu = useCallback(
    (key: MegaKey) => {
      clearCloseTimer();
      setOpenMega(key);
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMega(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMega(null);
        setMobileOpen(false);
        setMobileAccordion(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, key: MegaKey) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMegaMenu(key);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMega();
    }
  }

  function renderDesktopPanel(key: MegaKey): ReactNode {
    if (key === "solutions") return <SolutionsPanel onNavigate={closeAll} />;
    if (key === "engine") return <EnginePanel onNavigate={closeAll} />;
    return <ResourcesPanel onNavigate={closeAll} />;
  }

  const megaKeys: { key: MegaKey; label: string }[] = [
    { key: "solutions", label: "Solutions" },
    { key: "engine", label: "Engine" },
    { key: "resources", label: "Resources" },
  ];

  return (
    <header
      className={`site-header${openMega ? " has-mega" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
      ref={headerRef}
      onMouseLeave={(event) => {
        const next = event.relatedTarget;
        const leavingHeader =
          !next || !(next instanceof Node) || !headerRef.current?.contains(next);
        if (openMega && leavingHeader) {
          scheduleCloseMega();
        }
      }}
    >
      <div className="nav-inner">
        <Brand />
        <button
          className="nav-toggle"
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls={`${baseId}-mobile-nav`}
          onClick={() => {
            setMobileOpen((value) => !value);
            setOpenMega(null);
          }}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <nav className="nav-links nav-links-desktop" aria-label="Main navigation">
          {megaKeys.map(({ key, label }) => (
            <div
              key={key}
              className="nav-mega"
              onMouseEnter={() => openMegaMenu(key)}
            >
              <MegaTrigger
                id={triggerIds[key]}
                label={label}
                expanded={openMega === key}
                controls={panelIds[key]}
                onToggle={() => {
                  // Hover-capable pointers: open (don't toggle-close after hover).
                  // Coarse/touch: toggle so a second tap closes.
                  const hoverCapable =
                    typeof window !== "undefined" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                  if (hoverCapable) {
                    openMegaMenu(key);
                    return;
                  }
                  setOpenMega((current) => (current === key ? null : key));
                }}
                onKeyDown={(event) => onTriggerKeyDown(event, key)}
              />
            </div>
          ))}
          <Link className="nav-top-link" href="/pricing" onClick={closeAll}>
            Pricing
          </Link>
        </nav>

        <Link className="button button-signal header-cta" href="/book">
          Book a strategy call <ArrowUpRight size={16} />
        </Link>
      </div>

      <AnimatePresence>
        {openMega ? (
          <motion.div
            key={openMega}
            id={panelIds[openMega]}
            role="region"
            aria-labelledby={triggerIds[openMega]}
            className="mega-dropdown"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={clearCloseTimer}
          >
            {renderDesktopPanel(openMega)}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            id={`${baseId}-mobile-nav`}
            className="nav-mobile"
            aria-label="Mobile navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {megaKeys.map(({ key, label }) => {
              const expanded = mobileAccordion === key;
              return (
                <div key={key} className="nav-mobile-group">
                  <button
                    type="button"
                    className={`nav-mobile-trigger${expanded ? " is-open" : ""}`}
                    aria-expanded={expanded}
                    onClick={() => setMobileAccordion((current) => (current === key ? null : key))}
                  >
                    {label}
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        className="nav-mobile-panel"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                      >
                        {key === "solutions" ? (
                          <div className="nav-mobile-list">
                            {solutionsMegaItems.map((item) => (
                              <MegaItemLink key={item.href} item={item} onNavigate={closeAll} />
                            ))}
                          </div>
                        ) : null}
                        {key === "engine" ? (
                          <div className="nav-mobile-list">
                            {engineMegaItems.map((item) => (
                              <MegaItemLink key={item.href} item={item} onNavigate={closeAll} />
                            ))}
                            <Link className="nav-mobile-cta" href="/methodology" onClick={closeAll}>
                              View full methodology
                            </Link>
                          </div>
                        ) : null}
                        {key === "resources" ? (
                          <div className="nav-mobile-list">
                            {resourcesMegaItems.map((item) => (
                              <MegaItemLink key={item.href} item={item} onNavigate={closeAll} />
                            ))}
                            <p className="mega-panel-label nav-mobile-side-label">Company</p>
                            {companyMegaItems.map((item) => (
                              <Link
                                key={item.href}
                                className="mega-side-link"
                                href={item.href}
                                onClick={closeAll}
                              >
                                <MegaIcon name={item.icon} />
                                <span>{item.title}</span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
            <Link className="nav-mobile-top-link" href="/pricing" onClick={closeAll}>
              Pricing
            </Link>
            <Link className="button button-signal nav-mobile-book" href="/book" onClick={closeAll}>
              Book a strategy call <ArrowUpRight size={16} />
            </Link>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Brand />
          <p className="footer-blurb">
            A practical GEO partner for organisations that want their expertise to be understood,
            evidenced, and discoverable in generative search.
          </p>
          <SocialsCard />
        </div>
        <nav className="footer-links" aria-label="Explore">
          <span className="meta">Explore</span>
          {footerExploreLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
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
