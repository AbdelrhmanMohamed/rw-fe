"use client";

import React, { useMemo, useState } from "react";
import { StepType } from "../types";
import { Button, Input, Select } from "./ui";
import { defaultStepConfig } from "../constants/defaultStepConfig";
import { PlusIcon } from "./Icons";
import { useWorkflowStore } from "../store/workflowStore";

export const AddStepForm: React.FC = () => {
  const addStep = useWorkflowStore((state) => state.addStep);
  const [stepType, setStepType] = useState<StepType>(StepType.API_CALL);
  const [stepName, setStepName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepName.trim()) return;

    // Get the default config for the step type
    const defaultConfig = defaultStepConfig[stepType];

    // Add the step with the default config
    addStep({
      type: stepType,
      name: stepName.trim(),
      config: defaultConfig,
      mappings: [],
    });

    setStepName("");
  };

  const stepTypeOptions = useMemo(
    () =>
      Object.values(StepType).map((t) => ({
        value: t,
        label: t,
      })),
    []
  );

  return (
    <div className="mb-6 bg-slate-50 p-4 rounded-md border border-gray-200 shadow-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Add New Step</h3>
        <p className="text-sm text-gray-500">
          Create a new step to add to your workflow
        </p>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 items-end">
            {/* Step Type */}
            <div className="flex-1">
              <Select
                id="step-type"
                label="Step Type"
                value={stepType}
                onChange={(e) => setStepType(e.target.value as StepType)}
                options={stepTypeOptions}
              />
            </div>

            {/* Step Name */}
            <div className="flex-2">
              <Input
                id="step-name"
                type="text"
                label="Step Name"
                value={stepName}
                onChange={(e) => setStepName(e.target.value)}
                placeholder="Enter step name"
                required
                className="bg-white"
              />
            </div>

            {/* Submit Button */}
            <div className="shrink-0">
              <Button
                type="submit"
                variant="primary"
                disabled={!stepName.trim()}
                className="flex items-center gap-2 mb-1 "
              >
                <PlusIcon className="w-4 h-4" />
                Add Step
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
