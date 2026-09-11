"use client";

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";

type MethodStep = {
  index: string;
  title: string;
  detail: string;
};

type GeoMethodBentoProps = {
  steps: MethodStep[];
};

/* ─────────────────────────────────────────────────────────────────────────────
   Discovery Card - Interactive AI Search Results Flow
   ───────────────────────────────────────────────────────────────────────────── */

function DiscoveryMockup() {
  const [activeResult, setActiveResult] = useState(0);
  const reduceMotion = useReducedMotion();

  const results = [
    { title: "How to optimize for AI search", source: "gaioengine.com", cited: true },
    { title: "Best practices for GEO", source: "industry-blog.com", cited: true },
    { title: "Understanding AI citations", source: "research-hub.io", cited: false },
  ];

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setActiveResult((prev) => (prev + 1) % results.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [reduceMotion, results.length]);

  return (
    <div className="mockup-discovery-v2">
      {/* Query input */}
      <div className="discovery-query">
        <span className="discovery-query__icon">⌕</span>
        <span className="discovery-query__text">What makes content AI-ready?</span>
      </div>
      
      {/* Flow connector */}
      <div className="discovery-flow">
        <div className="discovery-flow__line" />
        <div className="discovery-flow__pulse" />
      </div>
      
      {/* Results list with active indicator */}
      <div className="discovery-results">
        {results.map((result, i) => (
          <motion.div
            key={result.title}
            className={`discovery-result ${i === activeResult ? "discovery-result--active" : ""}`}
            animate={{
              opacity: i === activeResult ? 1 : 0.5,
              x: i === activeResult ? 4 : 0,
            }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <div className="discovery-result__connector" />
            <div className="discovery-result__content">
              <span className="discovery-result__source">{result.source}</span>
              <span className="discovery-result__title">{result.title}</span>
            </div>
            {result.cited && <span className="discovery-result__cited">✓</span>}
          </motion.div>
        ))}
      </div>

      {/* Metrics sidebar */}
      <div className="discovery-metrics">
        <div className="discovery-metric">
          <span className="discovery-metric__icon">◎</span>
          <span className="discovery-metric__label">Visibility</span>
        </div>
        <div className="discovery-metric">
          <span className="discovery-metric__icon">◇</span>
          <span className="discovery-metric__label">Entity Match</span>
        </div>
        <div className="discovery-metric discovery-metric--active">
          <span className="discovery-metric__icon">✦</span>
          <span className="discovery-metric__label">Citation Ready</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Architecture Card - Content Pipeline Workflow
   ───────────────────────────────────────────────────────────────────────────── */

function ArchitectureMockup() {
  const stages = [
    { id: "raw", label: "Raw Content", status: "done" },
    { id: "struct", label: "Structured", status: "done" },
    { id: "schema", label: "Schema", status: "active" },
    { id: "ready", label: "AI-Ready", status: "pending" },
  ];

  return (
    <div className="mockup-architecture-v2">
      {/* Pipeline stages */}
      <div className="arch-pipeline">
        {stages.map((stage, i) => (
          <div key={stage.id} className={`arch-stage arch-stage--${stage.status}`}>
            <div className="arch-stage__dot" />
            <span className="arch-stage__label">{stage.label}</span>
            {i < stages.length - 1 && <div className="arch-stage__connector" />}
          </div>
        ))}
      </div>
      
      {/* Schema preview */}
      <div className="arch-schema">
        <div className="arch-schema__header">
          <span>schema.json</span>
        </div>
        <div className="arch-schema__body">
          <code>
            <span className="code-brace">{"{"}</span>
            <br />
            <span className="code-indent"><span className="code-key">"@type"</span>: <span className="code-value">"Article"</span>,</span>
            <br />
            <span className="code-indent"><span className="code-key">"author"</span>: <span className="code-value">"Organization"</span></span>
            <br />
            <span className="code-brace">{"}"}</span>
          </code>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Authority Card - Visibility Dashboard with Brand Tracking
   ───────────────────────────────────────────────────────────────────────────── */

function AuthorityMockup() {
  const reduceMotion = useReducedMotion();
  const [visibility, setVisibility] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setVisibility(32);
      return;
    }
    const timer = setTimeout(() => setVisibility(32), 400);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const competitors = [
    { name: "Your Brand", value: 32, change: "+2.4%" },
    { name: "Competitor A", value: 24, change: "-1.1%" },
    { name: "Competitor B", value: 18, change: "+0.3%" },
  ];

  return (
    <div className="mockup-authority-v2">
      {/* Header metrics */}
      <div className="authority-header">
        <div className="authority-stat">
          <span className="authority-stat__value">{visibility}%</span>
          <span className="authority-stat__label">Visibility</span>
        </div>
        <div className="authority-stat">
          <span className="authority-stat__value">#3</span>
          <span className="authority-stat__label">Position</span>
        </div>
      </div>

      {/* Brand list */}
      <div className="authority-brands">
        {competitors.map((brand, i) => (
          <div key={brand.name} className={`authority-brand ${i === 0 ? "authority-brand--you" : ""}`}>
            <div className="authority-brand__bar" style={{ width: `${brand.value * 2}%` }} />
            <span className="authority-brand__name">{brand.name}</span>
            <span className={`authority-brand__change ${brand.change.startsWith("+") ? "authority-brand__change--up" : "authority-brand__change--down"}`}>
              {brand.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Validation Card - AI Overview Citation Flow
   ───────────────────────────────────────────────────────────────────────────── */

function ValidationMockup() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div className="mockup-validation-v2">
      {/* Query flow */}
      <div className="validation-flow">
        <div className={`validation-node ${step >= 0 ? "validation-node--active" : ""}`}>
          <span>Query</span>
        </div>
        <div className="validation-connector" />
        <div className={`validation-node ${step >= 1 ? "validation-node--active" : ""}`}>
          <span>Parse</span>
        </div>
        <div className="validation-connector" />
        <div className={`validation-node validation-node--cite ${step >= 2 ? "validation-node--active" : ""}`}>
          <span>Cite</span>
        </div>
      </div>

      {/* AI Overview preview */}
      <div className="validation-preview">
        <div className="validation-preview__header">
          <span className="validation-preview__icon">✦</span>
          <span>AI Overview</span>
        </div>
        <p className="validation-preview__text">
          According to experts at <span className="validation-preview__cite">gaioengine.com</span>, effective GEO requires...
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Monitoring Card - Real-time Analytics Dashboard
   ───────────────────────────────────────────────────────────────────────────── */

function MonitoringMockup() {
  const reduceMotion = useReducedMotion();
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial data
    setDataPoints([12, 18, 15, 22, 28, 25, 32, 35, 30, 38]);
    
    if (reduceMotion) return;
    
    // Animate new data point periodically
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newPoint = prev[prev.length - 1] + (Math.random() > 0.5 ? 2 : -1);
        return [...prev.slice(1), Math.max(10, Math.min(45, newPoint))];
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div className="mockup-monitoring-v2">
      {/* Mini nav */}
      <div className="monitoring-nav">
        <span className="monitoring-nav__item monitoring-nav__item--active">Visibility</span>
        <span className="monitoring-nav__item">Citations</span>
        <span className="monitoring-nav__item">Prompts</span>
      </div>

      {/* Chart */}
      <div className="monitoring-chart">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-grid-accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-grid-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {dataPoints.length > 0 && (
            <>
              <motion.path
                d={`M0,${50 - dataPoints[0]} ${dataPoints.map((p, i) => `L${i * 11},${50 - p}`).join(" ")} L100,${50 - dataPoints[dataPoints.length - 1]} L100,50 L0,50 Z`}
                fill="url(#chartGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.path
                d={`M0,${50 - dataPoints[0]} ${dataPoints.map((p, i) => `L${i * 11},${50 - p}`).join(" ")}`}
                fill="none"
                stroke="var(--color-grid-accent)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1 }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Stats row */}
      <div className="monitoring-stats">
        <div className="monitoring-stat">
          <span className="monitoring-stat__value">78%</span>
          <span className="monitoring-stat__label">AI Ready</span>
        </div>
        <div className="monitoring-stat">
          <span className="monitoring-stat__value">42</span>
          <span className="monitoring-stat__label">Citations</span>
        </div>
        <div className="monitoring-stat">
          <span className="monitoring-stat__value">+12%</span>
          <span className="monitoring-stat__label">This Week</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Card Components
   ───────────────────────────────────────────────────────────────────────────── */

function BentoCard({
  step,
  mockup,
  variant,
  className = "",
}: {
  step: MethodStep;
  mockup: React.ReactNode;
  variant: "dark" | "light" | "accent";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`bento-card bento-card--${variant} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
      whileHover={reduceMotion ? {} : { y: -4 }}
    >
      <div className="bento-card__mockup">{mockup}</div>
      <div className="bento-card__content">
        <span className="bento-card__index">{step.index}</span>
        <h3 className="bento-card__title">{step.title}</h3>
        <p className="bento-card__detail">{step.detail}</p>
      </div>
    </motion.article>
  );
}

/* Hero Card - Discovery with flow-based design */
function BentoHeroCard({ step }: { step: MethodStep }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="bento-card bento-card--hero bento-card--dark"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
      whileHover={reduceMotion ? {} : { y: -4 }}
    >
      <div className="bento-card__mockup">
        <DiscoveryMockup />
      </div>
      <div className="bento-card__content">
        <span className="bento-card__index">{step.index}</span>
        <h3 className="bento-card__title">{step.title}</h3>
        <p className="bento-card__detail">{step.detail}</p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Bento Grid
   ───────────────────────────────────────────────────────────────────────────── */

export function GeoMethodBento({ steps }: GeoMethodBentoProps) {
  const [discovery, architecture, authority, validation, monitoring] = steps;

  return (
    <div className="geo-bento">
      <BentoHeroCard step={discovery} />
      <BentoCard step={architecture} mockup={<ArchitectureMockup />} variant="light" />
      <BentoCard step={authority} mockup={<AuthorityMockup />} variant="light" />
      <BentoCard step={validation} mockup={<ValidationMockup />} variant="dark" />
      <BentoCard step={monitoring} mockup={<MonitoringMockup />} variant="accent" />
    </div>
  );
}

export default GeoMethodBento;
