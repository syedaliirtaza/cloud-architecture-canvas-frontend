import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import {
  useAllUsers,
  useCollaborators,
  useAddCollaborator,
} from "@/hooks/useCollaborators";
import { Loader2 } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspaces";

export interface ShareWorkspaceDialogProps {
  workspaceId: number;
  trigger: React.ReactNode;
}

export function ShareWorkspaceDialog({
  workspaceId,
  trigger,
}: ShareWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: workspace } = useWorkspace(workspaceId);

  const { data: users = [], isLoading: usersLoading } = useAllUsers();
  const {
    data: collaborators = [],
    isLoading: collaboratorsLoading,
    refetch: refetchCollaborators,
  } = useCollaborators(workspaceId);

  const addCollaborator = useAddCollaborator(workspaceId);

  const handleAddCollaborator = () => {
    if (!selectedUserId) return;
    addCollaborator.mutate(selectedUserId, {
      onSuccess: () => {
        toast.success("Collaborator added!");
        setSelectedUserId(null);
        refetchCollaborators();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data || "Failed to add collaborator");
      },
    });
  };

  const ownerId = workspace?.createdBy;
  const collaboratorIds = new Set(collaborators.map((u) => u.id));
  if (ownerId) collaboratorIds.add(ownerId);
  const availableUsers = users.filter((u) => !collaboratorIds.has(u.id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Select user to add:
            </label>
            <Select
              value={selectedUserId ? String(selectedUserId) : ""}
              onValueChange={(value) => setSelectedUserId(Number(value))}
              disabled={usersLoading || availableUsers.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.firstname} {user.lastname} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddCollaborator}
            disabled={!selectedUserId || addCollaborator.isPending}
            className="w-full"
          >
            {addCollaborator.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Collaborator"
            )}
          </Button>
          <div>
            <div className="mt-4 text-sm font-semibold">
              Current Collaborators:
            </div>
            {collaboratorsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading collaborators...
              </div>
            ) : (
              <ul className="mt-2 space-y-1">
                {collaborators.map((user) => (
                  <li key={user.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {user.firstname?.[0]}
                        {user.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {user.firstname} {user.lastname} ({user.email})
                      {user.role === "OWNER" && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Owner)
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
