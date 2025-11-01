"use client";

import { create } from "zustand";
import { WorkflowState, Workflow, Step } from "../types";
import {
  exportWorkflowAsJSON,
  importWorkflowFromJSON,
} from "../utils/workflowIO";

// TODO: Implement the workflow store
// This is where you'll manage the workflow state using Zustand
// Key challenges to solve:
// 1. Handle step deletion with mapping updates
// 2. Handle step reordering with mapping updates
// 3. Maintain data integrity across all operations

const MAX_HISTORY = 10;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: null,
  isLoading: false,
  error: null,
  selectedStepId: null,
  openStepEditor: false,
  canUndo: false,
  canRedo: false,
  history: [],
  currentIndex: -1,

  loadWorkflow: (workflow: Workflow) =>
    set({
      workflow,
      history: [workflow],
      currentIndex: 0,
      canUndo: false,
      canRedo: false,
    }),

  // helper to push current workflow into history
  pushToHistory: (workflow: Workflow) =>
    set((state) => {
      if (!workflow) return state;
      let newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        workflow,
      ];

      // Limit history to MAX_HISTORY items
      if (newHistory.length > MAX_HISTORY) {
        newHistory = newHistory.slice(-MAX_HISTORY);
      }

      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        canUndo: newHistory.length > 1,
        canRedo: false,
      };
    }),

  addStep: (stepData) =>
    set((state) => {
      if (!state.workflow) return state;
      const stepNumber = state.workflow.steps.length + 1;
      const id = `step_${stepNumber}`;
      const newStep: Step = { id, stepNumber, ...stepData };
      const updated = {
        ...state.workflow,
        steps: [...state.workflow.steps, newStep],
      };

      get().pushToHistory(updated);
      return {
        workflow: updated,
      };
    }),

  updateStep: (id, updates) =>
    set((state) => {
      if (!state.workflow) return state;
      const updatedSteps = state.workflow.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      );
      const updated = { ...state.workflow, steps: updatedSteps };
      get().pushToHistory(updated);
      return {
        workflow: updated,
      };
    }),

  deleteStep: (deletedStepId) => {
    set((state) => {
      const workflow = state.workflow;
      if (!workflow) return state;

      const originalSteps = workflow.steps;
      const deletedIndex =
        originalSteps.findIndex((s) => s.id === deletedStepId) + 1;

      if (deletedIndex === 0) return state;

      const originalLen = originalSteps.length;
      const updatedSteps: Step[] = [];

      let counter = 1;

      for (const step of originalSteps) {
        if (step.id === deletedStepId) continue; // Skip the deleted step

        // Update the mappings in the same loop
        const filteredMappings = step.mappings
          .filter((m) => !m.source.includes(`step_${deletedIndex}`))
          .map((m) => {
            let newSource = m.source;
            for (let i = deletedIndex + 1; i <= originalLen; i++) {
              newSource = newSource.replaceAll(`step_${i}.`, `step_${i - 1}.`);
            }
            return { ...m, source: newSource };
          });
        updatedSteps.push({
          ...step,
          stepNumber: counter++,
          mappings: filteredMappings,
        });
      }
      const updated: Workflow = { ...workflow, steps: updatedSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    });
  },

  reorderSteps: (stepIds) => {
    set((state) => {
      const workflow = state.workflow;
      if (!workflow) return state;

      const originalSteps = workflow.steps;

      // Create a map of id to new number
      const idToNewNum: Record<string, number> = {};
      stepIds.forEach((id, idx) => {
        idToNewNum[id] = idx + 1;
      });

      // Create a new list of steps in the same order as stepIds
      const reorderedSteps: Step[] = [];

      for (let idx = 0; idx < stepIds.length; idx++) {
        const id = stepIds[idx];
        const oldStep = originalSteps.find((s) => s.id === id);
        if (!oldStep) continue;

        // Update each mapping in the same loop
        const updatedMappings = oldStep.mappings.map((mapping) => {
          let newSource = mapping.source;

          // Prevent nested replace (like deleteStep)
          originalSteps.forEach((oldS) => {
            const regex = new RegExp(`\\$\\{${oldS.id}\\.`, "g");
            newSource = newSource.replaceAll(regex, `\u0001${oldS.id}.\u0001`);
          });

          // Replace the old id with the new step_X according to the new order
          Object.entries(idToNewNum).forEach(([oldId, newNum]) => {
            newSource = newSource.replaceAll(
              `\u0001${oldId}.`,
              `step_${newNum}.`
            );
          });

          newSource = newSource.replaceAll(/\u0001/g, "");
          return { ...mapping, source: newSource };
        });

        reorderedSteps.push({
          ...oldStep,
          stepNumber: idx + 1,
          mappings: updatedMappings,
        });
      }

      const updated: Workflow = { ...workflow, steps: reorderedSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    });
  },

  addMapping: (stepId, mappingData) =>
    set((state) => {
      if (!state.workflow) return state;
      const uuid = crypto.randomUUID();
      const updatedSteps = state.workflow.steps.map((step) => {
        if (step.id !== stepId) return step;
        const mappingId = `${uuid}`;
        return {
          ...step,
          mappings: [...step.mappings, { ...mappingData, id: mappingId }],
        };
      });

      const updated: Workflow = { ...state.workflow, steps: updatedSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    }),

  updateMapping: (stepId, mappingId, updates) =>
    set((state) => {
      if (!state.workflow) return state;

      const updatedSteps = state.workflow.steps.map((step) => {
        if (step.id !== stepId) return step;

        const updatedMappings = step.mappings.map((mapping) =>
          mapping.id === mappingId ? { ...mapping, ...updates } : mapping
        );

        return { ...step, mappings: updatedMappings };
      });

      const updated: Workflow = { ...state.workflow, steps: updatedSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    }),

  deleteMapping: (stepId, mappingId) =>
    set((state) => {
      if (!state.workflow) return state;

      const updatedSteps = state.workflow.steps.map((step) => {
        if (step.id !== stepId) return step;

        const filteredMappings = step.mappings.filter(
          (m) => m.id !== mappingId
        );

        return { ...step, mappings: filteredMappings };
      });

      const updated: Workflow = { ...state.workflow, steps: updatedSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    }),

  saveWorkflow: () => {
    const state = get();
    if (!state.workflow) return;
    try {
      localStorage.setItem("workflow", JSON.stringify(state.workflow));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  loadWorkflowFromStorage: () => {
    set({ isLoading: true });
    try {
      const s = localStorage.getItem("workflow");
      if (s) {
        const workflow = JSON.parse(s);
        set({
          workflow,
          history: [workflow],
          currentIndex: 0,
          canUndo: false,
          canRedo: false,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  exportWorkflowAsJSON: () => {
    const workflow = get().workflow;
    if (!workflow) return;
    exportWorkflowAsJSON(workflow);
  },
  importWorkflowFromJSON: (file: File) => {
    if (!file) return;
    importWorkflowFromJSON(
      file,
      (workflow) => {
        get().loadWorkflow(workflow);
      },
      (error) => {
        set({ error });
      }
    );
  },

  clearError: () => {
    set({ error: null });
  },

  // Select and Deselect Step
  selectStepId: (stepId: string) => set({ selectedStepId: stepId }),
  deselectStepId: () => set({ selectedStepId: null }),

  // Toggle Step Editor
  toggleStepEditor: () =>
    set((state) => ({ openStepEditor: !state.openStepEditor })),

  // Undo and Redo
  undo: () => {
    set((state) => {
      if (state.currentIndex > 0) {
        const newIndex = state.currentIndex - 1;
        return {
          workflow: state.history[newIndex],
          currentIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
        };
      }
      return state;
    });
  },
  redo: () => {
    set((state) => {
      if (state.currentIndex < state.history.length - 1) {
        const newIndex = state.currentIndex + 1;
        return {
          workflow: state.history[newIndex],
          currentIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
        };
      }
      return state;
    });
  },
}));
