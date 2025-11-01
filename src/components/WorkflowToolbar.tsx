import React, { useState } from "react";
import { Button } from "./ui";
import { useWorkflowStore } from "../store/workflowStore";
import { UndoIcon, RedoIcon } from "./Icons";

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
  } = useWorkflowStore();

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

  return (
    <>
      <div className="sticky top-0 z-10 bg-white flex flex-col sm:flex-row justify-between gap-3 p-4 rounded-md border border-slate-200 shadow-none">
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
                  <span className="mr-2">💾</span>
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
                  <span className="mr-2">📂</span>
                  Load from Storage
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Undo and Redo buttons */}
        <div className="flex flex-row justify-between gap-3">
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
      {saveSuccess && (
        <span className="ml-2 text-green-600 font-medium inline-flex items-center">
          ✓ Saved successfully!
        </span>
      )}
    </>
  );
}
