import { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { Toolbar } from "./Toolbar";

import { useAuthStore } from "@/store/useAuthStore";
import { useParams } from "react-router-dom";
import { useCanvasElements } from "@/hooks/useCanvasElements";
import { useWorkspaceSocket } from "@/hooks/useCanvasWebSocket";
import { toElementPayload } from "@/lib/helper";
import { v4 as uuidv4 } from "uuid";
import type {
  AWSIconElement,
  AWSIconType,
  CanvasElement,
  CursorsMap,
  DiagramContainerElement,
  ShapeType,
  TextElement,
} from "@/lib/types";
import { CanvasElements } from "./CanvasElements";
import { RemoteCursors } from "./RemoteCursors";
import { ZoomControls } from "./ZoomControls";
import { CanvasGridBg } from "./CanvasGridBD";
import type { KonvaEventObject } from "konva/lib/Node";
import {
  buildElementsFromDiagram,
  calculateContainerSize,
  parseDiagramDSL,
} from "@/lib/diagramDsl";
import { DiagramDslEditor } from "./DiagramDslEditor";
import { AIPromptDialog } from "./AIPromptDialog";

interface StagePos {
  x: number;
  y: number;
}
interface WindowSize {
  width: number;
  height: number;
}

//this is just a helper function to parse element data
const parseElement = (el: any): CanvasElement => ({
  ...el.data,
  id: el.id,
  type: el.type,
});

export function CanvasStage() {
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);

  const userId = useAuthStore((s) => s.user?.id) as string | undefined;
  const userName = useAuthStore((s) => s.user?.firstname) as string | undefined;

  // all the dates are here and their values
  const [dimensions, setDimensions] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [tool, setTool] = useState<ShapeType | "select" | "hand">("select");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [newElement, setNewElement] = useState<CanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState<StagePos>({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);
  const [canvasText, setCanvasText] = useState("Please edit your text");
  const [lastPointer, setLastPointer] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [cursors, setCursors] = useState<CursorsMap>({});

  const [aiPromptVisible, setAiPromptVisible] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [dslEditorVisible, setDslEditorVisible] = useState(false);
  const [dslEditingContainerId, setDslEditingContainerId] = useState<
    string | null
  >(null);
  const [dslValue, setDslValue] = useState<string>("");

  const { data: initialElements } = useCanvasElements(workspaceId);

  useEffect(() => {
    if (initialElements) {
      setElements(initialElements.map(parseElement));
    }
  }, [initialElements]);

  const { sendElementEvent, sendCursorEvent } = useWorkspaceSocket(
    workspaceId,
    useCallback((event: any) => {
      if (!event.element) return;
      const parsed = parseElement(event.element);
      if (event.action === "add") {
        setElements((els) => [...els, parsed]);
      } else if (event.action === "update") {
        setElements((els) =>
          els.map((el) => (el.id === parsed.id ? parsed : el))
        );
      } else if (event.action === "delete") {
        setElements((els) => els.filter((el) => el.id !== parsed.id));
      }
    }, []),
    useCallback((cursorEvent: { userId: string; x: number; y: number }) => {
      setCursors((prev) => ({
        ...prev,
        [cursorEvent.userId]: { x: cursorEvent.x, y: cursorEvent.y },
      }));
    }, [])
  );

  const handleElementChange = (
    action: "add" | "update" | "delete",
    element: CanvasElement | { id: string }
  ) => {
    sendElementEvent({
      action,
      workspaceId,
      userId,
      element: toElementPayload(element),
    });
  };

  const handleBroadcastCursor = (x: number, y: number) => {
    sendCursorEvent({
      workspaceId,
      userId,
      x,
      y,
    });
  };

  useEffect(() => {
    const onResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.container();
      container.style.cursor =
        tool === "select"
          ? "default"
          : tool === "hand"
          ? panning
            ? "grabbing"
            : "grab"
          : "crosshair";
    }
  }, [tool, panning]);

  const handleMouseDown = (e: any) => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    handleBroadcastCursor(pointer.x, pointer.y);
    const adjustedPointer = {
      x: (pointer.x - stagePos.x) / zoom,
      y: (pointer.y - stagePos.y) / zoom,
    };

    if (tool === "hand") {
      setPanning(true);
      setLastPointer(pointer);
      return;
    }
    if (tool === "select") {
      if (e.target === stage) {
        setSelectedId(null);
        return;
      }
      const clickedId = e.target.id();
      setSelectedId(clickedId || null);
      return;
    }
    if (tool !== "text") {
      setDrawing(true);
    }
    setSelectedId(null);

    if (tool === "rectangle") {
      setNewElement({
        id: uuidv4(),
        type: "rectangle",
        x: adjustedPointer.x,
        y: adjustedPointer.y,
        text: "",
        width: 0,
        height: 0,
        stroke: "#3b82f6",
        fill: "rgba(59, 130, 246, 0.1)",
        strokeWidth: 2,
      });
    } else if (tool === "circle") {
      setNewElement({
        id: uuidv4(),
        type: "circle",
        x: adjustedPointer.x,
        y: adjustedPointer.y,
        radius: 0,
        stroke: "#10b981",
        fill: "rgba(16, 185, 129, 0.1)",
        strokeWidth: 2,
        text: "",
      });
    } else if (tool === "line") {
      setNewElement({
        id: uuidv4(),
        type: "line",
        x: 0,
        y: 0,
        points: [
          adjustedPointer.x,
          adjustedPointer.y,
          adjustedPointer.x,
          adjustedPointer.y,
        ],
        stroke: "#8b5cf6",
        strokeWidth: 3,
        text: "",
      });
    } else if (tool === "arrow") {
      setNewElement({
        x: 0,
        y: 0,
        id: uuidv4(),
        type: "arrow",
        points: [
          adjustedPointer.x,
          adjustedPointer.y,
          adjustedPointer.x,
          adjustedPointer.y,
        ],
        stroke: "#f59e0b",
        strokeWidth: 3,
        text: "",
      });
    } else if (tool === "freedraw") {
      setNewElement({
        id: uuidv4(),
        x: 0,
        y: 0,
        type: "freedraw",
        points: [adjustedPointer.x, adjustedPointer.y],
        stroke: "#ef4444",
        strokeWidth: 3,
        text: "",
      });
    } else if (tool === "dashedRectangle") {
      setNewElement({
        id: uuidv4(),
        type: "dashedRectangle",
        x: adjustedPointer.x,
        y: adjustedPointer.y,
        width: 0,
        height: 0,
        stroke: "#3b82f6",
        fill: "rgba(59, 130, 246, 0.1)",
        strokeWidth: 2,
        text: "Group",
      });
    } else if (tool === "elbowArrow") {
      setNewElement({
        id: uuidv4(),
        type: "elbowArrow",
        x: 0,
        y: 0,
        points: [
          adjustedPointer.x,
          adjustedPointer.y,
          adjustedPointer.x,
          adjustedPointer.y,
        ],
        stroke: "#8b5cf6",
        strokeWidth: 3,
        text: "",
      });
    }

    if (tool === "text") {
      const newId = uuidv4();

      const element: TextElement = {
        id: newId,
        type: "text",
        x: adjustedPointer.x,
        y: adjustedPointer.y,
        text: canvasText,
        fontSize: 20,
        fontFamily: "Roboto",
        color: "#000",
      };

      setElements((els) => [...els, element]);
      setSelectedId(newId);
      handleElementChange("add", element);
      return;
    }
  };

  const handleMouseMove = (e: any) => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    handleBroadcastCursor(pointer.x, pointer.y);
    if (panning && lastPointer) {
      setStagePos((pos) => ({
        x: pos.x + (pointer.x - lastPointer.x),
        y: pos.y + (pointer.y - lastPointer.y),
      }));
      setLastPointer(pointer);
      return;
    }
    if (!drawing || !newElement) return;
    const adjustedPointer = {
      x: (pointer.x - stagePos.x) / zoom,
      y: (pointer.y - stagePos.y) / zoom,
    };

    if (newElement.type === "rectangle") {
      setNewElement({
        ...newElement,
        width: adjustedPointer.x - newElement.x,
        height: adjustedPointer.y - newElement.y,
      });
    } else if (newElement.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(adjustedPointer.x - newElement.x, 2) +
          Math.pow(adjustedPointer.y - newElement.y, 2)
      );
      setNewElement({
        ...newElement,
        radius,
      });
    } else if (newElement.type === "line" || newElement.type === "arrow") {
      setNewElement({
        ...newElement,
        points: [
          newElement.points[0],
          newElement.points[1],
          adjustedPointer.x,
          adjustedPointer.y,
        ],
      });
    } else if (newElement.type === "freedraw") {
      setNewElement({
        ...newElement,
        points: [...newElement.points, adjustedPointer.x, adjustedPointer.y],
      });
    } else if (newElement.type === "dashedRectangle") {
      setNewElement({
        ...newElement,
        width: adjustedPointer.x - newElement.x,
        height: adjustedPointer.y - newElement.y,
      });
    } else if (newElement.type === "elbowArrow") {
      const startX = newElement.points[0];
      const startY = newElement.points[1];
      const currentX = adjustedPointer.x;
      const currentY = adjustedPointer.y;
      const bendX = currentX;
      const bendY = startY;
      setNewElement({
        ...newElement,
        points: [startX, startY, bendX, bendY, currentX, currentY],
      });
    }
  };

  const handleMouseUp = () => {
    if (panning) {
      setPanning(false);
      setLastPointer(null);
      return;
    }
    if (!drawing || !newElement) return;

    const shouldAdd =
      newElement.type === "freedraw" ||
      newElement.type === "elbowArrow" ||
      newElement.type === "dashedRectangle" ||
      (newElement.type === "rectangle" &&
        (Math.abs(newElement.width) > 5 || Math.abs(newElement.height) > 5)) ||
      (newElement.type === "circle" && newElement.radius > 5) ||
      ((newElement.type === "line" || newElement.type === "arrow") &&
        Math.sqrt(
          Math.pow((newElement.points[2] ?? 0) - newElement.points[0], 2) +
            Math.pow((newElement.points[3] ?? 0) - newElement.points[1], 2)
        ) > 5);

    if (shouldAdd) {
      setElements((els) => {
        const updated = [...els, newElement as CanvasElement];
        handleElementChange("add", newElement);
        return updated;
      });
    }
    setDrawing(false);
    setNewElement(null);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
    const draggedElement = elements.find((el) => el.id === id);

    if (draggedElement?.type === "diagramContainer") {
      // Calculate how much the container moved
      const deltaX = newX - draggedElement.x;
      const deltaY = newY - draggedElement.y;

      setElements((prev) =>
        prev.map((el) => {
          // If this is the container, update its position
          if (el.id === id) {
            return { ...el, x: newX, y: newY };
          }
          // If it is a child of this container then move it by the delta positions
          if ((el as any).data?.containerId === id) {
            return { ...el, x: el.x + deltaX, y: el.y + deltaY };
          }
          return el;
        })
      );

      // Also broadcast update for other users
      elements.forEach((el) => {
        if ((el as any).data?.containerId === id) {
          handleElementChange("update", {
            ...el,
            x: el.x + deltaX,
            y: el.y + deltaY,
          });
        }
      });

      handleElementChange("update", { ...draggedElement, x: newX, y: newY });
      return;
    }

    setElements((prev) =>
      prev.map((el) =>
        el.id === id && "x" in el && "y" in el
          ? { ...el, x: newX, y: newY }
          : el
      )
    );

    const updatedElement = elements.find((el) => el.id === id);
    if (updatedElement) {
      handleElementChange("update", { ...updatedElement, x: newX, y: newY });
    }
  };

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    setElements((els) =>
      els.map((el) => {
        if (el.id !== id) return el;
        let updated = el;
        if (el.type === "rectangle") {
          updated = {
            ...el,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          };
        } else if (el.type === "circle") {
          updated = {
            ...el,
            x: node.x(),
            y: node.y(),
            radius: Math.max(5, el.radius * Math.max(scaleX, scaleY)),
          };
        }
        handleElementChange("update", updated);
        return updated;
      })
    );
    node.scaleX(1);
    node.scaleY(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        setElements((els) => {
          const updated = els.filter((el) => el.id !== selectedId);
          handleElementChange("delete", { id: selectedId });
          return updated;
        });
        setSelectedId(null);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  useEffect(() => {
    if (trRef.current && selectedId) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    if (e.evt.ctrlKey || e.evt.metaKey) {
      const scaleBy = 1.05;
      const stage = stageRef.current;
      const oldZoom = zoom;
      const pointer = stage.getPointerPosition();

      let newZoom = oldZoom;
      if (e.evt.deltaY < 0) {
        newZoom = Math.min(oldZoom * scaleBy, 5);
      } else {
        newZoom = Math.max(oldZoom / scaleBy, 0.1);
      }

      setZoom(newZoom);

      const mousePointTo = {
        x: (pointer.x - stagePos.x) / oldZoom,
        y: (pointer.y - stagePos.y) / oldZoom,
      };

      setStagePos({
        x: pointer.x - mousePointTo.x * newZoom,
        y: pointer.y - mousePointTo.y * newZoom,
      });
    } else {
      setStagePos((pos) => ({
        x: pos.x - e.evt.deltaX,
        y: pos.y - e.evt.deltaY,
      }));
    }
  };

  const handleTextEdit = (id: string, newText: string) => {
    setElements((els) =>
      els.map((el) =>
        el.id === id && el.type === "text" ? { ...el, text: newText } : el
      )
    );

    const updatedElement = elements.find((el) => el.id === id);
    if (updatedElement) {
      handleElementChange("update", { ...updatedElement, text: newText });
    }
  };

  const handleAWSIconSelect = (iconType: AWSIconType) => {
    // Add AWS icon to canvas at center of viewport
    const stage = stageRef.current;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const newAWSIcon: AWSIconElement = {
      id: uuidv4(),
      type: "awsIcon",
      iconType,
      label: iconType.toUpperCase(),
      x: (centerX - stagePos.x) / zoom - 30,
      y: (centerY - stagePos.y) / zoom - 30,
      width: 60,
      height: 60,
      text: "",
    };

    setElements((els) => [...els, newAWSIcon]);
    handleElementChange("add", newAWSIcon);
    setTool("select");
  };

  const handleDiagramAsCodeSelect = () => {
    const containerId = uuidv4();

    // Create a new diagram container element with an empty DSL
    const diagramContainer: DiagramContainerElement = {
      id: containerId,
      type: "diagramContainer",
      x: 100,
      y: 100,
      width: 800,
      height: 500,
      stroke: "#666",
      strokeWidth: 2,
      text: "",
      data: {
        title: "Cloud Arch Diagram",
        dsl: "",
      },
    };

    setElements((els) => [...els, diagramContainer]);
    setSelectedId(containerId);
    setDslEditingContainerId(containerId);
    setDslEditorVisible(true);
    handleElementChange("add", diagramContainer);
  };

  const handleAIAssistedDiagramSelect = () => {
    setAiPromptVisible(true);
  };

  const handleAIGeneratedDSL = (dsl: string) => {
    const containerId = uuidv4();

    // this will create a new diagram container element with dsl generated by AI
    const diagramContainer: DiagramContainerElement = {
      id: containerId,
      type: "diagramContainer",
      x: 100,
      y: 100,
      width: 800,
      height: 500,
      stroke: "#666",
      strokeWidth: 2,
      text: "",
      data: {
        title: "AI Generated Diagram",
        dsl: dsl,
      },
    };

    const parsed = parseDiagramDSL(dsl);
    const containerCopy = { ...diagramContainer };
    const newElements = buildElementsFromDiagram(
      parsed,
      containerId,
      containerCopy
    );

    const childElements = newElements.filter((el) => el.id !== containerId);
    calculateContainerSize(childElements, containerCopy);

    const finalContainer = {
      ...diagramContainer,
      width: containerCopy.width,
      height: containerCopy.height,
    };

    setElements((els) => [...els, finalContainer, ...childElements]);
    setSelectedId(containerId);
    handleElementChange("add", finalContainer);
    childElements.forEach((element) => {
      handleElementChange("add", element);
    });
  };

  const openDslEditor = (containerId: string) => {
    const container = elements.find(
      (el) => el.id === containerId && el.type === "diagramContainer"
    ) as DiagramContainerElement;
    setDslEditingContainerId(containerId);
    setDslValue(container?.data.dsl || "");
    setDslEditorVisible(true);
    setSelectedId(containerId);
  };

  const handleDslChange = (newDsl: string) => {
    setDslValue(newDsl);

    if (!dslEditingContainerId) return;

    const container = elements.find(
      (el) => el.id === dslEditingContainerId && el.type === "diagramContainer"
    ) as DiagramContainerElement;
    if (!container) return;

    const parsed = parseDiagramDSL(newDsl);
    const containerCopy = { ...container };

    const newElements = buildElementsFromDiagram(
      parsed,
      container.id,
      containerCopy
    );

    const childElements = newElements.filter((el) => el.id !== container.id);

    calculateContainerSize(childElements, containerCopy);

    setElements((els) => {
      const withoutOldChildren = els.filter(
        (el) => !(el.data?.containerId === container.id)
      );

      const updatedContainerElements = withoutOldChildren.map((el) =>
        el.id === container.id && el.type === "diagramContainer"
          ? {
              ...el,
              data: { ...el.data, dsl: newDsl },
              width: containerCopy.width,
              height: containerCopy.height,
            }
          : el
      );

      return [...updatedContainerElements, ...childElements];
    });

    // Persist each new element to the database through WebSocket
    childElements.forEach((element) => {
      handleElementChange("add", element);
    });

    const updatedContainer = {
      ...container,
      data: { ...container.data, dsl: newDsl },
      width: containerCopy.width,
      height: containerCopy.height,
    };
    handleElementChange("update", updatedContainer);
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <Toolbar
        tool={tool}
        setTool={setTool}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setElements={setElements}
        handleElementChange={handleElementChange}
        onAWSIconSelect={handleAWSIconSelect}
        onDiagramAsCodeSelect={handleDiagramAsCodeSelect}
        onAIAssistedDiagramSelect={handleAIAssistedDiagramSelect}
      />
      <ZoomControls
        zoom={zoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
      />
      <CanvasGridBg zoom={zoom} stagePos={stagePos} />
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <Layer>
          <CanvasElements
            elements={elements}
            newElement={newElement}
            tool={tool}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            handleDragEnd={handleDragEnd}
            handleTransformEnd={handleTransformEnd}
            onTextEdit={handleTextEdit}
            zoom={zoom}
            stagePos={stagePos}
            stageRef={stageRef}
            openDslEditor={openDslEditor}
          />
          <RemoteCursors
            cursors={cursors}
            userId={userId}
            userName={userName}
          />
          <Transformer ref={trRef} />
        </Layer>
      </Stage>
      {dslEditorVisible && dslEditingContainerId && (
        <DiagramDslEditor
          dsl={dslValue}
          onChange={handleDslChange}
          onClose={() => setDslEditorVisible(false)}
        />
      )}
      {aiPromptVisible && (
        <AIPromptDialog
          visible={aiPromptVisible}
          onClose={() => setAiPromptVisible(false)}
          onDSLGenerated={handleAIGeneratedDSL}
        />
      )}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <p className="text-lg font-medium mb-2">
              All In One Cloud Architecture Diagram Tool
            </p>
            <p className="text-sm">
              Select a tool from the toolbar and start drawing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
