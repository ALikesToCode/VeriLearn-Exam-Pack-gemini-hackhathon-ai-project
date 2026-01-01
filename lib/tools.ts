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

export function buildComputerUseTools() {
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
