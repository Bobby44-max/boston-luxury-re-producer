# Remotion Captions Rules

## @remotion/captions Package

### Installation
```bash
npm install @remotion/captions
```

### Generate Captions from Audio
```tsx
import { transcribe } from '@remotion/install-whisper-cpp';

// Transcribe audio to get word-level timestamps
const transcription = await transcribe({
  inputPath: 'voiceover.mp3',
  model: 'medium.en',
});
```

## Caption Display Component

### Basic Word-by-Word Captions
```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface Caption {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const Captions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();

  const currentCaption = captions.find(
    (c) => frame >= c.startFrame && frame < c.endFrame
  );

  if (!currentCaption) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 48,
      fontWeight: 700,
      color: 'white',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    }}>
      {currentCaption.text}
    </div>
  );
};
```

### Animated Word Reveal
```tsx
interface Word {
  text: string;
  startFrame: number;
}

export const AnimatedCaptions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();

  const visibleWords = words.filter((w) => frame >= w.startFrame);

  return (
    <div style={{
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      textAlign: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    }}>
      {visibleWords.map((word, i) => {
        const wordAge = frame - word.startFrame;
        const scale = interpolate(wordAge, [0, 10], [0.8, 1], {
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(wordAge, [0, 5], [0, 1], {
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
```

## Caption Styles

### Glassmorphic Caption Box
```tsx
<div style={{
  position: 'absolute',
  bottom: 80,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  padding: '16px 32px',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.1)',
}}>
  <span style={{
    fontSize: 36,
    fontWeight: 600,
    color: 'white',
  }}>
    {caption.text}
  </span>
</div>
```

### Highlighted Word
```tsx
// Highlight the current word in a sentence
const words = sentence.split(' ');
const currentWordIndex = Math.floor(frame / framesPerWord);

{words.map((word, i) => (
  <span
    key={i}
    style={{
      color: i === currentWordIndex ? '#0dccf2' : 'white',
      fontWeight: i === currentWordIndex ? 700 : 400,
      transition: 'none', // Remember: no CSS transitions!
    }}
  >
    {word}{' '}
  </span>
))}
```

### Karaoke Style
```tsx
const progress = (frame - caption.startFrame) / (caption.endFrame - caption.startFrame);
const clipPercent = progress * 100;

<div style={{ position: 'relative' }}>
  {/* Base text (unhighlighted) */}
  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
    {caption.text}
  </span>

  {/* Highlighted overlay */}
  <span style={{
    position: 'absolute',
    left: 0,
    color: '#0dccf2',
    clipPath: `inset(0 ${100 - clipPercent}% 0 0)`,
  }}>
    {caption.text}
  </span>
</div>
```

## Real Estate Caption Templates

### Property Stats Caption
```tsx
const stats = [
  { label: 'Bedrooms', value: 4, frame: 0 },
  { label: 'Bathrooms', value: 3, frame: 30 },
  { label: 'Square Feet', value: 3500, frame: 60 },
];

{stats.map((stat) => {
  if (frame < stat.frame) return null;

  const age = frame - stat.frame;
  const opacity = interpolate(age, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(age, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>
      <span style={{ color: '#0dccf2' }}>{stat.value}</span>
      <span style={{ color: 'white' }}> {stat.label}</span>
    </div>
  );
})}
```

### Price Reveal Caption
```tsx
const priceRevealed = frame > 60;
const countUp = interpolate(frame, [60, 120], [0, price], { extrapolateRight: 'clamp' });

<div style={{ textAlign: 'center' }}>
  {priceRevealed && (
    <>
      <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
        Listed at
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, color: 'white' }}>
        ${Math.floor(countUp).toLocaleString()}
      </div>
    </>
  )}
</div>
```

## Caption Best Practices

1. **Max 2 lines** - Keep captions short and readable
2. **Large font size** - Minimum 36px for mobile viewing
3. **High contrast** - White text with dark shadow/background
4. **Sync with audio** - Match word timing exactly
5. **Safe zones** - Keep 80px from edges for platform UI
