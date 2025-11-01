// constants/defaultStepConfig.ts
import { StepType } from "../types";

export const defaultStepConfig: Record<StepType, Record<string, any>> = {
  [StepType.API_CALL]: { url: "/api/endpoint", method: "GET" },
  [StepType.FILTER]: { condition: "equals", value: "" },
  [StepType.TRANSFORM]: { transformType: "object_restructure" },
  [StepType.CONDITION]: { condition: "equals", value: "" },
};
