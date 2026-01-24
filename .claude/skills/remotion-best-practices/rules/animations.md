# Remotion Animation Rules

## Core Animation API

### interpolate()
The primary animation function. Maps frame ranges to value ranges.

```tsx
import { interpolate, Easing } from 'remotion';

// Basic fade
const opacity = interpolate(frame, [0, 30], [0, 1]);

// With clamping (ALWAYS USE)
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// With easing
const scale = interpolate(frame, [0, 30], [0.5, 1], {
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.cubic),
});
```

### spring()
Physics-based spring animation. Use for natural movement.

```tsx
import { spring, useVideoConfig } from 'remotion';

const { fps } = useVideoConfig();
const scale = spring({
  fps,
  frame,
  config: {
    damping: 200,    // Higher = less bounce
    stiffness: 100,  // Higher = faster
    mass: 1,         // Higher = slower
  },
});
```

### Easing Functions
```tsx
import { Easing } from 'remotion';

Easing.linear          // No easing
Easing.ease            // Subtle ease
Easing.in(Easing.quad) // Accelerate
Easing.out(Easing.quad) // Decelerate
Easing.inOut(Easing.cubic) // Both
Easing.bezier(0.25, 0.1, 0.25, 1) // Custom
```

## Animation Patterns

### Staggered Entrance
```tsx
const items = ['Item 1', 'Item 2', 'Item 3'];

{items.map((item, i) => {
  const delay = i * 10; // 10 frames between each
  const itemOpacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  return <div style={{ opacity: itemOpacity }}>{item}</div>;
})}
```

### Slide In From Side
```tsx
const translateX = interpolate(frame, [0, 30], [-100, 0], {
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.cubic),
});

<div style={{ transform: `translateX(${translateX}%)` }}>
  Content
</div>
```

### Scale + Fade Combo
```tsx
const progress = spring({ fps, frame, config: { damping: 200 } });
const opacity = interpolate(progress, [0, 1], [0, 1]);
const scale = interpolate(progress, [0, 1], [0.8, 1]);

<div style={{
  opacity,
  transform: `scale(${scale})`
}}>
  Content
</div>
```

### Counter Animation
```tsx
const count = interpolate(frame, [0, 60], [0, 1000], {
  extrapolateRight: 'clamp',
});

<span>{Math.floor(count).toLocaleString()}</span>
```

## Performance Rules

1. **Never use CSS transitions** - They don't work with frame-based rendering
2. **Avoid useEffect for animations** - Use interpolate() directly in render
3. **Memoize expensive calculations** - Use useMemo for complex paths
4. **Pre-calculate transforms** - Combine into single transform string
5. **Use will-change sparingly** - Only for complex layer compositions
