# Implementation Brief: EduPrep Hub "Elite AI Ops" Visual Overhaul

## Objective
Transition EduPrep Hub from a standard EdTech landing page to a premium, glass-morphic "Elite AI Operations" command center. The aesthetic must feel like a high-end, intelligent system—authoritative, cinematic, and futuristic.

## 1. Core Design Tokens (Tailwind)
Claude: Apply these to `tailwind.config.ts`.

```typescript
{
  colors: {
    brand: {
      depth: '#0A1628',      // Midnight Navy (Background)
      surface: '#1E293B',    // Slate Blue (Card surfaces)
      primary: '#7C3AED',    // Deep Violet (Main CTA)
      accent: '#67E8F9',     // Ice Blue (Secondary/Data)
      success: '#10B981',    // Emerald (Progress/Mastery)
      glass: 'rgba(15, 23, 42, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
    }
  },
  backdropBlur: {
    xl: '40px',
  }
}
```

## 2. Layout Structure: The Bento Grid
Replace the current feature list with a modular Bento Grid using `framer-motion`.

- **Module 1 (Large):** Predicted Score Diagnostic (Interactive graph).
- **Module 2 (Medium):** Mastery Pathway (3D step visualization).
- **Module 3 (Small):** Timed Practice (Countdown UI).
- **Module 4 (Small):** AI Recommendations (Typing terminal effect).

## 3. Visual Assets (Assets already generated)
Integrate the following 4K assets from `/public/assets/gemini-deck/`:
- **Hero Background:** `gemini_hero_bg.png` (Neural network ambient).
- **Feature Visuals:** Use `gemini_models_bg.png` for the "Diagnostic Engine" section.
- **Collaboration Visual:** `gemini_claude_bg.png` for the "AI Powered" section.

## 4. Interaction Specs
- **Glass Cards:** All containers should have `bg-brand-glass backdrop-blur-xl border border-brand-border`.
- **Text Gradient:** Apply `bg-gradient-to-r from-[#7C3AED] to-[#67E8F9] bg-clip-text text-transparent` to main headings.
- **Scroll Parallax:** Hero elements should have a subtle Y-axis parallax effect on scroll.

## 5. Deployment Mandate
Ensure all changes pass build tests and maintain the `@frombostonwithgloss` brand voice in all micro-copy.
