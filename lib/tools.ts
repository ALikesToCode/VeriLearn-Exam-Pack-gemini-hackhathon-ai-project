export function buildFileSearchTools(storeName: string) {
  return [
    {
      file_search: {
        file_search_store_names: [storeName],
        top_k: 6
      }
    }
  ];
}

function normalizeModelName(model?: string) {
  return (model ?? "").replace(/^models\//, "").toLowerCase();
}

export function supportsComputerUse(model?: string) {
  const normalized = normalizeModelName(model);
  if (!normalized) return true;
  return !normalized.startsWith("gemini-3");
}

export function buildComputerUseTools(model?: string) {
  if (!supportsComputerUse(model)) {
    return [];
  }
  return [
    {
      computer_use: {}
    }
  ];
}

export function buildCodeExecutionTools() {
  return [
    {
      code_execution: {}
    }
  ];
}
