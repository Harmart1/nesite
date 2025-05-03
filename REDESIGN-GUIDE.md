# NorthernEdge Legal Website Redesign Implementation Guide

## Overview

This guide provides instructions for implementing the new elegant visual design across the NorthernEdge Legal Solutions website. The redesign features sophisticated typography, refined color palette, and enhanced user experience with generous white space.

## Key Files

1. **CSS Files**
   - `elegant-design-system.css`: Core styling system with variables, typography, buttons, and layouts
   - `elegant-navigation.css`: Navigation components including header, dropdowns, and footer 
   - `typography-animations.css`: Typography enhancements and animation effects
   - `critical.css`: Critical CSS for initial page load
   - `variables.css`: CSS variables for consistent spacing and color palette
   - `responsive.css`: Responsive design adjustments
   - `visual-enhancements.css`: Micro-interactions and hover effects
   - `accessibility-enhancements.css`: Accessibility improvements
   - `accessibility.css`: Additional accessibility styles

2. **Template Files**
   - `index-elegant.html`: Example implementation of the new design system

## Implementation Steps

### 1. Update File References

Add these CSS file references to the `<head>` section of all HTML files:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- CSS Files -->
<link rel="stylesheet" href="css/elegant-design-system.css">
<link rel="stylesheet" href="css/elegant-navigation.css">
<link rel="stylesheet" href="css/typography-animations.css">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/critical.css">
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/visual-enhancements.css">
<link rel="stylesheet" href="css/accessibility-enhancements.css">
<link rel="stylesheet" href="css/accessibility.css">
```

### 2. Update Header Structure

Replace the existing header with this new structure:

```html
<header class="site-header">
  <div class="container header-container">
    <div class="logo-container">
      <a href="index.html">
        <img src="images/northernedge-logo.svg" alt="NorthernEdge Legal Solutions">
      </a>
    </div>
    
    <nav class="nav-wrapper">
      <ul class="primary-nav">
        <!-- Navigation items -->
      </ul>
      
      <button class="mobile-nav-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  </div>
</header>
```

### 3. Main Content Structure

Use these class patterns for main content sections:

- Section wrapper: `py-16 bg-[color]`
- Container: `container`
- Headings: `elegant-heading` (add `centered` for centered headings)
- Call to action buttons: `btn btn-primary`, `btn btn-secondary`, etc.
- Cards: `card` with `card-header` and `card-body`

### 4. Update Footer Structure

Replace the existing footer with the new structure:

```html
<footer class="py-12 bg-navy-dark">
  <div class="container">
    <div class="grid grid-cols-4 gap-8">
      <!-- Footer sections -->
    </div>
    
    <div class="mt-12 pt-6 border-t border-slate-dark text-center">
      <!-- Copyright and legal links -->
    </div>
  </div>
</footer>
```

### 5. Add Animation Classes

Apply animation classes to enhance visual elements:

- `fade-in`: Fade in elements
- `slide-up`, `slide-down`, `slide-left`, `slide-right`: Directional animations
- `zoom-in`: Zoom in effect
- `pulse`: Subtle pulsing effect
- Add delay classes (`delay-1` through `delay-5`) to create staggered animations

## Color Palette

The redesign uses these primary colors:

- Navy: `#1A365D` (--navy)
- Gold: `#D4AF37` (--gold)
- Burgundy: `#800020` (--burgundy)
- Slate: `#3E5C76` (--slate)

With supporting neutral colors from white to black.

## Typography

- Headings: 'Playfair Display', serif
- Body text: 'Raleway', sans-serif

## Responsive Design

The design system includes responsive breakpoints:

- Desktop: 1024px and above
- Tablet: 768px to 1023px
- Mobile: Below 768px

Media queries are already included in the CSS files.

## Next Steps

1. Begin with the homepage using `index-elegant.html` as a reference
2. Update individual practice area pages
3. Update about and contact pages
4. Test thoroughly on multiple devices

Remember to utilize the spacing and typography classes to maintain consistency across all pages.
