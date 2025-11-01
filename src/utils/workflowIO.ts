import { Workflow } from "../types";

export function exportWorkflowAsJSON(workflow: Workflow) {
  const jsonString = JSON.stringify(workflow, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${workflow.name
    .replace(/\s+/g, "_")
    .toLowerCase()}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importWorkflowFromJSON(
  file: File,
  onSuccess: (workflow: Workflow) => void,
  onError: (error: string) => void
) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const workflow = JSON.parse(content) as Workflow;

      // Basic validation
      if (!workflow.id || !workflow.name || !Array.isArray(workflow.steps)) {
        throw new Error("Invalid workflow format");
      }

      onSuccess(workflow);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to parse JSON");
    }
  };

  reader.onerror = () => {
    onError("Failed to read file");
  };

  reader.readAsText(file);
}
