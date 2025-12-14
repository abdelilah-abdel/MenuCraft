# MenuCraft Theme System Guide

## Overview
This document outlines the comprehensive theme system for MenuCraft, featuring aggressive angular design, minimalist aesthetics, and food industry colors.

---

## Design Philosophy

### 1. Angular Design
- **Aggressive angles** on buttons, cards, and UI elements
- **Clip-path polygons** for unique corner cuts
- **Angular shadows** (offset shadows instead of blur)
- **Skewed elements** for dynamic visual interest

### 2. Minimalism
- **Clean layouts** with generous whitespace
- **Focused content** without unnecessary decoration
- **Simple typography** with strong hierarchy
- **Purposeful animations** that enhance UX

### 3. Food Industry Colors
Colors scientifically chosen to stimulate appetite and convey freshness:
- **Warm Orange** - Primary (appetite stimulant)
- **Rich Brown** - Secondary (earthy, natural)
- **Fresh Green** - Accent (healthy, organic)
- **Luxury Gold** - Premium feel

---

## Color Palette

### Primary - Warm Orange (Appetite Stimulant)
```css
brand-orange-50:  #FFF7ED
brand-orange-100: #FFEDD5
brand-orange-200: #FED7AA
brand-orange-300: #FDBA74
brand-orange-400: #FB923C
brand-orange-500: #F97316 ⭐ Main
brand-orange-600: #EA580C
brand-orange-700: #C2410C
brand-orange-800: #9A3412
brand-orange-900: #7C2D12
```

### Secondary - Rich Brown (Earthy & Natural)
```css
brand-brown-50:  #FAFAF9
brand-brown-100: #F5F5F4
brand-brown-200: #E7E5E4
brand-brown-300: #D6D3D1
brand-brown-400: #A8A29E
brand-brown-500: #78716C
brand-brown-600: #57534E
brand-brown-700: #44403C ⭐ Main
brand-brown-800: #292524
brand-brown-900: #1C1917
```

### Accent - Fresh Green (Natural & Healthy)
```css
brand-green-50:  #F0FDF4
brand-green-100: #DCFCE7
brand-green-200: #BBF7D0
brand-green-300: #86EFAC
brand-green-400: #4ADE80
brand-green-500: #22C55E
brand-green-600: #16A34A ⭐ Main
brand-green-700: #15803D
brand-green-800: #166534
brand-green-900: #14532D
```

### Luxury - Gold (Premium Feel)
```css
brand-gold-50:  #FFFBEB
brand-gold-100: #FEF3C7
brand-gold-200: #FDE68A
brand-gold-300: #FCD34D
brand-gold-400: #FBBF24
brand-gold-500: #F59E0B
brand-gold-600: #D97706 ⭐ Main
brand-gold-700: #B45309
brand-gold-800: #92400E
brand-gold-900: #78350F
```

---

## Angular Design System

### Corner Cuts (Clip-path)

#### CSS Classes
```css
.angle-cut-tl    /* Top-left corner cut */
.angle-cut-tr    /* Top-right corner cut */
.angle-cut-bl    /* Bottom-left corner cut */
.angle-cut-br    /* Bottom-right corner cut */
.angle-cut-all   /* All corners cut */
```

#### Button Angle Classes
```css
.btn-angle       /* Standard button angle (8px) */
.btn-angle-sm    /* Small button angle (6px) */
.btn-angle-lg    /* Large button angle (10px) */
.btn-angle-diagonal /* Aggressive diagonal cuts */
```

#### Usage Example
```jsx
<div className="bg-white angle-cut-all shadow-angle">
  Content with angular design
</div>
```

### Angular Shadows

Instead of traditional blur shadows, we use **offset shadows** for sharp, angular aesthetics:

```css
.shadow-angle           /* 4px offset shadow */
.shadow-angle-orange    /* Orange-tinted offset shadow */
.shadow-angle-brown     /* Brown-tinted offset shadow */
```

#### Hover Effects
```css
.hover-angle-lift       /* Lift with angular shadow on hover */
.hover-skew            /* Skew transform on hover */
```

---

## Component Library

### Button Component

The Button component features aggressive angular design with multiple variants:

#### Variants
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

#### Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

#### Angular Toggle
```jsx
<Button angle={true}>Angular (Default)</Button>
<Button angle={false}>Rounded</Button>
```

#### Full Example
```jsx
import { Button } from '@/components/ui/Button';

<Button
  variant="primary"
  size="lg"
  angle={true}
  onClick={handleClick}
>
  Start Creating Free
</Button>
```

### Card Component

Angular cards with gradient accent:

```jsx
<div className="card-angle p-8 space-y-4">
  <h3>Card Title</h3>
  <p>Card content with angular top border</p>
</div>
```

Features:
- Automatic gradient top border (orange to gold)
- Angular corner cut on top border
- Hover lift effect with angular shadow

---

## Gradient System

### Background Gradients
```css
.gradient-orange   /* Orange gradient */
.gradient-brown    /* Brown gradient */
.gradient-warm     /* Warm multi-color gradient */
.gradient-food     /* Food industry gradient */
```

### Text Gradients
```css
.text-gradient-orange  /* Orange text gradient */
.text-gradient-warm    /* Warm text gradient */
```

#### Usage
```jsx
<h1 className="text-gradient-warm">
  Digital Menus Made Simple
</h1>
```

---

## Animation System

