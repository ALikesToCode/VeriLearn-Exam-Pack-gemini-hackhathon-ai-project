export function buildFileSearchTools(storeName: string) {
  return [
    {
      fileSearch: {
        fileSearchStoreNames: [storeName],
        topK: 6
      }
    }
  ];
}

export function buildComputerUseTools() {
  return [
    {
      computerUse: {}
    }
  ];
}

export function buildCodeExecutionTools() {
  return [
    {
      codeExecution: {}
    }
  ];
}
