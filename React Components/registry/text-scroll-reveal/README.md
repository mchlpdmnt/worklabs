# TextScrollReveal

A word-by-word reading reveal recreated from the interaction pattern in Olivier Larose's [Text Gradient Scroll Opacity](https://blog.olivierlarose.com/tutorials/text-gradient-scroll-opacity-v2): scrolling progressively brings each word from quiet gray into full contrast.

## Dependencies

```bash
npm install motion
```

## Integration

```tsx
<TextScrollReveal text="Motion should reward attention without blocking the story." />
```

## Props

- `text` — the sentence or paragraph to reveal.
- `height` — height of the self-contained scroll region; defaults to `620`.
- `className` — classes for the scroll region.

The region is keyboard-scrollable. Reduced-motion users receive the complete text immediately.
