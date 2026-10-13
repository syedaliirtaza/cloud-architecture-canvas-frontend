import { v4 as uuidv4 } from "uuid";
import dagre from "@dagrejs/dagre";
import type {
  AWSIconElement,
  AWSIconType,
  CanvasElement,
  DiagramContainerElement,
  ElbowArrowElement,
  LineElement,
  RectangleElement,
  CircleElement,
  DashedRectangleElement,
  TextElement,
} from "./types";

//this the type type the parser will output
export interface ParsedNode {
  id: string;
  label: string;
  iconType?: string | undefined;
  color?: string | undefined;
  children?: ParsedNode[];
  parentId?: string | undefined;
}

export interface ParsedConnection {
  from: string;
  to: string | string[];
  kind: "uni" | "bi" | "line";
}

export interface ParsedDiagram {
  nodes: ParsedNode[];
  connections: ParsedConnection[];
}

export function parseDiagramDSL(dsl: string): ParsedDiagram {
  const rawLines = dsl.split("\n");
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);

  const nodes: ParsedNode[] = [];
  const connections: ParsedConnection[] = [];
  const contextStack: ParsedNode[] = [];

  // Parse node line like:
  // Label [icon: EC2Icon]
  function parseNodeLine(line: string): ParsedNode | null {
    // allow label characters: letters, numbers, spaces, ., _, -, /
    const re = /^([A-Za-z0-9 .,_\-\/]+)(?:\s*\[([^\]]+)\])?$/;
    const match = re.exec(line);
    if (!match) return null;

    const label = match[1].trim();
    const props = match[2];

    let iconType: string | undefined;
    let color: string | undefined;

    if (props) {
      // this will split by comma and it ignore spaces
      props.split(",").forEach((p) => {
        const kv = p.split(":").map((s) => s.trim());
        if (kv.length === 2) {
          const key = kv[0].toLowerCase();
          const value = kv[1];
          if (key === "icon") iconType = value;
          if (key === "color") color = value;
        }
      });
    }

    return {
      id: uuidv4(),
      label,
      iconType,
      color,
      children: [],
    };
  }

  // this is the helper function to handle connection lines"
  function parseConnectionLine(line: string) {
    const opMatch = line.match(/(>|<|-)/);
    if (!opMatch) return;

    const op = opMatch[1];
    const parts = line.split(/\s*[><-]\s*/);
    if (parts.length < 2) return;

    const left = parts[0].trim();
    const right = parts.slice(1).join(">").trim();

    const targets = right
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let kind: ParsedConnection["kind"] = "uni";
    if (op === "<") kind = "bi";
    if (op === "-") kind = "line";

    connections.push({
      from: left,
      to: targets.length === 1 ? targets[0] : targets,
      kind,
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // close the group if line is '}' or ']'
    if (line === "}" || line === "]") {
      contextStack.pop();
      continue;
    }

    // group will be the start lines "VPC {" or "Subnet ["
    if (line.endsWith("{") || line.endsWith("[")) {
      const labelPart = line.slice(0, -1).trim();
      const node = parseNodeLine(labelPart);
      if (!node) continue;

      if (contextStack.length > 0) {
        const parent = contextStack[contextStack.length - 1];
        parent.children = parent.children || [];
        parent.children.push(node);
        node.parentId = parent.id;
      } else {
        nodes.push(node);
      }

      contextStack.push(node);
      continue;
    }

    // this is for connection line
    if (/[><-]/.test(line)) {
      parseConnectionLine(line);
      continue;
    }

    const node = parseNodeLine(line);
    if (node) {
      if (contextStack.length > 0) {
        const parent = contextStack[contextStack.length - 1];
        parent.children = parent.children || [];
        parent.children.push(node);
        node.parentId = parent.id;
      } else {
        nodes.push(node);
      }
    }
  }

  return { nodes, connections };
}

// factory methos for icons and elements
function createAWSIconElement(
  id: string,
  iconType: AWSIconType,
  label: string,
  x: number,
  y: number,
  containerId: string
): AWSIconElement {
  return {
    id,
    type: "awsIcon",
    iconType,
    label,
    x,
    y,
    width: 60,
    height: 60,
    text: label,
    data: { containerId },
  };
}

function createRectangleElement(
  id: string,
  label: string,
  x: number,
  y: number,
  containerId: string
): RectangleElement {
  return {
    id,
    type: "rectangle",
    x,
    y,
    width: 120,
    height: 60,
    fill: "rgba(59, 130, 246, 0.1)",
    stroke: "#3b82f6",
    strokeWidth: 2,
    text: label,
    data: { containerId },
  };
}

function createCircleElement(
  id: string,
  label: string,
  x: number,
  y: number,
  containerId: string
): CircleElement {
  return {
    id,
    type: "circle",
    x,
    y,
    radius: 40,
    fill: "rgba(16, 185, 129, 0.1)",
    stroke: "#10b981",
    strokeWidth: 2,
    text: label,
    data: { containerId },
  };
}

function createArrowElement(
  id: string,
  fromPoint: { x: number; y: number },
  toPoint: { x: number; y: number },
  containerId: string
): LineElement {
  return {
    id,
    type: "arrow",
    x: 0,
    y: 0,
    points: [fromPoint.x, fromPoint.y, toPoint.x, toPoint.y],
    stroke: "#f59e0b",
    strokeWidth: 3,
    text: "",
    data: { containerId },
  };
}

function createElbowArrowElement(
  id: string,
  points: number[],
  containerId: string
): ElbowArrowElement {
  return {
    id,
    type: "elbowArrow",
    x: 0,
    y: 0,
    points,
    stroke: "#8b5cf6",
    strokeWidth: 3,
    text: "",
    data: { containerId },
  };
}

function createDashedRectangleElement(
  id: string,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  containerId: string
): DashedRectangleElement {
  return {
    id,
    type: "dashedRectangle",
    x,
    y,
    width,
    height,
    stroke: "#3b82f6",
    strokeWidth: 2,
    fill: "rgba(59, 130, 246, 0.05)",
    text: label,
    data: { containerId },
  };
}

//helper functions that is required by the degree lib for fixing the layout
function getElementDimensions(element: CanvasElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (element.type === "circle") {
    const circle = element as CircleElement;
    return {
      x: circle.x - circle.radius,
      y: circle.y - circle.radius,
      width: circle.radius * 2,
      height: circle.radius * 2,
    };
  } else if (element.type === "awsIcon") {
    const icon = element as AWSIconElement;
    return { x: icon.x, y: icon.y, width: icon.width, height: icon.height };
  } else if (
    element.type === "rectangle" ||
    element.type === "dashedRectangle"
  ) {
    const rect = element as RectangleElement | DashedRectangleElement;
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  } else if (element.type === "diagramContainer") {
    const container = element as DiagramContainerElement;
    return {
      x: container.x,
      y: container.y,
      width: container.width,
      height: container.height,
    };
  } else if (element.type === "text") {
    const text = element as TextElement;
    const estimatedWidth = text.text.length * (text.fontSize * 0.6);
    const estimatedHeight = text.fontSize * 1.2;
    return {
      x: text.x,
      y: text.y,
      width: estimatedWidth,
      height: estimatedHeight,
    };
  }

  return { x: 0, y: 0, width: 60, height: 60 };
}

function getConnectionPoint(
  nodePos: { x: number; y: number; width: number; height: number },
  targetX: number,
  targetY: number
): { x: number; y: number } {
  const centerX = nodePos.x + nodePos.width / 2;
  const centerY = nodePos.y + nodePos.height / 2;

  const deltaX = targetX - centerX;
  const deltaY = targetY - centerY;

  // avoid division by zero
  const absDeltaX = Math.abs(deltaX) || 0.0001;
  const absDeltaY = Math.abs(deltaY) || 0.0001;

  const slope = Math.abs(deltaY / absDeltaX);
  const nodeRatio = nodePos.height / nodePos.width;

  if (slope < nodeRatio) {
    // left or right
    const x = deltaX > 0 ? nodePos.x + nodePos.width : nodePos.x;
    const y = centerY + (deltaY * nodePos.width) / (2 * absDeltaX);
    return {
      x,
      y: Math.max(nodePos.y, Math.min(nodePos.y + nodePos.height, y)),
    };
  } else {
    // top or bottom
    const y = deltaY > 0 ? nodePos.y + nodePos.height : nodePos.y;
    const x = centerX + (deltaX * nodePos.height) / (2 * absDeltaY);
    return {
      x: Math.max(nodePos.x, Math.min(nodePos.x + nodePos.width, x)),
      y,
    };
  }
}

function shouldUseElbowArrow(
  fromPoint: { x: number; y: number },
  toPoint: { x: number; y: number },
  fromPos: { x: number; y: number; width: number; height: number },
  toPos: { x: number; y: number; width: number; height: number }
): boolean {
  const deltaX = Math.abs(toPoint.x - fromPoint.x);
  const deltaY = Math.abs(toPoint.y - fromPoint.y);

  return deltaX > 120 && deltaY > 80;
}

function calculateElbowPoints(
  from: { x: number; y: number },
  to: { x: number; y: number }
): number[] {
  const midX = from.x + (to.x - from.x) * 0.6;
  return [from.x, from.y, midX, from.y, midX, to.y, to.x, to.y];
}

export function calculateContainerSize(
  elements: CanvasElement[],
  container: DiagramContainerElement
) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    if (el.data?.containerId === container.id) {
      const dim = getElementDimensions(el);

      // Account for possible stroke width / outline
      const EXTRA_MARGIN = 10;
      const x1 = dim.x - EXTRA_MARGIN;
      const y1 = dim.y - EXTRA_MARGIN;
      const x2 = dim.x + dim.width + EXTRA_MARGIN;
      const y2 = dim.y + dim.height + EXTRA_MARGIN;

      minX = Math.min(minX, x1);
      minY = Math.min(minY, y1);
      maxX = Math.max(maxX, x2);
      maxY = Math.max(maxY, y2);
    }
  });

  if (isFinite(minX)) {
    const PADDING = 40;
    const TITLE_BAR_HEIGHT = 30;

    container.x = minX - PADDING;
    container.y = minY - PADDING - TITLE_BAR_HEIGHT;
    container.width = maxX - minX + PADDING * 2;
    container.height = maxY - minY + PADDING * 2 + TITLE_BAR_HEIGHT;
  }
}

