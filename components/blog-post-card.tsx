"use client";

import Link from "next/link";
import styled from "styled-components";

export type BlogPostCardProps = {
  title: string;
  subtitle?: string;
  href: string;
  image?: string | null;
  likes?: number;
  comments?: number;
  views?: number;
};

function formatCount(n: number) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}

export function BlogPostCard({
  title,
  subtitle = "Insight",
  href,
  image,
  likes = 0,
  comments = 0,
  views = 0,
}: BlogPostCardProps) {
  return (
    <StyledWrapper>
      <article className="main">
        <div className="card-stage">
          <div className="card_back" aria-hidden="true" />
          <Link className="card-link" href={href} aria-label={`Read ${title}`}>
            <div className="card">
              <div className="card_media">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" />
                ) : (
                  <span className="card_fallback" aria-hidden="true">
                    <span className="card_fallback_mark">{title.charAt(0)}</span>
                  </span>
                )}
                <span className="card_scrim" aria-hidden="true" />
              </div>
              <div className="fl" aria-hidden="true">
                <span className="fullscreen">
                  <svg viewBox="0 0 100 100" className="fullscreen_svg">
                    <path d="M3.563-.004a3.573 3.573 0 0 0-3.527 4.09l-.004-.02v28.141c0 1.973 1.602 3.57 3.57 3.57s3.57-1.598 3.57-3.57V12.218v.004l22.461 22.461a3.571 3.571 0 0 0 6.093-2.527c0-.988-.398-1.879-1.047-2.523L12.218 7.172h19.989c1.973 0 3.57-1.602 3.57-3.57s-1.598-3.57-3.57-3.57H4.035a3.008 3.008 0 0 0-.473-.035zM96.333 0l-.398.035.02-.004h-28.16a3.569 3.569 0 0 0-3.57 3.57 3.569 3.569 0 0 0 3.57 3.57h19.989L65.323 29.632a3.555 3.555 0 0 0-1.047 2.523 3.571 3.571 0 0 0 6.093 2.527L92.83 12.221v19.985a3.569 3.569 0 0 0 3.57 3.57 3.569 3.569 0 0 0 3.57-3.57V4.034v.004a3.569 3.569 0 0 0-3.539-4.043l-.105.004zM3.548 64.23A3.573 3.573 0 0 0 .029 67.8v28.626-.004l.016.305-.004-.016.004.059v-.012l.039.289-.004-.023.023.121-.004-.023c.074.348.191.656.34.938l-.008-.02.055.098-.008-.02.148.242-.008-.012.055.082-.008-.012c.199.285.43.531.688.742l.008.008.031.027.004.004c.582.461 1.32.742 2.121.762h.004l.078.004h28.61a3.569 3.569 0 0 0 3.57-3.57 3.569 3.569 0 0 0-3.57-3.57H12.224l22.461-22.461a3.569 3.569 0 0 0-2.492-6.125l-.105.004h.008a3.562 3.562 0 0 0-2.453 1.074L7.182 87.778V67.793a3.571 3.571 0 0 0-3.57-3.57h-.055.004zm92.805 0a3.573 3.573 0 0 0-3.519 3.57v19.993-.004L70.373 65.328a3.553 3.553 0 0 0-2.559-1.082h-.004a3.573 3.573 0 0 0-3.566 3.57c0 1.004.414 1.91 1.082 2.555l22.461 22.461H67.802a3.57 3.57 0 1 0 0 7.14h28.606c.375 0 .742-.059 1.082-.168l-.023.008.027-.012-.02.008.352-.129-.023.008.039-.02-.02.008.32-.156-.02.008.023-.016-.008.008c.184-.102.34-.207.488-.32l-.008.008.137-.113-.008.004.223-.211.008-.008c.156-.164.301-.34.422-.535l.008-.016-.008.016.008-.02.164-.285.008-.02-.008.016.008-.02c.098-.188.184-.406.246-.633l.008-.023-.004.008.008-.023a3.44 3.44 0 0 0 .121-.852v-.004l.004-.078V67.804a3.569 3.569 0 0 0-3.57-3.57h-.055.004z" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="meta">
          <div className="text">
            <Link className="text_m" href={href}>
              {title}
            </Link>
            <div className="text_s">{subtitle}</div>
          </div>
        </div>

        <div className="btns">
          <div className="stat likes" aria-label={`${likes} likes`}>
            <svg className="stat_svg" viewBox="-2 0 105 92" aria-hidden="true">
              <path d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71Z" />
            </svg>
            <span className="stat_text">{formatCount(likes)}</span>
          </div>
          <div className="stat comments" aria-label={`${comments} comments`}>
            <svg className="stat_svg" viewBox="-405.9 238 56.3 54.8" aria-hidden="true">
              <path d="M-391 291.4c0 1.5 1.2 1.7 1.9 1.2 1.8-1.6 15.9-14.6 15.9-14.6h19.3c3.8 0 4.4-.8 4.4-4.5v-31.1c0-3.7-.8-4.5-4.4-4.5h-47.4c-3.6 0-4.4.9-4.4 4.5v31.1c0 3.7.7 4.4 4.4 4.4h10.4v13.5z" />
            </svg>
            <span className="stat_text">{formatCount(comments)}</span>
          </div>
          <div className="stat views" aria-label={`${views} views`}>
            <svg className="stat_svg" viewBox="0 0 30.5 16.5" aria-hidden="true">
              <path d="M15.3 0C8.9 0 3.3 3.3 0 8.3c3.3 5 8.9 8.3 15.3 8.3s12-3.3 15.3-8.3C27.3 3.3 21.7 0 15.3 0zm0 14.5c-3.4 0-6.2-2.8-6.2-6.2C9 4.8 11.8 2 15.3 2c3.4 0 6.2 2.8 6.2 6.2 0 3.5-2.8 6.3-6.2 6.3z" />
            </svg>
            <span className="stat_text">{formatCount(views)}</span>
          </div>
        </div>
      </article>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  min-width: 0;
  height: 100%;

  .main {
    --card-w: 100%;
    --meta-h: 3.25rem;
    --stats-h: 1.75rem;
    --pad: 0.85rem;
    position: relative;
    display: grid;
    grid-template-rows: auto var(--meta-h) var(--stats-h);
    row-gap: 0.75rem;
    width: 100%;
    max-width: 100%;
    min-height: 0;
    padding: var(--pad);
    isolation: isolate;
  }

  .card-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    z-index: 1;
  }

  .card-link {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
    position: relative;
    z-index: 1;
  }

  .card {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-md);
    overflow: clip;
    background: var(--color-ink-soft);
    border: 1px solid color-mix(in oklch, var(--color-ink) 12%, transparent);
    cursor: pointer;
    translate: 0 0;
    scale: 1;
    transition:
      translate var(--dur-base) var(--ease-out),
      scale var(--dur-base) var(--ease-out),
      border-color var(--dur-base) var(--ease-out),
      box-shadow var(--dur-base) var(--ease-out);
    box-shadow: 0 0.35rem 1rem color-mix(in oklch, var(--color-ink) 8%, transparent);
  }

  .card_media {
    position: absolute;
    inset: 0;
    background: var(--color-ink-soft);
  }

  .card_media img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  .card_fallback {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background:
      linear-gradient(145deg, var(--color-ink) 0%, var(--color-graphite) 55%, var(--color-ink-soft) 100%);
  }

  .card_fallback_mark {
    font: 800 clamp(2.5rem, 8vw, 3.5rem) / 1 var(--font-display);
    letter-spacing: var(--tracking-headline);
    color: color-mix(in oklch, var(--color-paper) 72%, transparent);
    text-transform: uppercase;
    user-select: none;
  }

  .card_scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 42%,
      color-mix(in oklch, var(--color-ink) 55%, transparent) 100%
    );
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out);
    pointer-events: none;
  }

  .fl {
    position: absolute;
    inset: 0 auto auto 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    padding: 0.65rem;
    opacity: 0;
    translate: 0 -0.25rem;
    transition:
      opacity var(--dur-base) var(--ease-out),
      translate var(--dur-base) var(--ease-out);
    pointer-events: none;
  }

  .fullscreen {
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 0.35rem;
    background: color-mix(in oklch, var(--color-ink) 72%, transparent);
    border: 1px solid color-mix(in oklch, var(--color-paper) 18%, transparent);
    display: grid;
    place-items: center;
    backdrop-filter: blur(6px);
  }

  .fullscreen_svg {
    width: 0.85rem;
    height: 0.85rem;
    fill: var(--color-paper-soft);
  }

  .card_back {
    position: absolute;
    inset: 0.55rem -0.35rem -0.55rem 0.55rem;
    border-radius: var(--radius-md);
    background: color-mix(in oklch, var(--color-ink) 78%, transparent);
    border: 1px solid color-mix(in oklch, var(--color-ink) 20%, transparent);
    z-index: 0;
    translate: 0 0;
    scale: 1;
    opacity: 0.55;
    transition:
      inset var(--dur-base) var(--ease-out),
      translate var(--dur-base) var(--ease-out),
      scale var(--dur-base) var(--ease-out),
      opacity var(--dur-base) var(--ease-out);
    pointer-events: none;
  }

  .meta {
    display: flex;
    align-items: center;
    height: var(--meta-h);
    min-height: var(--meta-h);
    max-height: var(--meta-h);
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.15rem;
    min-width: 0;
    width: 100%;
    font-family: var(--font-body);
    color: var(--color-ink);
  }

  .text_m {
    font-weight: 700;
    font-size: 0.9rem;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
  }

  .text_m:hover {
    text-decoration: underline;
    text-underline-offset: 0.12em;
  }

  .text_s {
    font-size: 0.72rem;
    line-height: 1.2;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btns {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    height: var(--stats-h);
    min-height: var(--stats-h);
    position: relative;
    z-index: 1;
  }

  .stat {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.28rem;
    min-width: 2.6rem;
    height: 1.45rem;
    padding: 0 0.4rem;
    border-radius: 0.35rem;
    background: var(--color-graphite);
    color: var(--color-paper);
    opacity: 0;
    translate: 0 0.2rem;
    transition:
      opacity var(--dur-base) var(--ease-out),
      translate var(--dur-base) var(--ease-out),
      background var(--dur-fast) var(--ease-out);
  }

  .likes {
    transition-delay: 0ms;
  }
  .comments {
    transition-delay: 40ms;
  }
  .views {
    transition-delay: 80ms;
  }

  .stat_text {
    font-family: var(--font-body);
    font-size: 0.75rem;
    line-height: 1;
    color: var(--color-paper);
  }

  .stat_svg {
    width: 0.72rem;
    height: 0.72rem;
    fill: var(--color-paper);
    flex-shrink: 0;
  }

  .main:hover .card,
  .main:focus-within .card {
    translate: 0 -0.35rem;
    scale: 1.01;
    border-color: color-mix(in oklch, var(--color-ink) 28%, transparent);
    box-shadow: 0 0.85rem 1.75rem color-mix(in oklch, var(--color-ink) 16%, transparent);
  }

  .main:hover .card_back,
  .main:focus-within .card_back {
    inset: -0.55rem -0.15rem -0.85rem -0.15rem;
    scale: 1.04;
    opacity: 0.85;
  }

  .main:hover .fl,
  .main:focus-within .fl {
    opacity: 1;
    translate: 0 0;
  }

  .main:hover .card_scrim,
  .main:focus-within .card_scrim {
    opacity: 0.28;
  }

  .main:hover .stat,
  .main:focus-within .stat {
    opacity: 1;
    translate: 0 0;
  }

  .stat:hover {
    background: var(--color-ink);
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .card_back,
    .fl,
    .stat,
    .card_scrim {
      transition: none;
    }

    .main:hover .card,
    .main:focus-within .card {
      translate: 0 0;
      scale: 1;
    }

    .main:hover .card_back,
    .main:focus-within .card_back {
      scale: 1;
    }
  }
`;
