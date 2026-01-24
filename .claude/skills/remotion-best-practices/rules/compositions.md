# Remotion Composition Rules

## Composition Setup

### Basic Composition
```tsx
import { Composition } from 'remotion';
import { z } from 'zod';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PropertyShowcase"
        component={PropertyShowcase}
        durationInFrames={900}  // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        schema={PropertySchema}
        defaultProps={{
          address: '123 Main St',
          price: '$1,500,000',
        }}
      />
    </>
  );
};
```

### Props Schema (Required for type safety)
```tsx
import { z } from 'zod';

export const PropertySchema = z.object({
  address: z.string(),
  price: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sqft: z.number(),
  images: z.array(z.string()),
  features: z.array(z.string()),
  voiceoverUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

type PropertyProps = z.infer<typeof PropertySchema>;
```

## Aspect Ratios

| Format | Width | Height | Use Case |
|--------|-------|--------|----------|
| 16:9 Landscape | 1920 | 1080 | YouTube, Websites |
| 9:16 Vertical | 1080 | 1920 | TikTok, Reels, Shorts |
| 1:1 Square | 1080 | 1080 | Instagram Feed |
| 4:5 Portrait | 1080 | 1350 | Instagram Posts |

## Sequence Structure

### Scene-Based Layout
```tsx
export const PropertyShowcase: React.FC<PropertyProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Hero - 5 seconds */}
      <Sequence from={0} durationInFrames={150}>
        <HeroScene {...props} />
      </Sequence>

      {/* Scene 2: Stats - 4 seconds */}
      <Sequence from={150} durationInFrames={120}>
        <StatsScene {...props} />
      </Sequence>

      {/* Scene 3: Gallery - 10 seconds */}
      <Sequence from={270} durationInFrames={300}>
        <GalleryScene images={props.images} />
      </Sequence>

      {/* Scene 4: Features - 6 seconds */}
      <Sequence from={570} durationInFrames={180}>
        <FeaturesScene features={props.features} />
      </Sequence>

      {/* Scene 5: CTA - 5 seconds */}
      <Sequence from={750} durationInFrames={150}>
        <CTAScene {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Overlapping Sequences (for transitions)
```tsx
{/* Background runs entire duration */}
<Sequence from={0} durationInFrames={900}>
  <GradientBackground />
</Sequence>

{/* Content fades between */}
<Sequence from={0} durationInFrames={180}>
  <Scene1 />
</Sequence>
<Sequence from={150} durationInFrames={180}> {/* 30 frame overlap */}
  <Scene2 />
</Sequence>
```

## Layout Components

### AbsoluteFill
Full-size container for layered content.
```tsx
<AbsoluteFill style={{ backgroundColor: '#000' }}>
  <AbsoluteFill> {/* Background layer */}
    <Img src={bgImage} />
  </AbsoluteFill>
  <AbsoluteFill> {/* Content layer */}
    <TextContent />
  </AbsoluteFill>
</AbsoluteFill>
```

### Series (Strict Sequential)
```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={150}>
    <Scene1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={120}>
    <Scene2 />
  </Series.Sequence>
</Series>
```

## Duration Calculations

```tsx
const fps = 30;

// Seconds to frames
const durationInFrames = seconds * fps;

// Frames to seconds
const durationInSeconds = frames / fps;

// Common durations at 30fps
// 1 second = 30 frames
// 5 seconds = 150 frames
// 10 seconds = 300 frames
// 30 seconds = 900 frames
// 60 seconds = 1800 frames
```
