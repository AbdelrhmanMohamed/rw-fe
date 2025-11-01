"use client";

import React from "react";
import { Step as StepType } from "../types";
import { IconButton } from "./ui";
import {
  DragHandleIcon,
  MappingsIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
} from "./Icons";
import { useWorkflowStore } from "../store/workflowStore";

interface StepProps {
  step: StepType;
  index: number;
  totalSteps: number;
  draggedIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number | null) => void;
  onDragOver: (e: React.DragEvent, index: number | null) => void;
  onDragEnd: () => void;
}

const getStepTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    API_CALL: "bg-blue-50 text-blue-600 border-blue-400",
    FILTER: "bg-purple-50 text-purple-600 border-purple-400",
    TRANSFORM: "bg-green-50 text-green-600 border-green-400",
    CONDITION: "bg-orange-50 text-orange-600 border-orange-400",
  };
  return colors[type] || "bg-slate-100 text-slate-800 border-slate-400";
};

const getStepTypeIconColor = (type: string): string => {
  const colors: Record<string, string> = {
    API_CALL: "from-blue-400 to-blue-600",
    FILTER: "from-purple-400 to-purple-600",
    TRANSFORM: "from-green-400 to-green-600",
    CONDITION: "from-orange-400 to-orange-600",
  };
  return colors[type] || "from-slate-400 to-slate-600";
};
export const Step: React.FC<StepProps> = ({
  step,
  index,
  totalSteps,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const { moveStep, selectStepId, deleteStep, toggleStepEditor } =
    useWorkflowStore();

  // handle select step
  const handleSelectStep = () => {
    selectStepId(step.id);
    toggleStepEditor();
  };

  // Reorder handler (move up/down)
  const handleMoveUp = () => {
    moveStep(step?.id, "up");
  };

  const handleMoveDown = () => {
    moveStep(step?.id, "down");
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragEnd={onDragEnd}
      className={`group bg-white rounded-lg border border-border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-move ${
        draggedIndex === index ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="p-5 flex gap-4 items-start">
        {/* Step Number Badge */}
        <div className="shrink-0 flex gap-2 items-center">
          {/* Drag Handle */}
          <div className="shrink-0 flex items-center justify-center cursor-move group-hover:text-slate-600 text-slate-400 transition-colors">
            <DragHandleIcon className="w-5 h-5" />
          </div>
          <div
            className={`w-10 h-10 rounded-full bg-linear-to-br ${getStepTypeIconColor(
              step.type
            )} text-white font-bold text-sm flex items-center justify-center shadow-md`}
          >
            {step.stepNumber}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-slate-900 mb-1.5">
                {step.name}
              </h4>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border-2 ${getStepTypeColor(
                  step.type
                )}`}
              >
                {step.type.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Mappings */}
          {step.mappings.length > 0 ? (
            <div className="mt-4 bg-slate-50 rounded-md p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MappingsIcon className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Mappings ({step.mappings.length})
                </span>
              </div>
              <div className="space-y-2">
                {step.mappings.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 text-sm bg-white rounded px-3 py-2 border border-slate-200"
                  >
                    <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded flex-1">
                      {m.source}
                    </code>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <code className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex-1 font-semibold">
                      {m.target}
                    </code>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded ml-1">
                      {m.dataType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-400 italic bg-slate-50 rounded-md p-2 border border-slate-200">
              No mappings configured
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="shrink-0 flex flex-col gap-2">
          {/* Reorder Buttons */}
          <div className="flex flex-col gap-1">
            <IconButton
              variant="secondary"
              disabled={index === 0}
              onClick={handleMoveUp}
              aria-label="Move up"
              icon={<ChevronUpIcon />}
            />
            <IconButton
              variant="secondary"
              disabled={index === totalSteps - 1}
              onClick={handleMoveDown}
              aria-label="Move down"
              icon={<ChevronDownIcon />}
            />
          </div>

          {/* Edit Button */}
          <IconButton
            variant="primary"
            onClick={handleSelectStep}
            aria-label="Edit step"
            icon={<EditIcon />}
          />

          {/* Delete Button */}
          <IconButton
            variant="danger"
            onClick={() => deleteStep(step.id)}
            aria-label="Delete step"
            icon={<DeleteIcon />}
          />
        </div>
      </div>
    </div>
  );
};
