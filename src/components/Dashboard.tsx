import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Plus, LogOut, Eye, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
} from "@/hooks/useWorkspaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    workspaceName: "",
    workspaceDescription: "",
  });

  const handleLogout = () => {
    logout();
    toast("You have been successfully logged out.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.workspaceName.trim() || !form.workspaceDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    createWorkspace.mutate(form, {
      onSuccess: () => {
        toast.success("Workspace created successfully!");
        console.log(form);
        setForm({ workspaceName: "", workspaceDescription: "" });
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to create workspace");
        console.error("Create workspace error:", error);
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    deleteWorkspace.mutate(id, {
      onSuccess: () => {
        toast.success(`Workspace "${name}" deleted successfully!`);
      },
      onError: (error) => {
        toast.error("Failed to delete workspace");
        console.error("Delete workspace error:", error);
      },
    });
  };

  const handleViewWorkspace = (workspaceId: number) => {
    window.open(`/workspace/${workspaceId}`, "_blank");
  };

  const resetForm = () => {
    setForm({ workspaceName: "", workspaceDescription: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-xl font-bold text-gray-900">MSC FYP</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.firstname?.[0]}
                  {user?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="px-6 py-8 space-y-10">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              My Workspaces
            </h2>
            <p className="text-sm text-gray-600">
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">Loading workspaces...</span>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {/* Create New Workspace Card */}
              <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Card className="min-w-[280px] hover:bg-gray-100 transition cursor-pointer border-dashed border-2 border-gray-300">
                    <CardContent className="h-full flex flex-col justify-center items-center p-6">
                      <Plus className="text-gray-600 mb-2" size={32} />
                      <p className="text-gray-600 font-medium">
                        {workspaces.length === 0
                          ? "Create Your First Workspace"
                          : "New Workspace"}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="workspaceName"
                        className="text-sm font-medium"
                      >
                        Workspace Name
                      </label>
                      <Input
                        id="workspaceName"
                        placeholder="Enter workspace name"
                        value={form.workspaceName}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            workspaceName: e.target.value,
                          }))
                        }
                        required
                        disabled={createWorkspace.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="workspaceDescription"
                        className="text-sm font-medium"
                      >
                        Description
                      </label>
                      <Textarea
                        id="workspaceDescription"
                        placeholder="Enter workspace description"
                        value={form.workspaceDescription}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            workspaceDescription: e.target.value,
                          }))
                        }
                        required
                        disabled={createWorkspace.isPending}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={createWorkspace.isPending}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createWorkspace.isPending}
                        className="flex-1"
                      >
                        {createWorkspace.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Workspace"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Workspace Cards */}
              {workspaces.length > 0 &&
                workspaces.map((workspace) => (
                  <Card
                    key={workspace.id}
                    className="min-w-[280px] shadow-sm hover:shadow-md transition"
                  >
                    <CardHeader>
                      <CardTitle className="text-base flex justify-between items-start">
                        <span className="truncate pr-2">
                          {workspace.workspaceName}
                        </span>
                        <div className="flex gap-2 items-center flex-shrink-0">
                          <Eye
                            size={16}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                            onClick={() => handleViewWorkspace(workspace.id)}
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Trash
                                size={16}
                                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                              />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Workspace
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {workspace.workspaceName}"? This action cannot
                                  be undone and will permanently remove all
                                  diagrams and data associated with this
                                  workspace.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(
                                      workspace.id,
                                      workspace.workspaceName
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteWorkspace.isPending}
                                >
                                  {deleteWorkspace.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete Workspace"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {workspace.workspaceDescription}
                      </CardDescription>
                      {workspace.createdAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          Created{" "}
                          {new Date(workspace.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
