"use client";

import React, { useMemo, useState } from "react";
import { StepType, Mapping, Step } from "../types";
import { Sheet } from "./ui/Sheet";
import { Button, IconButton, Input, Select } from "./ui";
import { CloseIcon } from "./Icons";
import { useWorkflowStore } from "../store/workflowStore";

export const StepEditor: React.FC = () => {
  const {
    selectedStep,
    updateStep,
    addMapping,
    updateMapping,
    deleteMapping,
    toggleStepEditor,
    deselectStep,
    openStepEditor,
  } = useWorkflowStore();

  const [newMapping, setNewMapping] = useState({
    source: "",
    target: "",
    dataType: "string" as Mapping["dataType"],
  });

  const [mappingErrors, setMappingErrors] = useState({
    source: "",
    target: "",
  });

  const validateMapping = (source: string, target: string): boolean => {
    const errors = {
      source: "",
      target: "",
    };

    // Validate source format: should be ${step_N.response...}
    if (!source.trim()) {
      errors.source = "Source is required";
    } else if (!source.startsWith("${step_")) {
      errors.source = "Source must start with ${step_";
    } else if (!source.endsWith("}")) {
      errors.source = "Source must end with }";
    } else if (!source.includes(".response")) {
      errors.source = "Source must include .response";
    }

    // Validate target format: should not start with $
    if (!target.trim()) {
      errors.target = "Target is required";
    } else if (target.trim().startsWith("$")) {
      errors.target = "Target should not start with $";
    }

    setMappingErrors(errors);
    return !errors.source && !errors.target;
  };

  const handleAddMapping = () => {
    if (!validateMapping(newMapping.source, newMapping.target)) {
      return;
    }
    addMapping(selectedStep?.id || "", newMapping);
    setNewMapping({ source: "", target: "", dataType: "string" });
    setMappingErrors({ source: "", target: "" });
  };

  const onClose = () => {
    deselectStep();
    toggleStepEditor();
  };

  const handleUpdateStep = <K extends keyof Step>(name: K, value: Step[K]) => {
    const updates: Partial<Step> = {
      [name]: value,
    };
    updateStep(selectedStep?.id || "", updates);
  };

  const handleUpdateStepConfig = <K extends keyof Step["config"]>(
    key: K,
    value: Step["config"][K]
  ) => {
    const updates: Partial<Step["config"]> = {
      [key]: value,
    };
    updateStep(selectedStep?.id || "", { config: updates });
  };
  const handleUpdateStepMapping = <K extends keyof Mapping>(
    id: string,
    key: K,
    value: Mapping[K]
  ) => {
    const updates: Partial<Mapping> = {
      [key]: value,
    };
    updateMapping(selectedStep?.id || "", id, updates);
  };

  const stepTypeOptions = useMemo(
    () =>
      Object.values(StepType).map((t) => ({
        value: t,
        label: t,
      })),
    []
  );

  const dataTypeOptions = useMemo(
    () =>
      Object.values(["string", "number", "object", "array"]).map((t) => ({
        value: t,
        label: t,
      })),
    []
  );

  return (
    <Sheet
      isOpen={openStepEditor}
      onClose={onClose}
      title={
        <span>
          ✏️ Edit Step —{" "}
          <span className="text-blue-600">{selectedStep?.name || ""}</span>
        </span>
      }
      width="w-[600px]"
    >
      <div className="p-2 space-y-6">
        {/* Step Info */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Step Name"
            value={selectedStep?.name || ""}
            onChange={(e) => handleUpdateStep("name", e.target.value)}
          />
          <Select
            label="Step Type"
            value={selectedStep?.type || ""}
            onChange={(e) =>
              handleUpdateStep("type", e.target.value as StepType)
            }
            options={stepTypeOptions}
          />
        </div>

        {/* Config Section */}
        <section className="bg-gray-50 border rounded-md border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">
              ⚙️ Step Configuration
            </h4>
          </div>

          <div className="space-y-2">
            {Object.entries(selectedStep?.config || {}).map(([key, value]) => {
              return (
                <div key={key} className="flex gap-2 items-center">
                  <Input
                    className="w-1/3 border border-gray-300 px-2 py-1 rounded-md bg-gray-100 text-gray-600"
                    value={key}
                    readOnly
                  />
                  <Input
                    className="w-2/3 border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-blue-400"
                    value={value}
                    onChange={(e) =>
                      handleUpdateStepConfig(key, e.target.value)
                    }
                  />
                </div>
              );
            })}
            {Object.keys(selectedStep?.config || {}).length === 0 && (
              <p className="text-gray-500 text-sm">
                No configuration fields yet.
              </p>
            )}
          </div>
        </section>

        {/* Mappings Section */}
        <section className="bg-gray-50 border rounded-md border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-700">🔗 Mappings</h4>
            <p className="text-sm text-gray-500">
              {selectedStep?.mappings.length} mapping
              {selectedStep?.mappings.length !== 1 ? "s" : ""}
            </p>
          </div>

          {selectedStep?.mappings.map((mapping) => (
            <div
              key={mapping.id}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 mb-2"
            >
              <Input
                className="w-1/3"
                value={mapping.source}
                onChange={(e) =>
                  handleUpdateStepMapping(mapping.id, "source", e.target.value)
                }
              />
              <Input
                className="w-1/3"
                value={mapping.target}
                onChange={(e) =>
                  handleUpdateStepMapping(mapping.id, "target", e.target.value)
                }
              />
              <Select
                className="w-1/4 border border-gray-300 px-2 py-1 rounded-md"
                value={mapping.dataType}
                onChange={(e) =>
                  handleUpdateStepMapping(
                    mapping.id,
                    "dataType",
                    e.target.value as Mapping["dataType"]
                  )
                }
                options={dataTypeOptions}
              />
              <IconButton
                className="bg-red-100 text-red-600! hover:bg-red-300"
                onClick={() =>
                  deleteMapping(selectedStep?.id || "", mapping.id)
                }
                icon={<CloseIcon />}
                aria-label="delete mapping"
              />
            </div>
          ))}
          {/* Add Mapping */}
          <div className="mt-3">
            <div className="flex gap-2">
              <Input
                label="Source"
                placeholder="source (e.g. ${step_1.response})"
                value={newMapping.source}
                onChange={(e) => {
                  setNewMapping({ ...newMapping, source: e.target.value });
                  // Clear error when user starts typing
                  if (mappingErrors.source) {
                    setMappingErrors({ ...mappingErrors, source: "" });
                  }
                }}
                error={mappingErrors.source}
              />

              <Input
                label="Target"
                placeholder="target (e.g. request.body.email)"
                value={newMapping.target}
                onChange={(e) => {
                  setNewMapping({ ...newMapping, target: e.target.value });
                  // Clear error when user starts typing
                  if (mappingErrors.target) {
                    setMappingErrors({ ...mappingErrors, target: "" });
                  }
                }}
                error={mappingErrors.target}
              />
              <Select
                label="Data Type"
                value={newMapping.dataType}
                onChange={(e) =>
                  setNewMapping({
                    ...newMapping,
                    dataType: e.target.value as Mapping["dataType"],
                  })
                }
                options={dataTypeOptions}
              />
            </div>
            <Button
              onClick={handleAddMapping}
              size="sm"
              variant="primary"
              className="w-full mt-2"
              disabled={!!mappingErrors.source || !!mappingErrors.target}
            >
              Add Mapping
            </Button>
          </div>
        </section>
      </div>
    </Sheet>
  );
};
