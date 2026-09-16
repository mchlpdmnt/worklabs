# PaintReveal

An erase-to-discover canvas recreated from the interaction pattern in Olivier Larose's [Paint Reveal](https://blog.olivierlarose.com/tutorials/paint-reveal): drag across the cover with a mouse, pen, or touch pointer to expose the content beneath it.

## Dependencies

React and Tailwind CSS only.

## Integration

```tsx
<PaintReveal cover="#f4f0e8">Hidden project content</PaintReveal>
```

## Props

- `children` — content beneath the canvas.
- `cover` — CSS color painted over the canvas.
- `brushSize` — eraser width in CSS pixels; defaults to `72`.
- `className` — classes for the containing surface.

The canvas is DPR-aware, resizes with its container, supports Pointer Events, and includes a keyboard-accessible Reset action.
