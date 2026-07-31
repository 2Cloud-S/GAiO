<!-- Hallmark pre-emit critique: Philosophy 5 · Hierarchy 5 · Execution 5 · Specificity 5 · Restraint 5 · Variety 5 -->

# GEO Agency Website — Resource Framework

## 1. Purpose and build boundary

This document is the source of truth for converting the supplied visual references into one coherent Generative Engine Optimization agency website. It is intentionally written before implementation so that every future design reference has a dedicated role, a reason to exist, and clear adaptation rules.

The site will present GEO as a strategic, technical service that improves a business’s discoverability, clarity, and citation readiness across generative search surfaces and Google’s AI-powered search experiences. It must not imply guaranteed placement, ownership of third-party AI results, or unverifiable performance outcomes.

### Primary conversion

Book a GEO opportunity call.

### Secondary conversion

Start a GEO readiness assessment.

### Audience

Founders, marketing leaders, SEO leads, and growth teams who understand search value but may be unfamiliar with Generative Engine Optimization.

## 2. Working creative direction — “Signal / Proof”

The website should feel like an expert research-and-growth partner, not a generic futuristic AI template.

| Element | Direction |
| --- | --- |
| Core feeling | Precise, editorial, quietly high-performance, technically fluent |
| Base palette | Obsidian `#141414`, graphite `#1B1B1B`, warm paper `#F3F3F3`, soft grey `#E1E1E1` |
| Signal accent | Acid-lime/chartreuse, used only for active states, annotations, and proof signals |
| Typography | A confident grotesk display face, an exceptionally readable sans body face, and restrained mono metadata |
| Layout | Large editorial type, clear evidence bands, generous spacing, thin rules, rounded but not bubble-like corners |
| Texture | Very subtle particle field / globe depth / print-like data texture; no decorative gradients by default |
| Motion voice | Measured signal movement: scanning, counting, morphing, revealing. Motion explains a concept; it never decorates empty space. |

### Non-negotiable visual rules

- Keep the monochrome foundation from `popular-dragonfly-22.tsx`; replace its pure black-and-white rigidity with accessible tonal layers and one signal accent.
- Use no more than one major animated device per viewport. For example, a globe and particles must not compete in the same hero view.
- Retain effect signatures, not their original sample copy, colors, dimensions, or unrelated brand marks.
- Do not reproduce fake browser/OS chrome from references. Information should appear as honest cards, evidence panels, or interactive content.
- Support reduced motion, keyboard focus, readable contrast, and a fully usable mobile layout.

## 3. Global content integrity rules

- Any currently unknown result, client, testimonial, logo, certification, ranking, or metric is a clearly labelled staging placeholder. It cannot be presented as factual proof at launch.
- Placeholder testimonials should read like credible, specific draft copy, but carry an internal `REPLACE BEFORE LAUNCH` data flag until approved.
- Number tickers only animate verified figures. Until numbers are provided, use qualitative proof or a neutral “metric to confirm” placeholder.
- Claims should use language such as “designed to improve visibility,” “optimize for citation,” and “measure presence,” not “guaranteed #1 ranking.”

## 4. Information architecture and section ownership

