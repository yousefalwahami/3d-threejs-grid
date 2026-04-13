"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";
import type { PlacedShape, ShapeKind } from "@/types/shapes";
import { Scene } from "./Scene";
import { Toolbox } from "./Toolbox";

export function Editor() {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [activeTool, setActiveTool] = useState<ShapeKind | null>(null);
  const [shapes, setShapes] = useState<PlacedShape[]>([]);

  const handlePlace = useCallback((kind: ShapeKind, position: [number, number, number]) => {
    setShapes((prev) => [...prev, { id: crypto.randomUUID(), kind, position }]);
  }, []);

  const handleMoveShape = useCallback((id: string, position: [number, number, number]) => {
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, position } : s)));
  }, []);

  const handleClear = useCallback(() => setShapes([]), []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
      <Toolbox
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        snapEnabled={snapEnabled}
        onSnapChange={setSnapEnabled}
        onClear={handleClear}
      />
      <div className="relative min-h-0 min-w-0 flex-1">
        <Canvas
          shadows
          camera={{ position: [11, 9, 11], fov: 50, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <Scene
              snapEnabled={snapEnabled}
              activeTool={activeTool}
              shapes={shapes}
              onPlace={handlePlace}
              onMoveShape={handleMoveShape}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
