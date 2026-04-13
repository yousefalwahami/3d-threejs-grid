"use client";

import { Box, Circle } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { SHAPE_LAYOUT } from "@/constants/scene";
import type { ShapeKind } from "@/types/shapes";

const COLORS: Record<ShapeKind, string> = {
  circle: "#14b8a6",
  cube: "#f97316",
  rectangle: "#6366f1",
};

type PlacedShapeMeshProps = {
  kind: ShapeKind;
  position: [number, number, number];
};

/** One placed primitive; stops pointer events so placements go to the floor, not through objects */
export function PlacedShapeMesh({ kind, position }: PlacedShapeMeshProps) {
  const stopPointer = (e: ThreeEvent<PointerEvent>) => e.stopPropagation();
  const stopClick = (e: ThreeEvent<MouseEvent>) => e.stopPropagation();

  switch (kind) {
    case "circle": {
      const { circleRadius, segments } = SHAPE_LAYOUT.circle;
      return (
        <group position={position} onPointerDown={stopPointer} onClick={stopClick}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Circle args={[circleRadius, segments]}>
              <meshStandardMaterial
                color={COLORS.circle}
                roughness={0.45}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </Circle>
          </group>
        </group>
      );
    }
    case "cube": {
      const { width, height, depth } = SHAPE_LAYOUT.cube;
      return (
        <Box
          args={[width, height, depth]}
          position={position}
          castShadow
          receiveShadow
          onPointerDown={stopPointer}
          onClick={stopClick}
        >
          <meshStandardMaterial color={COLORS.cube} roughness={0.4} metalness={0.15} />
        </Box>
      );
    }
    case "rectangle": {
      const { width, height, depth } = SHAPE_LAYOUT.rectangle;
      return (
        <Box
          args={[width, height, depth]}
          position={position}
          castShadow
          receiveShadow
          onPointerDown={stopPointer}
          onClick={stopClick}
        >
          <meshStandardMaterial color={COLORS.rectangle} roughness={0.4} metalness={0.15} />
        </Box>
      );
    }
  }
}