//this will build the layout
export function buildElementsFromDiagram(
  diagram: ParsedDiagram,
  containerId: string,
  container: DiagramContainerElement
): CanvasElement[] {
  const elements: CanvasElement[] = [];
  const nodePositions = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();

  // Create a new directed graph
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(() => ({}));

  const labelToNode = new Map<string, ParsedNode>();
  const nodeDimensions = new Map<string, { width: number; height: number }>();

  function collectLeafNodes(nodes: ParsedNode[]): ParsedNode[] {
    return nodes.flatMap((node) => {
      if (node.children && node.children.length > 0) {
        return collectLeafNodes(node.children);
      }
      return [node];
    });
  }

  const leafNodes = collectLeafNodes(diagram.nodes);

  leafNodes.forEach((node) => {
    const width = node.iconType ? 60 : 120;
    const height = node.iconType ? 60 : 60;

    graph.setNode(node.id, { width, height });
    labelToNode.set(node.label, node);
    nodeDimensions.set(node.id, { width, height });
  });

  diagram.connections.forEach((conn) => {
    const fromLabels = Array.isArray(conn.from) ? conn.from : [conn.from];
    const toLabels = Array.isArray(conn.to) ? conn.to : [conn.to];

    fromLabels.forEach((fromLabel) => {
      toLabels.forEach((toLabel) => {
        const fromNode = labelToNode.get(fromLabel);
        const toNode = labelToNode.get(toLabel);

        if (fromNode && toNode) {
          graph.setEdge(fromNode.id, toNode.id);
        }
      });
    });
  });

  dagre.layout(graph);

  leafNodes.forEach((node) => {
    const graphNode = graph.node(node.id);
    if (!graphNode) return;

    const { x, y, width, height } = graphNode;
    nodePositions.set(node.label, { x, y, width, height });

    if (node.iconType) {
      elements.push(
        createAWSIconElement(
          node.id,
          node.iconType as AWSIconType,
          node.label,
          x,
          y,
          containerId
        )
      );
    } else {
      elements.push(
        createRectangleElement(node.id, node.label, x, y, containerId)
      );
    }
  });

  function positionGroups(nodes: ParsedNode[]) {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        positionGroups(node.children);

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        node.children.forEach((child) => {
          const pos = nodePositions.get(child.label);
          if (pos) {
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            maxX = Math.max(maxX, pos.x + pos.width);
            maxY = Math.max(maxY, pos.y + pos.height);
          }
        });

        if (isFinite(minX)) {
          const padding = 20;
          const groupX = minX - padding;
          const groupY = minY - padding;
          const groupWidth = maxX - minX + padding * 2;
          const groupHeight = maxY - minY + padding * 2;

          elements.push(
            createDashedRectangleElement(
              node.id,
              node.label,
              groupX,
              groupY,
              groupWidth,
              groupHeight,
              containerId
            )
          );

          nodePositions.set(node.label, {
            x: groupX,
            y: groupY,
            width: groupWidth,
            height: groupHeight,
          });
        }
      }
    });
  }

  positionGroups(diagram.nodes);

  // Create connections
  diagram.connections.forEach((conn) => {
    const fromLabels = Array.isArray(conn.from) ? conn.from : [conn.from];
    const toLabels = Array.isArray(conn.to) ? conn.to : [conn.to];

    fromLabels.forEach((fromLabel) => {
      toLabels.forEach((toLabel) => {
        const fromPos = nodePositions.get(fromLabel);
        const toPos = nodePositions.get(toLabel);

        if (!fromPos || !toPos) return;

        const fromCenterX = fromPos.x + fromPos.width / 2;
        const fromCenterY = fromPos.y + fromPos.height / 2;
        const toCenterX = toPos.x + toPos.width / 2;
        const toCenterY = toPos.y + toPos.height / 2;

        const fromPoint = getConnectionPoint(fromPos, toCenterX, toCenterY);
        const toPoint = getConnectionPoint(toPos, fromCenterX, fromCenterY);

        const useElbow = shouldUseElbowArrow(
          fromPoint,
          toPoint,
          fromPos,
          toPos
        );

        if (useElbow) {
          const elbowPts = calculateElbowPoints(fromPoint, toPoint);
          elements.push(
            createElbowArrowElement(uuidv4(), elbowPts, containerId)
          );
        } else {
          elements.push(
            createArrowElement(uuidv4(), fromPoint, toPoint, containerId)
          );
        }
      });
    });
  });

  elements.push(container);

  calculateContainerSize(elements, container);

  return elements;
}

export function isSizedElement(
  el: CanvasElement
): el is
  | RectangleElement
  | AWSIconElement
  | DashedRectangleElement
  | DiagramContainerElement {
  return (
    el.type === "rectangle" ||
    el.type === "awsIcon" ||
    el.type === "dashedRectangle" ||
    el.type === "diagramContainer"
  );
}
