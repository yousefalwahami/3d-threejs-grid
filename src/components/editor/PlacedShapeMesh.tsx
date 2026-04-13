"use client";

import { Box, Circle, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCallback, useState } from "react";
import { SHAPE_LAYOUT, shapeCenterY } from "@/constants/scene";
import { useDragOnXZPlane } from "@/hooks/useDragOnXZPlane";
import type { ShapeKind } from "@/types/shapes";

const COLORS: Record<ShapeKind, string> = {
  circle: "#14b8a6",
  cube: "#f97316",
  rectangle: "#6366f1",
};

type PlacedShapeMeshProps = {
  id: string;
  kind: ShapeKind;
  position: [number, number, number];
  snapEnabled: boolean;
  onMove: (id: string, position: [number, number, number]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export function PlacedShapeMesh({
  id,
  kind,
  position,
  snapEnabled,
  onMove,
  onDragStart,
  onDragEnd,
}: PlacedShapeMeshProps) {
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const centerY = shapeCenterY(kind);

  const onDragTo = useCallback(
    (x: number, z: number) => {
      onMove(id, [x, centerY, z]);
    },
    [centerY, id, onMove],
  );

  const { handlePointerDown, dragging } = useDragOnXZPlane({
    snapEnabled,
    onDragTo,
    onDragStart,
    onDragEnd,
  });

  useCursor(hovered || dragging, dragging ? "grabbing" : "grab", "auto", gl.domElement);

  const stopClick = (e: ThreeEvent<MouseEvent>) => e.stopPropagation();

  const rootProps = {
    position,
    onPointerDown: handlePointerDown,
    onClick: stopClick,
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(false);
    },
  };

  switch (kind) {
    case "circle": {
      const { circleRadius, segments } = SHAPE_LAYOUT.circle;
      return (
        <group {...rootProps}>
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
        <group {...rootProps}>
          <Box args={[width, height, depth]} castShadow receiveShadow>
            <meshStandardMaterial color={COLORS.cube} roughness={0.4} metalness={0.15} />
          </Box>
        </group>
      );
    }
    case "rectangle": {
      const { width, height, depth } = SHAPE_LAYOUT.rectangle;
      return (
        <group {...rootProps}>
          <Box args={[width, height, depth]} castShadow receiveShadow>
            <meshStandardMaterial color={COLORS.rectangle} roughness={0.4} metalness={0.15} />
          </Box>
        </group>
      );
    }
  }
}
