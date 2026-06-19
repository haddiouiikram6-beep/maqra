---
name: Maqra Reading Library
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#434655'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ec'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#994529'
  on-secondary: '#ffffff'
  secondary-container: '#fe9472'
  on-secondary-container: '#762b11'
  tertiary: '#006247'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d5c'
  on-tertiary-container: '#beffe1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#7b2f15'
  tertiary-fixed: '#93f6cc'
  tertiary-fixed-dim: '#77d9b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  margin-mobile: 20px
  margin-tablet: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is a sophisticated fusion of traditional Moroccan heritage and modern functionalism. It draws heavy inspiration from the vibrant streets of Marrakech and the scholarly atmosphere of historic libraries. The aesthetic follows a **Modern Corporate** approach with a **Tactile** warmth, utilizing Material Design 3 principles to ensure accessibility and clarity.

The target audience consists of multi-lingual readers who value a premium, calm environment for their digital library. The UI evokes a sense of "cultural sanctuary"—it is inviting, intellectually stimulating, and deeply grounded in the textures of North Africa. Key characteristics include expansive whitespace, high-quality typography, and a "Warm Minimalist" execution.

## Colors
The palette is centered around **Majorelle Blue**, a high-intensity pigment that provides a sense of depth and authority. This is balanced by **Terracotta**, which adds an earthy, organic warmth reminiscent of clay architecture, and **Mint Green**, used sparingly for success states and secondary accents to represent fresh botanicals.

- **Primary (Majorelle Blue):** Used for key actions, active states, and brand-heavy components.
- **Secondary (Terracotta):** Used for highlights, decorative accents, and categories.
- **Tertiary (Mint Green):** Used for progress tracking, success indicators, and secondary navigation elements.
- **Neutral (Warm Beige):** The canvas of the app. Unlike cold grays, this beige provides a "paper-like" reading experience that reduces eye strain.

## Typography
The typography system uses **Plus Jakarta Sans** for headlines to provide a modern, soft-geometric feel that is highly legible and optimistic. For body copy, **Be Vietnam Pro** is selected for its contemporary proportions and warm character, ensuring a comfortable reading experience for long-form text.

**Bi-directional Support (LTR/RTL):** 
The design system is built to handle Arabic (RTL) alongside Latin (LTR) scripts. When rendering Arabic, the font weight should be slightly increased to maintain visual parity with the Latin weights. Use system-native Naskh-style fonts for Arabic headlines to ensure cultural authenticity and maximum readability.

## Layout & Spacing
This design system utilizes a **Fluid Grid** model optimized for mobile devices. The horizontal margins are set to 20px on mobile to create a "breathable" frame around the content. 

- **Columns:** 4-column grid for mobile, 8-column for tablet.
- **Vertical Rhythm:** A strict 4px baseline grid ensures consistent alignment of text and icons.
- **Adaptability:** On RTL layouts, the horizontal spacing flips automatically. The "leading" side always gets the primary margin.
- **Density:** We prioritize high whitespace to evoke a premium "gallery" feel rather than a dense data-heavy app.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**, consistent with Material Design 3's "Surface Tint" philosophy. 

1.  **Level 0 (Background):** Warm Beige (#F8F6F2). No shadow.
2.  **Level 1 (Cards/Surfaces):** White (#FFFFFF). Very soft, diffused shadow with a slight blue-gray tint (hex: #2563EB at 4% opacity, 8px blur).
3.  **Level 2 (Active/Floating):** White (#FFFFFF). More pronounced shadow (12px blur) to indicate interactivity or modal state.

Avoid harsh black shadows. The goal is to make elements look like they are gently resting on a bed of sand or soft paper.

## Shapes
The shape language is defined by generous, friendly curves. 
- **Standard Components:** Buttons and Input fields use 8px (`rounded`).
- **Main Containers:** Cards and Modals use 16px to 20px (`rounded-lg` or `rounded-xl`) to create a soft, inviting container for book covers and lists.
- **Selection Elements:** Chips and small badges use a full pill shape (`rounded-full`).

This roundedness mimics the arched doorways and organic forms found in Moroccan architecture, softening the technical nature of the mobile app.

## Components

### Buttons
- **Primary:** Majorelle Blue background with White text. 8px border radius.
- **Secondary:** Transparent background with Terracotta border and text.
- **Elevation:** Flat by default; light shadow on hover/tap.

### Cards (The "Library Shelf")
- Cards are the primary container for books. They should feature a White surface, a 16px radius, and a subtle 1px border in a darkened beige (#E8E4DB) to define the edge against the background.
- Book covers within cards should have a 4px radius.

### Input Fields
- Filled style: Warm Beige background (slightly darker than the main background) with a bottom stroke in Majorelle Blue when active.
- Labels use `label-lg` in a muted neutral color.

### Chips & Tags
- Used for genre tags (e.g., "History," "Poetry").
- Pill-shaped with a light tint of the Tertiary color (Mint Green) or Secondary (Terracotta) with 10% opacity and full-saturation text.

### Navigation Bar
- Modern bottom navigation with active states indicated by a Majorelle Blue pill-shaped indicator behind the icon, following MD3 standards.