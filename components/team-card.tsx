"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import styled from "styled-components";

export type TeamCardSocial = {
  label: string;
  href: string;
  icon: "instagram" | "x" | "github";
};

export type TeamCardProps = {
  name: string;
  role: string;
  about: string;
  initials: string;
  /** Distinct avatar treatment so cards are not identical clones */
  avatarTone?: "ink" | "graphite" | "rule";
  /** Opens the user's mail client for both the mail icon and Contact Me */
  email?: string;
  contactHref?: string;
  socials?: TeamCardSocial[];
  imageSrc?: string;
  /** CSS object-position for the photo (e.g. "center 40%") */
  imagePosition?: string;
};

const toneBackground: Record<NonNullable<TeamCardProps["avatarTone"]>, string> = {
  ink: "var(--color-ink)",
  graphite: "var(--color-graphite)",
  rule: "var(--color-paper-soft)",
};

const toneForeground: Record<NonNullable<TeamCardProps["avatarTone"]>, string> = {
  ink: "var(--color-paper)",
  graphite: "var(--color-paper)",
  rule: "var(--color-ink)",
};

function SocialIcon({ icon }: { icon: TeamCardSocial["icon"] }) {
  if (icon === "instagram") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M6-582H-2a4,4,0,0,1-4-4v-8a4,4,0,0,1,4-4H6a4,4,0,0,1,4,4v8A4,4,0,0,1,6-582ZM2-594a4,4,0,0,0-4,4,4,4,0,0,0,4,4,4,4,0,0,0,4-4A4.005,4.005,0,0,0,2-594Zm4.5-2a1,1,0,0,0-1,1,1,1,0,0,0,1,1,1,1,0,0,0,1-1A1,1,0,0,0,6.5-596ZM2-587.5A2.5,2.5,0,0,1-.5-590,2.5,2.5,0,0,1,2-592.5,2.5,2.5,0,0,1,4.5-590,2.5,2.5,0,0,1,2-587.5Z" transform="translate(6 598)" />
      </svg>
    );
  }
  if (icon === "x") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" aria-hidden="true">
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  );
}

function mailtoHref(address: string) {
  return `mailto:${address.trim()}`;
}

