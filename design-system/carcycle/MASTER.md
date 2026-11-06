# CarCycle design system (MASTER)

Global source of truth for all UI work. If `design-system/carcycle/pages/<page>.md` exists, its rules override this file for that page.

**Provenance:** hand-written from the `ui-ux-pro-max` data files (`ui-reasoning.csv` rows 13 and 57, `products.csv`, `styles.csv` "Accessible & Ethical", `typography.csv`, `google-fonts.csv`, `quick-reference.md`). The `--design-system` generator was not run because Python was not available on the machine. Dials applied by hand: density 2-3, motion 1-2, variance 4-5.

**Audience:** Thai users aged 60+. Thai is the interface language.

## Direction: สมุดประจำรถ (the car's logbook)

A well-kept paper service book, not a dashboard: ruled rows, plain labels, dates written in full.

The one memorable element is the Thai licence plate (`LicensePlate`). Everything around it stays quiet. Do not add a second signature element.

## Color

| Token | Value | Use | Contrast |
|---|---|---|---|
| `paper` | `#FAF7F0` | Page background | n/a |
| `surface` | `#FFFFFF` | Plate, inputs, dialogs | n/a |
| `tint` | `#EFE9DD` | Image placeholder | n/a |
| `ink` | `#2B2118` | Body text | 14.7:1 on paper |
| `ink-muted` | `#4F4338` | Secondary text, field labels | 8.95:1 on paper |
| `primary` | `#114B3A` | Buttons, links, focus ring | 9.38:1 on paper, white on it 10.04:1 |
| `primary-hover` | `#0B3A2C` | Hover, pressed | White on it 12.68:1 |
| `primary-tint` | `#E6F0EB` | Hover on quiet controls | Primary on it 8.62:1 |
| `accent` | `#F2C230` | Current-page marker only, always with ink text | Ink on it 9.40:1 |
| `error` | `#8A1F11` | Errors, always with an icon and text | 8.59:1 on paper |
| `error-tint` | `#FBEAE6` | Error background | Error on it 7.88:1 |
| `rule` | `#D9D1C3` | Decorative ruled lines only | n/a |
| `border-control` | `#6E6155` | Input and control borders | 5.60:1 on paper (needs 3:1) |
| `disabled-bg` | `#E9E3D8` | Disabled controls, with `ink-muted` text | n/a |

Never use `accent` as a focus ring or as text on paper: it is 1.57:1 on paper. Tailwind's default palette is removed, so only these tokens exist.

## Type

- **Family:** IBM Plex Sans Thai Looped, self-hosted, weights 400, 500, 600, 700. Looped Thai forms are the ones older readers learned first. Nothing below 400.
- **Scale:** body 20px; minimum 18px; h3 24px; h2 28px; h1 36px. All in rem so browser settings apply.
- **Line-height:** 1.7 for text, 1.5 for headings. Thai needs room for stacked vowels and tone marks.
- `text-xs` and `text-sm` are redefined to 18px so nothing can fall below the minimum.
- No uppercase, no letter-spaced labels, no monospace for Thai.
- Dates are written in full: `15 มีนาคม 2570`. Mileage: `48,000 กม.`

## Space and shape

- 8px grid. Sections are 48-96px apart, rows 24px.
- One content column, max 60rem (960px).
- 8px radius on controls. No shadows. Separate content with ruled lines and whitespace.
- Prefer ruled rows to cards. `Card` is the exception, not the default.

## Motion

Only hover and pressed colour changes at 150ms, plus the loading spinner. Everything is disabled under `prefers-reduced-motion`. No scroll effects, entrance animation, carousels or timeouts.

## Components

- **Button / ButtonLink:** at least 52px high, 20px semibold text. Variants: `primary`, `secondary`, `quiet`. At most one `primary` per page.
- **Field:** label above, optional hint, input, then error. Never use a placeholder as a label.
- **Dialog / ConfirmDialog:** native `<dialog>`. Always has a visible way out.
- **Icons:** `lucide-react`, stroke 2, 24px, always beside visible text and `aria-hidden`. No emoji.

## Elderly UX rules (must not be violated)

- Body text at least 18px, line-height at least 1.5, no weight below 400.
- Text contrast at least 7:1, never below 4.5:1.
- Tap targets at least 48x48px, at least 8px apart.
- No icon-only buttons.
- One page, one main task, one dominant primary button.
- Labels above fields. Errors in plain language next to the field.
- Irreversible actions have a confirmation step or a clear way back.
- Navigation is the same on every page with an obvious way to Home. No hamburger.
- No hidden gestures, timeouts or auto-advancing content.
- Layout must hold at 200% text zoom.

## Never

Purple or blue gradients, glassmorphism, glows, soft shadows, emoji icons, oversized slogan heroes, grids of identical cards, Inter or Roboto, cream plus terracotta plus serif.

## Accepted exceptions

- **Home** has no single primary button: each car has its own equal "ดูข้อมูลรถ" action.
- **Car page for non-admins** is read-only, so it has no primary action to offer.
