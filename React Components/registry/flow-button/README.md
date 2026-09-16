# FlowButton

A button whose dark centre grows outward on hover while its arrows trade places. Defaults to a capsule; a low-radius rounded rectangle and left-flowing navigation variant are also available.

## Dependencies

```bash
npm install lucide-react
```

## Integration

```tsx
import { FlowButton } from "@/components/flow-button/flow-button";

<FlowButton text="View Menu" onClick={() => console.log("Clicked")} />;
<FlowButton text="GitHub" href="https://github.com/owner/repository" shape="rectangle" />;
<FlowButton text="Back to home" href="/" shape="rectangle" direction="left" />;
```

## Props

- `text` — label text; defaults to `"Modern Button"`.
- `shape` — `"pill"` (default) or `"rectangle"` (6px corners).
- `direction` — `"right"` (default) or `"left"` for back navigation.
- `icon` — optional decorative React icon displayed beside the label.
- `hoverIcon` — optional decorative React icon replacing the incoming arrow on hover or keyboard focus. The outgoing arrow remains visible at rest; no extra icon is added beside the label.
- Accepts native button props, including `onClick`, `disabled`, and `type`. Adding `href` renders a native anchor and accepts link props instead.
- `className` — optional Tailwind classes to adjust its appearance.
- Keyboard focus shares the hover treatment. Reduced-motion preferences disable transitions; disabled buttons do not animate.
