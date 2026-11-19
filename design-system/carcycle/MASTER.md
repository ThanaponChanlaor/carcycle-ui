# CarCycle design system (MASTER)

Global source of truth for all UI work. If `design-system/carcycle/pages/<page>.md` exists, its rules override this file for that page.

**Audience:** Thai users, many aged 60+. Thai is the interface language.

## Direction

The original blue-and-white look (owner rated it 8/10): white rounded cards with a thin border and a light shadow on a `slate-50` page, with blue as the action colour. This redesign keeps that look and fixes only what made it hard for older users to read and tap: small text, faded grey text, short buttons, faint input borders, a search box with no visible label, and mixed English.

Owner decisions (2026-11-19): IBM Plex Sans Thai (no loops), 16px body text, licence plate shown as plain text (no plate graphic).

## Colour

Tailwind's default palette plus `primary-50..900` (Tailwind blue), defined in `src/index.css`. Contrast is WCAG 2.x against the background listed.

| Use | Class | Contrast |
|---|---|---|
| Page background | `bg-slate-50` | n/a |
| Cards, inputs, dialogs | `bg-white` | n/a |
| Body text, headings | `text-slate-900` | 17.85:1 on white |
| Secondary text, hints, dates | `text-slate-600` (minimum) | 7.58:1 on white, 7.24:1 on slate-50 |
| Field labels | `text-slate-700 font-semibold` | 10.35:1 on white |
| Primary button | `bg-primary-600 text-white`, hover `bg-primary-700` | 5.17:1 / 6.70:1 |
| Links, secondary button text | `text-primary-700`, border `primary-600` | 6.70:1 on white |
| Current nav item, saved notice | `bg-primary-50 text-primary-800` | 8.01:1 |
| Errors (always with icon and text) | `text-red-700` on `bg-red-50` / white | 6.47:1 on white |
| Input borders | `border-slate-500` | 4.76:1 on white (needs 3:1) |
| Focus outline | 2px `primary-600`, offset 2px | 5.17:1 on white, 4.94:1 on slate-50 |
| Decorative dividers, card borders | `border-slate-200` | n/a (decorative) |

**Never use `text-slate-400` or `text-slate-500` on text.** They are 2.56:1 and 4.76:1. `slate-400` is allowed only on decorative, `aria-hidden` shapes.

## Type

- **Family:** IBM Plex Sans Thai, self-hosted through `@fontsource/ibm-plex-sans-thai`, weights 400, 600 and 700. Inter is not used because it has no Thai glyphs.
- **Scale:** body 16px (`text-base`), secondary text also 16px, emphasised lines 18px (`text-lg`), h3 20px, h2 24px, h1 30px rising to 36px from `md`. Set in rem so browser settings apply.
- **Do not use `text-xs` or `text-sm` on text.** Nothing may be smaller than 16px.
- **Line-height:** 1.6 for body and `text-lg`, and `leading-snug` for headings. Thai needs room for stacked vowels and tone marks.
- No uppercase, no letter-spaced labels, no monospace for Thai.
- Write dates in full (`15 มีนาคม 2570`) and mileage as `48,000 กม.`, using the helpers in `src/utils/format.ts`.

## Space and shape

- Content width is `container-app` (`max-w-7xl`).
- `Card`: `rounded-xl border border-slate-200 bg-white p-6 shadow-sm`. Clickable cards add `hover:shadow-md hover:border-primary-600`.
- Home is a grid of 1, 2 or 3 car cards. The car page puts details (2/3 width) beside the QR code (1/3), with the history card below.
- Controls use an 8px radius (`rounded-lg`).

## Components

- **Button / ButtonLink:** at least 48px high, 16px semibold text. Variants are `primary`, `secondary` (outline) and `quiet` (underlined link). Use at most one `primary` per view.
- **Field:** label above the input, then an optional hint, the input (at least 52px high, 1px `slate-500` border), a note (for example the chosen date in Thai) and the error. Never use a placeholder as the only label.
- **Dialog / ConfirmDialog:** native `<dialog>` with a rounded-xl card and a `slate-900/60` backdrop. Always has a visible way out.
- **Icons:** `lucide-react`, 24px, always next to visible text and `aria-hidden`. No emoji.

## Elderly UX rules (must not be violated)

- Text at least 16px, text contrast at least 4.5:1 (aim for 7:1).
- Tap targets at least 48x48px, at least 8px apart. No icon-only buttons.
- A visible focus outline on every control, including inside dialogs. Never `outline-none` on a control without a replacement.
- Labels above fields. Errors in plain language next to the field, plus a summary that links to each one.
- Never use colour alone to convey meaning: pair it with an icon or text.
- Irreversible actions need a confirmation step or a clear way back.
- No hidden gestures, timeouts or auto-advancing content. Motion only for hover colour and the spinner, and none under `prefers-reduced-motion`.
- All text is in Thai. The layout must hold at 375px wide and at 200% zoom.
