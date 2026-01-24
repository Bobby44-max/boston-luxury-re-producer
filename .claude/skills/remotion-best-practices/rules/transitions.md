# Remotion Transition Rules

## @remotion/transitions Package

### Installation
```bash
npm install @remotion/transitions
```

### Basic Usage
```tsx
import { TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={150}>
    <Scene1 />
  </TransitionSeries.Sequence>

  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 30 })}
  />

  <TransitionSeries.Sequence durationInFrames={150}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

## Built-in Transitions

### Fade
```tsx
import { fade } from '@remotion/transitions/fade';

<TransitionSeries.Transition
  presentation={fade()}
  timing={linearTiming({ durationInFrames: 30 })}
/>
```

### Slide
```tsx
import { slide } from '@remotion/transitions/slide';

// Slide from right
<TransitionSeries.Transition
  presentation={slide({ direction: 'from-right' })}
  timing={springTiming({ config: { damping: 200 } })}
/>

// Directions: 'from-left', 'from-right', 'from-top', 'from-bottom'
```

### Wipe
```tsx
import { wipe } from '@remotion/transitions/wipe';

<TransitionSeries.Transition
  presentation={wipe({ direction: 'from-left' })}
  timing={linearTiming({ durationInFrames: 30 })}
/>
```

### Flip
```tsx
import { flip } from '@remotion/transitions/flip';

<TransitionSeries.Transition
  presentation={flip({ direction: 'from-right' })}
  timing={springTiming({ config: { damping: 200 } })}
/>
```

## Timing Functions

### Linear Timing
```tsx
import { linearTiming } from '@remotion/transitions';

timing={linearTiming({
  durationInFrames: 30,
  easing: Easing.inOut(Easing.cubic)
})}
```

### Spring Timing
```tsx
import { springTiming } from '@remotion/transitions';

timing={springTiming({
  config: {
    damping: 200,
    stiffness: 100,
    mass: 1,
  }
})}
```

## Custom Transitions

### Manual Crossfade
```tsx
// When not using TransitionSeries

<Sequence from={0} durationInFrames={180}>
  <Scene1 opacity={interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: 'clamp' })} />
</Sequence>

<Sequence from={150} durationInFrames={180}>
  <Scene2 opacity={interpolate(frame - 150, [0, 30], [0, 1], { extrapolateRight: 'clamp' })} />
</Sequence>
```

### Zoom Transition
```tsx
// Zoom out current, zoom in next
const exitScale = interpolate(frame, [120, 150], [1, 0.8], { extrapolateRight: 'clamp' });
const exitOpacity = interpolate(frame, [120, 150], [1, 0], { extrapolateRight: 'clamp' });

const enterScale = interpolate(frame, [150, 180], [1.2, 1], { extrapolateLeft: 'clamp' });
const enterOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: 'clamp' });
```

### Morphing Elements
```tsx
// Shared element transition
const circleRadius = interpolate(frame, [0, 60], [50, 300], { extrapolateRight: 'clamp' });
const circleOpacity = interpolate(frame, [50, 60], [1, 0], { extrapolateRight: 'clamp' });

<div style={{
  width: circleRadius * 2,
  height: circleRadius * 2,
  borderRadius: '50%',
  opacity: circleOpacity,
}} />
```

## Real Estate Video Transitions

### Property Gallery Slider
```tsx
const imageIndex = Math.floor(frame / (fps * 3)); // Change every 3 seconds
const imageProgress = (frame % (fps * 3)) / (fps * 3);

const translateX = interpolate(imageProgress, [0.9, 1], [0, -100], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

### Stats Counter Reveal
```tsx
// Wipe reveal for numbers
const clipPath = interpolate(frame, [0, 30], [0, 100], {
  extrapolateRight: 'clamp',
});

<div style={{ clipPath: `inset(0 ${100 - clipPath}% 0 0)` }}>
  $2,500,000
</div>
```

### Feature List Cascade
```tsx
{features.map((feature, i) => {
  const delay = i * 8;
  const y = interpolate(frame, [delay, delay + 20], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: `translateY(${y}px)`, opacity }}>
      {feature}
    </div>
  );
})}
```

## Transition Best Practices

1. **Keep transitions short** - 0.5-1 second max for most cases
2. **Match content type** - Fade for emotional, slide for energetic
3. **Consistent direction** - Pick one slide direction and stick with it
4. **Spring for organic feel** - Use springTiming for natural motion
5. **Test readability** - Ensure text is readable during transitions
