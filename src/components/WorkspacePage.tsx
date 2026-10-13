import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { useCollaborators } from "@/hooks/useCollaborators";
import { ShareWorkspaceDialog } from "@/components/ShareWorkspaceDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { CanvasStage } from "./CanvasStage";

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);

  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceId);
  const { data: collaborators = [], isLoading: collaboratorsLoading } =
    useCollaborators(workspaceId);

  if (workspaceLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  if (!workspace) return <div>Workspace not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            {workspace.workspaceName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {collaboratorsLoading ? (
              <Loader2 className="animate-spin h-7 w-7 text-gray-400" />
            ) : (
              collaborators.map((user, idx) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={`h-8 w-8 border-2 border-white shadow-sm bg-gray-200 transition-transform hover:scale-110 ${
                        idx !== 0 ? "-ml-3" : ""
                      }`}
                    >
                      <AvatarFallback>
                        {user.firstname?.[0]}
                        {user.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {user.firstname} {user.lastname}
                    {user.role === "OWNER" && (
                      <span className="ml-1 text-xs font-medium text-blue-600">
                        (Owner)
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))
            )}
          </TooltipProvider>
          <ShareWorkspaceDialog
            workspaceId={workspaceId}
            trigger={
              <Button
                size="sm"
                variant="outline"
                className="ml-2 flex items-center gap-2 font-medium shadow-sm cursor-pointer"
              >
                Share
              </Button>
            }
          />
        </div>
      </div>
      <div className="absolute inset-0">
        <CanvasStage />
      </div>
    </div>
  );
}
