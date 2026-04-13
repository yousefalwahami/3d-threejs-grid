"use client";

import type { ShapeKind } from "@/types/shapes";

const TOOLS: { kind: ShapeKind; label: string; hint: string }[] = [
  { kind: "circle", label: "Circle", hint: "Flat circle on the ground plane" },
  { kind: "cube", label: "Cube", hint: "Unit cube" },
  { kind: "rectangle", label: "Rectangle", hint: "Wide low box" },
];

type ToolboxProps = {
  activeTool: ShapeKind | null;
  onSelectTool: (kind: ShapeKind | null) => void;
  snapEnabled: boolean;
  onSnapChange: (value: boolean) => void;
  onClear: () => void;
};

export function Toolbox({
  activeTool,
  onSelectTool,
  snapEnabled,
  onSnapChange,
  onClear,
}: ToolboxProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 border-r border-zinc-800 bg-zinc-950 p-5 text-zinc-100">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Shape toolbox</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Pick a shape, then click the grid to place. Drag with the mouse to orbit; scroll to zoom.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Add</span>
        <div className="flex flex-col gap-2">
          {TOOLS.map(({ kind, label, hint }) => {
            const selected = activeTool === kind;
            return (
              <button
                key={kind}
                type="button"
                title={hint}
                onClick={() => onSelectTool(selected ? null : kind)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  selected
                    ? "border-sky-500 bg-sky-950/60 text-sky-100"
                    : "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Grid</span>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2.5">
          <span className="text-sm text-zinc-200">Snap to grid</span>
          <button
            type="button"
            role="switch"
            aria-checked={snapEnabled}
            onClick={() => onSnapChange(!snapEnabled)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              snapEnabled ? "bg-sky-600" : "bg-zinc-600"
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                snapEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>
        <p className="text-xs leading-relaxed text-zinc-500">
          When on, new shapes snap to 1-unit cells (same spacing as the grid lines). When off, they
          land exactly where you click.
        </p>
      </div>

      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-red-500/80 hover:bg-red-950/40 hover:text-red-100"
        >
          Clear all shapes
        </button>
      </div>
    </aside>
  );
}
