import * as React from "react"
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden"

/**
 * VisuallyHidden component for accessibility
 * Hides content visually but keeps it accessible to screen readers
 */
const VisuallyHidden = React.forwardRef<
  React.ElementRef<typeof VisuallyHiddenPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>
>((props, ref) => (
  <VisuallyHiddenPrimitive.Root ref={ref} {...props} />
))
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
