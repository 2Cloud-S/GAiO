# GEO AI Chat Demo

Zola-inspired multi-model chat window for the homepage **Search Shift** section.

Lightweight scripted demo only — no Zola clone, no auth, no live model APIs.

## Install

```bash
npm i animejs
```

## Wire-up

Imported from `app/page.tsx` as `GeoAiChatDemo` + `GeoShiftStatement`.

## Layout

- Desktop app window (~min-height 520–640px, max-width ~1100px)
- Retractable history sidebar (overlay drawer on narrow viewports)
- Large Zola-style composer: placeholder top-left; bottom bar with paperclip · model pill · send

## Demo flow (cursor-driven)

| Step | Model | Prompt | Result style |
|------|--------|--------|--------------|
| 1 | Claude | Best B2B analytics companies… | Structured + GEO attributes + cites |
| 2 | ChatGPT | How do brands get included… | Conversational + sources |
| 3 | Perplexity | Evidence patterns for citation… | Research cites |
| 4 | Gemini | Entity graph for GEO-ready firm | Bullet synthesis + metrics |
| 5 | Copilot | Workplace brief for AI answers | Concise + actions |

Per model: cursor → model pill → dropdown select → type in input → send → answer stream → history item updates → next.

No engine carousel / auto-sliding windows.

## Behavior

- Pause cursor demo on hover/focus; resume on leave
- Manual model select + history collapse always available
- `prefers-reduced-motion` / coarse pointer: skip cursor, still cycle answers
- IntersectionObserver pauses when offscreen
