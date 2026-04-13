"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { clientXYToNdc } from "@/lib/pointerNdc";
import { snapScalar } from "@/lib/snap";

const DRAG_THRESHOLD_PX = 5;

type UseDragOnXZPlaneOptions = {
  snapEnabled: boolean;
  onDragTo: (x: number, z: number) => void;
  /** Fires once when movement crosses the drag threshold (orbit stays off until pointer up) */
  onDragStart?: () => void;
  /** Fires only if the pointer actually moved enough to count as a drag (avoids blocking the next grid click after a bare press) */
  onDragEnd?: () => void;
};

/**
 * Pointer drag projected onto y=0: updates X/Z (with optional snap). Disables default orbit
 * controls for the duration so dragging and camera orbit do not fight.
 */
export function useDragOnXZPlane({
  snapEnabled,
  onDragTo,
  onDragStart,
  onDragEnd,
}: UseDragOnXZPlaneOptions) {
  const { camera, gl } = useThree();
  const controls = useThree((s) => s.controls as { enabled?: boolean } | undefined);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  const onDragToRef = useRef(onDragTo);
  onDragToRef.current = onDragTo;

  const [dragging, setDragging] = useState(false);

  const applyMove = useCallback(
    (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect();
      clientXYToNdc(clientX, clientY, rect, ndc);
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(plane, hit)) return;
      const x = snapScalar(hit.x, snapEnabled);
      const z = snapScalar(hit.z, snapEnabled);
      onDragToRef.current(x, z);
    },
    [camera, gl.domElement, hit, ndc, plane, raycaster, snapEnabled],
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.button !== 0) return;
      if (controls) controls.enabled = false;

      const el = gl.domElement;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }

      const originX = e.clientX;
      const originY = e.clientY;
      let hasDragged = false;

      const onMove = (ev: PointerEvent) => {
        const dist = Math.hypot(ev.clientX - originX, ev.clientY - originY);
        if (!hasDragged) {
          if (dist <= DRAG_THRESHOLD_PX) return;
          hasDragged = true;
          setDragging(true);
          onDragStart?.();
        }
        applyMove(ev.clientX, ev.clientY);
      };

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch {
          /* noop */
        }
        if (controls) controls.enabled = true;
        setDragging(false);
        if (hasDragged) onDragEnd?.();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [applyMove, controls, gl.domElement, onDragEnd, onDragStart],
  );

  return { handlePointerDown, dragging };
}
