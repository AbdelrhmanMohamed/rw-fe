"use client";

import React, { useMemo } from "react";
import { Step as StepComponent } from "./Step";
import { ClipboardIcon } from "./Icons";
import { useWorkflowStore } from "../store/workflowStore";

export const StepList: React.FC = () => {
  const workflow = useWorkflowStore((state) => state.workflow);

  const steps = useMemo(() => workflow?.steps || [], [workflow?.steps]);

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
      </div>
    </div>
  );
};