export function TeamCard({
  name,
  role,
  about,
  initials,
  avatarTone = "ink",
  email,
  contactHref = "/book",
  socials,
  imageSrc,
  imagePosition = "center top",
}: TeamCardProps) {
  const mailHref = email ? mailtoHref(email) : undefined;
  const contactTarget = mailHref ?? contactHref;
  const isMailto = Boolean(mailHref);
  const isExternal =
    contactTarget.startsWith("mailto:") || contactTarget.startsWith("http");

  return (
    <StyledWrapper $tone={avatarTone} $imagePosition={imagePosition}>
      <article className="card" aria-label={`${name}, ${role}`}>
        {isMailto ? (
          <a className="mail" href={mailHref} aria-label={`Email ${name}`}>
            <Mail size={20} strokeWidth={2.25} aria-hidden="true" />
          </a>
        ) : isExternal ? (
          <a className="mail" href={contactTarget} aria-label={`Contact ${name}`} rel="noopener noreferrer">
            <Mail size={20} strokeWidth={2.25} aria-hidden="true" />
          </a>
        ) : (
          <Link className="mail" href={contactTarget} aria-label={`Contact ${name}`}>
            <Mail size={20} strokeWidth={2.25} aria-hidden="true" />
          </Link>
        )}

        <div className="profile-pic" aria-hidden="true">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="avatar-img" src={imageSrc} alt="" />
          ) : (
            <div className="avatar-face">
              <span className="avatar-initials">{initials}</span>
              <span className="avatar-role">{role}</span>
            </div>
          )}
        </div>

        <div className="bottom">
          <div className="content">
            <span className="name">{name}</span>
            <span className="role-label">{role}</span>
            <span className="about-me">{about}</span>
          </div>
          <div className="bottom-bottom">
            <div className="social-links-container">
              {socials?.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={(event) => event.stopPropagation()}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
            {isMailto ? (
              <a className="contact" href={mailHref}>
                Contact Me
              </a>
            ) : isExternal ? (
              <a className="contact" href={contactTarget} rel="noopener noreferrer">
                Contact Me
              </a>
            ) : (
              <Link className="contact" href={contactTarget}>
                Contact Me
              </Link>
            )}
          </div>
        </div>
      </article>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{
  $tone: NonNullable<TeamCardProps["avatarTone"]>;
  $imagePosition: string;
}>`
  /* Prevent flex shrink in .team-grid from collapsing the card width */
  flex-shrink: 0;
  width: 280px;
  max-width: 100%;

  .card {
    width: 100%;
    height: 360px;
    background: var(--color-paper);
    border-radius: 32px;
    padding: 3px;
    position: relative;
    border: var(--rule);
    box-shadow: color-mix(in oklch, var(--color-ink) 18%, transparent) 0px 70px 30px -50px;
    transition: all 0.5s ease-in-out;
  }

  .card .mail {
    position: absolute;
    right: 1.15rem;
    top: 1.1rem;
    z-index: 10;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    /* Solid ink so the circle reads the same over light and dark photos */
    background: var(--color-ink);
    box-shadow: 0 1px 3px color-mix(in oklch, var(--color-ink) 28%, transparent);
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-paper);
    text-decoration: none;
    pointer-events: auto;
    transition: background 0.35s ease, color 0.35s ease;
  }

  .card .mail svg {
    stroke: var(--color-paper);
    stroke-width: 2.25px;
    filter: drop-shadow(0 1px 1px color-mix(in oklch, var(--color-ink) 45%, transparent));
    transition: stroke 0.35s ease, filter 0.35s ease;
  }

  .card .mail:hover,
  .card .mail:focus-visible {
    background: color-mix(in oklch, var(--color-ink) 82%, var(--color-paper));
  }

  .card .mail:hover svg,
  .card .mail:focus-visible svg {
    stroke: var(--color-paper);
  }

  /* Rest: full-bleed portrait behind a short name/role footer */
  .card .profile-pic {
    position: absolute;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    border-radius: 29px;
    z-index: 1;
    border: 0px solid var(--color-ink);
    overflow: hidden;
    box-sizing: border-box;
    /* Decorative only — must not intercept mail / contact hits */
    pointer-events: none;
    transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
  }

  .card .profile-pic .avatar-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${p => p.$imagePosition};
    transition: all 0.5s ease-in-out 0s;
    transform-origin: 50% 30%;
  }

  .card .profile-pic .avatar-face {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(
        145deg,
        color-mix(in oklch, ${p => toneBackground[p.$tone]} 92%, white) 0%,
        ${p => toneBackground[p.$tone]} 55%,
        color-mix(in oklch, ${p => toneBackground[p.$tone]} 80%, black) 100%
      ),
      repeating-linear-gradient(
        -28deg,
        transparent 0 10px,
        color-mix(in oklch, var(--color-paper) 8%, transparent) 10px 11px
      );
    color: ${p => toneForeground[p.$tone]};
    transition: all 0.5s ease-in-out 0s;
    transform-origin: 45% 20%;
  }

  .card .profile-pic .avatar-initials {
    font: 800 var(--text-2xl)/0.9 var(--font-display);
    letter-spacing: var(--tracking-display);
  }

  .card .profile-pic .avatar-role {
    max-width: 12ch;
    text-align: center;
    font: 700 var(--text-xs)/var(--leading-snug) var(--font-mono);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    opacity: 0.72;
  }

  /* Short footer: name + role + Contact Me — bio takes no space */
  .card .bottom {
    position: absolute;
    bottom: 3px;
    left: 3px;
    right: 3px;
    top: 72%;
    background: var(--color-ink);
    border-radius: 29px;
    z-index: 2;
    box-shadow: color-mix(in oklch, var(--color-ink) 22%, transparent) 0px 5px 5px 0px inset;
    overflow: hidden;
    /* Let mail icon (z-index 10) receive clicks when this panel expands */
    pointer-events: none;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  .card .bottom .content {
    position: absolute;
    top: 0.7rem;
    bottom: 2.85rem;
    left: 1.15rem;
    right: 1.15rem;
    height: auto;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
    transition: top 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }

  .card .bottom .content .name {
    display: block;
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    color: var(--color-paper);
    font-weight: 800;
    font-family: var(--font-display);
    letter-spacing: var(--tracking-tight);
  }

  .card .bottom .content .role-label {
    display: block;
    margin-top: 0.2rem;
    font: 700 var(--text-xs)/var(--leading-snug) var(--font-mono);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-paper) 92%, transparent);
  }

  .card .bottom .content .about-me {
    display: block;
    font-size: var(--text-sm);
    color: color-mix(in oklch, var(--color-paper) 88%, transparent);
    margin-top: 0;
    line-height: var(--leading-snug);
    overflow-wrap: break-word;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      opacity 0.35s ease 0.05s,
      max-height 0.45s cubic-bezier(0.645, 0.045, 0.355, 1) 0.05s,
      margin-top 0.35s ease 0.05s;
  }

  .card .bottom .bottom-bottom {
    position: absolute;
    bottom: 0.85rem;
    left: 1.15rem;
    right: 1.15rem;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    pointer-events: auto;
  }

  .card .bottom .bottom-bottom .social-links-container {
    display: flex;
    gap: 1rem;
    min-height: 20px;
  }

  .card .bottom .bottom-bottom .social-links-container a {
    display: grid;
    place-items: center;
    color: inherit;
  }

  .card .bottom .bottom-bottom .social-links-container svg {
    height: 20px;
    width: 20px;
    fill: var(--color-paper);
    filter: drop-shadow(0 5px 5px color-mix(in oklch, var(--color-ink) 18%, transparent));
    transition: fill 0.5s ease, transform 0.5s ease;
  }

  .card .bottom .bottom-bottom .social-links-container a:hover svg,
  .card .bottom .bottom-bottom .social-links-container a:focus-visible svg {
    fill: var(--color-signal);
    transform: scale(1.2);
  }

  .card .bottom .bottom-bottom .contact {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-paper);
    color: var(--color-ink);
    border: none;
    border-radius: 20px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.4rem 0.6rem;
    box-shadow: color-mix(in oklch, var(--color-ink) 14%, transparent) 0px 5px 5px 0px;
    transition: background 0.5s ease, color 0.5s ease;
    white-space: nowrap;
    cursor: pointer;
    pointer-events: auto;
  }

  .card .bottom .bottom-bottom .contact:hover,
  .card .bottom .bottom-bottom .contact:focus-visible {
    background: var(--color-signal-deep);
    color: var(--color-paper);
  }

  /* Desktop fine pointer: expand panel + reveal bio on hover / keyboard focus */
  @media (hover: hover) and (pointer: fine) {
    .card:hover,
    .card:focus-within {
      border-top-left-radius: 55px;
    }

    .card:hover .bottom,
    .card:focus-within .bottom {
      top: 16%;
      border-radius: 80px 29px 29px 29px;
      transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
    }

    .card:hover .bottom .content,
    .card:focus-within .bottom .content {
      top: 4.35rem;
    }

    .card:hover .bottom .content .about-me,
    .card:focus-within .bottom .content .about-me {
      opacity: 1;
      max-height: 5.5rem;
      margin-top: 0.5rem;
    }

    .card:hover .profile-pic,
    .card:focus-within .profile-pic {
      width: 100px;
      height: 100px;
      aspect-ratio: 1;
      top: 10px;
      left: 10px;
      border-radius: 50%;
      z-index: 3;
      border: 7px solid var(--color-ink);
      box-shadow: color-mix(in oklch, var(--color-ink) 20%, transparent) 0px 5px 5px 0px;
      transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
    }

    .card:hover .profile-pic:hover {
      transform: scale(1.3);
      border-radius: 0px;
    }

    .card:hover .profile-pic .avatar-face,
    .card:hover .profile-pic .avatar-img,
    .card:focus-within .profile-pic .avatar-face,
    .card:focus-within .profile-pic .avatar-img {
      /* Mild zoom — stronger scale clipped crowns with cover framing */
      transform: scale(1.06);
      transform-origin: center center;
      transition: all 0.5s ease-in-out 0.5s;
    }

    .card:hover .profile-pic .avatar-role,
    .card:focus-within .profile-pic .avatar-role {
      opacity: 0;
    }
  }

  /* Touch / no-hover: bio readable by default (expanded chrome) */
  @media (hover: none) {
    .card {
      border-top-left-radius: 55px;
    }

    .card .bottom {
      top: 16%;
      border-radius: 80px 29px 29px 29px;
    }

    .card .bottom .content {
      top: 4.35rem;
    }

    .card .bottom .content .about-me {
      opacity: 1;
      max-height: 5.5rem;
      margin-top: 0.5rem;
    }

    .card .profile-pic {
      width: 100px;
      height: 100px;
      aspect-ratio: 1;
      top: 10px;
      left: 10px;
      border-radius: 50%;
      z-index: 3;
      border: 7px solid var(--color-ink);
      box-shadow: color-mix(in oklch, var(--color-ink) 20%, transparent) 0px 5px 5px 0px;
    }

    .card .profile-pic .avatar-face,
    .card .profile-pic .avatar-img {
      transform: scale(1.06);
      transform-origin: center center;
    }

    .card .profile-pic .avatar-role {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .card .profile-pic,
    .card .bottom,
    .card .bottom .content,
    .card .profile-pic .avatar-face,
    .card .profile-pic .avatar-img,
    .card .mail,
    .card .mail svg,
    .card .bottom .bottom-bottom .contact,
    .card .bottom .bottom-bottom .social-links-container svg,
    .card .bottom .content .about-me {
      transition: none;
    }
  }
`;
