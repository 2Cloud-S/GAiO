"use client";

import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { siteSocials } from "@/lib/site";

/** Adapted from Uiverse.io / Smit-Prajapati/massive-insect-5 — themed for GAiO. */

const LINKS = [
  {
    key: "instagram",
    label: "GAiO on Instagram",
    href: siteSocials.instagram,
    box: "box1",
    icon: (
      <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="svg" aria-hidden="true">
        <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "GAiO on X",
    href: siteSocials.x,
    box: "box2",
    icon: (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="svg" aria-hidden="true">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "GAiO on Facebook",
    href: siteSocials.facebook,
    box: "box3",
    icon: (
      <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" className="svg" aria-hidden="true">
        <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V151.3c0-28.3 14.1-56.6 59.1-56.6h45.7V16.1C288.7 14.7 253.4 0 217.8 0 140.6 0 80 48.6 80 139.3v62.2H14v97.8H80z" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "GAiO on TikTok",
    href: siteSocials.tiktok,
    box: "box4",
    icon: (
      <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="svg" aria-hidden="true">
        <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3v178.7A162.6 162.6 0 1 1 185.4 166v89.7a74.6 74.6 0 1 0 52.2 71.2V0h88a121.2 121.2 0 0 0 1.9 22.2 122.2 122.2 0 0 0 53.9 80.2A121.4 121.4 0 0 0 448 109.3z" />
      </svg>
    ),
  },
] as const;

export function SocialsCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.55, 0.75], rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <StyledWrapper>
      <div
        ref={cardRef}
        className={active ? "card is-active" : "card"}
        aria-label="GAiO social profiles"
      >
        <div className="background" aria-hidden="true" />
        <div className="logo" aria-hidden="true">
          Socials
        </div>
        {LINKS.map((link) => (
          <a
            key={link.key}
            className={`box ${link.box}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            <span className="icon">{link.icon}</span>
          </a>
        ))}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-top: var(--space-5);
  /* Clip hover scale so the footer stays tidy */
  overflow: hidden;
  border-radius: calc(var(--radius-lg) + 4px);
  padding: 4px;

  .card {
    position: relative;
    width: 200px;
    max-width: 100%;
    aspect-ratio: 1;
    height: auto;
    background: var(--color-ink);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 0.75rem 1.75rem color-mix(in srgb, var(--color-ink) 18%, transparent);
    transition:
      transform var(--dur-slow) var(--ease-in-out),
      border-color var(--dur-base) var(--ease-out);
    border: 1px solid var(--color-graphite);
  }

  .background {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        160deg,
        color-mix(in srgb, var(--color-graphite) 55%, transparent) 0%,
        transparent 48%
      ),
      radial-gradient(
        120% 80% at 18% 0%,
        color-mix(in srgb, var(--color-paper) 7%, transparent),
        transparent 58%
      ),
      var(--color-ink-soft);
  }

  .logo {
    position: absolute;
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    transition:
      transform var(--dur-slow) var(--ease-in-out),
      letter-spacing var(--dur-slow) var(--ease-in-out);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-paper);
    letter-spacing: var(--tracking-eyebrow);
    z-index: 1;
    pointer-events: none;
  }

  .icon {
    display: inline-grid;
    place-items: center;
    width: 1.25rem;
    height: 1.25rem;
  }

  .icon .svg {
    fill: color-mix(in srgb, var(--color-paper) 82%, transparent);
    width: 100%;
    height: 100%;
    transition:
      fill var(--dur-base) var(--ease-out),
      filter var(--dur-base) var(--ease-out);
  }

  .box {
    position: absolute;
    z-index: 2;
    display: grid;
    place-items: start end;
    padding: 0.65rem;
    text-align: right;
    text-decoration: none;
    color: inherit;
    background: color-mix(in srgb, var(--color-paper) 14%, transparent);
    border-top: 1px solid color-mix(in srgb, var(--color-paper) 55%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--color-paper) 28%, transparent);
    border-radius: 10% 13% 42% 0% / 10% 12% 75% 0%;
    box-shadow: -0.4rem 0.4rem 1.4rem color-mix(in srgb, var(--color-ink) 35%, transparent);
    transform-origin: bottom left;
    transition:
      bottom var(--dur-slow) var(--ease-in-out),
      left var(--dur-slow) var(--ease-in-out),
      background var(--dur-base) var(--ease-out);
  }

  .box::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out);
    pointer-events: none;
  }

  .box:hover .svg,
  .box:focus-visible .svg {
    fill: var(--color-paper);
  }

  .box:focus-visible {
    outline: 2px solid var(--color-paper);
    outline-offset: 2px;
  }

  /* Four stacked fans — sizes/delays tuned so all icons land cleanly */
  .box1 {
    width: 76%;
    height: 76%;
    bottom: -76%;
    left: -76%;
  }

  .box1::before {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--color-paper) 22%, transparent),
      color-mix(in srgb, var(--color-signal) 35%, transparent)
    );
  }

  .box2 {
    width: 58%;
    height: 58%;
    bottom: -58%;
    left: -58%;
    transition-delay: 0.12s;
  }

  .box2::before {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--color-paper) 18%, transparent),
      color-mix(in srgb, var(--color-graphite) 55%, transparent)
    );
  }

  .box3 {
    width: 40%;
    height: 40%;
    bottom: -40%;
    left: -40%;
    transition-delay: 0.24s;
  }

  .box3::before {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--color-paper) 16%, transparent),
      color-mix(in srgb, var(--color-ink) 40%, var(--color-graphite))
    );
  }

  .box4 {
    width: 24%;
    height: 24%;
    bottom: -24%;
    left: -24%;
    transition-delay: 0.36s;
  }

  .box4::before {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--color-signal) 40%, transparent),
      color-mix(in srgb, var(--color-paper) 12%, transparent)
    );
  }

  .box:hover::before,
  .box:focus-visible::before {
    opacity: 1;
  }

  .box:hover .icon .svg,
  .box:focus-visible .icon .svg {
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--color-paper) 55%, transparent));
  }

  .card.is-active,
  .card:hover,
  .card:focus-within {
    transform: scale(1.04);
    border-color: color-mix(in srgb, var(--color-paper) 28%, var(--color-graphite));
  }

  .card.is-active .box,
  .card:hover .box,
  .card:focus-within .box {
    bottom: -1px;
    left: -1px;
  }

  .card.is-active .logo,
  .card:hover .logo,
  .card:focus-within .logo {
    transform: translate(4.35rem, -3.25rem);
    letter-spacing: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .logo,
    .box,
    .box::before,
    .icon .svg {
      transition: none;
    }

    .card.is-active,
    .card:hover,
    .card:focus-within {
      transform: none;
    }

    .box {
      bottom: -1px !important;
      left: -1px !important;
      transition-delay: 0s !important;
    }

    .logo {
      transform: translate(4.35rem, -3.25rem);
      letter-spacing: 0;
    }
  }
`;
