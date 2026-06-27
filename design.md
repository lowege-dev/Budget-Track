# Design — Budget Track

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
modern-minimal

## Macrostructure family
Pages within a family share the family's shape; they vary only in component archetypes.

- Auth/Pin pages: Center-anchored visual cards, high-restraint type.
- App pages:       Workbench (tabbed panel dashboard, responsive sections, card grids).

## Theme
- `--color-paper`   oklch(0.99 0.005 0) / Dark: oklch(0.12 0.012 250)
- `--color-paper-2` oklch(0.96 0.006 240) / Dark: oklch(0.15 0.015 250)
- `--color-ink`     oklch(0.2 0.01 240) / Dark: oklch(0.92 0.01 240)
- `--color-ink-2`   oklch(0.45 0.015 240) / Dark: oklch(0.72 0.01 240)
- `--color-rule`    oklch(0.92 0.008 240) / Dark: oklch(0.22 0.012 250)
- `--color-accent`  oklch(0.58 0.23 268) / Dark: oklch(0.68 0.18 268)
- `--color-focus`   oklch(0.58 0.23 268) / Dark: oklch(0.68 0.18 268)

## Typography
- Display: Outfit, weight 600/700, style normal
- Body:    Outfit, weight 300/400/500
- Mono:    JetBrains Mono, Courier New, monospace, weight 400/600
- Display tracking: -0.02em
- Type scale anchor: --text-display = clamp(1.75rem, 4vw, 2.5rem)

## Spacing
4-point named scale. The values are in `tokens.css`. Pages must use named tokens (`var(--space-md)`), never raw values.

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1) named `--ease-out`
- Reveal pattern: none (instant UI performance, smooth transitions on active tab)
- Reduced-motion fallback: opacity-only, ≤ 150 ms.

## Microinteractions stance
- silent success / celebratory toasts: never (unless critical transaction logging status, standard operations are silent)
- hover delay 800 ms · focus delay 0 ms
- active scale transitions (e.g. scale(0.98) on button click)

## CTA voice
- Primary CTA: filled background with Accent color, border-radius 12px, bold typography, hover scale feedback.
- Secondary CTA: border 1px solid Rule color, background paper, hover border Accent color.

## Per-page allowances
- Auth screens: Minimal visual asset (SVG logo), zero photos.
- App pages: Pure dashboard components, no visual decoration or stock illustration. Financial numbers styled with Mono font.

## What pages MUST share
- The app branding (logotype and Wallet icon).
- The accent color and its placement (≤ 5% per viewport).
- The display + body fonts (Outfit).
- The CTA voice (button shape, border-radius 12px, padding rhythm).
- Section heading rhythm.

## What pages MAY differ on
- Panels arrangement and columns depending on viewport and content.
- List vs Grid display for transactions.

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(0.99 0.005 0);
  --color-paper-2:    oklch(0.96 0.006 240);
  --color-ink:        oklch(0.2 0.01 240);
  --color-ink-2:      oklch(0.45 0.015 240);
  --color-rule:       oklch(0.92 0.008 240);
  --color-accent:     oklch(0.58 0.23 268);
  --color-accent-ink: oklch(0.99 0.005 0);
  --color-focus:      oklch(0.58 0.23 268);

  --font-display: "Outfit", sans-serif;
  --font-body:    "Outfit", sans-serif;
  --font-outlier: "JetBrains Mono", monospace;

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;
  --radius-card: 16px; --radius-pill: 9999px; --radius-input: 12px;
}

[data-theme='dark'] {
  --color-paper:      oklch(0.12 0.012 250);
  --color-paper-2:    oklch(0.15 0.015 250);
  --color-ink:        oklch(0.92 0.01 240);
  --color-ink-2:      oklch(0.72 0.01 240);
  --color-rule:       oklch(0.22 0.012 250);
  --color-accent:     oklch(0.68 0.18 268);
  --color-accent-ink: oklch(0.99 0.005 0);
  --color-focus:      oklch(0.68 0.18 268);
}
```

### Tailwind v4 `@theme`
```css
@theme {
  --color-paper:   oklch(0.99 0.005 0);
  --color-ink:     oklch(0.2 0.01 240);
  --color-accent:  oklch(0.58 0.23 268);
  --font-display:  "Outfit", sans-serif;
  --font-body:     "Outfit", sans-serif;
  --spacing-md:    1.5rem;
  --text-md:       1.125rem;
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG `tokens.json`
```json
{
  "color": {
    "paper":  { "$value": "oklch(0.99 0.005 0)", "$type": "color" },
    "ink":    { "$value": "oklch(0.2 0.01 240)", "$type": "color" },
    "accent": { "$value": "oklch(0.58 0.23 268)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Outfit", "$type": "fontFamily" },
    "body":    { "$value": "Outfit", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables
```css
:root {
  --background:        0.99  0.005  0;   /* paper */
  --foreground:        0.2   0.01   240;   /* ink */
  --primary:           0.58  0.23   268;   /* accent */
  --primary-foreground: 0.99 0.005  0;   /* accent-ink */
  --muted:             0.92  0.008  240;   /* rule */
  --muted-foreground:  0.45  0.015  240;   /* ink-2 */
  --border:            0.92  0.008  240;   /* rule */
  --input:             0.92  0.008  240;   /* rule */
  --ring:              0.58  0.23   268;   /* focus */
  --radius:            12px;
}
```
