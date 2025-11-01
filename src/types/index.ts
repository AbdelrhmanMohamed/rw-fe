/* eslint-disable @typescript-eslint/no-explicit-any */
export enum StepType {
  API_CALL = "API_CALL",
  FILTER = "FILTER",
  TRANSFORM = "TRANSFORM",
  CONDITION = "CONDITION",
}

export interface Mapping {
  id: string;
  source: string; // e.g., "${step_2.response.data}"
  target: string; // e.g., "request.body.email"
  dataType: "string" | "number" | "object" | "array";
}

export interface Step {
  id: string;
  stepNumber: number;
  type: StepType;
  name: string;
  mappings: Mapping[];
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: Step[];
}

export interface WorkflowState {
  workflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
  selectedStepId: string | null;
  openStepEditor: boolean;
  canUndo: boolean;
  canRedo: boolean;
  history: Workflow[];
  currentIndex: number;

  // Actions
  loadWorkflow: (workflow: Workflow) => void;
  addStep: (step: Omit<Step, "id" | "stepNumber">) => void;
  updateStep: (id: string, updates: Partial<Step>) => void;
  deleteStep: (id: string) => void;
  reorderSteps: (stepIds: string[]) => void;
  moveStep: (stepId: string, type: "up" | "down") => void;
  addMapping: (stepId: string, mapping: Omit<Mapping, "id">) => void;
  updateMapping: (
    stepId: string,
    mappingId: string,
    updates: Partial<Mapping>
  ) => void;
  deleteMapping: (stepId: string, mappingId: string) => void;
  saveWorkflow: () => void;
  loadWorkflowFromStorage: () => void;
  exportWorkflowAsJSON: () => void;
  importWorkflowFromJSON: (file: File) => void;
  clearError: () => void;
  selectStepId: (stepId: string) => void;
  deselectStepId: () => void;
  toggleStepEditor: () => void;
  undo: () => void;
  redo: () => void;
  pushToHistory: (workflow: Workflow) => void;
}
