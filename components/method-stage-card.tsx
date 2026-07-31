"use client";

import styled from "styled-components";

export type MethodStageCardProps = {
  index: string;
  title: string;
  detail: string;
};

export function MethodStageCard({ index, title, detail }: MethodStageCardProps) {
  return (
    <StyledWrapper>
      <article className="card" aria-label={`${index} ${title}`}>
        <div className="align" aria-hidden="true">
          <span className="red" />
          <span className="yellow" />
          <span className="green" />
        </div>
        <h3>
          <span className="stage-index">{index}</span> {title}
        </h3>
        <p>{detail}</p>
      </article>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  .card {
    width: 100%;
    min-height: 15.875rem;
    height: auto;
    padding: 0.5rem;
    background: color-mix(in oklch, var(--color-paper) 72%, transparent);
    border-radius: 8px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-bottom: 3px solid color-mix(in oklch, var(--color-ink) 18%, transparent);
    border-left: 2px outset color-mix(in oklch, var(--color-ink) 28%, transparent);
    box-shadow: -1.5rem 1.75rem 1.5rem color-mix(in oklch, var(--color-ink) 12%, transparent);
    transform: none;
    transition:
      height 0.4s var(--ease-out),
      min-height 0.4s var(--ease-out),
      transform 0.4s var(--ease-out),
      background 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out);
    overflow: hidden;
    color: var(--color-ink);
  }

  @media (hover: hover) and (pointer: fine) {
    .card {
      height: 15.875rem;
      transform: skewX(10deg);
    }

    .card:hover,
    .card:focus-within {
      height: auto;
      min-height: 15.875rem;
      transform: skewX(0deg);
      background: color-mix(in oklch, var(--color-paper) 88%, transparent);
      box-shadow: -0.75rem 1.25rem 1.75rem color-mix(in oklch, var(--color-ink) 14%, transparent);
    }
  }

  .card .align {
    padding: 0.85rem 0.85rem 0;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-self: flex-start;
  }

  .card .red,
  .card .yellow,
  .card .green {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: -5px 5px 5px color-mix(in oklch, var(--color-ink) 18%, transparent);
  }

  .card .red {
    background-color: #ff605c;
  }

  .card .yellow {
    background-color: #ffbd44;
  }

  .card .green {
    background-color: #00ca4e;
  }

  .card h3 {
    text-align: left;
    margin: 1.1rem 0.65rem 0.75rem;
    color: var(--color-ink);
    font: 800 var(--text-xl) / var(--leading-tight) var(--font-display);
    letter-spacing: var(--tracking-tight);
    text-shadow: -6px 4px 10px color-mix(in oklch, var(--color-ink) 18%, transparent);
  }

  .card .stage-index {
    display: block;
    margin-bottom: 0.35rem;
    font: 700 var(--text-xs) / 1 var(--font-mono);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--color-muted);
    text-shadow: none;
  }

  .card p {
    margin: 0 0.65rem 1rem;
    color: var(--color-graphite);
    font-size: var(--text-sm);
    line-height: var(--leading-lede);
    text-align: left;
  }

  @media (prefers-reduced-transparency: reduce) {
    .card {
      background: var(--color-paper);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transform: none !important;
      transition: none;
      height: auto !important;
      min-height: 15.875rem;
    }
  }
`;
