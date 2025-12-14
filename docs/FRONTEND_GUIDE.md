# Frontend Development Guide - MenuCraft

> **Version:** 1.0.0
> **Last Updated:** 2025-12-14
> **Maintainers:** Development Team

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design System](#design-system)
3. [Component Structure](#component-structure)
4. [Styling Approach](#styling-approach)
5. [State Management](#state-management)
6. [Development Prompts](#development-prompts)
7. [Best Practices](#best-practices)

---

## Architecture Overview

### Tech Stack

```yaml
Framework: Next.js 16 (App Router)
React: 19.2.1
TypeScript: 5.x
Styling: Tailwind CSS 4.x
State: React Hooks (Context API for future)
Storage: localStorage (V1), Database (V2+)
```

### Directory Structure

```
/app                    # Next.js App Router pages
  /builder             # Menu builder interface
  /menu/[id]           # Public menu display

/components            # React components
  /builder             # Builder-specific UI
  /preview             # Menu preview/templates
  /ui                  # Reusable components

/lib                   # Business logic
  /services            # Data layer abstraction
  /templates           # Menu display templates
  /types               # TypeScript definitions
  /hooks               # Custom React hooks (V2+)

/docs                  # Project documentation
```

---

## Design System

### Core Philosophy

**"Physical Menu Aesthetic"** - The entire interface should feel like you're designing on actual restaurant menu paper.

### Color Palette

```typescript
// Cream/Parchment (Menu Paper)
menu-cream-50:  '#FEFDFB'  // Lightest cream
menu-cream-100: '#FBF9F4'  // Light background
menu-cream-200: '#F7F3EB'  // Main background
menu-cream-300: '#F0EAE0'  // Subtle contrast

// Charcoal (Primary Text)
menu-charcoal-700: '#2D2D2D'  // Main text
menu-charcoal-600: '#3A3A3A'  // Headings
menu-charcoal-500: '#4A4A4A'  // Secondary text
menu-charcoal-200: '#C8C8C8'  // Borders

// Gold (Accents & Actions)
menu-gold-500: '#D4AF37'  // Primary gold
menu-gold-600: '#C19A2E'  // Darker gold
menu-gold-400: '#F0D166'  // Lighter gold
menu-gold-100: '#FDF6E3'  // Subtle highlights
```

### Typography

```css
/* Headings & Elegant Text */
font-family: Georgia, Cambria, "Times New Roman", serif;

/* Body & Interface */
font-family: Inter, system-ui, sans-serif;

/* Menu Titles */
.menu-title {
  font-family: Georgia, serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Spacing & Layout

```css
/* Consistent padding */
Section padding: p-6 (24px)
Card padding: p-4 to p-5 (16-20px)
Input padding: px-4 py-3

/* Border radius */
Subtle: rounded-sm (0.125rem)
Standard: rounded (0.25rem)

/* Shadows */
Light: shadow-menu (0 2px 8px rgba(0,0,0,0.08))
Medium: shadow-menu-lg (0 4px 16px rgba(0,0,0,0.12))
Heavy: shadow-menu-xl (0 8px 32px rgba(0,0,0,0.16))
```

### Border Style

**Single, subtle borders with opacity:**

```css
border border-menu-charcoal-200/60  /* Primary border style */
hover:border-menu-gold-400/50       /* Hover state */
focus:border-menu-gold-500          /* Focus state */
```

### Interactive States

```css
/* Hover Effects */
hover:bg-menu-cream-50
hover:border-menu-gold-400/50
hover:shadow-menu-lg

/* Focus States */
focus:outline-none
focus:border-menu-gold-500
focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]

/* Active States */
Active buttons: bg-menu-gold-500 text-white
Inactive: text-menu-charcoal-600
```

---

## Component Structure

### UI Component Guidelines

All UI components follow FlowCV-inspired design:

#### Input Fields

```tsx
// Reference: /components/ui/Input.tsx
<Input
  label="Field Label *"
  placeholder="Hint text"
  error="Error message"
  value={value}
  onChange={handler}
/>

// Visual: White bg, subtle border, gold focus glow
```

#### Buttons

```tsx
// Reference: /components/ui/Button.tsx
<Button
  variant="primary | secondary | outline | ghost | gold"
  size="sm | md | lg"
>
  Action
</Button>
```

#### Layout Patterns

```tsx
// Step Container
<div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
  <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
    {/* Header */}
  </div>
  <div className="p-6 space-y-5 bg-menu-cream-100">
    {/* Content */}
  </div>
</div>
```

### Component Naming Convention

```
Feature-based: MenuBuilder, MenuPreview
UI Components: Input, Button, Card
Template Components: ClassicTemplate, ModernTemplate
Service Classes: MenuService, ImageService
```

---

## Styling Approach

### Tailwind CSS Philosophy

**Utility-first with custom design tokens:**

```css
/* Good - Use design tokens */
className="bg-menu-cream-50 text-menu-charcoal-700"

/* Avoid - Arbitrary values */
className="bg-[#F7F3EB] text-[#2D2D2D]"

/* Good - Responsive design */
className="px-4 md:px-6 lg:px-8"

/* Use spacing scale */
gap-3, gap-4, gap-5 (consistent spacing)
```

### Custom CSS Classes

Located in `/app/globals.css`:

```css
.menu-title       /* Elegant serif headings */
.menu-subtitle    /* Secondary headings */
.menu-description /* Body text */
.menu-price       /* Price formatting */
.menu-card        /* Card container */
.menu-divider-*   /* Decorative dividers */
```

---

## State Management

### Current (V1): Component State

```tsx
// MenuBuilder pattern
const [menu, setMenu] = useState<Menu>(initialMenu);

// Update helpers
const updateMenu = (updates: Partial<Menu>) => {
  setMenu(prev => ({ ...prev, ...updates }));
};
```

### Future (V2): Context API

```tsx
// Planned architecture
<MenuProvider>
  <MenuBuilder />
  <MenuPreview />
</MenuProvider>

// Custom hooks
useMenu()         // Access menu state
useSection(id)    // Section operations
useMenuItem(id)   // Item operations
```

---

## Development Prompts

### Prompt Templates for AI Assistance

#### 1. **Component Creation Prompt**

```
Create a [ComponentName] component for MenuCraft that:
- Follows the FlowCV-inspired design with subtle borders
- Uses menu color palette (cream backgrounds, charcoal text, gold accents)
- Has proper TypeScript types
- Includes hover/focus states with gold highlights
- Matches the physical menu aesthetic

Example: Input fields should have:
- White background
- Single border with border-menu-charcoal-200/60
- Gold focus glow: focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]
- Rounded corners: rounded-sm
```

#### 2. **Feature Implementation Prompt**

```
Implement [FeatureID] for MenuCraft:
- Use modular, database-ready code structure
- Separate UI from business logic
- Create reusable components in /components
- Add types to /lib/types
- Follow repository pattern for data access
- Include proper error handling

Code should be:
- Clean and well-commented
- Easily extendable to database backend
- Following existing naming conventions
```

#### 3. **Styling Prompt**

```
Style this component to match MenuCraft's menu aesthetic:
- Warm cream/parchment backgrounds (bg-menu-cream-*)
- Subtle borders with opacity (border-menu-charcoal-200/60)
- Gold accents for interactive elements (menu-gold-500)
- Serif fonts for headings (Georgia)
- Shadow hierarchy: shadow-menu for cards
- Hover states should lighten background
- Focus states should add gold border + subtle glow
```

#### 4. **Refactoring Prompt**

```
Refactor [ComponentName] to:
- Extract reusable logic into custom hooks
- Separate UI components into smaller pieces
- Make data access database-agnostic
- Improve TypeScript type safety
- Add JSDoc comments for complex functions
- Follow single responsibility principle
```

---

## Best Practices

### Code Organization

```tsx
// ✅ Good - Clean component structure
const MenuBuilder: React.FC<MenuBuilderProps> = ({ initialMenu, onSave }) => {
  // 1. State declarations
  const [menu, setMenu] = useState(initialMenu);

  // 2. Derived state / memos
  const isValid = useMemo(() => validateMenu(menu), [menu]);

  // 3. Event handlers
  const handleSave = () => {
    MenuService.saveMenu(menu);
    onSave?.(menu);
  };

  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### TypeScript Usage

```tsx
// ✅ Always define prop interfaces
interface MenuBuilderProps {
  initialMenu?: Menu;
  onSave?: (menu: Menu) => void;
  onPreview?: (menu: Menu) => void;
}

// ✅ Use type inference
const menu = useState<Menu>(createDefaultMenu());

// ✅ Avoid 'any'
// ❌ Bad
const handleChange = (e: any) => { }

// ✅ Good
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { }
```

### Performance Optimization

```tsx
// ✅ Memoize expensive computations
const sortedSections = useMemo(
  () => sections.sort((a, b) => a.order - b.order),
  [sections]
);

// ✅ Prevent unnecessary re-renders
const MemoizedItem = React.memo(MenuItem);

// ✅ Use useCallback for handlers passed to children
const handleDelete = useCallback((id: string) => {
  deleteItem(id);
}, []);
```

### Accessibility

```tsx
// ✅ Semantic HTML
<label htmlFor="restaurant-name">Restaurant Name</label>
<input id="restaurant-name" />

// ✅ Keyboard navigation
<button onClick={handleClick} onKeyDown={handleKeyDown}>

// ✅ ARIA attributes when needed
<div role="dialog" aria-labelledby="modal-title">
```

### File Organization

```
Feature-based organization:
/components/builder/
  MenuBuilder.tsx           # Main component
  SectionList.tsx          # Section container
  SectionCard.tsx          # Individual section
  ItemCard.tsx             # Menu item card
  index.ts                 # Barrel exports
```

---

## Development Workflow

### Adding a New Component

1. **Create component file** in appropriate folder
2. **Define TypeScript interface** for props
3. **Implement component** following design system
4. **Add JSDoc comments** for complex logic
5. **Export from index.ts** (barrel export)
6. **Document in FRONTEND_GUIDE.md** if reusable

### Styling a Component

1. **Use Tailwind utilities first** (menu-* classes)
2. **Extract repeated patterns** to globals.css
3. **Follow spacing/color tokens** from design system
4. **Test responsive breakpoints** (sm, md, lg)
5. **Verify hover/focus states** match gold theme

### Testing Checklist

- [ ] Component renders without errors
- [ ] TypeScript types are correct
- [ ] Responsive design works (mobile → desktop)
- [ ] Hover states show gold highlights
- [ ] Focus states have visible gold glow
- [ ] Keyboard navigation works
- [ ] Matches menu aesthetic (cream bg, subtle borders)

---

## Common Patterns

### Form Input Pattern

```tsx
<Input
  label="Field Name *"
  value={formData.field}
  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
  placeholder="Enter value"
  error={errors.field}
/>
```

### Modal Pattern

```tsx
{isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-5xl bg-menu-cream-50 shadow-menu-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal content */}
    </div>
  </div>
)}
```

### Empty State Pattern

```tsx
<div className="border border-dashed border-menu-charcoal-300/60 bg-menu-cream-200 p-12 text-center rounded-sm">
  <svg className="w-16 h-16 mx-auto mb-4 text-menu-gold-600">
    {/* Icon */}
  </svg>
  <h3 className="text-lg font-bold text-menu-charcoal-900 mb-2 uppercase">
    No Items Yet
  </h3>
  <p className="text-sm text-menu-charcoal-600 mb-6">
    Create your first item to get started
  </p>
  <Button variant="gold" onClick={onCreate}>
    Create First Item
  </Button>
</div>
```

---

## Feature Development Checklist

Before implementing any feature:

- [ ] Read PROJECT_VISION.md to understand business goals
- [ ] Check VERSIONING_STRATEGY.md for version targeting
- [ ] Review existing similar components for consistency
- [ ] Design database-agnostic data access layer
- [ ] Follow repository pattern for future scalability
- [ ] Add proper TypeScript types
- [ ] Include error handling
- [ ] Test responsive design
- [ ] Document in relevant .md files
- [ ] Add JSDoc comments for complex logic

---

## Questions & Support

**Design System Questions:** Reference this guide's Design System section
**Component Structure:** See Component Structure section
**Code Patterns:** Check Common Patterns section
**Business Logic:** See PROJECT_VISION.md
**Version Planning:** See VERSIONING_STRATEGY.md

---

**Last Updated:** 2025-12-14
**Next Review:** Before V2 development
