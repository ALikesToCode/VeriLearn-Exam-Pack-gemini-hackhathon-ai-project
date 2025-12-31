import { getGenAIClient } from "./genaiClient";

type InteractionConfig = {
  temperature?: number;
  maxOutputTokens?: number;
};

function extractText(outputs?: Array<{ type?: string; text?: string }>) {
  if (!outputs?.length) return "";
  return outputs
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("");
}

export async function generateInteractionText(options: {
  apiKey: string;
  model: string;
  prompt: string;
  config?: InteractionConfig;
}) {
  const ai = getGenAIClient(options.apiKey);
  const interaction = await ai.interactions.create({
    model: options.model as any,
    input: options.prompt,
    generation_config: {
      temperature: options.config?.temperature ?? 0.4,
      max_output_tokens: options.config?.maxOutputTokens ?? 1024
    }
  });

  return extractText(interaction.outputs as Array<{ type?: string; text?: string }>);
}

export async function generateInteractionJson<T>(options: {
  apiKey: string;
  model: string;
  prompt: string;
  schema: Record<string, unknown>;
  config?: InteractionConfig;
}) {
  const ai = getGenAIClient(options.apiKey);
  const interaction = await ai.interactions.create({
    model: options.model as any,
    input: options.prompt,
    response_mime_type: "application/json",
    response_format: options.schema,
    generation_config: {
      temperature: options.config?.temperature ?? 0.3,
      max_output_tokens: options.config?.maxOutputTokens ?? 2048
    }
  });

  const text = extractText(interaction.outputs as Array<{ type?: string; text?: string }>);
  if (!text) {
    throw new Error("Empty JSON response from Interactions API");
  }
  return JSON.parse(text) as T;
}
