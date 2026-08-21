"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";
import "./cal-embed.css";

const CAL_NAMESPACE = "30min";
const CAL_LINK = "gaioengine/30min";
const READY_FALLBACK_MS = 8000;

/** GAiO monochrome tokens — applied via Cal cssVarsPerTheme (no `--` prefix). */
const gaioDarkVars = {
  "cal-brand": "#ffffff",
  "cal-brand-emphasis": "#e1e1e1",
  "cal-brand-text": "#000000",
  "cal-brand-subtle": "#2e2e2e",
  "cal-brand-accent": "#000000",
  "cal-text": "#e1e1e1",
  "cal-text-emphasis": "#ffffff",
  "cal-text-subtle": "#a0a0a0",
  "cal-text-muted": "#5a5a5a",
  "cal-text-inverted": "#000000",
  "cal-text-semantic-info": "#e1e1e1",
  "cal-text-semantic-attention": "#f3f3f3",
  "cal-text-semantic-error": "#ffffff",
  "cal-text-info": "#e1e1e1",
  "cal-text-success": "#f3f3f3",
  "cal-text-attention": "#f3f3f3",
  "cal-text-error": "#ffffff",
  "cal-bg": "#000000",
  "cal-bg-emphasis": "#1b1b1b",
  "cal-bg-subtle": "#141414",
  "cal-bg-muted": "#0a0a0a",
  "cal-bg-inverted": "#ffffff",
  "cal-bg-attention": "#2e2e2e",
  "cal-bg-error": "#1b1b1b",
  "cal-bg-semantic-info-subtle": "#141414",
  "cal-bg-semantic-attention-subtle": "#1b1b1b",
  "cal-bg-semantic-error-subtle": "#1b1b1b",
  "cal-border": "#2e2e2e",
  "cal-border-emphasis": "#e1e1e1",
  "cal-border-subtle": "#1b1b1b",
  "cal-border-muted": "#141414",
  "cal-border-error": "#5a5a5a",
  "cal-border-semantic-error": "#5a5a5a",
  "cal-border-semantic-attention-subtle": "#2e2e2e",
  "cal-border-semantic-error-subtle": "#2e2e2e",
  "cal-border-booker": "#2e2e2e",
  "cal-border-booker-width": "1px",
  radius: "0.875rem",
};

function markIframeLoaded(iframe: HTMLIFrameElement, onReady: () => void) {
  if (iframe.dataset.gaioReadyBound === "1") return;
  iframe.dataset.gaioReadyBound = "1";

  const done = () => onReady();
  iframe.addEventListener("load", done, { once: true });

  // Same-origin only; Cal iframe is cross-origin so this usually no-ops.
  try {
    if (iframe.contentDocument?.readyState === "complete") done();
  } catch {
    /* ignore */
  }
}

export function CalEmbed() {
  const [ready, setReady] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const onReady = () => {
      if (!cancelled) setReady(true);
    };

    const shell = shellRef.current;
    const existing = shell?.querySelector("iframe");
    if (existing instanceof HTMLIFrameElement) {
      markIframeLoaded(existing, onReady);
    }

    const observer =
      shell &&
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            const iframe =
              node instanceof HTMLIFrameElement
                ? node
                : node.querySelector("iframe");
            if (iframe instanceof HTMLIFrameElement) {
              markIframeLoaded(iframe, onReady);
            }
          }
        }
      });

    if (shell && observer) {
      observer.observe(shell, { childList: true, subtree: true });
    }

    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;

      if (typeof window !== "undefined" && window.Cal) {
        window.Cal.config = window.Cal.config || {};
        window.Cal.config.forwardQueryParams = true;
      }

      cal("ui", {
        theme: "dark",
        layout: "month_view",
        // Hides left event-details panel (broken avatar + Cal Video CDN assets).
        hideEventTypeDetails: true,
        styles: {
          branding: { brandColor: "#ffffff" },
        },
        cssVarsPerTheme: {
          dark: gaioDarkVars,
          light: gaioDarkVars,
        },
      });

      // linkReady can race ahead of this listener under Strict Mode; iframe
      // MutationObserver + timeout below cover that case.
      cal("on", { action: "linkReady", callback: onReady });
    })();

    const fallback = window.setTimeout(onReady, READY_FALLBACK_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className="cal-embed-shell"
      data-ready={ready ? "true" : "false"}
    >
      {!ready ? (
        <div className="cal-embed-loading" aria-live="polite" aria-busy="true">
          <span className="cal-embed-loading-dot" aria-hidden="true" />
          <p className="meta">Loading calendar…</p>
        </div>
      ) : null}
      <div className="cal-embed-frame">
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          calOrigin="https://app.cal.com"
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
          config={{
            layout: "month_view",
            theme: "dark",
            useSlotsViewOnSmallScreen: "true",
          }}
        />
      </div>
    </div>
  );
}
