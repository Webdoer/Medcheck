---
name: Serene Civic Health
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#404845'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#717975'
  outline-variant: '#c0c8c4'
  surface-tint: '#3a675b'
  primary: '#386458'
  on-primary: '#ffffff'
  primary-container: '#507d70'
  on-primary-container: '#f4fffa'
  inverse-primary: '#a1d0c1'
  secondary: '#3f627a'
  on-secondary: '#ffffff'
  secondary-container: '#bde2fd'
  on-secondary-container: '#41657c'
  tertiary: '#61567d'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a6e97'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bdeddd'
  primary-fixed-dim: '#a1d0c1'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#214e43'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#a7cbe6'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#264b61'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#cebfed'
  on-tertiary-fixed: '#1f1539'
  on-tertiary-fixed-variant: '#4c4167'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 21px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.2px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.3px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.4px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes an empathetic, non-alarmist public health verification experience tailored for citizens, caregivers, and rural health intermediaries across India. The aesthetic blends **Tactile Soft Minimalism** with civic dignity. Users interacting with this interface are often experiencing acute vulnerability—such as having already consumed a prescribed batch or caring for an ailing relative—demanding an atmosphere of clinical authority stripped of clinical dread.

### Visual Atmosphere & Aesthetic Pillars
- **Reassuring Softness**: Interfaces avoid razor-sharp edges, clinical sterile whites, and high-frequency visual noise. Organic curvature (20–28px radii) combined with warm paper-like backdrops creates an inviting physical feel akin to a trusted medical handbook.
- **Dignified Public Utility**: Avoids generic startup cheerfulness or hyper-gamified aesthetics. State emblems, verification seals, and statutory hotlines (CDSCO 1800-11-4477) are framed with understated reverence.
- **De-escalation by Default**: Negative or critical outcomes must never employ flashing sirens, harsh crimson fills, or exclamation graphics. Information is conveyed with gentle clarity, clear next steps, and supportive medical guidance.

## Colors

The palette employs gentle earthen and mineral tones designed to lower cognitive strain and reduce heart rates under duress. Pure blacks (`#000000`) and pure whites (`#FFFFFF`) are prohibited to maintain a soft, paper-like tactile surface.

### Palette Architecture
- **Primary (Misty Sage - `#5E8B7E`)**: Represents stewardship, calm recovery, and biological balance. Used for primary actions, navigation active states, and structural authority.
- **Secondary (Pale Sky - `#90B4CE`)**: Conveys open breathability and diagnostic neutrality. Applied to auxiliary informational surfaces and search container fills.
- **Tertiary (Soft Lavender - `#9B8EB9`)**: Evokes quiet care and reassurance. Used for secondary metadata, pill tags, and educational tooltips.
- **Neutral (Warm Alabaster Canvas - `#FBF9F5` / `#F4F1EA`)**: A soothing, low-glare ground mimicking warm botanical paper.
- **Deep Slate Charcoal Text (`#2B3A4A` / `#3D4A58`)**: High-contrast, warm slate replacing pure black to maximize accessibility without visual harshness.

### Non-Alarmist Status Semantics
- **Flagged / सावधान (`#D97768` on `#F8E5E2`)**: Dusty warm terracotta instead of aggressive neon red. Signals immediate attention without panic.
- **Possible Match / संभावित मिलान (`#DDA74F` on `#FCF3E3`)**: Warm ochre-amber for batch variance or inconclusive lookups.
- **Not Found in Alerts / सूची में नहीं (`#5F7D8E` on `#E7EFF3`)**: Serene blue-grey slate. **Critical Mandate**: Never use green checkmarks or "safe" language for unlisted drugs; absence from the CDSCO Not-of-Standard-Quality database does not confer certified authenticity.

## Typography

The typography is built around generous vertical metrics, open letterforms, and full Indic script parity (pairing seamlessly with system fonts like Noto Sans Devanagari, Tamil, and Bengali). Because users may include elderly citizens or those with visual impairments reading in sub-optimal ambient conditions, baseline body sizing begins at an elevated 17px.

### Typographic Hierarchy Rules
- **Line Heights**: Generous proportions (minimum 1.5x on body text) prevent crowded multi-lingual text where matras and conjunct consonants otherwise cause overlapping ascenders and descenders.
- **Batch & Code Rendering**: Drug codes and batch identification numbers must use distinct semi-bold weights with increased tabular tracking (`letter-spacing: 0.05em`) to prevent mistyping lookalike numerals (e.g., '0' and 'O', '1' and 'I').
- **Bilingual Stacking**: When presenting bilingual UI pairs (e.g., English header above Devanagari subline), the primary language takes `headline-md` while the secondary regional script maintains equivalent visual scale using `body-md` in medium weight.

