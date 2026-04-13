import { GRID_CELL } from "@/constants/scene";

/**
 * Snaps a scalar to the grid when enabled. Free placement uses the raw value so
 * off-grid clicks still land exactly under the cursor.
 */
export function snapScalar(value: number, snapEnabled: boolean, cell = GRID_CELL): number {
  if (!snapEnabled) return value;
  return Math.round(value / cell) * cell;
}