| # | Section | Job | Principal resources | Resource treatment |
| --- | --- | --- | --- | --- |
| 1 | Navigation | Make services, methodology, proof, insights, and contact immediately discoverable. | `PulsatingButton.tsx` | Use a compact floating/lightly elevated navigation; reserve the pulse for the one “Book a strategy call” CTA. |
| 2 | Hero — “Be the answer AI finds” | Establish GEO, distinguish it from conventional SEO, and drive the first CTA. | `Line_Shadow_Text.tsx`, `MorphingText.tsx`, `Globe.tsx` | Line-shadow animates one key phrase only. The morph changes `SEO → GEO → AI visibility`, not the primary heading. Globe is a dim, clipped geographic signal field behind the hero—not a full decorative background. |
| 3 | The search shift | Explain why marketing now has to earn inclusion in generated answers. | `Text_3D_Flip.tsx`, `Dia_Text_Reveal.tsx` | Use the 3D flip for a short evolving phrase (for example, “rankings / recommendations / answers”). Use the reveal to introduce the central explanation, not every paragraph. |
| 4 | Engine landscape | Show which generative search environments the agency optimizes for. | `Icon_Cloud.tsx`, `Particles.tsx` | Icon cloud is the visual focal point with legible, accessible engine labels beside it. Particles appear at very low opacity only in this contained dark panel if needed. |
| 5 | GEO operating system | Make the service feel concrete: discovery, entity/content architecture, authority signals, testing, monitoring. | `animated-beam-demo.tsx`, `Kinetic_Text.tsx`, `fat-rattlesnake-0.tsx` | Rebuild the beam as an explainable flow between five named stages. Kinetic text becomes a single section divider. Repurpose the printing animation into a compact “publish → parse → validate” signal, not a giant background. |
| 6 | What we optimize | Translate technical work into client outcomes without shallow feature cards. | `big-chipmunk-8.tsx`, `afraid-lionfish-0.tsx` | Use the orbiting / scan-line behavior for an entity-and-source relationship card. Convert the hover expansion into a transparent “inspect the signal” disclosure card; remove its traffic-light dots and skew gimmick. |
| 7 | Proof of presence | Demonstrate the kind of evidence clients receive: cited pages, answer snapshots, source coverage, and visibility tracking. | `Pixel_Image.tsx`, `Number_Ticker.tsx`, `Text_Highlighter.tsx` | Pixel reveal introduces proof imagery. Tickers only activate after verified data is supplied. Highlighter marks terms inside actual, approved sample result excerpts—not invented rankings. |
| 8 | AI-result gallery | Show examples of optimised content appearing in AI-query contexts. | `Marquee.tsx` | Two slow, pause-on-hover marquee tracks contain labelled sample “query → cited source” cards. Use static cards on mobile; never make key evidence impossible to read. |
| 9 | Client perspective | Give the page human credibility and a sense of ongoing momentum. | `Scroll_Based_Velocity.tsx` | Use velocity as a slim moving testimonial/perspective tape above accessible static testimonial cards. Do not put long quotes inside fast moving text. |
| 10 | Team | Humanise the specialist team and show relevant disciplines. | `stupid-bullfrog-39.tsx` | Preserve the detailed card interaction concept, but simplify it into calm team profile cards with role, specialty, and one expandable detail. Remove visual noise and any decorative email-centric behavior. |
| 11 | Insights / ranked content | Turn thought leadership into a second proof surface. | `chilly-dragon-63.tsx`, `pretty-dolphin-6.tsx`, `Text_Highlighter.tsx` | The outer card becomes a premium editorial article card. The inner interaction becomes article-level save/share/reading-progress utility, not social-like decoration. Highlight only substantive GEO phrases. |
| 12 | FAQ | Resolve objections about scope, timelines, reporting, ethical claims, and client input. | `collpase.jsx` / DaisyUI Collapse | Build accessible native disclosure/accordion behavior styled with the GEO tokens. Keep keyboard semantics; do not depend on DaisyUI as a design system. |
| 13 | Assessment request | Capture qualified project details with low cognitive load. | `brave-kangaroo-30.tsx`, Untitled UI progress-step reference | Rebuild as a three-step form: business context → goals & current presence → contact details. Retain the form’s tactile card feel, but replace all original colors, labels, and `styled-components` implementation. |
| 14 | Call booking | Offer a deliberate booking route for high-intent visitors. | Untitled UI calendar reference | Recreate an accessible, responsive availability picker within the site theme. It is an interaction design reference only; real availability requires a later calendar integration. |
| 15 | Successful submission | Close the loop clearly after the form is submitted. | `warp-background.tsx` | Use a contained warp/signal field behind a concise success state with next steps—not a full-page visual effect. |
| 16 | Footer / referral card | Provide contact routes, social profiles, and a shareable QR card. | `massive-insect-5.tsx`, `dull-dolphin-40.tsx` | Convert the social effect into branded, high-contrast icon links with text labels. Use the QR treatment for a “share this assessment” card; QR destination remains a launch-time configuration. |
| 17 | 404 page | Keep an accidental dead end on-brand and useful. | `lazy-eel-99.tsx` | Adapt the cosmic/earth movement into a restrained “signal lost” scene with navigation back to services, insights, and home. |

## 5. Resource disposition ledger

### Directly reusable as a component pattern

| Reference | Keep | Change before use |
| --- | --- | --- |
| `Line_Shadow_Text.tsx` | Moving shadow treatment on a single word | Remove italic styling; bind shadow color to theme tokens. |
| `Number_Ticker.tsx` | Count-up mechanics | Trigger on viewport entry once; use only verified numbers. |
| `MorphingText.tsx` | Smooth word morph | Limit the word list to three short terms and provide a static reduced-motion fallback. |
| `Text_Highlighter.tsx` | Marker/highlight emphasis | Chartreuse marker with dark text contrast; never highlight whole paragraphs. |
| `Text_3D_Flip.tsx` | Short word/phrase transition | Use for one compact concept, with no perpetual distracting loop. |
| `Kinetic_Text.tsx` | Kinetic section-break energy | Scale down from demo size; use as an interstitial, not body copy. |
| `Pixel_Image.tsx` | Pixelated evidence reveal | Use client-approved imagery and meaningful text alternatives. |
| `Marquee.tsx` | Seamless, pauseable horizontal movement | Slow it down; keyboard focus and mobile get a non-moving presentation. |
| `Icon_Cloud.tsx` | Engine ecosystem visual | Replace unrelated technology slugs with approved engine/platform marks; list names in semantic text. |
| `PulsatingButton.tsx` | CTA urgency signal | One primary CTA per view; disable constant pulse under reduced motion. |
| `Globe.tsx` | Geographic / network depth | Change colors, opacity, and density to match the proof system. |
| `Particles.tsx` | Atmospheric micro-texture | Restrict to one bounded panel; use a static dot texture fallback. |
| `warp-background.tsx` | Post-submit “signal received” field | Contain to success card; ensure content sits above it at AA contrast. |
| `animated-beam-demo.tsx` | Connection and routing motion | Replace generic icons with GEO process nodes and label every connection. |
| `Scroll_Based_Velocity.tsx` | Scroll-reactive tape | Use only for short statements and cap velocity for readability. |
| `Dia_Text_Reveal.tsx` | Deliberate text reveal | Use once for the “why GEO” thesis. |