## Layout & Spacing

The layout is grounded in a fluid single-column mobile-first shell that expands into an anchored 4-column tablet or desktop card module. All vertical cadences follow an 8pt structural rhythm, with 4pt micro-steps for compact badge alignment.

### Form Factor Adaptations
- **Mobile (<600px)**: 16px lateral canvas margins, single-column vertical flow, bottom-anchored persistent utility sheets for camera and batch inputs. All interactive targets adhere strictly to a minimum physical bounding box of 52px × 52px.
- **Tablet / Expanded (600px–1024px)**: 24px lateral canvas margins, fluid multi-column arrangement capped at 680px maximum content line width to preserve legibility and prevent scanning fatigue.
- **Safe Area Insets**: Scanner interfaces and primary verify triggers must respect bottom navigation safe zones with an extra `16px` elevation buffer to accommodate native system handles.

## Elevation & Depth

Visual depth is communicated primarily through **Tonal Layering** and **Cloud Shadows**, avoiding harsh directional drop-shadows that create visual tension.

### Depth Architecture
- **Layer 0 (Canvas Base)**: `#FBF9F5` warm cream finish. Entirely non-reflective.
- **Layer 1 (Card & Module Resting)**: `#FFFFFF` or `#F4F1EA` surfaces layered with a soft, diffused ambient bloom: `box-shadow: 0 4px 20px -2px rgba(43, 58, 74, 0.04), 0 2px 6px -1px rgba(43, 58, 74, 0.02)`.
- **Layer 2 (Modals & Sheet Drawers)**: Tinted depth utilizing subtle primary color diffusion: `box-shadow: 0 12px 32px -4px rgba(94, 139, 126, 0.12), 0 4px 12px -2px rgba(43, 58, 74, 0.03)`.
- **Low-Contrast Contours**: Elevate structural legibility by applying an ultra-soft border on cards (`1px solid rgba(43, 58, 74, 0.06)`). This ensures distinction for cataract-affected or low-contrast displays without adding visual clutter.

## Shapes

The shape vocabulary emphasizes reassurance through continuous rounded radii. Sharp geometries (0px corners) are completely excluded to keep the interface friendly, human, and gentle.

### Corner Radius System
- **Compact Badges, Input Bars & Buttons**: 24px pill rounding (`rounded-full`) for friendly, thumb-ready interactions.
- **Surface Cards & Action Panels**: 20px base corner rounding (`rounded-lg`), softening the silhouette of dense clinical data.
- **Modal Dialogs & Bottom Verification Sheets**: 28px top-corner radius (`rounded-xl`), creating an inviting, paper-like envelope that slides upward over the canvas.

## Components

### 1. Buttons
- **Primary (Verify Batch / Scan)**: Deep sage `#5E8B7E` solid fill, `#FFFFFF` text, min-height 52px, fully pill-rounded (28px). Hover/Focus shifts tone to `#4E756A` with an ambient sage glow.
- **Secondary (Upload Photo / Call Helpline)**: Pale sky `#D4E4EF` fill with `#2B3A4A` text, 52px min-height, providing a soft, non-intimidating secondary target.
- **Tertiary / Utility**: Ghost surface with 1px border `rgba(43, 58, 74, 0.12)` and slate text for dismissals or back-navigation.

### 2. Status Result Cards
- **Neutral / Not Found**: Slate-grey surface (`#E7EFF3`), navy border (`#5F7D8E`), muted information icon. Header text: "Not Found in Alerts / अलर्ट में नहीं मिला". Clear subtext: "This batch is not listed in current CDSCO defect alerts. This does not confirm authenticity. Inspect packaging for physical irregularities."
- **Flagged Batch**: Terracotta surface (`#F8E5E2`), warm coral badge (`#D97768`). Plain-language guidance on what to do next, combined with a direct-dial CDSCO Helpline button (1800-11-4477).

### 3. Verification Input Field
- **Structure**: Min-height 56px, pill-curved, warm off-white background with a `1.5px` border in `#90B4CE`. Text appears in `18px` tracking with clear placeholder text: "e.g., B.No. 4022A". Includes an embedded scan button for one-touch camera entry.

### 4. Privacy & Trust Badges
- **CDSCO Emblem Card**: Clean emblem badge container with official insignia, displaying last database synchronization timestamp (e.g., "Updated Today, 06:00 AM").
- **Camera Privacy Pill**: Floating reassurance chip over viewfinder: "Photo processed locally. Images are never stored on external servers."

### 5. Checkboxes & Radio Controls
- **Geometry**: 24px soft rounded squares (checkboxes) and circles (radios) with a minimum 48px touch padding boundary. Selected state fills with primary sage `#5E8B7E` featuring a soft, thick ivory icon.