interface CanvasGridBgProps {
  zoom: number;
  stagePos: { x: number; y: number };
}
export function CanvasGridBg({ zoom, stagePos }: CanvasGridBgProps) {
  return (
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${stagePos.x}px ${stagePos.y}px`,
      }}
    />
  );
}
