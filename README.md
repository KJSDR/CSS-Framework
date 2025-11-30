# ACSD CSS Framework

## Purpose

ACSD is a Nordic maritime-inspired classless CSS framework that provides beautiful defaults for semantic HTML without requiring any classes. It emphasizes simplicity, readability, and functionality with a cohesive design system built on CSS custom properties, making it perfect for marketing pages, documentation, blogs, and internal tools that need professional styling with minimal effort.

## How to Use

Link the framework in your HTML `<head>`:

```html
<link rel="stylesheet" href="acsd.css">
```

Optionally, add Web Components for interactive features:

```html
<script src="acsd-components.js" defer></script>
```

Then write semantic HTML as normal. The framework automatically styles all standard elements (headings, paragraphs, lists, links, tables, forms, etc.) without requiring any classes.

**Example:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="acsd.css">
  <title>My Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This page automatically looks great with zero classes.</p>
</body>
</html>
```

## Layer Structure

The framework uses CSS `@layer` to organize styles into five distinct layers:

```css
@layer tokens, base, components, utilities, overrides;
```

- **tokens**: CSS custom properties for colors, typography, spacing, and other design values
- **base**: Element selectors only (no classes) that style semantic HTML
- **components**: Optional component classes (currently includes theme toggle styling)
- **utilities**: Reserved for future single-purpose helper classes
- **overrides**: For developers integrating the framework to add custom styles

This layered approach provides predictable specificity without `!important` and makes customization straightforward.

## Token System

All design values are defined as CSS custom properties in the tokens layer, ensuring consistency and easy customization:

**Color Palette** (Nordic maritime-inspired):
- `--color-sand`: Warm off-white backgrounds
- `--color-anchor`: Deep charcoal text
- `--color-sea-deep`: Ocean blue for primary elements
- `--color-rust`: Warm rust/orange for accents
- Plus semantic tokens (`--color-bg`, `--color-fg`, `--color-link`, etc.)

**Typography Scale**:
- Font families (system font stack)
- Sizes from `--font-size-xs` to `--font-size-h1`
- Weights and line heights

**Spacing Scale**:
- `--space-xs` (0.25rem) through `--space-3xl` (4rem)

**Other Tokens**:
- Border radius (`--radius-sm`, `--radius-md`, etc.)
- Shadows, transitions, max-widths

To customize, override tokens in your own stylesheet:
```css
:root {
  --color-accent: oklch(0.55 0.15 130); /* Change accent to green */
  --space-md: 1.25rem; /* Adjust spacing */
}
```

## Features Implemented

**Required Features:**
- ✅ Classless base styling for all semantic HTML elements
- ✅ Layered CSS architecture with `@layer`
- ✅ Comprehensive design token system
- ✅ WCAG AA accessible (contrast, focus states, keyboard navigation)
- ✅ Responsive design

**Optional Enhancements:**
- ✅ **Custom form styling**: Cohesive, visually interactive form controls
- ✅ **Dark theme**: Complete "Night at Sea" theme via `.theme-dark` class on `<html>`
- ✅ **Micro-interactions**: Smooth transitions on hover, focus, and active states
- ✅ **Web Components** (optional JS): `<frmwrk-theme-toggle>` and `<frmwrk-badge>` custom elements