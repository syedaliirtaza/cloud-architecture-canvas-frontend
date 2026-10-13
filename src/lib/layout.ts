import type { CanvasElement } from "./types";

const GRID_SIZE = 160;

export function positionForGrid(
  row: number,
  col: number
): { x: number; y: number } {
  return {
    x: col * GRID_SIZE,
    y: row * GRID_SIZE,
  };
}

export function getCenter(el: CanvasElement) {
  const width = "width" in el ? el.width : 60;
  const height = "height" in el ? el.height : 60;
  return {
    x: el.x + width / 2,
    y: el.y + height / 2,
  };
}

export function getElbowPoints(
  from: CanvasElement,
  to: CanvasElement
): number[] {
  const start = getCenter(from);
  const end = getCenter(to);

  if (start.x === end.x || start.y === end.y) {
    return [start.x, start.y, end.x, end.y];
  }

  return [start.x, start.y, start.x, end.y, end.x, end.y];
}

export function createArrowElement(
  from: CanvasElement,
  to: CanvasElement
): CanvasElement {
  return {
    id: `arrow-${from.id}-${to.id}`,
    type: "elbowArrow",
    x: 0,
    y: 0,
    points: getElbowPoints(from, to),
    stroke: "#6366f1",
    strokeWidth: 2,
    text: "",
  };
}

export function applyGridLayoutToElements(
  elements: CanvasElement[]
): CanvasElement[] {
  const positioned: CanvasElement[] = [];
  let row = 0;
  let col = 0;

  for (const el of elements) {
    if (el.type === "awsIcon") {
      const { x, y } = positionForGrid(row, col);
      el.x = x;
      el.y = y;
      col++;
      if (col >= 4) {
        col = 0;
        row++;
      }
    }
    positioned.push(el);
  }

  return positioned;
}
