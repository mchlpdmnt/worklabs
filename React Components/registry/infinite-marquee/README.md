# InfiniteMarquee

A direction-aware infinite text rail recreated from the interaction pattern in Olivier Larose's [Infinite Text Move On Scroll](https://blog.olivierlarose.com/tutorials/infinite-text-move-on-scroll): the marquee reverses with the visitor's vertical scroll direction, loops without a visible seam, and pauses for reduced-motion users.

## Dependencies

```bash
npm install motion
```

## Integration

```tsx
<InfiniteMarquee items={["Design", "Motion", "Development"]} />
```

## Props

- `items` — text entries in the repeating rail.
- `speed` — travel speed in pixels per second; defaults to `56`.
- `separator` — decorative separator between entries.
- `className` — classes for the outer clipping region.

The duplicate rail is hidden from assistive technology. Wheel input only changes direction; native scrolling is never blocked.
