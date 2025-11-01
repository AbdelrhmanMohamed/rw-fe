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

        // Update the mappings
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

      // Validate that all step IDs are present and the count matches
      if (
        stepIds.length !== originalSteps.length ||
        !stepIds.every((id) => originalSteps.some((step) => step.id === id))
      ) {
        return state; // Invalid reorder, return unchanged
      }

      // Create a map of step ID to step for quick lookup
      const stepMap = new Map(originalSteps.map((step) => [step.id, step]));

      // Reorder steps according to stepIds array
      const reorderedSteps: Step[] = stepIds.map((id, index) => {
        const step = stepMap.get(id);
        if (!step) return step!; // This shouldn't happen due to validation above

        // Update step number to match new position (1-based)
        return {
          ...step,
          stepNumber: index + 1,
        };
      });

      // Create a mapping from old step numbers to new step numbers
      const stepNumberMap = new Map<number, number>();
      originalSteps.forEach((originalStep) => {
        const newIndex = reorderedSteps.findIndex(
          (s) => s.id === originalStep.id
        );
        if (newIndex !== -1) {
          const oldStepNumber = originalStep.stepNumber;
          const newStepNumber = newIndex + 1;
          if (oldStepNumber !== newStepNumber) {
            stepNumberMap.set(oldStepNumber, newStepNumber);
          }
        }
      });

      // Update all mappings in all steps that reference reordered step numbers
      // Use a two-pass approach to avoid conflicts when swapping step numbers:
      // First pass: replace with temporary placeholders
      // Second pass: replace placeholders with final step numbers
      const finalSteps = reorderedSteps.map((step) => {
        const updatedMappings = step.mappings.map((mapping) => {
          let newSource = mapping.source;

          // First pass: replace old step numbers with temporary placeholders
          stepNumberMap.forEach((newStepNumber, oldStepNumber) => {
            if (newSource.includes(`step_${oldStepNumber}.`)) {
              newSource = newSource.replaceAll(
                `step_${oldStepNumber}.`,
                `__TEMP_${newStepNumber}__.`
              );
            }
          });

          // Second pass: replace placeholders with final step numbers
          stepNumberMap.forEach((newStepNumber) => {
            newSource = newSource.replaceAll(
              `__TEMP_${newStepNumber}__.`,
              `step_${newStepNumber}.`
            );
          });

          return { ...mapping, source: newSource };
        });

        return { ...step, mappings: updatedMappings };
      });

      const updated: Workflow = { ...workflow, steps: finalSteps };
      get().pushToHistory(updated);

      return {
        workflow: updated,
      };
    });
  },

  moveStep: (stepId, type) => {
    set((state) => {
      const workflow = state.workflow;
      if (!workflow) return state;

      const steps = workflow.steps;
      const currentIndex = steps.findIndex((s) => s.id === stepId);

      if (currentIndex === -1) return state;

      let newIndex: number;
      if (type === "up") {
        if (currentIndex === 0) return state; // Already at top
        newIndex = currentIndex - 1;
      } else {
        // type === "down"
        if (currentIndex === steps.length - 1) return state; // Already at bottom
        newIndex = currentIndex + 1;
      }

      // Get the step numbers before swapping (these are 1-based, matching array index + 1)
      const currentStep = steps[currentIndex];
      const targetStep = steps[newIndex];
      const oldCurrentStepNumber = currentStep.stepNumber;
      const oldTargetStepNumber = targetStep.stepNumber;

      // Create new steps array with swapped positions
      const updatedSteps = [...steps];
      [updatedSteps[currentIndex], updatedSteps[newIndex]] = [
        updatedSteps[newIndex],
        updatedSteps[currentIndex],
      ];

      // Update step numbers to match their new positions (stepNumber = index + 1)
      // After swap: step at currentIndex is now at position currentIndex + 1
      //             step at newIndex is now at position newIndex + 1
      updatedSteps[currentIndex] = {
        ...updatedSteps[currentIndex],
        stepNumber: currentIndex + 1,
      };
      updatedSteps[newIndex] = {
        ...updatedSteps[newIndex],
        stepNumber: newIndex + 1,
      };

      // Update all mappings in all steps that reference the swapped step numbers
      const finalSteps = updatedSteps.map((step) => {
        const updatedMappings = step.mappings.map((mapping) => {
          let newSource = mapping.source;

          // Replace references to swap the step numbers
          // If a mapping references oldCurrentStepNumber, it should now reference oldTargetStepNumber
          // If a mapping references oldTargetStepNumber, it should now reference oldCurrentStepNumber
          if (newSource.includes(`step_${oldCurrentStepNumber}.`)) {
            newSource = newSource.replaceAll(
              `step_${oldCurrentStepNumber}.`,
              `step_${oldTargetStepNumber}.`
            );
          } else if (newSource.includes(`step_${oldTargetStepNumber}.`)) {
            newSource = newSource.replaceAll(
              `step_${oldTargetStepNumber}.`,
              `step_${oldCurrentStepNumber}.`
            );
          }

          return { ...mapping, source: newSource };
        });

        return { ...step, mappings: updatedMappings };
      });

      const updated: Workflow = { ...workflow, steps: finalSteps };
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

  clearError: () => {
    set({ error: null });
  },

  // Save and Load Workflow from Storage
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

  // Export and Import Workflow as JSON
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
