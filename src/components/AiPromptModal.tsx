import { useState } from "react";

interface AiPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  error?: string;
}

export function AiPromptModal({
  visible,
  onClose,
  onSubmit,
  isLoading,
  error,
}: AiPromptModalProps) {
  const [prompt, setPrompt] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-96 z-50">
      <h3 className="text-lg font-medium mb-2">Generate Diagram with AI</h3>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={3}
        placeholder="Describe your cloud architecture..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
