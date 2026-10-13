import { Rect, Circle, Line, Text, Arrow, Group } from "react-konva";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { AWS_ICONS } from "@/components/AWSIconMap";
import type {
  CanvasElement,
  AWSIconElement,
  ElbowArrowElement,
  DashedRectangleElement,
  DiagramContainerElement,
} from "@/lib/types";

interface CanvasElementsProps {
  elements: CanvasElement[];
  newElement: CanvasElement | null;
  tool: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  handleDragEnd: (e: any, id: string) => void;
  handleTransformEnd: (e: any, id: string) => void;
  onTextEdit?: (id: string, newText: string) => void;
  zoom: number;
  stagePos: { x: number; y: number };
  stageRef: React.RefObject<any>;
  openDslEditor: (containerId: string) => void;
}

export function CanvasElements({
  elements,
  newElement,
  tool,
  selectedId,
  setSelectedId,
  handleDragEnd,
  handleTransformEnd,
  openDslEditor,
}: CanvasElementsProps) {
  // this is just the funciton so that the children inside the constain can have the offset in the container
  function getOffset(el: CanvasElement): { x: number; y: number } {
    if (el.data?.containerId) {
      const parent = elements.find(
        (e) => e.id === el?.data?.containerId && e.type === "diagramContainer"
      ) as DiagramContainerElement | undefined;
      if (parent) {
        return { x: parent.x, y: parent.y };
      }
    }
    return { x: 0, y: 0 };
  }

  const awsIconImages: Record<string, ReturnType<typeof useImage>> = {};
  elements
    .filter((el) => el.type === "awsIcon")
    .forEach((el) => {
      const aws = el as AWSIconElement;
      const iconData = aws.iconType ? AWS_ICONS[aws.iconType] : undefined;
      if (iconData?.icon) {
        awsIconImages[el.id] = useImage(iconData.icon);
      }
    });

  const renderElement = (el: CanvasElement) => {
    const { x: offsetX, y: offsetY } = getOffset(el);
    switch (el.type) {
      case "rectangle":
        return (
          <Rect
            id={el.id}
            key={el.id}
            x={el.x + offsetX}
            y={el.y + offsetY}
            width={el.width}
            height={el.height}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            cornerRadius={4}
            shadowBlur={selectedId === el.id ? 8 : 0}
            shadowColor="rgba(59, 130, 246, 0.4)"
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e: any) => handleDragEnd(e, el.id)}
            onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
          />
        );
      case "dashedRectangle":
        const dashedRect = el as DashedRectangleElement;
        return (
          <Group key={el.id}>
            <Rect
              id={el.id}
              x={dashedRect.x + offsetX}
              y={dashedRect.y + offsetY}
              width={dashedRect.width}
              height={dashedRect.height}
              stroke={dashedRect.stroke}
              strokeWidth={dashedRect.strokeWidth}
              dash={[10, 5]}
              fill={dashedRect.fill || "transparent"}
              cornerRadius={4}
              shadowBlur={selectedId === el.id ? 8 : 0}
              shadowColor="rgba(59, 130, 246, 0.4)"
              draggable={tool === "select"}
              onClick={() => tool === "select" && setSelectedId(el.id)}
              onTap={() => tool === "select" && setSelectedId(el.id)}
              onDragEnd={(e: any) => handleDragEnd(e, el.id)}
              onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
            />
            {dashedRect.text && (
              <Text
                x={dashedRect.x + offsetX + 10}
                y={dashedRect.y + offsetY + 10}
                text={dashedRect.text}
                fontSize={14}
                fontFamily="Arial"
                fill={dashedRect.stroke}
                fontStyle="bold"
              />
            )}
          </Group>
        );
      case "circle":
        return (
          <Circle
            id={el.id}
            key={el.id}
            x={el.x + offsetX}
            y={el.y + offsetY}
            radius={el.radius}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            shadowBlur={selectedId === el.id ? 8 : 0}
            shadowColor="rgba(16, 185, 129, 0.4)"
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e: any) => handleDragEnd(e, el.id)}
            onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
          />
        );
      case "line":
      case "arrow":
        return (
          <Arrow
            id={el.id}
            key={el.id}
            x={offsetX}
            y={offsetY}
            points={el.points}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            lineCap="butt"
            lineJoin="round"
            shadowBlur={selectedId === el.id ? 4 : 0}
            shadowColor="rgba(139, 92, 246, 0.4)"
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e: any) => handleDragEnd(e, el.id)}
            onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
          />
        );
      case "elbowArrow":
        const elbowArrow = el as ElbowArrowElement;
        return (
          <Arrow
            id={el.id}
            key={el.id}
            x={offsetX}
            y={offsetY}
            points={elbowArrow.points}
            stroke={elbowArrow.stroke}
            strokeWidth={elbowArrow.strokeWidth}
            lineJoin="miter"
            lineCap="butt"
            pointerLength={10}
            pointerWidth={8}
            pointerAtEnding={true}
            shadowBlur={selectedId === el.id ? 4 : 0}
            shadowColor="rgba(139, 92, 246, 0.4)"
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e: any) => handleDragEnd(e, el.id)}
            onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
          />
        );
      case "freedraw":
        return (
          <Line
            key={el.id}
            id={el.id}
            x={offsetX}
            y={offsetY}
            points={el.points}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
            globalCompositeOperation="source-over"
          />
        );
      case "text":
        return (
          <Text
            id={el.id}
            key={el.id}
            x={el.x + offsetX}
            y={el.y + offsetY}
            text={el.text}
            fontSize={el.fontSize}
            fontFamily={el.fontFamily}
            fill={el.color}
            shadowBlur={selectedId === el.id ? 4 : 0}
            shadowColor="rgba(0, 0, 0, 0.3)"
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e: any) => handleDragEnd(e, el.id)}
            onTransformEnd={(e: any) => handleTransformEnd(e, el.id)}
          />
        );
      case "awsIcon":
        const awsIcon = el as AWSIconElement;
        const iconData = awsIcon.iconType
          ? AWS_ICONS[awsIcon.iconType]
          : undefined;
        if (!iconData) {
          return (
            <Rect
              key={el.id}
              id={el.id}
              x={awsIcon.x + offsetX}
              y={awsIcon.y + offsetY}
              width={awsIcon.width}
              height={awsIcon.height}
              fill="#f3f4f6"
              stroke="#9ca3af"
              strokeWidth={1}
              cornerRadius={4}
              draggable={tool === "select"}
              onClick={() => tool === "select" && setSelectedId(el.id)}
              onTap={() => tool === "select" && setSelectedId(el.id)}
              onDragEnd={(e) => handleDragEnd(e, el.id)}
              onTransformEnd={(e) => handleTransformEnd(e, el.id)}
            />
          );
        }

        const [image] = awsIconImages[el.id] || [];
        return (
          <Group
            key={el.id}
            id={el.id}
            x={awsIcon.x + offsetX}
            y={awsIcon.y + offsetY}
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e) => handleDragEnd(e, el.id)}
            onTransformEnd={(e) => handleTransformEnd(e, el.id)}
          >
            {image && (
              <KonvaImage
                image={image}
                width={awsIcon.width}
                height={awsIcon.height}
              />
            )}
            <Text
              x={awsIcon.width / 2.5}
              y={awsIcon.height + 10}
              text={awsIcon.label}
              fontSize={11}
              fontFamily="Arial"
              fill="#374151"
              align="center"
              offsetX={awsIcon.label.length * 2.5}
            />
          </Group>
        );
      case "diagramContainer":
        const container = el as DiagramContainerElement;
        return (
          <Group
            key={el.id}
            id={el.id}
            x={container.x}
            y={container.y}
            draggable={tool === "select"}
            onClick={() => tool === "select" && setSelectedId(el.id)}
            onTap={() => tool === "select" && setSelectedId(el.id)}
            onDragEnd={(e) => handleDragEnd(e, el.id)}
            onTransformEnd={(e) => handleTransformEnd(e, el.id)}
          >
            {/* Container background */}
            <Rect
              x={0}
              y={0}
              width={container.width}
              height={container.height}
              stroke={container.stroke}
              strokeWidth={container.strokeWidth}
              dash={[15, 10]}
              fill={container.fill}
              cornerRadius={8}
              shadowBlur={selectedId === el.id ? 8 : 0}
              shadowColor="rgba(59, 130, 246, 0.4)"
            />
            {/* Title bar */}
            <Rect
              x={0}
              y={0}
              width={container.width}
              height={35}
              fill="rgba(59, 130, 246, 0.1)"
              stroke={container.stroke}
              strokeWidth={1}
              cornerRadius={[8, 8, 0, 0]}
            />
            {/* Title text */}
            <Text
              x={12}
              y={12}
              text={container.data.title}
              fontSize={14}
              fontFamily="Arial"
              fill="#1f2937"
              fontStyle="bold"
            />
            {/* DSL editor button */}
            <Rect
              x={container.width - 45}
              y={8}
              width={35}
              height={20}
              fill="#ffffff"
              stroke="#d1d5db"
              strokeWidth={1}
              cornerRadius={4}
              shadowBlur={2}
              shadowColor="rgba(0, 0, 0, 0.1)"
              onClick={(e) => {
                e.cancelBubble = true;
                openDslEditor(container.id);
              }}
              onTap={(e) => {
                e.cancelBubble = true;
                openDslEditor(container.id);
              }}
            />
            {/* Button icon */}
            <Text
              x={container.width - 37}
              y={11}
              text="{ }"
              fontSize={12}
              fontFamily="monospace"
              fill="#3b82f6"
              fontStyle="bold"
              onClick={(e) => {
                e.cancelBubble = true;
                openDslEditor(container.id);
              }}
              onTap={(e) => {
                e.cancelBubble = true;
                openDslEditor(container.id);
              }}
            />
            {/* Status indicator */}
            {container.data.dsl && container.data.dsl.trim() && (
              <Circle
                x={container.width - 15}
                y={25}
                radius={3}
                fill="#10b981"
              />
            )}
          </Group>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {elements.map(renderElement)}
      {newElement && renderElement(newElement)}
    </>
  );
}
