import type { Vector2 } from "three";

/** Normalized device coords for `Raycaster.setFromCamera` — must be relative to the canvas, not the viewport */
export function clientXYToNdc(
  clientX: number,
  clientY: number,
  rect: DOMRectReadOnly,
  out: Vector2,
): void {
  out.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  out.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}
