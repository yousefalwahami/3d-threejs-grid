import type { ShapeKind } from "@/types/shapes";

/** Must stay aligned with `Grid` `cellSize` and placement snap math */
export const GRID_CELL = 1;

/** Vertical center and geometry args per kind — kept in one place so meshes and hit heights stay consistent */
export const SHAPE_LAYOUT = {
  circle: { centerY: 0.02, circleRadius: 0.55, segments: 48 },
  cube: { centerY: 0.5, width: 1, height: 1, depth: 1 },
  rectangle: { centerY: 0.25, width: 2, height: 0.5, depth: 1 },
} as const;

export function shapeCenterY(kind: ShapeKind): number {
  switch (kind) {
    case "circle":
      return SHAPE_LAYOUT.circle.centerY;
    case "cube":
      return SHAPE_LAYOUT.cube.centerY;
    case "rectangle":
      return SHAPE_LAYOUT.rectangle.centerY;
  }
}
