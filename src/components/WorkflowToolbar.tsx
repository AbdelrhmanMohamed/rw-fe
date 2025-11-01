import React, { useRef, useState } from "react";
import { Button } from "./ui";
import { useWorkflowStore } from "../store/workflowStore";
import {
  UndoIcon,
  RedoIcon,
  UploadIcon,
  DownloadIcon,
  SaveIcon,
  FolderIcon,
} from "./Icons";

export default function WorkflowToolbar() {
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState<boolean>(false);
  const {
    saveWorkflow,
    loadWorkflowFromStorage,
    undo,
    redo,
    canUndo,
    canRedo,
    exportWorkflowAsJSON,
    importWorkflowFromJSON,
  } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveWorkflow = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    saveWorkflow();
    setIsSaving(false);
    setSaveSuccess(true);

    // Clear success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLoadWorkflow = async () => {
    setIsLoadingStorage(true);

    // Simulate slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    loadWorkflowFromStorage();
    setIsLoadingStorage(false);
  };

  const handleExport = () => {
    exportWorkflowAsJSON();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    importWorkflowFromJSON(file);
    // Reset input
    event.target.value = "";
  };

  return (
    <div className="sticky top-0 z-10 bg-white p-4 rounded-md border border-slate-200 shadow-none">
      <div className="flex flex-row justify-between gap-3 items-center">
        {/* Save Workflow Button */}
        <div className="flex flex-row justify-between gap-3">
          <div className="flex-1">
            <Button
              variant="primary"
              onClick={handleSaveWorkflow}
              disabled={isSaving}
              className="w-full sm:w-auto min-w-[140px] relative overflow-hidden"
            >
              {isSaving ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4" />
                  Save Workflow
                </>
              )}
            </Button>
          </div>
          <div className="flex-1">
            <Button
              variant="secondary"
              onClick={handleLoadWorkflow}
              disabled={isLoadingStorage}
              className="w-full sm:w-auto min-w-[140px]"
            >
              {isLoadingStorage ? (
                <>
                  <span className="inline-block animate-spin mr-2">🔄</span>
                  Loading...
                </>
              ) : (
                <>
                  <FolderIcon className="w-4 h-4" />
                  Load from Storage
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Import/Export Buttons and Undo/Redo buttons */}
        <div className="flex flex-row justify-between gap-3 items-center">
          {/* Import/Export Buttons */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 border-slate-200">
            <Button
              variant="secondary"
              onClick={handleImportClick}
              title="Import workflow from JSON"
              aria-label="Import workflow from JSON"
            >
              <UploadIcon className="w-4 h-4" />
              Import
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              title="Export workflow as JSON"
              aria-label="Export workflow as JSON"
            >
              <DownloadIcon className="w-4 h-4" />
              Export
            </Button>
          </div>
          {/* Undo and Redo buttons */}
          <div className="flex flex-row justify-between gap-3 border border-slate-200 rounded-lg p-1">
            <Button variant="secondary" onClick={undo} disabled={!canUndo}>
              <UndoIcon className="w-4 h-4" />
              Undo
            </Button>
            <Button variant="secondary" onClick={redo} disabled={!canRedo}>
              <RedoIcon className="w-4 h-4" />
              Redo
            </Button>
          </div>
        </div>
      </div>
      {saveSuccess && (
        <span className="ml-2 text-green-600 font-medium inline-flex items-center">
          ✓ Saved successfully!
        </span>
      )}
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
