import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

export function ZoomControls({
  zoom,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
}: ZoomControlsProps) {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600"
            disabled={zoom <= 0.1}
          >
            <ZoomOut size={18} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleResetZoom}
            className="px-3 h-10 rounded-xl hover:bg-gray-100 text-gray-600 min-w-[60px] text-sm font-medium"
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600"
            disabled={zoom >= 5}
          >
            <ZoomIn size={18} />
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleResetZoom}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