### References to rebuild, not import wholesale

| Reference | Retained signature | GEO translation |
| --- | --- | --- |
| `popular-dragonfly-22.tsx` | Stacked monochrome palette logic | Becomes the token foundation described in Section 2. |
| `big-chipmunk-8.tsx` | Orbital icons + vertical scanning beam | “Entity signal map” in the optimization section. |
| `afraid-lionfish-0.tsx` | Compact card that reveals detail | “Inspect a citation signal” disclosure card, without fake desktop chrome. |
| `fat-rattlesnake-0.tsx` | Rhythmic printing/processing mechanism | Content publication-to-indexing micro-visual in the methodology. |
| `massive-insect-5.tsx` | Animated social presentation | Branded footer social links, redesigned for accessibility and consistency. |
| `brave-kangaroo-30.tsx` | Tactile, dimensional form shell | Three-step GEO assessment form. |
| `stupid-bullfrog-39.tsx` | Rich profile-card interaction | Team expertise cards with a focused, professional interaction. |
| `chilly-dragon-63.tsx` | High-depth card composition | Insight / case-study preview cards. |
| `pretty-dolphin-6.tsx` | Detail-page micro interaction | Blog reading actions and evidence annotation treatment. |
| `dull-dolphin-40.tsx` | QR card structure | Share / referral / quick-start QR card. |
| `lazy-eel-99.tsx` | Cosmic motion and strong illustration energy | Signal-lost 404 page, simplified to protect performance. |
| `collpase.jsx` | Disclosure behavior | FAQ component using semantic `<details>` or an accessible accordion primitive. |

### Do not use unchanged

- The empty `progress-steps.tsx` file has no usable source. The supplied Untitled UI screenshot defines the desired progression structure; it will be recreated from that interaction brief.
- The calendar has been supplied as a visual reference, not local source. It will be rebuilt in the project’s design system and only connected to real scheduling data after a provider is chosen.
- Magic UI demo imports use `@/registry/...` paths. These are examples, not drop-in production imports for this empty project.
- `styled-components` is present in multiple Uiverse files, but it will not be introduced solely for those fragments. Their ideas will be translated into the selected project styling system.

## 6. Motion and accessibility contract

1. Major effects appear only once per story beat: hero signal, engine cloud, methodology beam, proof reveal, success state.
2. Motion uses transform and opacity rather than layout shifts.
3. Every automated movement pauses on hover where content may be read, and has a reduced-motion version.
4. Marquees and velocity rows are supporting texture only; essential testimonial and proof content remains static and keyboard reachable.
5. Focus styles, form errors, loading, submission success, disabled controls, and keyboard accordion behavior are designed states—not afterthoughts.

## 7. Build sequence after framework approval

1. Create the project shell, token layer, typography pairing, responsive spacing scale, and utility primitives.
2. Build page structure and final information architecture before adding visual effects.
3. Implement the Hero, engine landscape, GEO operating system, and proof sections with the mapped effects.
4. Add forms, booking interface, success state, FAQ, blog, team, and footer interactions.
5. Replace staging content with approved brand copy, verified metrics, client permissions, social URLs, QR destination, and real calendar integration.
6. Verify at 320px, 375px, 414px, 768px, desktop, keyboard-only, and reduced-motion settings.

## 8. Inputs still needed before production content is final

- Agency name, logo, domain, legal company name, and social destinations.
- Final approved description of services and any certification claims.
- Client permissions, real case-study evidence, metrics, testimonials, and engine logos that may be displayed.
- Calendar provider / booking workflow and the inbox or CRM endpoint for form submissions.
- Preferred primary CTA wording if different from “Book a strategy call.”

## 9. Acceptance check for every future resource

A newly supplied reference is accepted only when it can answer all five questions:

1. Which exact section does it serve?
2. What user understanding or action does it improve?
3. Which effect, texture, or interaction is worth retaining?
4. What must change to obey the Signal / Proof theme?
5. What is the static, accessible, and mobile-safe fallback?

If it cannot pass this check, it remains a source of inspiration rather than a production component.
