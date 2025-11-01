import { Workflow } from "../types";

export function validateWorkflow(workflow: Workflow) {
  console.log("Validating workflow", workflow);
  const errors: string[] = [];
  if (!workflow.id) {
    errors.push("Workflow ID is required");
  }
  if (!workflow.name) {
    errors.push("Workflow name is required");
  }
  if (!workflow.steps) {
    errors.push("Workflow steps are required");
  }
  return errors;
}
