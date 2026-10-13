import { useState, useEffect } from "react";
import { Loader2, Wand2, X } from "lucide-react";
import { useAIGenerateDiagram } from "@/hooks/useAIDiagramGeneration";

interface AIPromptDialogProps {
  visible: boolean;
  onClose: () => void;
  onDSLGenerated: (dsl: string) => void;
}

export function AIPromptDialog({
  visible,
  onClose,
  onDSLGenerated,
}: AIPromptDialogProps) {
  const [prompt, setPrompt] = useState("");
  const aiMutation = useAIGenerateDiagram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    aiMutation.mutate(
      { prompt: prompt.trim() },
      {
        onSuccess: (response) => {
          onDSLGenerated(response.dsl);
          setPrompt("");
          onClose();
        },
        onError: (error) => {
          console.error("Failed to generate diagram:", error);
          // You might want to show a toast notification here
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!visible) {
      setPrompt("");
      aiMutation.reset();
    }
  }, [visible, aiMutation]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl p-6 w-full max-w-4xl mx-4 mb-0 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Diagram Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={aiMutation.isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="ai-prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Describe your cloud architecture diagram:
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your prompt here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={aiMutation.isPending}
              autoFocus
            />
          </div>

          {aiMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                {aiMutation.error?.message ||
                  "Failed to generate diagram. Please try again."}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={aiMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || aiMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {aiMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Diagram
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {aiMutation.isPending && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
