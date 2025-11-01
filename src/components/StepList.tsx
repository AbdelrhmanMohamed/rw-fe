"use client";

import React, { useMemo, useState } from "react";
import { Step as StepComponent } from "./Step";
import { ClipboardIcon } from "./Icons";
import { useWorkflowStore } from "../store/workflowStore";

export const StepList: React.FC = () => {
  const { workflow, reorderSteps } = useWorkflowStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const steps = useMemo(() => workflow?.steps || [], [workflow?.steps]);

  const handleDragStart = (e: React.DragEvent, index: number | null) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number | null) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || index === null)
      return;

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedStep);

    const stepIds = newSteps.map((s) => s.id);
    reorderSteps(stepIds);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Workflow Steps
        </h3>
        <p className="text-sm text-slate-500">
          {steps.length} {steps.length === 1 ? "step" : "steps"} in workflow
        </p>
      </div>

      {steps.length === 0 ? (
        <EmptyStepList />
      ) : (
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <StepComponent
              key={step.id}
              step={step}
              index={idx}
              totalSteps={steps.length}
              draggedIndex={draggedIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyStepList = () => {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="text-gray-400 mb-2">
        <ClipboardIcon className="mx-auto h-12 w-12" />
        <p className="text-gray-500">No steps in workflow</p>
      </div>
    </div>
  );
};