### Built-in Animations
```css
.animate-fade-in         /* Fade in from bottom */
.animate-slide-in        /* Slide in from left */
.animate-angle-slide     /* Angular slide with skew */
.animate-pulse-orange    /* Pulsing orange shadow */
.animate-angle-float     /* Floating with rotation */
```

### Usage Examples
```jsx
<div className="animate-fade-in-up">
  Fades in from bottom
</div>

<div className="animate-angle-slide">
  Slides in with angular motion
</div>
```

---

## Section Patterns

### Section Divider
Add a subtle angular divider above sections:

```jsx
<section className="section-divider py-24">
  <h2>Section Title</h2>
  {/* Content */}
</section>
```

### Angular Background Elements
```jsx
<section className="relative overflow-hidden">
  {/* Angular background shapes */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange-100 opacity-20 skew-angle-reverse"></div>
  <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-green-100 opacity-20 skew-angle"></div>

  {/* Content */}
  <div className="relative z-10">
    Your content here
  </div>
</section>
```

---

## Typography

### Font System
```jsx
font-sans      /* Body text */
font-display   /* Headings */
```

### Font Weights
- `font-semibold` for buttons and labels
- `font-bold` for headings
- `font-normal` for body text

### Text Utilities
```css
.uppercase          /* Uppercase transformation */
.tracking-wide      /* Letter spacing for uppercase */
.editorial-spacing  /* Tight letter spacing for headlines */
.text-balance       /* Balanced text wrapping */
```

---

## Responsive Design

### Mobile Adjustments
On mobile devices (< 640px):
- Angular cuts reduce from 8px to 6px
- Padding adjusts automatically
- Sections collapse to single column

### Breakpoints
```css
xs:   475px
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

---

## Best Practices

### 1. Consistent Angular Design
✅ **Do:**
- Use `btn-angle` classes for buttons
- Apply `angle-cut-*` to cards and containers
- Use angular shadows instead of blur shadows

❌ **Don't:**
- Mix rounded corners with angular design
- Use traditional soft shadows
- Overuse angular cuts (maintain balance)

### 2. Color Usage
✅ **Do:**
- Use `brand-orange-500` as primary action color
- Use `brand-brown-700` for secondary elements
- Use `brand-green-600` sparingly as accent
- Reserve gold for premium features

❌ **Don't:**
- Use all colors equally (creates visual chaos)
- Use colors outside the brand palette
- Forget color contrast for accessibility

### 3. Spacing & Layout
✅ **Do:**
- Use generous whitespace (py-24 for sections)
- Maintain consistent padding in cards (p-6, p-8)
- Use grid layouts for even spacing

❌ **Don't:**
- Crowd elements together
- Use inconsistent spacing
- Ignore mobile responsiveness

### 4. Animations
✅ **Do:**
- Use subtle animations (0.3s duration)
- Add hover effects for interactivity
- Use `ease-out` for natural motion

❌ **Don't:**
- Overuse animations (distracting)
- Use long animation durations (>0.5s)
- Animate everything on the page

---

## Page Layout Template

```jsx
export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation with angular design */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-brand-orange-500">
        {/* Nav content */}
      </nav>

      {/* Hero with angular backgrounds */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange-100 opacity-20 skew-angle-reverse"></div>
        {/* Hero content */}
      </section>

      {/* Content sections */}
      <section className="py-24 px-6 lg:px-12 bg-neutral-100 section-divider">
        {/* Section content */}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-brand-orange-500 py-12">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

---

## Quick Reference

### Common Patterns

#### Angular Card
```jsx
<div className="card-angle p-8 hover-angle-lift">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

#### Hero Headline
```jsx
<h1 className="text-6xl font-bold text-brand-brown-900">
  Main Title
  <span className="block text-gradient-warm">Highlighted Text</span>
</h1>
```

#### Call-to-Action Section
```jsx
<section className="py-24 bg-brand-brown-900">
  <div className="w-24 h-1 bg-brand-orange-500 mx-auto angle-cut-all mb-8"></div>
  <h2 className="text-5xl font-bold text-white">CTA Headline</h2>
  <Button variant="primary" size="lg">Take Action</Button>
</section>
```

#### Feature Grid
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {features.map((feature) => (
    <div className="card-angle p-8">
      <div className="w-14 h-14 bg-brand-orange-100 btn-angle">
        <Icon />
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </div>
  ))}
</div>
```

---

## File Structure

```
/app
  globals.css          - Theme CSS variables & utilities
  page.tsx             - Homepage with theme implementation
/components/ui
  Button.tsx           - Angular button component
/tailwind.config.ts    - Theme configuration
```

---

## Support & Customization

### Customizing Colors
Edit `tailwind.config.ts` → `theme.extend.colors.brand`

### Customizing Angular Cuts
Edit `app/globals.css` → CSS variables `--angle-cut`

### Adding New Variants
1. Define in `tailwind.config.ts`
2. Add utility classes in `globals.css`
3. Update component props if needed

---

## Migration from Previous Theme

### Changes Made
1. ✅ Replaced gray palette with food industry colors
2. ✅ Added angular design system (clip-paths, angular shadows)
3. ✅ Updated Button component with new variants
4. ✅ Redesigned homepage with angular aesthetic
5. ✅ Added gradient system for visual interest
6. ✅ Implemented custom animations

### Breaking Changes
- Button default styling changed (now angular by default)
- Color classes changed from `gray-*` to `brand-*` colors
- Shadow utilities replaced with angular shadows

---

**Built with:** Next.js 15 + Tailwind CSS 4 + TypeScript
**Theme Version:** 1.0.0
**Last Updated:** December 2025
