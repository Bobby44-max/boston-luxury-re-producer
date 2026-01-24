# Property Showcase Video Template

## Specifications
- **Duration**: 30 seconds (900 frames at 30fps)
- **Aspect Ratio**: 16:9 (1920x1080)
- **Use Case**: Listing promotion, website embed, YouTube

## Scene Breakdown

### Scene 1: Hero (0-3s, frames 0-90)
**Purpose**: Capture attention with stunning visual

**Elements**:
- Full-screen hero image (best exterior shot)
- Ken Burns effect: scale 1.0 → 1.1, subtle pan
- Address text fade in (bottom third)
- Price badge (top right corner)

**Animation**:
```tsx
const heroScale = interpolate(frame, [0, 90], [1, 1.1]);
const addressOpacity = interpolate(frame, [20, 50], [0, 1]);
const priceOpacity = interpolate(frame, [40, 70], [0, 1]);
```

**Typography**:
- Address: 48px, Plus Jakarta Sans, weight 700
- Price: 64px, gradient text (#0dccf2 → #8b5cf6)

---

### Scene 2: Stats (3-7s, frames 90-210)
**Purpose**: Key numbers for quick scanning

**Elements**:
- Three stat cards in row
- Counter animation for numbers
- Icons for each stat (Bed, Bath, Grid for sqft)

**Layout**:
```tsx
<div className="stats-row">
  <StatCard icon="bed" value={bedrooms} label="Bedrooms" delay={0} />
  <StatCard icon="bath" value={bathrooms} label="Bathrooms" delay={15} />
  <StatCard icon="grid" value={sqft} label="Sq Ft" delay={30} />
</div>
```

**Animation**:
- Staggered entrance: each card 0.5s apart
- Number counter: 0 → value over 1 second
- Subtle bounce on completion

---

### Scene 3: Gallery (7-20s, frames 210-600)
**Purpose**: Showcase property photos

**Elements**:
- Photo slideshow (5-7 images)
- Smooth transitions between images
- Optional: picture-in-picture for floor plan

**Timing**:
- Each image: 2.5 seconds (75 frames)
- Transition: 0.5 seconds (15 frames overlap)

**Transitions**:
- Ken Burns on each image
- Crossfade between images
- Alternating pan directions

**Animation**:
```tsx
const imageIndex = Math.floor((frame - 210) / 75);
const imageProgress = ((frame - 210) % 75) / 75;
const opacity = interpolate(imageProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
```

---

### Scene 4: Features (20-25s, frames 600-750)
**Purpose**: Highlight key selling points

**Elements**:
- Feature list (4-6 items)
- Check icons
- Glass panel background

**Layout**:
```tsx
<div className="glass-panel features">
  {features.slice(0, 6).map((feature, i) => (
    <FeatureItem key={i} text={feature} delay={i * 10} />
  ))}
</div>
```

**Animation**:
- Staggered cascade from top
- Check icon draws in
- Text slides from left

---

### Scene 5: CTA (25-30s, frames 750-900)
**Purpose**: Drive action

**Elements**:
- Agent photo (circular)
- Agent name and title
- Brokerage logo
- Contact info (phone, email)
- "Schedule a Tour" text

**Layout**:
```tsx
<div className="cta-container">
  <div className="agent-info">
    <img className="agent-photo" src={agentPhoto} />
    <div className="agent-name">{agentName}</div>
    <div className="agent-title">{agentTitle}</div>
  </div>
  <div className="contact">
    <div className="phone">{phone}</div>
    <div className="email">{email}</div>
  </div>
  <img className="logo" src={logoUrl} />
</div>
```

**Animation**:
- Elements scale in from center
- Logo pulses subtly
- Gradient border animation

---

## Audio Layer

### Voiceover Script Template
```
[0-3s] "Welcome to [ADDRESS], offered at [PRICE]"
[3-7s] "[BEDS] bedrooms, [BATHS] baths, [SQFT] square feet of luxury living"
[7-20s] "Featuring [FEATURE_1], [FEATURE_2], and [FEATURE_3]"
[20-25s] "Additional highlights include [FEATURE_4] and [FEATURE_5]"
[25-30s] "Contact [AGENT] today to schedule your private showing"
```

### Background Music
- Style: Upscale, sophisticated
- Volume: 20% (behind voiceover)
- Fade out in last 2 seconds

---

## Color Palette

```tsx
const colors = {
  background: '#09090b',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.06)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  accentCyan: '#0dccf2',
  accentViolet: '#8b5cf6',
  gradient: 'linear-gradient(135deg, #0dccf2, #8b5cf6)',
};
```

---

## Required Props

```typescript
interface PropertyShowcaseProps {
  // Property Data
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];  // Minimum 5 images
  features: string[]; // Minimum 4 features

  // Branding
  agentName: string;
  agentTitle: string;
  agentPhoto?: string;
  brokerageName: string;
  logoUrl: string;
  phone: string;
  email: string;

  // Optional
  voiceoverUrl?: string;
  musicUrl?: string;
  primaryColor?: string;
}
```
