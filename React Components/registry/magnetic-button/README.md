# MagneticButton

A pointer-responsive action recreated from the interaction pattern in Olivier Larose's [Magnetic Button](https://blog.olivierlarose.com/tutorials/magnetic-button): the control is pulled toward a nearby pointer, then settles smoothly back into place.

## Dependencies

```bash
npm install motion
```

## Integration

```tsx
<MagneticButton strength={0.25}>Start a project</MagneticButton>
```

## Props

- `strength` — fraction of the pointer's distance applied to the button; defaults to `0.3`.
- Accepts native button props and children.

The magnetic response is mouse-only, resets on blur/leave, and is disabled for reduced-motion users. Touch and keyboard users receive a stable native button.
