import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

export function DiagramDslEditor({ dsl, onChange, onClose }: any) {
  const [tempDsl, setTempDsl] = useState(dsl);

  const handleEditorChange = (value: any) => {
    setTempDsl(value ?? "");
  };

  const handleSave = () => {
    onChange(tempDsl);
  };

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l z-50 shadow-xl px-6 py-4 flex flex-col">
      <div className="flex items-center mb-2">
        <span className="font-bold text-lg flex-1">Diagram Code (DSL)</span>
        <button
          onClick={onClose}
          className="ml-2 p-2 rounded hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      <MonacoEditor
        height="80%"
        language="plaintext"
        value={tempDsl}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
        onChange={handleEditorChange}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
