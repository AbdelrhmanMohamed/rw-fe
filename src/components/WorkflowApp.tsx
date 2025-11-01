"use client";

import React, { useEffect } from "react";
import { useWorkflowStore } from "../store/workflowStore";
import { StepList } from "./StepList";
import { StepEditor } from "./StepEditor";
import { AddStepForm } from "./AddStepForm";
import SAMPLE_DATA from "../../SAMPLE_DATA.json";
import { StepType } from "../types";
import { Button } from "./ui";
import WorkflowToolbar from "./WorkflowToolbar";
import { CloseIcon } from "./Icons";

export default function WorkflowApp() {
  const { workflow, isLoading, error, loadWorkflow, clearError } =
    useWorkflowStore();

  useEffect(() => {
    if (!workflow) {
      const steps = SAMPLE_DATA.workflow.steps.map((step) => ({
        ...step,
        type:
          typeof step.type === "string"
            ? StepType[step.type as keyof typeof StepType]
            : step.type,
        mappings: step.mappings.map((mapping) => ({
          ...mapping,
          dataType: mapping.dataType as
            | "string"
            | "number"
            | "object"
            | "array",
        })),
      }));
      loadWorkflow({ ...SAMPLE_DATA.workflow, steps });
    }
  }, [loadWorkflow, workflow]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="App-header mb-0">
        <h1 className="text-3xl font-bold">Workflow Step Manager</h1>
        {error && (
          <div className="error text-red-600 bg-red-100 p-2 rounded mb-2 flex items-center gap-2">
            {error}
            <Button
              variant="danger"
              onClick={clearError}
              className="ml-auto text-xl"
            >
              <CloseIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </header>

      <main className="App-main">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              Loading workflow...
            </p>
          </div>
        )}
        {!isLoading && workflow && (
          <>
            {/** workflow toolbar */}
            <WorkflowToolbar />
            {/** add step form */}
            <AddStepForm />
            {/** step list */}
            <StepList />
            {/** step editor */}
            <StepEditor />
          </>
        )}
      </main>
    </div>
  );
}
