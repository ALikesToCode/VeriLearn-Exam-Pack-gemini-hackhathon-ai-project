import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { getGenAIClient } from "./genaiClient";
import { VaultDoc } from "./types";

const FILE_SEARCH_ROOT = path.join(os.tmpdir(), "verilearn-file-search");

async function waitForOperation(
  apiKey: string,
  name: string,
  timeoutMs = 120000
) {
  const ai = getGenAIClient(apiKey);
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    // @ts-ignore
    const operation = await ai.operations.get({ name });
    if (operation.done) return operation;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("File search upload timed out.");
}

async function writeTempFile(fileName: string, content: string) {
  await fs.mkdir(FILE_SEARCH_ROOT, { recursive: true });
  const filePath = path.join(FILE_SEARCH_ROOT, fileName);
  await fs.writeFile(filePath, content, "utf-8");
  return filePath;
}

export async function createFileSearchStore(apiKey: string, displayName: string) {
  const ai = getGenAIClient(apiKey);
  const store = await ai.fileSearchStores.create({
    config: { displayName }
  });
  if (!store.name) {
    throw new Error("Failed to create file search store");
  }
  return store.name;
}

export async function uploadVaultDocsToStore(options: {
  apiKey: string;
  storeName: string;
  docs: VaultDoc[];
  extraText?: string;
}) {
  const ai = getGenAIClient(options.apiKey);

  const uploads: Array<Promise<void>> = [];
  const enqueueUpload = async (filePath: string, displayName: string) => {
    const operation = await ai.fileSearchStores.uploadToFileSearchStore({
      fileSearchStoreName: options.storeName,
      file: filePath,
      config: {
        displayName,
        mimeType: "text/plain"
      }
    });

    if (operation.name) {
      await waitForOperation(options.apiKey, operation.name);
    }
  };

  if (options.extraText?.trim()) {
    const filePath = await writeTempFile(
      `vault-notes-${Date.now()}.txt`,
      options.extraText.trim()
    );
    uploads.push(enqueueUpload(filePath, "Vault notes"));
  }

  options.docs.forEach((doc) => {
    if (!doc.content?.trim()) return;
    uploads.push(
      writeTempFile(`${doc.id}.txt`, doc.content).then((filePath) =>
        enqueueUpload(filePath, doc.name)
      )
    );
  });

  await Promise.all(uploads);
}
