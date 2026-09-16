# ButtonWithIcon

A capsule button with a circular arrow that moves to the leading edge and rotates on hover.

## Dependencies

```bash
npm install lucide-react
```

Requires Tailwind CSS with shadcn/ui colour tokens (`bg-primary`, `bg-background`, and their foreground counterparts).

## Integration

```tsx
import { ButtonWithIcon } from "@/components/button-with-icon/button-with-icon";

<ButtonWithIcon onClick={() => console.log("Clicked")}>Let's Collaborate</ButtonWithIcon>;
```

## Props

- Accepts all native button props, including `onClick`, `disabled`, and `type`.
- `children` — the button label or other button content.
- `className` — optional Tailwind classes to adjust its appearance.
