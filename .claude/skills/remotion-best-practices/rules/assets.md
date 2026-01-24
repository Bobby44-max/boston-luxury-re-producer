# Remotion Asset Rules

## Local Assets

### staticFile()
Load assets from /public directory.
```tsx
import { staticFile, Img, Video, Audio } from 'remotion';

// Image
<Img src={staticFile('logo.png')} />

// Video
<Video src={staticFile('background.mp4')} />

// Audio
<Audio src={staticFile('voiceover.mp3')} />
```

### Directory Structure
```
/public
  /images
    logo.png
    watermark.png
  /videos
    background.mp4
  /audio
    music.mp3
    voiceover.mp3
  /fonts
    custom-font.woff2
```

## Remote Assets

### Loading External Images
```tsx
import { Img, delayRender, continueRender } from 'remotion';
import { useState } from 'react';

export const RemoteImage: React.FC<{ src: string }> = ({ src }) => {
  const [handle] = useState(() => delayRender('Loading image'));

  return (
    <Img
      src={src}
      onLoad={() => continueRender(handle)}
      onError={() => continueRender(handle)} // Don't block on error
    />
  );
};
```

### Preloading Multiple Assets
```tsx
import { delayRender, continueRender } from 'remotion';
import { preloadImage } from '@remotion/preload';

export const PropertyGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [handle] = useState(() => delayRender('Loading gallery'));

  useEffect(() => {
    Promise.all(images.map(preloadImage))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [images, handle]);

  // Render after loaded...
};
```

## Image Component

### Basic Usage
```tsx
import { Img } from 'remotion';

<Img
  src={imageUrl}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }}
/>
```

### Ken Burns Effect
```tsx
const scale = interpolate(frame, [0, 150], [1, 1.1], {
  extrapolateRight: 'clamp',
});
const translateX = interpolate(frame, [0, 150], [0, -5], {
  extrapolateRight: 'clamp',
});

<div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
  <Img
    src={imageUrl}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: `scale(${scale}) translateX(${translateX}%)`,
    }}
  />
</div>
```

## Video Component

### Background Video
```tsx
import { Video, OffthreadVideo } from 'remotion';

// Standard (for short clips)
<Video
  src={staticFile('background.mp4')}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  volume={0}
/>

// OffthreadVideo (for long videos, better performance)
<OffthreadVideo
  src={staticFile('long-video.mp4')}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```

## Audio Component

### Voiceover with Volume Control
```tsx
import { Audio, interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
const volume = interpolate(
  frame,
  [0, 30, durationInFrames - 30, durationInFrames],
  [0, 1, 1, 0] // Fade in and out
);

<Audio src={voiceoverUrl} volume={volume} />
```

### Background Music (Lower Volume)
```tsx
<Audio src={staticFile('music.mp3')} volume={0.2} />
```

## Fonts

### Google Fonts
```tsx
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';

const { fontFamily } = loadFont();

<div style={{ fontFamily }}>
  Styled Text
</div>
```

### Local Fonts
```tsx
// In remotion.config.ts or component
import { staticFile } from 'remotion';

const fontFace = new FontFace(
  'CustomFont',
  `url(${staticFile('fonts/custom.woff2')})`
);
await fontFace.load();
document.fonts.add(fontFace);
```

## Asset Best Practices

1. **Preload before render** - Use delayRender/continueRender
2. **Use appropriate formats** - WebP for images, WebM for video
3. **Optimize file sizes** - Compress assets before adding
4. **Handle errors gracefully** - Always call continueRender on error
5. **Use OffthreadVideo for long clips** - Prevents memory issues
