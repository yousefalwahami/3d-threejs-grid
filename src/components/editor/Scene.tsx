"use client";

import { OrbitControls } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { shapeCenterY } from "@/constants/scene";
import { snapScalar } from "@/lib/snap";
import type { PlacedShape, ShapeKind } from "@/types/shapes";
import { PlacedShapeMesh } from "./PlacedShapeMesh";

type SceneProps = {
  snapEnabled: boolean;
  activeTool: ShapeKind | null;
  shapes: PlacedShape[];
  onPlace: (kind: ShapeKind, position: [number, number, number]) => void;
  onMoveShape: (id: string, position: [number, number, number]) => void;
};

/**
 * Lights, shadows, XZ grid, and click-to-place. Uses THREE.GridHelper so line positions match
 * world integer coordinates; drei's shader Grid + infiniteGrid stretches vertices so visuals
 * no longer matched raycast hits / snapping.
 */
export function Scene({ snapEnabled, activeTool, shapes, onPlace, onMoveShape }: SceneProps) {
  const skipNextGridClick = useRef(false);
  const scheduleSkipReset = () => {
    window.setTimeout(() => {
      skipNextGridClick.current = false;
    }, 400);
  };

  const gridHelper = useMemo(() => {
    const g = new THREE.GridHelper(200, 200, "#3b82f6", "#64748b");
    g.position.y = 0.001;
    return g;
  }, []);

  // `onClick` avoids fighting OrbitControls: drags rotate the camera, short clicks still place.
  const handleGridClick = (e: ThreeEvent<MouseEvent>) => {
    if (skipNextGridClick.current) {
      skipNextGridClick.current = false;
      return;
    }
    if (!activeTool) return;
    e.stopPropagation();
    const p = e.point;
    const x = snapScalar(p.x, snapEnabled);
    const z = snapScalar(p.z, snapEnabled);
    const y = shapeCenterY(activeTool);
    onPlace(activeTool, [x, y, z]);
  };

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

      <primitive object={gridHelper} />

      {/* Full picking surface at y=0; R3F uses canvas-relative coords (offsetX/Y). GridHelper is lines-only. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={handleGridClick}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      {shapes.map((s) => (
        <PlacedShapeMesh
          key={s.id}
          id={s.id}
          kind={s.kind}
          position={s.position}
          snapEnabled={snapEnabled}
          onMove={onMoveShape}
          onDragEnd={() => {
            skipNextGridClick.current = true;
            scheduleSkipReset();
          }}
        />
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
