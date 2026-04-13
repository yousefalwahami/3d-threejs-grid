export type ShapeKind = "circle" | "cube" | "rectangle";

export type PlacedShape = {
  id: string;
  kind: ShapeKind;
  /** World-space center of the shape */
  position: [number, number, number];
};
