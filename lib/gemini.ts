const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

type GenerationConfig = {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
};

type GenerateOptions = {
  model: string;
  apiKey: string;
  prompt: string;
  system?: string;
  config?: GenerationConfig;
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
    const { responseMimeType, responseSchema, ...rest } = options.config;
    payload.generationConfig = {
      ...rest,
      ...(responseMimeType ? { response_mime_type: responseMimeType } : {}),
      ...(responseSchema ? { response_schema: responseSchema } : {})
    };
  }

  return payload;
}

async function postJson(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Gemini error ${response.status}`);
  }

  return response.json();
}

export async function generateText(options: GenerateOptions) {
  const payload = buildPayload(options);
  const url = `${API_BASE}/models/${options.model}:generateContent?key=${options.apiKey}`;
  const data = await postJson(url, payload);
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
  const data = await postJson(url, payload);
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
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    const text = await response.text();
    throw new Error(text || `Gemini stream error ${response.status}`);
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
