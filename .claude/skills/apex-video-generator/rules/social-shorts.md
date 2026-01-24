# Social Short Video Template

## Specifications
- **Duration**: 9 seconds (270 frames at 30fps)
- **Aspect Ratio**: 9:16 (1080x1920)
- **Use Case**: TikTok, Instagram Reels, YouTube Shorts

## Platform Considerations

### Safe Zones
```
┌─────────────────────────┐
│   ← 60px margin →       │  ← Status bar (iOS)
├─────────────────────────┤
│                         │
│                         │
│    MAIN CONTENT         │
│    (safe zone)          │
│                         │
│                         │
├─────────────────────────┤
│   ← 150px margin →      │  ← Platform UI (like, share, etc.)
└─────────────────────────┘
```

Keep critical text/elements within:
- Top: 60px from edge
- Bottom: 150px from edge
- Left/Right: 40px from edges

---

## Scene Breakdown

### Scene 1: Hook (0-2s, frames 0-60)
**Purpose**: Stop the scroll

**Elements**:
- Full-bleed hero image
- Bold text overlay
- Price or hook phrase

**Hook Templates**:
- "🔥 Just Listed in [NEIGHBORHOOD]"
- "[PRICE] | [BEDS]BD [BATHS]BA"
- "This [CITY] home is INSANE 👀"
- "POV: You found your dream home"

**Animation**:
```tsx
// Zoom in + text pop
const imageScale = interpolate(frame, [0, 60], [1.2, 1]);
const textScale = spring({ fps, frame: frame - 10, config: { damping: 200 } });
const textOpacity = interpolate(frame, [10, 25], [0, 1]);
```

**Typography**:
- Main text: 72px, weight 900, uppercase
- Subtext: 36px, weight 600
- Text shadow for readability

---

### Scene 2: Value (2-6s, frames 60-180)
**Purpose**: Deliver key info fast

**Elements**:
- Three stat reveals
- Property image backgrounds
- Animated counters

**Layout**:
```tsx
<AbsoluteFill>
  <Sequence from={0} durationInFrames={40}>
    <StatReveal icon="🛏️" value={bedrooms} label="BEDS" />
  </Sequence>
  <Sequence from={40} durationInFrames={40}>
    <StatReveal icon="🛁" value={bathrooms} label="BATHS" />
  </Sequence>
  <Sequence from={80} durationInFrames={40}>
    <StatReveal icon="📐" value={sqft} label="SQ FT" />
  </Sequence>
</AbsoluteFill>
```

**Animation**:
- Each stat: slide up + fade in
- Numbers: quick counter animation
- Background: subtle Ken Burns

---

### Scene 3: CTA (6-9s, frames 180-270)
**Purpose**: Drive engagement

**Elements**:
- "Link in bio" or "DM for info"
- Agent branding
- Action prompt

**CTA Templates**:
- "💬 Comment TOUR for details"
- "👆 Link in bio"
- "📱 DM me for a showing"
- "❤️ Save for your house hunt"

**Animation**:
```tsx
// Pulsing CTA button
const pulse = interpolate(
  frame % 30,
  [0, 15, 30],
  [1, 1.05, 1]
);

// Bouncing arrow
const arrowY = interpolate(
  frame % 20,
  [0, 10, 20],
  [0, -10, 0]
);
```

---

## Quick Cut Variant

For maximum engagement, use quick cuts:

```tsx
const cuts = [
  { from: 0, duration: 15, scene: 'exterior' },
  { from: 15, duration: 15, scene: 'kitchen' },
  { from: 30, duration: 15, scene: 'living' },
  { from: 45, duration: 15, scene: 'bedroom' },
  { from: 60, duration: 15, scene: 'bathroom' },
  // ... more cuts
];

{cuts.map((cut, i) => (
  <Sequence key={i} from={cut.from} durationInFrames={cut.duration}>
    <Img src={images[cut.scene]} />
  </Sequence>
))}
```

---

## Text Styles

### Hook Text
```tsx
<div style={{
  fontSize: 72,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  textShadow: '0 4px 30px rgba(0,0,0,0.8)',
  color: 'white',
}}>
  $2.5M
</div>
```

### Stat Text
```tsx
<div style={{
  fontSize: 96,
  fontWeight: 900,
  background: 'linear-gradient(135deg, #0dccf2, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}>
  {value}
</div>
```

### CTA Text
```tsx
<div style={{
  fontSize: 32,
  fontWeight: 700,
  padding: '16px 32px',
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: 100,
  border: '2px solid rgba(255,255,255,0.2)',
}}>
  Link in bio 👆
</div>
```

---

## Audio Recommendations

### Background Music
- Trending sounds (check platform for popular audio)
- Upbeat, modern
- 100% volume (no voiceover)
- Sync cuts to beat drops

### Optional Voiceover
- Keep under 20 words total
- Punchy, conversational tone
- Example: "Four beds, three baths, Back Bay. Two point five. Link in bio."

---

## Required Props

```typescript
interface SocialShortProps {
  // Property Data
  address: string;
  neighborhood: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];  // Minimum 3 images

  // Branding
  agentHandle: string;  // @username
  logoUrl?: string;

  // Style
  hookTemplate: 'just-listed' | 'price-focus' | 'pov' | 'custom';
  customHookText?: string;
  ctaTemplate: 'link-bio' | 'dm' | 'comment' | 'save';

  // Optional
  musicUrl?: string;
}
```

---

## Platform-Specific Tips

### TikTok
- First frame must hook (no slow builds)
- Use trending sounds
- Add text overlays for muted viewing
- Vertical orientation required

### Instagram Reels
- Can repurpose TikTok content
- Add branded intro/outro
- Use Instagram-native music

### YouTube Shorts
- Slightly longer hooks OK
- Include channel branding
- Subscribe CTA works well
