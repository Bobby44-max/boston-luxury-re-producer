# Remotion Timing Rules

## Core Hooks

### useCurrentFrame()
Returns the current frame number (0-indexed).
```tsx
import { useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
// At 2 seconds into a 30fps video, frame = 60
```

### useVideoConfig()
Returns composition configuration.
```tsx
import { useVideoConfig } from 'remotion';

const { fps, width, height, durationInFrames } = useVideoConfig();
```

## Frame-Based Timing

### Calculate Progress
```tsx
const frame = useCurrentFrame();
const { durationInFrames } = useVideoConfig();

// Overall progress (0 to 1)
const progress = frame / durationInFrames;

// Progress within a section
const sectionStart = 60;  // Start at 2 seconds
const sectionEnd = 150;   // End at 5 seconds
const sectionProgress = (frame - sectionStart) / (sectionEnd - sectionStart);
```

### Delay Start
```tsx
// Start animation at frame 30 (1 second)
const opacity = interpolate(
  frame,
  [30, 60], // Start at 30, complete at 60
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
```

### Loop Animation
```tsx
const { fps } = useVideoConfig();
const loopDuration = fps * 2; // 2-second loop
const loopFrame = frame % loopDuration;

const pulse = interpolate(
  loopFrame,
  [0, loopDuration / 2, loopDuration],
  [1, 1.1, 1]
);
```

## Common Timing Patterns

### Entrance + Hold + Exit
```tsx
const opacity = interpolate(
  frame,
  [0, 20, 100, 120], // Fade in, hold, fade out
  [0, 1, 1, 0],
  { extrapolateRight: 'clamp' }
);
```

### Staggered Grid
```tsx
const cols = 3;
const rows = 3;

{items.map((item, index) => {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const delay = (row + col) * 5; // Diagonal stagger

  const itemOpacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return <div style={{ opacity: itemOpacity }}>{item}</div>;
})}
```

### Typewriter Effect
```tsx
const text = "Hello World";
const charsPerSecond = 10;
const { fps } = useVideoConfig();
const framesPerChar = fps / charsPerSecond;

const visibleChars = Math.floor(frame / framesPerChar);
const displayText = text.slice(0, visibleChars);
```

### Progress Bar
```tsx
const progressWidth = interpolate(
  frame,
  [0, durationInFrames],
  [0, 100],
  { extrapolateRight: 'clamp' }
);

<div style={{
  width: `${progressWidth}%`,
  height: 4,
  backgroundColor: '#0dccf2'
}} />
```

## Audio Sync

### Sync to Voiceover
```tsx
// If voiceover mentions price at 3 seconds
const priceRevealFrame = 3 * fps;

<Sequence from={priceRevealFrame}>
  <PriceAnimation price={price} />
</Sequence>
```

### Beat-Matched Animation
```tsx
const bpm = 120;
const framesPerBeat = (60 / bpm) * fps;
const beatNumber = Math.floor(frame / framesPerBeat);
const beatProgress = (frame % framesPerBeat) / framesPerBeat;

// Pulse on beat
const scale = interpolate(beatProgress, [0, 0.1, 1], [1.05, 1.05, 1]);
```

## Timeline Best Practices

1. **Plan in seconds first** - Then convert to frames
2. **Use constants for timing** - `const INTRO_DURATION = 5 * fps`
3. **Account for transitions** - Overlap sequences by 0.5-1 second
4. **Match audio cues** - Align visual changes with voiceover
5. **Test at multiple playback speeds** - Ensure readability
