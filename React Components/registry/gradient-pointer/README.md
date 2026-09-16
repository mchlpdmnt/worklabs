# GradientPointer

A responsive color field recreated from the interaction pattern in Olivier Larose's [Gradient Mouse Move](https://blog.olivierlarose.com/tutorials/gradient-mouse-move): a layered gradient follows the pointer without adding a render loop.

## Dependencies

React and Tailwind CSS only.

## Integration

```tsx
<GradientPointer glow="#f0ff8c" base="#5528ff">Your content</GradientPointer>
```

## Props

- `children` — content rendered above the field.
- `glow` / `base` — CSS colors for the near and middle stops.
- `className` — classes for sizing and composition.

Touch users receive the centered composition. Pointer movement only updates two CSS custom properties.
