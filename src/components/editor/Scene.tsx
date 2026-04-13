"use client";

import { Grid, OrbitControls } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { SHAPE_LAYOUT } from "@/constants/scene";
import { snapScalar } from "@/lib/snap";
import type { PlacedShape, ShapeKind } from "@/types/shapes";
import { PlacedShapeMesh } from "./PlacedShapeMesh";

type SceneProps = {
  snapEnabled: boolean;
  activeTool: ShapeKind | null;
  shapes: PlacedShape[];
  onPlace: (kind: ShapeKind, position: [number, number, number]) => void;
};

function centerYForKind(kind: ShapeKind): number {
  switch (kind) {
    case "circle":
      return SHAPE_LAYOUT.circle.centerY;
    case "cube":
      return SHAPE_LAYOUT.cube.centerY;
    case "rectangle":
      return SHAPE_LAYOUT.rectangle.centerY;
  }
}

/**
 * Lights, shadows, infinite grid (shader plane from drei), and click-to-place on the grid plane.
 * Orbit controls share the same pointer layer; `stopPropagation` on meshes avoids accidental placement through them.
 */
export function Scene({ snapEnabled, activeTool, shapes, onPlace }: SceneProps) {
  // `onClick` avoids fighting OrbitControls: drags rotate the camera, short clicks still place.
  const handleGridClick = (e: ThreeEvent<MouseEvent>) => {
    if (!activeTool) return;
    e.stopPropagation();
    const p = e.point;
    const x = snapScalar(p.x, snapEnabled);
    const z = snapScalar(p.z, snapEnabled);
    const y = centerYForKind(activeTool);
    onPlace(activeTool, [x, y, z]);
  };

  const gridArgs = useMemo(() => [30, 30] as [number, number], []);

  return (
    <>
      <color attach="background" args={["#0c0c0f"]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[10, 18, 8]}
        intensity={1.15}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {/* drei SoftShadows injects GLSL that assumes packed RGBA shadows; current Three uses depth textures → shader errors. */}

      <Grid
        infiniteGrid
        fadeDistance={55}
        fadeStrength={1.2}
        cellSize={1}
        sectionSize={5}
        sectionColor="#3b82f6"
        cellColor="#64748b"
        sectionThickness={1.1}
        cellThickness={0.6}
        position={[0, 0, 0]}
        args={gridArgs}
        side={THREE.DoubleSide}
        onClick={handleGridClick}
      />

      {shapes.map((s) => (
        <PlacedShapeMesh key={s.id} kind={s.kind} position={s.position} />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={42}
        target={[0, 0, 0]}
      />
    </>
  );
}
