const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

type GenerationConfig = {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
  responseJsonSchema?: Record<string, unknown>;
  retry?: {
    maxRetries?: number;
    baseDelayMs?: number;
  };
};

type GenerateOptions = {
  model: string;
  apiKey: string;
  prompt: string;
  system?: string;
  config?: GenerationConfig;
  tools?: Record<string, unknown>[];
  toolConfig?: Record<string, unknown>;
};

function buildPayload(options: GenerateOptions) {
  const parts = [{ text: options.prompt }];
  const payload: Record<string, unknown> = {
    contents: [{ role: "user", parts }]
  };

  if (options.system) {
    payload.systemInstruction = {
      role: "system",
      parts: [{ text: options.system }]
    };
  }

  if (options.config) {
    const {
      responseMimeType,
      responseSchema,
      responseJsonSchema,
      retry,
      ...rest
    } = options.config;
    const resolvedSchema = responseJsonSchema ?? responseSchema;
    payload.generationConfig = {
      ...rest,
      ...(responseMimeType ? { responseMimeType } : {}),
      ...(resolvedSchema ? { responseJsonSchema: resolvedSchema } : {})
    };
  }

  if (options.tools?.length) {
    payload.tools = options.tools;
  }

  if (options.toolConfig) {
    payload.toolConfig = options.toolConfig;
  }

  return payload;
}

async function postJson(
  url: string,
  payload: Record<string, unknown>,
  retry?: GenerationConfig["retry"]
) {
  const maxRetries = retry?.maxRetries ?? 2;
  const baseDelayMs = retry?.baseDelayMs ?? 400;
  let attempt = 0;

  while (true) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return response.json();
    }

    const text = await response.text();
    if (attempt >= maxRetries) {
      throw new Error(text || `Gemini error ${response.status}`);
    }
    attempt += 1;
    await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
  }
}

export async function generateText(options: GenerateOptions) {
  const payload = buildPayload(options);
  const url = `${API_BASE}/models/${options.model}:generateContent?key=${options.apiKey}`;
  const data = await postJson(url, payload, options.config?.retry);
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text)
    .join("");
  return text ?? "";
}

export async function generateJson<T>(options: GenerateOptions): Promise<T> {
  const payload = buildPayload({
    ...options,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
      maxOutputTokens: 2048,
      ...options.config
    }
  });
  const url = `${API_BASE}/models/${options.model}:generateContent?key=${options.apiKey}`;
  const data = await postJson(url, payload, options.config?.retry);
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text)
    .join("");
  if (!text) {
    throw new Error("Empty JSON response from Gemini");
  }

  return JSON.parse(text) as T;
}

export async function streamText(options: GenerateOptions) {
  const payload = buildPayload(options);
  const url = `${API_BASE}/models/${options.model}:streamGenerateContent?key=${options.apiKey}`;
  const maxRetries = options.config?.retry?.maxRetries ?? 1;
  const baseDelayMs = options.config?.retry?.baseDelayMs ?? 400;
  let attempt = 0;
  let response: Response | null = null;

  while (attempt <= maxRetries) {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok && response.body) break;
    attempt += 1;
    if (attempt > maxRetries) break;
    await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
  }

  if (!response || !response.ok || !response.body) {
    const text = response ? await response.text() : "";
    throw new Error(text || "Gemini stream error");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();

  return new ReadableStream<string>({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payloadText = trimmed.replace(/^data:\s*/, "");
          if (payloadText === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(payloadText);
            const chunk = json.candidates?.[0]?.content?.parts
              ?.map((part: any) => part.text)
              .join("");
            if (chunk) controller.enqueue(chunk);
          } catch {
            // ignore malformed chunks
          }
        }
      }
      controller.close();
    }
  });
}
