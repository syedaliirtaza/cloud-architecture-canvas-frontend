import {
  Trash2,
  MousePointer,
  Hand,
  Pencil,
  Square,
  Circle as CircleIcon,
  ArrowRight,
  Minus,
  Type,
  CornerRightDown,
  Box,
  Cloud,
  Code,
  Sparkles,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CanvasElement, AWSIconType } from "@/lib/types";
import { AWS_ICONS } from "@/components/AWSIconMap";

type Tool =
  | "select"
  | "hand"
  | "freedraw"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "text"
  | "awsIcon"
  | "elbowArrow"
  | "dashedRectangle"
  | "diagramContainer";

interface ToolbarProps {
  tool: Tool;
  setTool: Dispatch<SetStateAction<Tool>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  handleElementChange: (
    action: "add" | "update" | "delete",
    element: CanvasElement | { id: string }
  ) => void;
  onAWSIconSelect?: (iconType: AWSIconType) => void;
  onDiagramAsCodeSelect?: () => void;
  onAIAssistedDiagramSelect?: () => void;
}

const TOOLBAR_TOOLS: { id: Tool; icon: any; label: string; group: string }[] = [
  { id: "select", icon: MousePointer, label: "Select", group: "selection" },
  { id: "hand", icon: Hand, label: "Pan", group: "selection" },
];

const DRAWING_TOOLS: { id: Tool; icon: any; label: string; group: string }[] = [
  { id: "freedraw", icon: Pencil, label: "Free Draw", group: "draw" },
  { id: "rectangle", icon: Square, label: "Rectangle", group: "shapes" },
  {
    id: "dashedRectangle",
    icon: Box,
    label: "Dashed Rectangle",
    group: "shapes",
  },
  { id: "circle", icon: CircleIcon, label: "Circle", group: "shapes" },
  { id: "line", icon: Minus, label: "Line", group: "shapes" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", group: "shapes" },
  {
    id: "elbowArrow",
    icon: CornerRightDown,
    label: "Elbow Arrow",
    group: "shapes",
  },
  { id: "text", icon: Type, label: "Text", group: "text" },
];

export function Toolbar({
  tool,
  setTool,
  selectedId,
  setSelectedId,
  setElements,
  handleElementChange,
  onAWSIconSelect,
  onDiagramAsCodeSelect,
  onAIAssistedDiagramSelect,
}: ToolbarProps) {
  const [awsSubmenuOpen, setAwsSubmenuOpen] = useState(false);
  const [plusSubmenuOpen, setPlusSubmenuOpen] = useState(false);
  const awsSubmenuRef = useRef<HTMLDivElement>(null);
  const plusSubmenuRef = useRef<HTMLDivElement>(null);

  // Close submenus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        awsSubmenuRef.current &&
        !awsSubmenuRef.current.contains(event.target as Node)
      ) {
        setAwsSubmenuOpen(false);
      }
      if (
        plusSubmenuRef.current &&
        !plusSubmenuRef.current.contains(event.target as Node)
      ) {
        setPlusSubmenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2">
        {/* Selection Tools */}
        <div className="flex flex-col gap-1">
          {TOOLBAR_TOOLS.map((toolItem) => (
            <Button
              key={toolItem.id}
              size="icon"
              variant={tool === toolItem.id ? "default" : "ghost"}
              className={cn(
                "w-11 h-11 rounded-xl transition-all duration-200",
                tool === toolItem.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              )}
              onClick={() => setTool(toolItem.id)}
            >
              <toolItem.icon size={20} />
            </Button>
          ))}
        </div>

        <div className="h-px bg-gray-200 mx-2 mb-3" />

        {/* to show all the icons in the toolbar */}
        <div className="flex flex-col gap-1 mb-3">
          {DRAWING_TOOLS.map((toolItem) => (
            <Button
              key={toolItem.id}
              size="icon"
              variant={tool === toolItem.id ? "default" : "ghost"}
              className={cn(
                "w-11 h-11 rounded-xl transition-all duration-200",
                tool === toolItem.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              )}
              onClick={() => setTool(toolItem.id)}
            >
              <toolItem.icon size={20} />
            </Button>
          ))}
        </div>

        <div className="h-px bg-gray-200 mx-2 mb-3" />

        {/* this is to open the aws menu lib from the tool bar  */}
        <div className="relative" ref={awsSubmenuRef}>
          <Button
            size="icon"
            variant={awsSubmenuOpen ? "default" : "ghost"}
            className={cn(
              "w-11 h-11 rounded-xl transition-all duration-200 relative",
              awsSubmenuOpen
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-600"
            )}
            onClick={() => setAwsSubmenuOpen(!awsSubmenuOpen)}
          >
            <Cloud size={20} />
            <ChevronRight
              size={12}
              className={cn(
                "absolute -right-1 -top-1 transition-transform duration-200",
                awsSubmenuOpen && "rotate-90"
              )}
            />
          </Button>

          {awsSubmenuOpen && (
            <div className="absolute left-full ml-2 top-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-2 min-w-[200px] z-50">
              <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2">
                AWS Services
              </div>
              <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                {Object.entries(AWS_ICONS).map(([iconType, iconData]) => {
                  return (
                    <Button
                      key={iconType}
                      size="sm"
                      variant="ghost"
                      className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-gray-100 rounded-lg p-1"
                      onClick={() => {
                        onAWSIconSelect?.(iconType as AWSIconType);
                        setAwsSubmenuOpen(false);
                      }}
                    >
                      <img
                        src={iconData.icon}
                        alt={iconType}
                        className="w-5 h-5"
                      />
                      <span className="text-xs text-center leading-tight">
                        {iconData.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* this is for the plus icon on the tool bar to open its menu */}
        <div className="relative mt-1" ref={plusSubmenuRef}>
          <Button
            size="icon"
            variant={plusSubmenuOpen ? "default" : "ghost"}
            className={cn(
              "w-11 h-11 rounded-xl transition-all duration-200 relative",
              plusSubmenuOpen
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-600"
            )}
            onClick={() => setPlusSubmenuOpen(!plusSubmenuOpen)}
          >
            <Plus size={20} />
            <ChevronRight
              size={12}
              className={cn(
                "absolute -right-1 -top-1 transition-transform duration-200",
                plusSubmenuOpen && "rotate-90"
              )}
            />
          </Button>

          {plusSubmenuOpen && (
            <div className="absolute left-full ml-2 top-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-2 min-w-[220px] z-50">
              <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2">
                Generate Diagram
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-10 flex items-center justify-start gap-3 hover:bg-gray-100 rounded-lg px-3"
                  onClick={() => {
                    onDiagramAsCodeSelect?.();
                    setPlusSubmenuOpen(false);
                  }}
                >
                  <Code size={16} className="text-blue-600" />
                  <span className="text-sm">Diagram as Code</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-10 flex items-center justify-start gap-3 hover:bg-gray-100 rounded-lg px-3"
                  onClick={() => {
                    onAIAssistedDiagramSelect?.();
                    setPlusSubmenuOpen(false);
                  }}
                >
                  <Sparkles size={16} className="text-purple-600" />
                  <span className="text-sm">AI Generated Diagram</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Button */}
        {selectedId && (
          <>
            <div className="h-px bg-gray-200 mx-2 my-3" />
            <Button
              size="icon"
              variant="ghost"
              className="w-11 h-11 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              onClick={() => {
                setElements((els) => {
                  const updated = els.filter((el) => el.id !== selectedId);
                  handleElementChange("delete", { id: selectedId });
                  return updated;
                });
                setSelectedId(null);
              }}
            >
              <Trash2 size={20} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
