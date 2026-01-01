<br />

| We have updated our[Terms of Service](https://ai.google.dev/gemini-api/terms).

The Interactions API ([Beta](https://ai.google.dev/gemini-api/docs/api-versions)) is a unified interface for interacting with Gemini models and agents. It simplifies state management, tool orchestration, and long-running tasks. For comprehensive view of the API schema, see the[API Reference](https://ai.google.dev/api/interactions-api). During the Beta, features and schemas are subject to[breaking changes](https://ai.google.dev/gemini-api/docs/interactions#breaking-changes).

<br />

| We have updated our[Terms of Service](https://ai.google.dev/gemini-api/terms).

Gemini 3 is our most intelligent model family to date, built on a foundation of state-of-the-art reasoning. It is designed to bring any idea to life by mastering agentic workflows, autonomous coding, and complex multimodal tasks. This guide covers key features of the Gemini 3 model family and how to get the most out of it.  
[Try Gemini 3 Pro](https://aistudio.google.com?model=gemini-3-pro-preview)[Try Gemini 3 Flash](https://aistudio.google.com?model=gemini-3-flash-preview)[Try Nano Banana Pro](https://aistudio.google.com?model=gemini-3-pro-image-preview)

Explore our[collection of Gemini 3 apps](https://aistudio.google.com/app/apps?source=showcase&showcaseTag=gemini-3)to see how the model handles advanced reasoning, autonomous coding, and complex multimodal tasks.

Get started with a few lines of code:  

### Python

    from google import genai

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-preview",
        contents="Find the race condition in this multi-threaded C++ snippet: [code here]",
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function run() {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: "Find the race condition in this multi-threaded C++ snippet: [code here]",
      });

      console.log(response.text);
    }

    run();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "Find the race condition in this multi-threaded C++ snippet: [code here]"}]
        }]
      }'

## Meet the Gemini 3 series

Gemini 3 Pro, the first model in the new series, is best for complex tasks that require broad world knowledge and advanced reasoning across modalities.

Gemini 3 Flash is our latest 3-series model, with Pro-level intelligence at the speed and pricing of Flash.

Nano Banana Pro (also known as Gemini 3 Pro Image) is our highest quality image generation model yet.

All Gemini 3 models are currently in preview.

|            Model ID            | Context Window (In / Out) | Knowledge Cutoff |            Pricing (Input / Output)\*             |
|--------------------------------|---------------------------|------------------|---------------------------------------------------|
| **gemini-3-pro-preview**       | 1M / 64k                  | Jan 2025         | $2 / $12 (\<200k tokens) $4 / $18 (\>200k tokens) |
| **gemini-3-flash-preview**     | 1M / 64k                  | Jan 2025         | $0.50 / $3                                        |
| **gemini-3-pro-image-preview** | 65k / 32k                 | Jan 2025         | $2 (Text Input) / $0.134 (Image Output)\*\*       |

*\* Pricing is per 1 million tokens unless otherwise noted.* *\*\* Image pricing varies by resolution. See the[pricing page](https://ai.google.dev/gemini-api/docs/pricing)for details.*

For detailed limits, pricing, and additional information, see the[models page](https://ai.google.dev/gemini-api/docs/models/gemini).

## New API features in Gemini 3

Gemini 3 introduces new parameters designed to give developers more control over latency, cost, and multimodal fidelity.

### Thinking level

Gemini 3 series models use dynamic thinking by default to reason through prompts. You can use the`thinking_level`parameter, which controls the**maximum**depth of the model's internal reasoning process before it produces a response. Gemini 3 treats these levels as relative allowances for thinking rather than strict token guarantees.

If`thinking_level`is not specified, Gemini 3 will default to`high`. For faster, lower-latency responses when complex reasoning isn't required, you can constrain the model's thinking level to`low`.

**Gemini 3 Pro and Flash thinking levels:**

The following thinking levels are supported by both Gemini 3 Pro and Flash:

- `low`: Minimizes latency and cost. Best for simple instruction following, chat, or high-throughput applications
- `high`(Default, dynamic): Maximizes reasoning depth. The model may take significantly longer to reach a first token, but the output will be more carefully reasoned.

**Gemini 3 Flash thinking levels**

In addition to the levels above, Gemini 3 Flash also supports the following thinking levels that are not currently supported by Gemini 3 Pro:

- `minimal`: Matches the "no thinking" setting for most queries. The model may think very minimally for complex coding tasks. Minimizes latency for chat or high throughput applications.

  | **Note:** Circulation of[thought signatures](https://ai.google.dev/gemini-api/docs/gemini-3#thought_signatures)is required even when thinking level is set to`minimal`for Gemini 3 Flash.
- `medium`: Balanced thinking for most tasks.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-preview",
        contents="How does AI work?",
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_level="low")
        ),
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: "How does AI work?",
        config: {
          thinkingConfig: {
            thinkingLevel: "low",
          }
        },
      });

    console.log(response.text);

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "How does AI work?"}]
        }],
        "generationConfig": {
          "thinkingConfig": {
            "thinkingLevel": "low"
          }
        }
      }'

| **Important:** You cannot use both`thinking_level`and the legacy`thinking_budget`parameter in the same request. Doing so will return a 400 error.

### Media resolution

Gemini 3 introduces granular control over multimodal vision processing via the`media_resolution`parameter. Higher resolutions improve the model's ability to read fine text or identify small details, but increase token usage and latency. The`media_resolution`parameter determines the**maximum number of tokens allocated per input image or video frame.**

You can now set the resolution to`media_resolution_low`,`media_resolution_medium`,`media_resolution_high`, or`media_resolution_ultra_high`per individual media part or globally (via`generation_config`, global not available for ultra high). If unspecified, the model uses optimal defaults based on the media type.

**Recommended settings**

|      Media Type       |                 Recommended Setting                 |   Max Tokens    |                                                                                  Usage Guidance                                                                                   |
|-----------------------|-----------------------------------------------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Images**            | `media_resolution_high`                             | 1120            | Recommended for most image analysis tasks to ensure maximum quality.                                                                                                              |
| **PDFs**              | `media_resolution_medium`                           | 560             | Optimal for document understanding; quality typically saturates at`medium`. Increasing to`high`rarely improves OCR results for standard documents.                                |
| **Video**(General)    | `media_resolution_low`(or`media_resolution_medium`) | 70 (per frame)  | **Note:** For video,`low`and`medium`settings are treated identically (70 tokens) to optimize context usage. This is sufficient for most action recognition and description tasks. |
| **Video**(Text-heavy) | `media_resolution_high`                             | 280 (per frame) | Required only when the use case involves reading dense text (OCR) or small details within video frames.                                                                           |

**Note:** The`media_resolution`parameter maps to different token counts depending on the input type. While images scale linearly (`media_resolution_low`: 280,`media_resolution_medium`: 560,`media_resolution_high`: 1120), Video is compressed more aggressively. For Video, both`media_resolution_low`and`media_resolution_medium`are capped at 70 tokens per frame, and`media_resolution_high`is capped at 280 tokens. See full details[here](https://ai.google.dev/gemini-api/docs/media-resolution#token-counts)  

### Python

    from google import genai
    from google.genai import types
    import base64

    # The media_resolution parameter is currently only available in the v1alpha API version.
    client = genai.Client(http_options={'api_version': 'v1alpha'})

    response = client.models.generate_content(
        model="gemini-3-pro-preview",
        contents=[
            types.Content(
                parts=[
                    types.Part(text="What is in this image?"),
                    types.Part(
                        inline_data=types.Blob(
                            mime_type="image/jpeg",
                            data=base64.b64decode("..."),
                        ),
                        media_resolution={"level": "media_resolution_high"}
                    )
                ]
            )
        ]
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    // The media_resolution parameter is currently only available in the v1alpha API version.
    const ai = new GoogleGenAI({ apiVersion: "v1alpha" });

    async function run() {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [
          {
            parts: [
              { text: "What is in this image?" },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: "...",
                },
                mediaResolution: {
                  level: "media_resolution_high"
                }
              }
            ]
          }
        ]
      });

      console.log(response.text);
    }

    run();

### REST

    curl "https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-pro-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [
            { "text": "What is in this image?" },
            {
              "inlineData": {
                "mimeType": "image/jpeg",
                "data": "..."
              },
              "mediaResolution": {
                "level": "media_resolution_high"
              }
            }
          ]
        }]
      }'

### Temperature

For Gemini 3, we strongly recommend keeping the temperature parameter at its default value of`1.0`.

While previous models often benefited from tuning temperature to control creativity versus determinism, Gemini 3's reasoning capabilities are optimized for the default setting. Changing the temperature (setting it below 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks.

### Thought signatures

Gemini 3 uses[Thought signatures](https://ai.google.dev/gemini-api/docs/thought-signatures)to maintain reasoning context across API calls. These signatures are encrypted representations of the model's internal thought process. To ensure the model maintains its reasoning capabilities you must return these signatures back to the model in your request exactly as they were received:

- **Function Calling (Strict):**The API enforces strict validation on the "Current Turn". Missing signatures will result in a 400 error.

  | **Note:** Circulation of thought signatures is required even when[thinking level](https://ai.google.dev/gemini-api/docs/gemini-3#thinking_level)is set to`minimal`for Gemini 3 Flash.
- **Text/Chat:**Validation is not strictly enforced, but omitting signatures will degrade the model's reasoning and answer quality.

- **Image generation/editing (Strict)** : The API enforces strict validation on all Model parts including a`thoughtSignature`. Missing signatures will result in a 400 error.

| **Success:** If you use the[official SDKs (Python, Node, Java)](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting#thinking)and standard chat history, Thought Signatures are handled automatically. You do not need to manually manage these fields.

#### Function calling (strict validation)

When Gemini generates a`functionCall`, it relies on the`thoughtSignature`to process the tool's output correctly in the next turn. The "Current Turn" includes all Model (`functionCall`) and User (`functionResponse`) steps that occurred since the last standard**User** `text`message.

- **Single Function Call:** The`functionCall`part contains a signature. You must return it.
- **Parallel Function Calls:** Only the first`functionCall`part in the list will contain the signature. You must return the parts in the exact order received.
- **Multi-Step (Sequential):** If the model calls a tool, receives a result, and calls*another* tool (within the same turn),**both** function calls have signatures. You must return**all**accumulated signatures in the history.

#### Text and streaming

For standard chat or text generation, the presence of a signature is not guaranteed.

- **Non-Streaming** : The final content part of the response may contain a`thoughtSignature`, though it is not always present. If one is returned, you should send it back to maintain best performance.
- **Streaming**: If a signature is generated, it may arrive in a final chunk that contains an empty text part. Ensure your stream parser checks for signatures even if the text field is empty.

#### Image generation and editing

For`gemini-3-pro-image-preview`, thought signatures are critical for conversational editing. When you ask the model to modify an image it relies on the`thoughtSignature`from the previous turn to understand the composition and logic of the original image.

- **Editing:** Signatures are guaranteed on the first part after the thoughts of the response (`text`or`inlineData`) and on every subsequent`inlineData`part. You must return all of these signatures to avoid errors.

#### Code examples

#### Multi-step Function Calling (Sequential)

The user asks a question requiring two separate steps (Check Flight -\> Book Taxi) in one turn.  

**Step 1: Model calls Flight Tool.**   
The model returns a signature`<Sig_A>`  

```java
// Model Response (Turn 1, Step 1)
  {
    "role": "model",
    "parts": [
      {
        "functionCall": { "name": "check_flight", "args": {...} },
        "thoughtSignature": "<Sig_A>" // SAVE THIS
      }
    ]
  }
```

**Step 2: User sends Flight Result**   
We must send back`<Sig_A>`to keep the model's train of thought.  

```java
// User Request (Turn 1, Step 2)
[
  { "role": "user", "parts": [{ "text": "Check flight AA100..." }] },
  { 
    "role": "model", 
    "parts": [
      { 
        "functionCall": { "name": "check_flight", "args": {...} }, 
        "thoughtSignature": "<Sig_A>" // REQUIRED
      } 
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": { "name": "check_flight", "response": {...} } }] }
]
```

**Step 3: Model calls Taxi Tool**   
The model remembers the flight delay via`<Sig_A>`and now decides to book a taxi. It generates a*new* signature`<Sig_B>`.  

```java
// Model Response (Turn 1, Step 3)
{
  "role": "model",
  "parts": [
    {
      "functionCall": { "name": "book_taxi", "args": {...} },
      "thoughtSignature": "<Sig_B>" // SAVE THIS
    }
  ]
}
```

**Step 4: User sends Taxi Result**   
To complete the turn, you must send back the entire chain:`<Sig_A>`AND`<Sig_B>`.  

```java
// User Request (Turn 1, Step 4)
[
  // ... previous history ...
  { 
    "role": "model", 
    "parts": [
       { "functionCall": { "name": "check_flight", ... }, "thoughtSignature": "<Sig_A>" } 
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": {...} }] },
  { 
    "role": "model", 
    "parts": [
       { "functionCall": { "name": "book_taxi", ... }, "thoughtSignature": "<Sig_B>" } 
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": {...} }] }
]
```  

#### Parallel Function Calling

The user asks: "Check the weather in Paris and London." The model returns two function calls in one response.  

```java
// User Request (Sending Parallel Results)
[
  {
    "role": "user",
    "parts": [
      { "text": "Check the weather in Paris and London." }
    ]
  },
  {
    "role": "model",
    "parts": [
      // 1. First Function Call has the signature
      {
        "functionCall": { "name": "check_weather", "args": { "city": "Paris" } },
        "thoughtSignature": "<Signature_A>" 
      },
      // 2. Subsequent parallel calls DO NOT have signatures
      {
        "functionCall": { "name": "check_weather", "args": { "city": "London" } }
      } 
    ]
  },
  {
    "role": "user",
    "parts": [
      // 3. Function Responses are grouped together in the next block
      {
        "functionResponse": { "name": "check_weather", "response": { "temp": "15C" } }
      },
      {
        "functionResponse": { "name": "check_weather", "response": { "temp": "12C" } }
      }
    ]
  }
]
```  

#### Text/In-Context Reasoning (No Validation)

The user asks a question that requires in-context reasoning without external tools. While not strictly validated, including the signature helps the model maintain the reasoning chain for follow-up questions.  

```java
// User Request (Follow-up question)
[
  { 
    "role": "user", 
    "parts": [{ "text": "What are the risks of this investment?" }] 
  },
  { 
    "role": "model", 
    "parts": [
      {
        "text": "I need to calculate the risk step-by-step. First, I'll look at volatility...",
        "thoughtSignature": "<Signature_C>" // Recommended to include
      }
    ]
  },
  { 
    "role": "user", 
    "parts": [{ "text": "Summarize that in one sentence." }] 
  }
]
```  

#### Image Generation \& Editing

For image generation, signatures are strictly validated. They appear on the**first part** (text or image) and**all subsequent image parts**. All must be returned in the next turn.  

```java
// Model Response (Turn 1)
{
  "role": "model",
  "parts": [
    // 1. First part ALWAYS has a signature (even if text)
    {
      "text": "I will generate a cyberpunk city...",
      "thoughtSignature": "<Signature_D>" 
    },
    // 2. ALL InlineData (Image) parts ALWAYS have signatures
    {
      "inlineData": { ... }, 
      "thoughtSignature": "<Signature_E>" 
    },
  ]
}

// User Request (Turn 2 - Requesting an Edit)
{
  "contents": [
    // History must include ALL signatures received
    {
      "role": "user",
      "parts": [{ "text": "Generate a cyberpunk city" }]
    },
    {
      "role": "model",
      "parts": [
         { "text": "...", "thoughtSignature": "<Signature_D>" },
         { "inlineData": "...", "thoughtSignature": "<Signature_E>" },
      ]
    },
    // New User Prompt
    {
      "role": "user",
      "parts": [{ "text": "Make it daytime." }]
    }
  ]
}
```

#### Migrating from other models

If you are transferring a conversation trace from another model (e.g., Gemini 2.5) or injecting a custom function call that was not generated by Gemini 3, you will not have a valid signature.

To bypass strict validation in these specific scenarios, populate the field with this specific dummy string:`"thoughtSignature": "context_engineering_is_the_way_to_go"`

### Structured Outputs with tools

Gemini 3 models allow you to combine[Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output)with built-in tools, including[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search),[URL Context](https://ai.google.dev/gemini-api/docs/url-context), and[Code Execution](https://ai.google.dev/gemini-api/docs/code-execution).  

### Python

    from google import genai
    from google.genai import types
    from pydantic import BaseModel, Field
    from typing import List

    class MatchResult(BaseModel):
        winner: str = Field(description="The name of the winner.")
        final_match_score: str = Field(description="The final match score.")
        scorers: List[str] = Field(description="The name of the scorer.")

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-preview",
        contents="Search for all details for the latest Euro.",
        config={
            "tools": [
                {"google_search": {}},
                {"url_context": {}}
            ],
            "response_mime_type": "application/json",
            "response_json_schema": MatchResult.model_json_schema(),
        },  
    )

    result = MatchResult.model_validate_json(response.text)
    print(result)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const ai = new GoogleGenAI({});

    const matchSchema = z.object({
      winner: z.string().describe("The name of the winner."),
      final_match_score: z.string().describe("The final score."),
      scorers: z.array(z.string()).describe("The name of the scorer.")
    });

    async function run() {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: "Search for all details for the latest Euro.",
        config: {
          tools: [
            { googleSearch: {} },
            { urlContext: {} }
          ],
          responseMimeType: "application/json",
          responseJsonSchema: zodToJsonSchema(matchSchema),
        },
      });

      const match = matchSchema.parse(JSON.parse(response.text));
      console.log(match);
    }

    run();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "Search for all details for the latest Euro."}]
        }],
        "tools": [
          {"googleSearch": {}},
          {"urlContext": {}}
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseJsonSchema": {
                "type": "object",
                "properties": {
                    "winner": {"type": "string", "description": "The name of the winner."},
                    "final_match_score": {"type": "string", "description": "The final score."},
                    "scorers": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "The name of the scorer."
                    }
                },
                "required": ["winner", "final_match_score", "scorers"]
            }
        }
      }'

### Image generation

Gemini 3 Pro Image lets you generate and edit images from text prompts. It uses reasoning to "think" through a prompt and can retrieve real-time data---such as weather forecasts or stock charts---before using[Google Search](https://ai.google.dev/gemini-api/docs/google-search)grounding before generating high-fidelity images.

**New \& improved capabilities:**

- **4K \& text rendering:**Generate sharp, legible text and diagrams with up to 2K and 4K resolutions.
- **Grounded generation:** Use the`google_search`tool to verify facts and generate imagery based on real-world information.
- **Conversational editing:** Multi-turn image editing by simply asking for changes (e.g., "Make the background a sunset"). This workflow relies on**Thought Signatures**to preserve visual context between turns.

For complete details on aspect ratios, editing workflows, and configuration options, see the[Image Generation guide](https://ai.google.dev/gemini-api/docs/image-generation).  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents="Generate an infographic of the current weather in Tokyo.",
        config=types.GenerateContentConfig(
            tools=[{"google_search": {}}],
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
                image_size="4K"
            )
        )
    )

    image_parts = [part for part in response.parts if part.inline_data]

    if image_parts:
        image = image_parts[0].as_image()
        image.save('weather_tokyo.png')
        image.show()

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    const ai = new GoogleGenAI({});

    async function run() {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: "Generate a visualization of the current weather in Tokyo.",
        config: {
          tools: [{ googleSearch: {} }],
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "4K"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("weather_tokyo.png", buffer);
        }
      }
    }

    run();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "Generate a visualization of the current weather in Tokyo."}]
        }],
        "tools": [{"googleSearch": {}}],
        "generationConfig": {
            "imageConfig": {
              "aspectRatio": "16:9",
              "imageSize": "4K"
          }
        }
      }'

**Example Response**

![Weather Tokyo](https://ai.google.dev/static/gemini-api/docs/images/weather-tokyo.jpg)

## Migrating from Gemini 2.5

Gemini 3 is our most capable model family to date and offers a stepwise improvement over Gemini 2.5. When migrating, consider the following:

- **Thinking:** If you were previously using complex prompt engineering (like chain of thought) to force Gemini 2.5 to reason, try Gemini 3 with`thinking_level: "high"`and simplified prompts.
- **Temperature settings:**If your existing code explicitly sets temperature (especially to low values for deterministic outputs), we recommend removing this parameter and using the Gemini 3 default of 1.0 to avoid potential looping issues or performance degradation on complex tasks.
- **PDF \& document understanding:** Default OCR resolution for PDFs has changed. If you relied on specific behavior for dense document parsing, test the new`media_resolution_high`setting to ensure continued accuracy.
- **Token consumption:** Migrating to Gemini 3 defaults may**increase** token usage for PDFs but**decrease**token usage for video. If requests now exceed the context window due to higher default resolutions, we recommend explicitly reducing the media resolution.
- **Image segmentation:** Image segmentation capabilities (returning pixel-level masks for objects) are not supported in Gemini 3 Pro or Gemini 3 Flash. For workloads requiring native image segmentation, we recommend continuing to utilize Gemini 2.5 Flash with thinking turned off or[Gemini Robotics-ER 1.5](https://ai.google.dev/gemini-api/docs/robotics-overview).
- **Tool support**: Maps grounding and Computer use tools are not yet supported for Gemini 3 models, so won't migrate. Additionally, combining built-in tools with function calling is not yet supported.

## OpenAI compatibility

For users utilizing the OpenAI compatibility layer, standard parameters are automatically mapped to Gemini equivalents:

- `reasoning_effort`(OAI) maps to`thinking_level`(Gemini). Note that`reasoning_effort`medium maps to`thinking_level`high.

## Prompting best practices

Gemini 3 is a reasoning model, which changes how you should prompt.

- **Precise instructions:**Be concise in your input prompts. Gemini 3 responds best to direct, clear instructions. It may over-analyze verbose or overly complex prompt engineering techniques used for older models.
- **Output verbosity:**By default, Gemini 3 is less verbose and prefers providing direct, efficient answers. If your use case requires a more conversational or "chatty" persona, you must explicitly steer the model in the prompt (e.g., "Explain this as a friendly, talkative assistant").
- **Context management:**When working with large datasets (e.g., entire books, codebases, or long videos), place your specific instructions or questions at the end of the prompt, after the data context. Anchor the model's reasoning to the provided data by starting your question with a phrase like, "Based on the information above...".

Learn more about prompt design strategies in the[prompt engineering guide](https://ai.google.dev/gemini-api/docs/prompting-strategies).

## FAQ

1. **What is the knowledge cutoff for Gemini 3?** Gemini 3 models have a knowledge cutoff of January 2025. For more recent information, use the[Search Grounding](https://ai.google.dev/gemini-api/docs/google-search)tool.

2. **What are the context window limits?**Gemini 3 models support a 1 million token input context window and up to 64k tokens of output.

3. **Is there a free tier for Gemini 3?** Gemini 3 Flash`gemini-3-flash-preview`has a free tier in the Gemini API. You can try both Gemini 3 Pro and Flash for free in Google AI Studio, but currently, there is no free tier available for`gemini-3-pro-preview`in the Gemini API.

4. **Will my old`thinking_budget`code still work?** Yes,`thinking_budget`is still supported for backward compatibility, but we recommend migrating to`thinking_level`for more predictable performance. Do not use both in the same request.

5. **Does Gemini 3 support the Batch API?** Yes, Gemini 3 supports the[Batch API.](https://ai.google.dev/gemini-api/docs/batch-api)

6. **Is Context Caching supported?** Yes,[Context Caching](https://ai.google.dev/gemini-api/docs/caching?lang=python)is supported for Gemini 3. The minimum token count required to initiate caching is 2,048 tokens.

7. **Which tools are supported in Gemini 3?** Gemini 3 supports[Google Search](https://ai.google.dev/gemini-api/docs/google-search),[File Search](https://ai.google.dev/gemini-api/docs/file-search),[Code Execution](https://ai.google.dev/gemini-api/docs/code-execution), and[URL Context](https://ai.google.dev/gemini-api/docs/url-context). It also supports standard[Function Calling](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting)for your own custom tools (but not with built-in tools). Please note that[Grounding with Google Maps](https://ai.google.dev/gemini-api/docs/maps-grounding)and[Computer Use](https://ai.google.dev/gemini-api/docs/computer-use)are currently not supported.

   | **Note:** Gemini 3 billing for[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)will begin on January 5, 2026.

## Next steps

- Get started with the[Gemini 3 Cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started.ipynb#templateParams=%7B%22MODEL_ID%22%3A+%22gemini-3-pro-preview%22%7D)
- Check the dedicated Cookbook guide on[thinking levels](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_thinking_REST.ipynb#gemini3)and how to migrate from thinking budget to thinking levels.


General useFunction callingDeep Research agent

The following example shows how to call the Interactions API with a text prompt.  

### Python

    from google import genai

    client = genai.Client()

    interaction =  client.interactions.create(
        model="gemini-3-flash-preview",
        input="Tell me a short joke about programming."
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction =  await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Tell me a short joke about programming.',
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Tell me a short joke about programming."
    }'

## Basic interactions

The Interactions API is available through our[existing SDKs](https://ai.google.dev/gemini-api/docs/interactions#sdk). The simplest way to interact with the model is by providing a text prompt. The`input`can be a string, a list containing a content objects, or a list of turns with roles and content objects.  

### Python

    from google import genai

    client = genai.Client()

    interaction =  client.interactions.create(
        model="gemini-3-flash-preview",
        input="Tell me a short joke about programming."
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction =  await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Tell me a short joke about programming.',
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Tell me a short joke about programming."
    }'

| **Note:** Interaction objects are saved by default (`store=true`) to enable state management features and background execution. See[Data Storage and Retention](https://ai.google.dev/gemini-api/docs/interactions#data-storage-retention)for details on retention periods and how to delete stored data or opt out.

## Conversation

You can build multi-turn conversations in two ways:

- Statefully by referencing a previous interaction
- Statelessly by providing the entire conversation history

### Stateful conversation

Pass the`id`from the previous interaction to the`previous_interaction_id`parameter to continue a conversation.  

### Python

    from google import genai

    client = genai.Client()

    # 1. First turn
    interaction1 = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Hi, my name is Phil."
    )
    print(f"Model: {interaction1.outputs[-1].text}")

    # 2. Second turn (passing previous_interaction_id)
    interaction2 = client.interactions.create(
        model="gemini-3-flash-preview",
        input="What is my name?",
        previous_interaction_id=interaction1.id
    )
    print(f"Model: {interaction2.outputs[-1].text}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    // 1. First turn
    const interaction1 = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Hi, my name is Phil.'
    });
    console.log(`Model: ${interaction1.outputs[interaction1.outputs.length - 1].text}`);

    // 2. Second turn (passing previous_interaction_id)
    const interaction2 = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'What is my name?',
        previous_interaction_id: interaction1.id
    });
    console.log(`Model: ${interaction2.outputs[interaction2.outputs.length - 1].text}`);

### REST

    # 1. First turn
    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Hi, my name is Phil."
    }'

    # 2. Second turn (Replace INTERACTION_ID with the ID from the previous interaction)
    # curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    # -H "Content-Type: application/json" \
    # -H "x-goog-api-key: $GEMINI_API_KEY" \
    # -d '{
    #     "model": "gemini-3-flash-preview",
    #     "input": "What is my name?",
    #     "previous_interaction_id": "INTERACTION_ID"
    # }'

#### Retrieve past stateful interactions

Using the interaction`id`to retrieve previous turns of the conversation.  

### Python

    previous_interaction = client.interactions.get("<YOUR_INTERACTION_ID>")

    print(previous_interaction)

### JavaScript

    const previous_interaction = await client.interactions.get("<YOUR_INTERACTION_ID>");
    console.log(previous_interaction);

### REST

    curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/<YOUR_INTERACTION_ID>" \
    -H "x-goog-api-key: $GEMINI_API_KEY"

### Stateless conversation

You can manage conversation history manually on the client side.  

### Python

    from google import genai

    client = genai.Client()

    conversation_history = [
        {
            "role": "user",
            "content": "What are the three largest cities in Spain?"
        }
    ]

    interaction1 = client.interactions.create(
        model="gemini-3-flash-preview",
        input=conversation_history
    )

    print(f"Model: {interaction1.outputs[-1].text}")

    conversation_history.append({"role": "model", "content": interaction1.outputs})
    conversation_history.append({
        "role": "user", 
        "content": "What is the most famous landmark in the second one?"
    })

    interaction2 = client.interactions.create(
        model="gemini-3-flash-preview",
        input=conversation_history
    )

    print(f"Model: {interaction2.outputs[-1].text}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const conversationHistory = [
        {
            role: 'user',
            content: "What are the three largest cities in Spain?"
        }
    ];

    const interaction1 = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: conversationHistory
    });

    console.log(`Model: ${interaction1.outputs[interaction1.outputs.length - 1].text}`);

    conversationHistory.push({ role: 'model', content: interaction1.outputs });
    conversationHistory.push({
        role: 'user',
        content: "What is the most famous landmark in the second one?"
    });

    const interaction2 = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: conversationHistory
    });

    console.log(`Model: ${interaction2.outputs[interaction2.outputs.length - 1].text}`);

### REST

     curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
     -H "Content-Type: application/json" \
     -H "x-goog-api-key: $GEMINI_API_KEY" \
     -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {
                "role": "user",
                "content": "What are the three largest cities in Spain?"
            },
            {
                "role": "model",
                "content": "The three largest cities in Spain are Madrid, Barcelona, and Valencia."
            },
            {
                "role": "user",
                "content": "What is the most famous landmark in the second one?"
            }
        ]
    }'

## Multimodal capabilities

You can use the Interactions API for multimodal use cases such as image understanding or video generation.

### Multimodal understanding

You can provide multimodal data as base64 encoded data inline or using the Files API for larger files.

#### Image understanding

### Python

    import base64
    from pathlib import Path
    from google import genai

    client = genai.Client()

    # Read and encode the image
    with open(Path(__file__).parent / "car.png", "rb") as f:
        base64_image = base64.b64encode(f.read()).decode('utf-8')

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {"type": "text", "text": "Describe the image."},
            {"type": "image", "data": base64_image, "mime_type": "image/png"}
        ]
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';

    const client = new GoogleGenAI({});

    const base64Image = fs.readFileSync('car.png', { encoding: 'base64' });

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            { type: 'text', text: 'Describe the image.' },
            { type: 'image', data: base64Image, mime_type: 'image/png' }
        ]
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {"type": "text", "text": "Describe the image."},
            {"type": "image", "data": "'"$(base64 -w0 car.png)"'", "mime_type": "image/png"}
        ]
    }'

#### Audio understanding

### Python

    import base64
    from pathlib import Path
    from google import genai

    client = genai.Client()

    # Read and encode the audio
    with open(Path(__file__).parent / "speech.wav", "rb") as f:
        base64_audio = base64.b64encode(f.read()).decode('utf-8')

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {"type": "text", "text": "What does this audio say?"},
            {"type": "audio", "data": base64_audio, "mime_type": "audio/wav"}
        ]
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';

    const client = new GoogleGenAI({});

    const base64Audio = fs.readFileSync('speech.wav', { encoding: 'base64' });

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            { type: 'text', text: 'What does this audio say?' },
            { type: 'audio', data: base64Audio, mime_type: 'audio/wav' }
        ]
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {"type": "text", "text": "What does this audio say?"},
            {"type": "audio", "data": "'"$(base64 -w0 speech.wav)"'", "mime_type": "audio/wav"}
        ]
    }'

#### Video understanding

### Python

    import base64
    from pathlib import Path
    from google import genai

    client = genai.Client()

    # Read and encode the video
    with open(Path(__file__).parent / "video.mp4", "rb") as f:
        base64_video = base64.b64encode(f.read()).decode('utf-8')

    print("Analyzing video...")
    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {"type": "text", "text": "What is happening in this video? Provide a timestamped summary."},
            {"type": "video", "data": base64_video, "mime_type": "video/mp4" }
        ]
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';

    const client = new GoogleGenAI({});

    const base64Video = fs.readFileSync('video.mp4', { encoding: 'base64' });

    console.log('Analyzing video...');
    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            { type: 'text', text: 'What is happening in this video? Provide a timestamped summary.' },
            { type: 'video', data: base64Video, mime_type: 'video/mp4'}
        ]
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {"type": "text", "text": "What is happening in this video?"},
            {"type": "video", "mime_type": "video/mp4", "data": "'"$(base64 -w0 video.mp4)"'"}
        ]
    }'

#### Document (PDF) understanding

### Python

    import base64
    from google import genai

    client = genai.Client()

    with open("sample.pdf", "rb") as f:
        base64_pdf = base64.b64encode(f.read()).decode('utf-8')

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {"type": "text", "text": "What is this document about?"},
            {"type": "document", "data": base64_pdf, "mime_type": "application/pdf"}
        ]
    )
    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';
    const client = new GoogleGenAI({});

    const base64Pdf = fs.readFileSync('sample.pdf', { encoding: 'base64' });

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            { type: 'text', text: 'What is this document about?' },
            { type: 'document', data: base64Pdf, mime_type: 'application/pdf' }
        ],
    });
    console.log(interaction.outputs[0].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {"type": "text", "text": "What is this document about?"},
            {"type": "document", "data": "'"$(base64 -w0 sample.pdf)"'", "mime_type": "application/pdf"}
        ]
    }'

### Multimodal generation

You can use Interactions API to generate multimodal outputs.

#### Image generation

### Python

    import base64
    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-pro-image-preview",
        input="Generate an image of a futuristic city.",
        response_modalities=["IMAGE"]
    )

    for output in interaction.outputs:
        if output.type == "image":
            print(f"Generated image with mime_type: {output.mime_type}")
            # Save the image
            with open("generated_city.png", "wb") as f:
                f.write(base64.b64decode(output.data))

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-pro-image-preview',
        input: 'Generate an image of a futuristic city.',
        response_modalities: ['IMAGE']
    });

    for (const output of interaction.outputs) {
        if (output.type === 'image') {
            console.log(`Generated image with mime_type: ${output.mime_type}`);
            // Save the image
            fs.writeFileSync('generated_city.png', Buffer.from(output.data, 'base64'));
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-pro-image-preview",
        "input": "Generate an image of a futuristic city.",
        "response_modalities": ["IMAGE"]
    }'

## Agentic capabilities

The Interactions API is designed for building and interacting with agents, and includes support for function calling, built-in tools, structured outputs, and the Model Context Protocol (MCP).

### Agents

You can use specialized agents like`deep-research-pro-preview-12-2025`for complex tasks. To learn more about the Gemini Deep Research Agent, see the[Deep Research](https://ai.google.dev/gemini-api/docs/deep-research)guide.
**Note:** The`background=true`parameter is only supported for agents.  

### Python

    import time
    from google import genai

    client = genai.Client()

    # 1. Start the Deep Research Agent
    initial_interaction = client.interactions.create(
        input="Research the history of the Google TPUs with a focus on 2025 and 2026.",
        agent="deep-research-pro-preview-12-2025",
        background=True
    )

    print(f"Research started. Interaction ID: {initial_interaction.id}")

    # 2. Poll for results
    while True:
        interaction = client.interactions.get(initial_interaction.id)
        print(f"Status: {interaction.status}")

        if interaction.status == "completed":
            print("\nFinal Report:\n", interaction.outputs[-1].text)
            break
        elif interaction.status in ["failed", "cancelled"]:
            print(f"Failed with status: {interaction.status}")
            break

        time.sleep(10)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    // 1. Start the Deep Research Agent
    const initialInteraction = await client.interactions.create({
        input: 'Research the history of the Google TPUs with a focus on 2025 and 2026.',
        agent: 'deep-research-pro-preview-12-2025',
        background: true
    });

    console.log(`Research started. Interaction ID: ${initialInteraction.id}`);

    // 2. Poll for results
    while (true) {
        const interaction = await client.interactions.get(initialInteraction.id);
        console.log(`Status: ${interaction.status}`);

        if (interaction.status === 'completed') {
            console.log('\nFinal Report:\n', interaction.outputs[interaction.outputs.length - 1].text);
            break;
        } else if (['failed', 'cancelled'].includes(interaction.status)) {
            console.log(`Failed with status: ${interaction.status}`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }

### REST

    # 1. Start the Deep Research Agent
    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Research the history of the Google TPUs with a focus on 2025 and 2026.",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true
    }'

    # 2. Poll for results (Replace INTERACTION_ID with the ID from the previous interaction)
    # curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID" \
    # -H "x-goog-api-key: $GEMINI_API_KEY"

### Tools and function calling

This section explains how to use function calling to define custom tools and how to use Google's built-in tools within the Interactions API.

#### Function calling

### Python

    from google import genai

    client = genai.Client()

    # 1. Define the tool
    def get_weather(location: str):
        """Gets the weather for a given location."""
        return f"The weather in {location} is sunny."

    weather_tool = {
        "type": "function",
        "name": "get_weather",
        "description": "Gets the weather for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"}
            },
            "required": ["location"]
        }
    }

    # 2. Send the request with tools
    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="What is the weather in Paris?",
        tools=[weather_tool]
    )

    # 3. Handle the tool call
    for output in interaction.outputs:
        if output.type == "function_call":
            print(f"Tool Call: {output.name}({output.arguments})")
            # Execute tool
            result = get_weather(**output.arguments)

            # Send result back
            interaction = client.interactions.create(
                model="gemini-3-flash-preview",
                previous_interaction_id=interaction.id,
                input=[{
                    "type": "function_result",
                    "name": output.name,
                    "call_id": output.id,
                    "result": result
                }]
            )
            print(f"Response: {interaction.outputs[-1].text}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    // 1. Define the tool
    const weatherTool = {
        type: 'function',
        name: 'get_weather',
        description: 'Gets the weather for a given location.',
        parameters: {
            type: 'object',
            properties: {
                location: { type: 'string', description: 'The city and state, e.g. San Francisco, CA' }
            },
            required: ['location']
        }
    };

    // 2. Send the request with tools
    let interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'What is the weather in Paris?',
        tools: [weatherTool]
    });

    // 3. Handle the tool call
    for (const output of interaction.outputs) {
        if (output.type === 'function_call') {
            console.log(`Tool Call: ${output.name}(${JSON.stringify(output.arguments)})`);

            // Execute tool (Mocked)
            const result = `The weather in ${output.arguments.location} is sunny.`;

            // Send result back
            interaction = await client.interactions.create({
                model: 'gemini-3-flash-preview',
                previous_interaction_id:interaction.id,
                input: [{
                    type: 'function_result',
                    name: output.name,
                    call_id: output.id,
                    result: result
                }]
            });
            console.log(`Response: ${interaction.outputs[interaction.outputs.length - 1].text}`);
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "What is the weather in Paris?",
        "tools": [{
            "type": "function",
            "name": "get_weather",
            "description": "Gets the weather for a given location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"}
                },
                "required": ["location"]
            }
        }]
    }'

    # Handle the tool call and send result back (Replace INTERACTION_ID and CALL_ID)
    # curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    # -H "Content-Type: application/json" \
    # -H "x-goog-api-key: $GEMINI_API_KEY" \
    # -d '{
    #     "model": "gemini-3-flash-preview",
    #     "previous_interaction_id": "INTERACTION_ID",
    #     "input": [{
    #         "type": "function_result",
    #         "name": "get_weather",
    #         "call_id": "FUNCTION_CALL_ID",
    #         "result": "The weather in Paris is sunny."
    #     }]
    # }'

##### Function calling with client-side state

If you don't want to use server-side state, you can manage it all on the client side.  

### Python

    from google import genai
    client = genai.Client()

    functions = [
        {
            "type": "function",
            "name": "schedule_meeting",
            "description": "Schedules a meeting with specified attendees at a given time and date.",
            "parameters": {
                "type": "object",
                "properties": {
                    "attendees": {"type": "array", "items": {"type": "string"}},
                    "date": {"type": "string", "description": "Date of the meeting (e.g., 2024-07-29)"},
                    "time": {"type": "string", "description": "Time of the meeting (e.g., 15:00)"},
                    "topic": {"type": "string", "description": "The subject of the meeting."},
                },
                "required": ["attendees", "date", "time", "topic"],
            },
        }
    ]

    history = [{"role": "user","content": [{"type": "text", "text": "Schedule a meeting for 2025-11-01 at 10 am with Peter and Amir about the Next Gen API."}]}]

    # 1. Model decides to call the function
    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=history,
        tools=functions
    )

    # add model interaction back to history
    history.append({"role": "model", "content": interaction.outputs})

    for output in interaction.outputs:
        if output.type == "function_call":
            print(f"Function call: {output.name} with arguments {output.arguments}")

            # 2. Execute the function and get a result
            # In a real app, you would call your function here.
            # call_result = schedule_meeting(**json.loads(output.arguments))
            call_result = "Meeting scheduled successfully."

            # 3. Send the result back to the model
            history.append({"role": "user", "content": [{"type": "function_result", "name": output.name, "call_id": output.id, "result": call_result}]})

            interaction2 = client.interactions.create(
                model="gemini-3-flash-preview",
                input=history,
            )
            print(f"Final response: {interaction2.outputs[-1].text}")
        else:
            print(f"Output: {output}")

### JavaScript

    // 1. Define the tool
    const functions = [
        {
            type: 'function',
            name: 'schedule_meeting',
            description: 'Schedules a meeting with specified attendees at a given time and date.',
            parameters: {
                type: 'object',
                properties: {
                    attendees: { type: 'array', items: { type: 'string' } },
                    date: { type: 'string', description: 'Date of the meeting (e.g., 2024-07-29)' },
                    time: { type: 'string', description: 'Time of the meeting (e.g., 15:00)' },
                    topic: { type: 'string', description: 'The subject of the meeting.' },
                },
                required: ['attendees', 'date', 'time', 'topic'],
            },
        },
    ];

    const history = [
        { role: 'user', content: [{ type: 'text', text: 'Schedule a meeting for 2025-11-01 at 10 am with Peter and Amir about the Next Gen API.' }] }
    ];

    // 2. Model decides to call the function
    let interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: history,
        tools: functions
    });

    // add model interaction back to history
    history.push({ role: 'model', content: interaction.outputs });

    for (const output of interaction.outputs) {
        if (output.type === 'function_call') {
            console.log(`Function call: ${output.name} with arguments ${JSON.stringify(output.arguments)}`);

            // 3. Send the result back to the model
            history.push({ role: 'user', content: [{ type: 'function_result', name: output.name, call_id: output.id, result: 'Meeting scheduled successfully.' }] });

            const interaction2 = await client.interactions.create({
                model: 'gemini-3-flash-preview',
                input: history,
            });
            console.log(`Final response: ${interaction2.outputs[interaction2.outputs.length - 1].text}`);
        }
    }

#### Built-in tools

Gemini comes with built-in tools like[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search),[Code execution](https://ai.google.dev/gemini-api/docs/code-execution), and[URL context](https://ai.google.dev/gemini-api/docs/url-context).

##### Grounding with Google search

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Who won the last Super Bowl?",
        tools=[{"type": "google_search"}]
    )
    # Find the text output (not the GoogleSearchResultContent)
    text_output = next((o for o in interaction.outputs if o.type == "text"), None)
    if text_output:
        print(text_output.text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Who won the last Super Bowl?',
        tools: [{ type: 'google_search' }]
    });
    // Find the text output (not the GoogleSearchResultContent)
    const textOutput = interaction.outputs.find(o => o.type === 'text');
    if (textOutput) console.log(textOutput.text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Who won the last Super Bowl?",
        "tools": [{"type": "google_search"}]
    }'

##### Code execution

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Calculate the 50th Fibonacci number.",
        tools=[{"type": "code_execution"}]
    )
    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Calculate the 50th Fibonacci number.',
        tools: [{ type: 'code_execution' }]
    });
    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Calculate the 50th Fibonacci number.",
        "tools": [{"type": "code_execution"}]
    }'

##### URL context

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Summarize the content of https://www.wikipedia.org/",
        tools=[{"type": "url_context"}]
    )
    # Find the text output (not the URLContextResultContent)
    text_output = next((o for o in interaction.outputs if o.type == "text"), None)
    if text_output:
        print(text_output.text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Summarize the content of https://www.wikipedia.org/',
        tools: [{ type: 'url_context' }]
    });
    // Find the text output (not the URLContextResultContent)
    const textOutput = interaction.outputs.find(o => o.type === 'text');
    if (textOutput) console.log(textOutput.text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Summarize the content of https://www.wikipedia.org/",
        "tools": [{"type": "url_context"}]
    }'

### Remote Model context protocol (MCP)

Remote[MCP](https://modelcontextprotocol.io/docs/getting-started/intro)integration simplifies agent development by allowing the Gemini API to directly call external tools hosted on remote servers.  

### Python

    import datetime
    from google import genai

    client = genai.Client()

    mcp_server = {
        "type": "mcp_server",
        "name": "weather_service",
        "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
    }

    today = datetime.date.today().strftime("%d %B %Y")

    interaction = client.interactions.create(
        model="gemini-2.5-flash",
        input="What is the weather like in New York today?",
        tools=[mcp_server],
        system_instruction=f"Today is {today}."
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const mcpServer = {
        type: 'mcp_server',
        name: 'weather_service',
        url: 'https://gemini-api-demos.uc.r.appspot.com/mcp'
    };

    const today = new Date().toDateString();

    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: 'What is the weather like in New York today?',
        tools: [mcpServer],
        system_instruction: `Today is ${today}.`
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-2.5-flash",
        "input": "What is the weather like in New York today?",
        "tools": [{
            "type": "mcp_server",
            "name": "weather_service",
            "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
        }],
        "system_instruction": "Today is '"$(date +"%du%Bt%Y")"' YYYY-MM-DD>."
    }'

**Important notes:**

- Remote MCP only works with Streamable HTTP servers (SSE servers are not supported)
- Remote MCP does not work with Gemini 3 models (this is coming soon)
- MCP server names shouldn't include "-" character (use snake_case server names instead)

### Structured output (JSON schema)

Enforce a specific JSON output by providing a JSON schema in the`response_format`parameter. This is useful for tasks like moderation, classification, or data extraction.  

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import Literal, Union
    client = genai.Client()

    class SpamDetails(BaseModel):
        reason: str = Field(description="The reason why the content is considered spam.")
        spam_type: Literal["phishing", "scam", "unsolicited promotion", "other"]

    class NotSpamDetails(BaseModel):
        summary: str = Field(description="A brief summary of the content.")
        is_safe: bool = Field(description="Whether the content is safe for all audiences.")

    class ModerationResult(BaseModel):
        decision: Union[SpamDetails, NotSpamDetails]

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Moderate the following content: 'Congratulations! You've won a free cruise. Click here to claim your prize: www.definitely-not-a-scam.com'",
        response_format=ModerationResult.model_json_schema(),
    )

    parsed_output = ModerationResult.model_validate_json(interaction.outputs[-1].text)
    print(parsed_output)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import { z } from 'zod';
    const client = new GoogleGenAI({});

    const moderationSchema = z.object({
        decision: z.union([
            z.object({
                reason: z.string().describe('The reason why the content is considered spam.'),
                spam_type: z.enum(['phishing', 'scam', 'unsolicited promotion', 'other']).describe('The type of spam.'),
            }).describe('Details for content classified as spam.'),
            z.object({
                summary: z.string().describe('A brief summary of the content.'),
                is_safe: z.boolean().describe('Whether the content is safe for all audiences.'),
            }).describe('Details for content classified as not spam.'),
        ]),
    });

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: "Moderate the following content: 'Congratulations! You've won a free cruise. Click here to claim your prize: www.definitely-not-a-scam.com'",
        response_format: z.toJSONSchema(moderationSchema),
    });
    console.log(interaction.outputs[0].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Moderate the following content: 'Congratulations! You've won a free cruise. Click here to claim your prize: www.definitely-not-a-scam.com'",
        "response_format": {
            "type": "object",
            "properties": {
                "decision": {
                    "type": "object",
                    "properties": {
                        "reason": {"type": "string", "description": "The reason why the content is considered spam."},
                        "spam_type": {"type": "string", "description": "The type of spam."}
                    },
                    "required": ["reason", "spam_type"]
                }
            },
            "required": ["decision"]
        }
    }'

### Combining tools and structured output

Combine built-in tools with structured output to get a reliable JSON object based on information retrieved by a tool.  

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import Literal, Union

    client = genai.Client()

    class SpamDetails(BaseModel):
        reason: str = Field(description="The reason why the content is considered spam.")
        spam_type: Literal["phishing", "scam", "unsolicited promotion", "other"]

    class NotSpamDetails(BaseModel):
        summary: str = Field(description="A brief summary of the content.")
        is_safe: bool = Field(description="Whether the content is safe for all audiences.")

    class ModerationResult(BaseModel):
        decision: Union[SpamDetails, NotSpamDetails]

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Moderate the following content: 'Congratulations! You've won a free cruise. Click here to claim your prize: www.definitely-not-a-scam.com'",
        response_format=ModerationResult.model_json_schema(),
        tools=[{"type": "url_context"}]
    )

    parsed_output = ModerationResult.model_validate_json(interaction.outputs[-1].text)
    print(parsed_output)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import { z } from 'zod'; // Assuming zod is used for schema generation, or define manually
    const client = new GoogleGenAI({});

    const obj = z.object({
        winning_team: z.string(),
        score: z.string(),
    });
    const schema = z.toJSONSchema(obj);

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Who won the last euro?',
        tools: [{ type: 'google_search' }],
        response_format: schema,
    });
    console.log(interaction.outputs[0].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Who won the last euro?",
        "tools": [{"type": "google_search"}],
        "response_format": {
            "type": "object",
            "properties": {
                "winning_team": {"type": "string"},
                "score": {"type": "string"}
            }
        }
    }'

## Advanced features

There are also additional advance features that give you more flexibility in working with Interactions API.

### Streaming

Receive responses incrementally as they are generated.  

### Python

    from google import genai

    client = genai.Client()

    stream = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Explain quantum entanglement in simple terms.",
        stream=True
    )

    for chunk in stream:
        if chunk.event_type == "content.delta":
            if chunk.delta.type == "text":
                print(chunk.delta.text, end="", flush=True)
            elif chunk.delta.type == "thought":
                print(chunk.delta.thought, end="", flush=True)
        elif chunk.event_type == "interaction.complete":
            print(f"\n\n--- Stream Finished ---")
            print(f"Total Tokens: {chunk.interaction.usage.total_tokens}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const stream = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Explain quantum entanglement in simple terms.',
        stream: true,
    });

    for await (const chunk of stream) {
        if (chunk.event_type === 'content.delta') {
            if (chunk.delta.type === 'text' && 'text' in chunk.delta) {
                process.stdout.write(chunk.delta.text);
            } else if (chunk.delta.type === 'thought' && 'thought' in chunk.delta) {
                process.stdout.write(chunk.delta.thought);
            }
        } else if (chunk.event_type === 'interaction.complete') {
            console.log('\n\n--- Stream Finished ---');
            console.log(`Total Tokens: ${chunk.interaction.usage.total_tokens}`);
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Explain quantum entanglement in simple terms.",
        "stream": true
    }'

### Configuration

Customize the model's behavior with`generation_config`.  

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Tell me a story about a brave knight.",
        generation_config={
            "temperature": 0.7,
            "max_output_tokens": 500,
            "thinking_level": "low",
        }
    )

    print(interaction.outputs[-1].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'Tell me a story about a brave knight.',
        generation_config: {
            temperature: 0.7,
            max_output_tokens: 500,
            thinking_level: 'low',
        }
    });

    console.log(interaction.outputs[interaction.outputs.length - 1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "Tell me a story about a brave knight.",
        "generation_config": {
            "temperature": 0.7,
            "max_output_tokens": 500,
            "thinking_level": "low"
        }
    }'

The`thinking_level`parameter lets you control the model's reasoning behavior for all Gemini 2.5 and newer models.

|   Level   |                                                                       Description                                                                       |              Supported Models               |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `minimal` | Matches the "no thinking" setting for most queries. In some cases, models may think very minimally. Minimizes latency and cost.                         | **Flash Models Only** (e.g. Gemini 3 Flash) |
| `low`     | Light reasoning that prioritises latency and cost savings for simple instruction following and chat.                                                    | **All Thinking Models**                     |
| `medium`  | Balanced thinking for most tasks.                                                                                                                       | **Flash Models Only** (e.g. Gemini 3 Flash) |
| `high`    | **(Default)**Maximizes reasoning depth. The model may take significantly longer to reach a first token, but the output will be more carefully reasoned. | **All Thinking Models**                     |

### Working with files

#### Working with remote files

Access files using remote URLs directly in the API call.  

### Python

    from google import genai
    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {
                "type": "image",
                "uri": "https://github.com/<github-path>/cats-and-dogs.jpg",
            },
            {"type": "text", "text": "Describe what you see."}
        ],
    )
    for output in interaction.outputs:
        if output.type == "text":
            print(output.text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            {
                type: 'image',
                uri: 'https://github.com/<github-path>/cats-and-dogs.jpg',
            },
            { type: 'text', text: 'Describe what you see.' }
        ],
    });
    for (const output of interaction.outputs) {
        if (output.type === 'text') {
            console.log(output.text);
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {
                "type": "image",
                "uri": "https://github.com/<github-path>/cats-and-dogs.jpg"
            },
            {"type": "text", "text": "Describe what you see."}
        ]
    }'

#### Working with Gemini Files API

Upload files to the Gemini[Files API](https://ai.google.dev/gemini-api/docs/files)before using them.  

### Python

    from google import genai
    import time
    import requests
    client = genai.Client()

    # 1. Download the file
    url = "https://github.com/philschmid/gemini-samples/raw/refs/heads/main/assets/cats-and-dogs.jpg"
    response = requests.get(url)
    with open("cats-and-dogs.jpg", "wb") as f:
        f.write(response.content)

    # 2. Upload to Gemini Files API
    file = client.files.upload(file="cats-and-dogs.jpg")

    # 3. Wait for processing
    while client.files.get(name=file.name).state != "ACTIVE":
        time.sleep(2)

    # 4. Use in Interaction
    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {
                "type": "image",
                "uri": file.uri,
            },
            {"type": "text", "text": "Describe what you see."}
        ],
    )
    for output in interaction.outputs:
        if output.type == "text":
            print(output.text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    import * as fs from 'fs';
    import fetch from 'node-fetch';
    const client = new GoogleGenAI({});

    // 1. Download the file
    const url = 'https://github.com/philschmid/gemini-samples/raw/refs/heads/main/assets/cats-and-dogs.jpg';
    const filename = 'cats-and-dogs.jpg';
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filename, buffer);

    // 2. Upload to Gemini Files API
    const myfile = await client.files.upload({ file: filename, config: { mimeType: 'image/jpeg' } });

    // 3. Wait for processing
    while ((await client.files.get({ name: myfile.name })).state !== 'ACTIVE') {
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 4. Use in Interaction
    const interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: [
            { type: 'image', uri: myfile.uri, },
            { type: 'text', text: 'Describe what you see.' }
        ],
    });
    for (const output of interaction.outputs) {
        if (output.type === 'text') {
            console.log(output.text);
        }
    }

### REST

    # 1. Upload the file (Requires File API setup)
    # See https://ai.google.dev/gemini-api/docs/files for details.
    # Assume FILE_URI is obtained from the upload step.

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": [
            {"type": "image", "uri": "FILE_URI"},
            {"type": "text", "text": "Describe what you see."}
        ]
    }'

### Data model

You can learn more about the data model in the[API Reference](https://ai.google.dev/api/interactions-api#data-models). The following is a high level overview of the main components.

#### Interaction

|         Property          |                                   Type                                   |                                Description                                 |
|---------------------------|--------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `id`                      | `string`                                                                 | Unique identifier for the interaction.                                     |
| `model`/`agent`           | `string`                                                                 | The model or agent used. Only one can be provided.                         |
| `input`                   | [`Content[]`](https://ai.google.dev/api/interactions-api#data-models)    | The inputs provided.                                                       |
| `outputs`                 | [`Content[]`](https://ai.google.dev/api/interactions-api#data-models)    | The model's responses.                                                     |
| `tools`                   | [`Tool[]`](https://ai.google.dev/api/interactions-api#Resource:Tool)     | The tools used.                                                            |
| `previous_interaction_id` | `string`                                                                 | ID of the previous interaction for context.                                |
| `stream`                  | `boolean`                                                                | Whether the interaction is streaming.                                      |
| `status`                  | `string`                                                                 | Status:`completed`,`in_progress`,`requires_action`,`failed`, etc.          |
| `background`              | `boolean`                                                                | Whether the interaction is in background mode.                             |
| `store`                   | `boolean`                                                                | Whether to store the interaction. Default:`true`. Set to`false`to opt out. |
| `usage`                   | [Usage](https://ai.google.dev/api/interactions-api#Resource:Interaction) | Token usage of the interaction request.                                    |

## Supported models \& agents

|       Model Name       | Type  |              Model ID               |
|------------------------|-------|-------------------------------------|
| Gemini 2.5 Pro         | Model | `gemini-2.5-pro`                    |
| Gemini 2.5 Flash       | Model | `gemini-2.5-flash`                  |
| Gemini 2.5 Flash-lite  | Model | `gemini-2.5-flash-lite`             |
| Gemini 3 Pro Preview   | Model | `gemini-3-pro-preview`              |
| Gemini 3 Flash Preview | Model | `gemini-3-flash-preview`            |
| Deep Research Preview  | Agent | `deep-research-pro-preview-12-2025` |

## How the Interactions API works

The Interactions API is designed around a central resource: the[**`Interaction`**](https://ai.google.dev/api/interactions-api#Resource:Interaction). An`Interaction`represents a complete turn in a conversation or task. It acts as a session record, containing the entire history of an interaction, including all user inputs, model thoughts, tool calls, tool results, and final model outputs.

When you make a call to[`interactions.create`](https://ai.google.dev/api/interactions-api#CreateInteraction), you are creating a new`Interaction`resource.

Optionally, you can use the`id`of this resource in a subsequent call using the`previous_interaction_id`parameter to continue the conversation. The server uses this ID to retrieve the full context, saving you from having to resend the entire chat history. This server-side state management is optional; you can also operate in stateless mode by sending the full conversation history in each request.

### Data storage and retention

By default, all Interaction objects are stored (`store=true`) in order to simplify use of server-side state management features (with`previous_interaction_id`), background execution (using`background=true`) and observability purposes.

- **Paid Tier** : Interactions are retained for**55 days**.
- **Free Tier** : Interactions are retained for**1 day**.

If you do not want this, you can set`store=false`in your request. This control is separate from state management; you can opt out of storage for any interaction. However, note that`store=false`is incompatible with`background=true`and prevents using`previous_interaction_id`for subsequent turns.

You can delete stored interactions at any time using the delete method found in the[API Reference](https://ai.google.dev/api/interactions-api). You can only delete interactions if you know the interaction ID.

After the retention period expires, your data will be deleted automatically.

Interactions objects are processed according to the[terms](https://ai.google.dev/gemini-api/terms).

## Best practices

- **Cache hit rate** : Using`previous_interaction_id`to continue conversations allows the system to more easily utilize implicit caching for the conversation history, which improves performance and reduces costs.
- **Mixing interactions** : You have the flexibility to mix and match Agent and Model interactions within a conversation. For instance, you can use a specialized agent, like the Deep Research agent, for initial data collection, and then use a standard Gemini model for follow-up tasks such as summarizing or reformatting, linking these steps with the`previous_interaction_id`.

## SDKs

You can use latest version of the Google GenAI SDKs in order to access Interactions API.

- On Python, this is`google-genai`package from`1.55.0`version onwards.
- On JavaScript, this is`@google/genai`package from`1.33.0`version onwards.

You can learn more about how to install the SDKs on[Libraries](https://ai.google.dev/gemini-api/docs/libraries)page.

## Limitations

- **Beta status**: The Interactions API is in beta/preview. Features and schemas may change.
- **Unsupported features**: The following features are not yet supported but are coming soon:

  - [Grounding with Google Maps](https://ai.google.dev/gemini-api/docs/maps-grounding)
  - [Computer Use](https://ai.google.dev/gemini-api/docs/computer-use)
- **Output ordering** : Content ordering for built-in tools (`google_search`and`url_context`) may sometimes be incorrect, with text appearing before the tool execution and result. This is a known issue and a fix is in progress.

- **Tool combinations**: Combining MCP, Function Call, and Built-in tools is not yet supported but is coming soon.

- **Remote MCP**: Gemini 3 does not support remote mcp, this is coming soon.

## Breaking changes

The Interactions API is currently in an early beta stage. We are actively developing and refining the API capabilities, resource schemas, and SDK interfaces based on real-world usage and developer feedback.

As a result,**breaking changes may occur**. Updates may include changes to:

- Schemas for input and output.
- SDK method signatures and object structures.
- Specific feature behaviors.

For production workloads, you should continue to use the standard[`generateContent`](https://ai.google.dev/gemini-api/docs/text-generation)API. It remains the recommended path for stable deployments and will continue to be actively developed and maintained.

## Feedback

Your feedback is critical to the development of the Interactions API. Please share your thoughts, report bugs, or request features on our[Google AI Developer Community Forum](https://discuss.ai.google.dev/c/gemini-api/4).

## What's next

- Learn more about the[Gemini Deep Research Agent](https://ai.google.dev/gemini-api/docs/deep-research).

<br />

<br />

| We have updated our[Terms of Service](https://ai.google.dev/gemini-api/terms).

Imagen is Google's high-fidelity image generation model, capable of generating realistic and high quality images from text prompts. All generated images include a SynthID watermark. To learn more about the available Imagen model variants, see the[Model versions](https://ai.google.dev/gemini-api/docs/imagen#model-versions)section.
| **Note:** You can also generate images with Gemini's built-in multimodal capabilities. See the[Image generation guide](https://ai.google.dev/gemini-api/docs/image-generation)for details.

## Generate images using the Imagen models

This example demonstrates generating images with an[Imagen model](https://deepmind.google/technologies/imagen-3/):  

### Python

    from google import genai
    from google.genai import types
    from PIL import Image
    from io import BytesIO

    client = genai.Client()

    response = client.models.generate_images(
        model='imagen-4.0-generate-001',
        prompt='Robot holding a red skateboard',
        config=types.GenerateImagesConfig(
            number_of_images= 4,
        )
    )
    for generated_image in response.generated_images:
      generated_image.image.show()

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: 'Robot holding a red skateboard',
        config: {
          numberOfImages: 4,
        },
      });

      let idx = 1;
      for (const generatedImage of response.generatedImages) {
        let imgBytes = generatedImage.image.imageBytes;
        const buffer = Buffer.from(imgBytes, "base64");
        fs.writeFileSync(`imagen-${idx}.png`, buffer);
        idx++;
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      config := &genai.GenerateImagesConfig{
          NumberOfImages: 4,
      }

      response, _ := client.Models.GenerateImages(
          ctx,
          "imagen-4.0-generate-001",
          "Robot holding a red skateboard",
          config,
      )

      for n, image := range response.GeneratedImages {
          fname := fmt.Sprintf("imagen-%d.png", n)
              _ = os.WriteFile(fname, image.Image.ImageBytes, 0644)
      }
    }

### REST

    curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "instances": [
              {
                "prompt": "Robot holding a red skateboard"
              }
            ],
            "parameters": {
              "sampleCount": 4
            }
          }'

![AI-generated image of a robot holding a red skateboard](https://ai.google.dev/static/gemini-api/docs/images/robot-skateboard.png)AI-generated image of a robot holding a red skateboard

### Imagen configuration

Imagen supports English only prompts at this time and the following parameters:
| **Note:** Naming conventions of parameters vary by programming language.

- `numberOfImages`: The number of images to generate, from 1 to 4 (inclusive). The default is 4.
- `imageSize`: The size of the generated image. This is only supported for the Standard and Ultra models. The supported values are`1K`and`2K`. Default is`1K`.
- `aspectRatio`: Changes the aspect ratio of the generated image. Supported values are`"1:1"`,`"3:4"`,`"4:3"`,`"9:16"`, and`"16:9"`. The default is`"1:1"`.
- `personGeneration`: Allow the model to generate images of people. The following values are supported:

  - `"dont_allow"`: Block generation of images of people.
  - `"allow_adult"`: Generate images of adults, but not children. This is the default.
  - `"allow_all"`: Generate images that include adults and children.

  | **Note:** The`"allow_all"`parameter value is not allowed in EU, UK, CH, MENA locations.

## Imagen prompt guide

This section of the Imagen guide shows you how modifying a text-to-image prompt can produce different results, along with examples of images you can create.

### Prompt writing basics

| **Note:** Maximum prompt length is 480 tokens.

A good prompt is descriptive and clear, and makes use of meaningful keywords and modifiers. Start by thinking of your**subject** ,**context** , and**style**.
![Prompt with subject, context, and style emphasized](https://ai.google.dev/static/gemini-api/docs/images/imagen/style-subject-context.png)Image text: A*sketch* (**style** ) of a*modern apartment building* (**subject** ) surrounded by*skyscrapers* (**context and background**).

1. **Subject** : The first thing to think about with any prompt is the*subject*: the object, person, animal, or scenery you want an image of.

2. **Context and background:** Just as important is the*background or context*in which the subject will be placed. Try placing your subject in a variety of backgrounds. For example, a studio with a white background, outdoors, or indoor environments.

3. **Style:** Finally, add the style of image you want.*Styles*can be general (painting, photograph, sketches) or very specific (pastel painting, charcoal drawing, isometric 3D). You can also combine styles.

After you write a first version of your prompt, refine your prompt by adding more details until you get to the image that you want. Iteration is important. Start by establishing your core idea, and then refine and expand upon that core idea until the generated image is close to your vision.

|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![photorealistic sample image 1](https://ai.google.dev/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_short.png)Prompt: A park in the spring next to a lake | ![photorealistic sample image 2](https://ai.google.dev/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_medium.png)Prompt: A park in the spring next to a lake,**the sun sets across the lake, golden hour** | ![photorealistic sample image 3](https://ai.google.dev/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_long.png)Prompt: A park in the spring next to a lake,***the sun sets across the lake, golden hour, red wildflowers*** |

Imagen models can transform your ideas into detailed images, whether your prompts are short or long and detailed. Refine your vision through iterative prompting, adding details until you achieve the perfect result.

|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Short prompts let you generate an image quickly. ![Imagen 3 short prompt example](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_short-prompt.png)Prompt: close-up photo of a woman in her 20s, street photography, movie still, muted orange warm tones | Longer prompts let you add specific details and build your image. ![Imagen 3 long prompt example](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_long-prompt.png)Prompt: captivating photo of a woman in her 20s utilizing a street photography style. The image should look like a movie still with muted orange warm tones. |

Additional advice for Imagen prompt writing:

- **Use descriptive language**: Employ detailed adjectives and adverbs to paint a clear picture for Imagen.
- **Provide context**: If necessary, include background information to aid the AI's understanding.
- **Reference specific artists or styles**: If you have a particular aesthetic in mind, referencing specific artists or art movements can be helpful.
- **Use prompt engineering tools**: Consider exploring prompt engineering tools or resources to help you refine your prompts and achieve optimal results.
- **Enhancing the facial details in your personal and group images**: Specify facial details as a focus of the photo (for example, use the word "portrait" in the prompt).

### Generate text in images

Imagen models can add text into images, opening up more creative image generation possibilities. Use the following guidance to get the most out of this feature:

- **Iterate with confidence**: You might have to regenerate images until you achieve the look you want. Imagen's text integration is still evolving, and sometimes multiple attempts yield the best results.
- **Keep it short**: Limit text to 25 characters or less for optimal generation.
- **Multiple phrases**: Experiment with two or three distinct phrases to provide additional information. Avoid exceeding three phrases for cleaner compositions.

  ![Imagen 3 generate text example](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_generate-text.png)Prompt: A poster with the text "Summerland" in bold font as a title, underneath this text is the slogan "Summer never felt so good"
- **Guide Placement**: While Imagen can attempt to position text as directed, expect occasional variations. This feature is continually improving.

- **Inspire font style**: Specify a general font style to subtly influence Imagen's choices. Don't rely on precise font replication, but expect creative interpretations.

- **Font size** : Specify a font size or a general indication of size (for example,*small* ,*medium* ,*large*) to influence the font size generation.

### Prompt parameterization

To better control output results, you might find it helpful to parameterize the inputs into Imagen. For example, suppose you want your customers to be able to generate logos for their business, and you want to make sure logos are always generated on a solid color background. You also want to limit the options that the client can select from a menu.

In this example, you can create a parameterized prompt similar to the following:  

```
A {logo_style} logo for a {company_area} company on a solid color background. Include the text {company_name}.
```

In your custom user interface, the customer can input the parameters using a menu, and their chosen value populates the prompt Imagen receives.

For example:

1. Prompt:`A `<var translate="no">minimalist</var>` logo for a `<var translate="no">health care</var>` company on a solid color background. Include the text `<var translate="no">Journey</var>`.`

   ![Imagen 3 prompt parameterization example 1](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_prompt-param_healthcare.png)
2. Prompt:`A `<var translate="no">modern</var>` logo for a `<var translate="no">software</var>` company on a solid color background. Include the text `<var translate="no">Silo</var>`.`

   ![Imagen 3 prompt parameterization example 2](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_prompt-param_software.png)
3. Prompt:`A `<var translate="no">traditional</var>` logo for a `<var translate="no">baking</var>` company on a solid color background. Include the text `<var translate="no">Seed</var>`.`

   ![Imagen 3 prompt parameterization example 3](https://ai.google.dev/static/gemini-api/docs/images/imagen/imagen3_prompt-param_baking.png)

### Advanced prompt writing techniques

Use the following examples to create more specific prompts based on attributes like photography descriptors, shapes and materials, historical art movements, and image quality modifiers.

#### Photography

- Prompt includes:*"A photo of..."*

To use this style, start with using keywords that clearly tell Imagen that you're looking for a photograph. Start your prompts with*"A photo of. . ."*. For example:

|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![photorealistic sample image 1](https://ai.google.dev/static/gemini-api/docs/images/imagen/1_style-photography_coffee-beans.png)Prompt:**A photo of**coffee beans in a kitchen on a wooden surface | ![photorealistic sample image 2](https://ai.google.dev/static/gemini-api/docs/images/imagen/1_style-photography_chocolate-bar.png)Prompt:**A photo of**a chocolate bar on a kitchen counter | ![photorealistic sample image 3](https://ai.google.dev/static/gemini-api/docs/images/imagen/1_style-photography_modern-building.png)Prompt:**A photo of**a modern building with water in the background |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.^

##### Photography modifiers

In the following examples, you can see several photography-specific modifiers and parameters. You can combine multiple modifiers for more precise control.

1. **Camera Proximity** -*Close up, taken from far away*

   <br />

   |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![close up camera sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/3_camera-proximity_close-up.png)Prompt: A**close-up**photo of coffee beans | ![zoomed out camera sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/3_camera-proximity_zoomed-out.png)Prompt: A**zoomed out** photo of a small bag of coffee beans in a messy kitchen |

   <br />

2. **Camera Position** -*aerial, from below*

   |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![aerial photo sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/4_camera-position_aerial-photo.png)Prompt:**aerial photo**of urban city with skyscrapers | ![a view from underneath sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/4_camera-position_from-below.png)Prompt: A photo of a forest canopy with blue skies**from below** |

3. **Lighting** -*natural, dramatic, warm, cold*

   |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![natural lighting sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/5_lighting_natural-lighting.png)Prompt: studio photo of a modern arm chair,**natural lighting** | ![dramatic lighting sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/5_lighting_dramatic-lighting.png)Prompt: studio photo of a modern arm chair,**dramatic lighting** |

4. **Camera Settings** *- motion blur, soft focus, bokeh, portrait*

   |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![motion blur sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/6_camera-settings_motion-blur.png)Prompt: photo of a city with skyscrapers from the inside of a car with**motion blur** | ![soft focus sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/6_camera-settings_soft-focus.png)Prompt:**soft focus**photograph of a bridge in an urban city at night |

5. **Lens types** -*35mm, 50mm, fisheye, wide angle, macro*

   |----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![macro lens sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/7_lens-types_macro-lens.png)Prompt: photo of a leaf,**macro lens** | ![fisheye lens sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/7_lens-types_fisheye-lens.png)Prompt: street photography, new york city,**fisheye lens** |

6. **Film types** -*black and white, polaroid*

   |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![polaroid photo sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/8_film-types_polaroid-portrait.png)Prompt: a**polaroid portrait**of a dog wearing sunglasses | ![black and white photo sample image](https://ai.google.dev/static/gemini-api/docs/images/imagen/8_film-types_bw-photo.png)Prompt:**black and white photo**of a dog wearing sunglasses |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.^

### Illustration and art

- Prompt includes:*"A<var translate="no">painting</var>of..."* ,*"A<var translate="no">sketch</var>of..."*

Art styles vary from monochrome styles like pencil sketches, to hyper-realistic digital art. For example, the following images use the same prompt with different styles:

*"An<var translate="no">[art style or creation technique]</var>of an angular sporty electric sedan with skyscrapers in the background"*

|------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration1A.png)Prompt: A**technical pencil drawing**of an angular... | ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration1B.png)Prompt: A**charcoal drawing**of an angular... | ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration1C.png)Prompt: A**color pencil drawing**of an angular... |

|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration2E.png)Prompt: A**pastel painting**of an angular... | ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration2F.png)Prompt: A**digital art**of an angular... | ![art sample images](https://ai.google.dev/static/gemini-api/docs/images/imagen/2_style-illustration2G.png)Prompt: An**art deco (poster)**of an angular... |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 2 model.^

##### Shapes and materials

- Prompt includes:*"...made of..."* ,*"...in the shape of..."*

One of the strengths of this technology is that you can create imagery that is otherwise difficult or impossible. For example, you can recreate your company logo in different materials and textures.

|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![shapes and materials example image 1](https://ai.google.dev/static/gemini-api/docs/images/imagen/9_shapes-materials_duffel.png)Prompt: a duffle bag**made of**cheese | ![shapes and materials example image 2](https://ai.google.dev/static/gemini-api/docs/images/imagen/9_shapes-materials_bird.png)Prompt: neon tubes**in the shape**of a bird | ![shapes and materials example image 3](https://ai.google.dev/static/gemini-api/docs/images/imagen/9_shapes-materials_paper.png)Prompt: an armchair**made of paper**, studio photo, origami style |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.^

#### Historical art references

- Prompt includes:*"...in the style of..."*

Certain styles have become iconic over the years. The following are some ideas of historical painting or art styles that you can try.

*"generate an image in the style of<var translate="no">[art period or movement]</var>: a wind farm"*

|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![impressionism example image](https://ai.google.dev/static/gemini-api/docs/images/imagen/10_historical-ref1_impressionism.png)Prompt: generate an image**in the style of*an impressionist painting***: a wind farm | ![renaissance example image](https://ai.google.dev/static/gemini-api/docs/images/imagen/10_historical-ref1_renaissance.png)Prompt: generate an image**in the style of*a renaissance painting***: a wind farm | ![pop art example image](https://ai.google.dev/static/gemini-api/docs/images/imagen/10_historical-ref1_pop-art.png)Prompt: generate an image**in the style of*pop art***: a wind farm |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.^

#### Image quality modifiers

Certain keywords can let the model know that you're looking for a high-quality asset. Examples of quality modifiers include the following:

- **General Modifiers** -*high-quality, beautiful, stylized*
- **Photos** -*4K, HDR, Studio Photo*
- **Art, Illustration** -*by a professional, detailed*

The following are a few examples of prompts without quality modifiers and the same prompt with quality modifiers.

|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![corn example image without modifiers](https://ai.google.dev/static/gemini-api/docs/images/imagen/11_quality-modifier2_no-mods.png)Prompt (no quality modifiers): a photo of a corn stalk | ![corn example image with modifiers](https://ai.google.dev/static/gemini-api/docs/images/imagen/11_quality-modifier2_4k-hdr.png)Prompt (with quality modifiers):**4k HDR beautiful** photo of a corn stalk**taken by a professional photographer** |

^Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.^

#### Aspect ratios

Imagen image generation lets you set five distinct image aspect ratios.

1. **Square**(1:1, default) - A standard square photo. Common uses for this aspect ratio include social media posts.
2. **Fullscreen**(4:3) - This aspect ratio is commonly used in media or film. It is also the dimensions of most old (non-widescreen) TVs and medium format cameras. It captures more of the scene horizontally (compared to 1:1), making it a preferred aspect ratio for photography.

   |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_4-3_piano.png)Prompt: close up of a musician's fingers playing the piano, black and white film, vintage (4:3 aspect ratio) | ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_4-3_fries.png)Prompt: A professional studio photo of french fries for a high end restaurant, in the style of a food magazine (4:3 aspect ratio) |

3. **Portrait full screen**(3:4) - This is the fullscreen aspect ratio rotated 90 degrees. This lets to capture more of the scene vertically compared to the 1:1 aspect ratio.

   |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_3-4_hiking.png)Prompt: a woman hiking, close of her boots reflected in a puddle, large mountains in the background, in the style of an advertisement, dramatic angles (3:4 aspect ratio) | ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_3-4_valley.png)Prompt: aerial shot of a river flowing up a mystical valley (3:4 aspect ratio) |

4. **Widescreen**(16:9) - This ratio has replaced 4:3 and is now the most common aspect ratio for TVs, monitors, and mobile phone screens (landscape). Use this aspect ratio when you want to capture more of the background (for example, scenic landscapes).

   ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_16-9_man.png)Prompt: a man wearing all white clothing sitting on the beach, close up, golden hour lighting (16:9 aspect ratio)
5. **Portrait**(9:16) - This ratio is widescreen but rotated. This a relatively new aspect ratio that has been popularized by short form video apps (for example, YouTube shorts). Use this for tall objects with strong vertical orientations such as buildings, trees, waterfalls, or other similar objects.

   ![aspect ratio example](https://ai.google.dev/static/gemini-api/docs/images/imagen/aspect-ratios_9-16_skyscraper.png)Prompt: a digital render of a massive skyscraper, modern, grand, epic with a beautiful sunset in the background (9:16 aspect ratio)

#### Photorealistic images

Different versions of the image generation model might offer a mix of artistic and photorealistic output. Use the following wording in prompts to generate more photorealistic output, based on the subject you want to generate.
| **Note:** Take these keywords as general guidance when you try to create photorealistic images. They aren't required to achieve your goal.

|                  Use case                   |   Lens type    | Focal lengths |                              Additional details                               |
|---------------------------------------------|----------------|---------------|-------------------------------------------------------------------------------|
| People (portraits)                          | Prime, zoom    | 24-35mm       | black and white film, Film noir, Depth of field, duotone (mention two colors) |
| Food, insects, plants (objects, still life) | Macro          | 60-105mm      | High detail, precise focusing, controlled lighting                            |
| Sports, wildlife (motion)                   | Telephoto zoom | 100-400mm     | Fast shutter speed, Action or movement tracking                               |
| Astronomical, landscape (wide-angle)        | Wide-angle     | 10-24mm       | Long exposure times, sharp focus, long exposure, smooth water or clouds       |

##### Portraits

|      Use case      |  Lens type  | Focal lengths |                              Additional details                               |
|--------------------|-------------|---------------|-------------------------------------------------------------------------------|
| People (portraits) | Prime, zoom | 24-35mm       | black and white film, Film noir, Depth of field, duotone (mention two colors) |

Using several keywords from the table, Imagen can generate the following portraits:

|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_blue-gray1.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_blue-gray2.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_blue-gray3.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_blue-gray4.png) |

Prompt:*A woman, 35mm portrait, blue and grey duotones*   
Model:`imagen-3.0-generate-002`

|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_film-noir1.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_film-noir2.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_film-noir3.png) | ![portrait photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/portrait_film-noir4.png) |

Prompt:*A woman, 35mm portrait, film noir*   
Model:`imagen-3.0-generate-002`

##### Objects

|                  Use case                   | Lens type | Focal lengths |                 Additional details                 |
|---------------------------------------------|-----------|---------------|----------------------------------------------------|
| Food, insects, plants (objects, still life) | Macro     | 60-105mm      | High detail, precise focusing, controlled lighting |

Using several keywords from the table, Imagen can generate the following object images:

|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_leaf1.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_leaf2.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_leaf3.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_leaf4.png) |

Prompt:*leaf of a prayer plant, macro lens, 60mm*   
Model:`imagen-3.0-generate-002`

|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_pasta1.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_pasta2.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_pasta3.png) | ![object photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/object_pasta4.png) |

Prompt:*a plate of pasta, 100mm Macro lens*   
Model:`imagen-3.0-generate-002`

##### Motion

|         Use case          |   Lens type    | Focal lengths |               Additional details                |
|---------------------------|----------------|---------------|-------------------------------------------------|
| Sports, wildlife (motion) | Telephoto zoom | 100-400mm     | Fast shutter speed, Action or movement tracking |

Using several keywords from the table, Imagen can generate the following motion images:

|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_football1.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_football2.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_football3.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_football4.png) |

Prompt:*a winning touchdown, fast shutter speed, movement tracking*   
Model:`imagen-3.0-generate-002`

|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_deer1.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_deer2.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_deer3.png) | ![motion photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/motion_deer4.png) |

Prompt:*A deer running in the forest, fast shutter speed, movement tracking*   
Model:`imagen-3.0-generate-002`

##### Wide-angle

|               Use case               | Lens type  | Focal lengths |                           Additional details                            |
|--------------------------------------|------------|---------------|-------------------------------------------------------------------------|
| Astronomical, landscape (wide-angle) | Wide-angle | 10-24mm       | Long exposure times, sharp focus, long exposure, smooth water or clouds |

Using several keywords from the table, Imagen can generate the following wide-angle images:

|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_mountain1.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_mountain2.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_mountain3.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_mountain4.png) |

Prompt:*an expansive mountain range, landscape wide angle 10mm*   
Model:`imagen-3.0-generate-002`

|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_astro1.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_astro2.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_astro3.png) | ![wide-angle photography example](https://ai.google.dev/static/gemini-api/docs/images/imagen/wide-angle_astro4.png) |

Prompt:*a photo of the moon, astro photography, wide angle 10mm*   
Model:`imagen-3.0-generate-002`

## Model versions

### Imagen 4

|                                    Property                                    |                                               Description                                               |
|--------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| id_cardModel code                                                              | **Gemini API** `imagen-4.0-generate-001` `imagen-4.0-ultra-generate-001` `imagen-4.0-fast-generate-001` |
| saveSupported data types                                                       | **Input** Text **Output** Images                                                                        |
| token_autoToken limits^[\[\*\]](https://ai.google.dev/gemini-api/docs/tokens)^ | **Input token limit** 480 tokens (text) **Output images** 1 to 4 (Ultra/Standard/Fast)                  |
| calendar_monthLatest update                                                    | June 2025                                                                                               |

### Imagen 3

|                                    Property                                    |                     Description                     |
|--------------------------------------------------------------------------------|-----------------------------------------------------|
| id_cardModel code                                                              | **Gemini API** `imagen-3.0-generate-002`            |
| saveSupported data types                                                       | **Input** Text **Output** Images                    |
| token_autoToken limits^[\[\*\]](https://ai.google.dev/gemini-api/docs/tokens)^ | **Input token limit** N/A **Output images** Up to 4 |
| calendar_monthLatest update                                                    | February 2025                                       |


<br />

<br />

Gemini can generate and process images conversationally. You can prompt either the[fast Gemini 2.5 Flash (aka Nano Banana) or the advanced Gemini 3 Pro Preview (aka Nano Banana Pro)](https://ai.google.dev/gemini-api/docs/image-generation#model-selection)image models with text, images, or a combination of both, allowing you to create, edit, and iterate on visuals with unprecedented control:

- **Text, Image, and Multi-Image to Image:**Generate high-quality images from text descriptions, use text prompts to edit and adjust a given image, or use multiple input images to compose new scenes and transfer styles.
- **Iterative refinement:**Conversationally refine your image over multiple turns, making small adjustments until it's perfect.
- **High-Fidelity text rendering:**Accurately generate images that contain legible and well-placed text, ideal for logos, diagrams, and posters.

All generated images include a[SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Image generation (text-to-image)

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    prompt = (
        "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("generated_image.png")

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          genai.Text("Create a picture of a nano banana dish in a " +
                     " fancy restaurant with a Gemini theme"),
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "gemini_generated_image.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class TextToImage {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("_01_generated_image.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }]
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > gemini-native-image.png

![AI-generated image of a nano banana dish](https://ai.google.dev/static/gemini-api/docs/images/nano-banana.png)AI-generated image of a nano banana dish in a Gemini-themed restaurant

## Image editing (text-and-image-to-image)

**Reminder** : Make sure you have the necessary rights to any images you upload. Don't generate content that infringe on others' rights, including videos or images that deceive, harass, or harm. Your use of this generative AI service is subject to our[Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy).

Provide an image and use text prompts to add, remove, or modify elements, change the style, or adjust the color grading.

The following example demonstrates uploading base64 encoded images. For multiple images, larger payloads, and supported MIME types, check the[Image understanding](https://ai.google.dev/gemini-api/docs/image-understanding)page.  

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    prompt = (
        "Create a picture of my cat eating a nano-banana in a "
        "fancy restaurant under the Gemini constellation",
    )

    image = Image.open("/path/to/cat_image.png")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt, image],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("generated_image.png")

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "path/to/cat_image.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        { text: "Create a picture of my cat eating a nano-banana in a" +
                "fancy restaurant under the Gemini constellation" },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }

    main();

### Go

    package main

    import (
     "context"
     "fmt"
     "log"
     "os"
     "google.golang.org/genai"
    )

    func main() {

     ctx := context.Background()
     client, err := genai.NewClient(ctx, nil)
     if err != nil {
         log.Fatal(err)
     }

     imagePath := "/path/to/cat_image.png"
     imgData, _ := os.ReadFile(imagePath)

     parts := []*genai.Part{
       genai.NewPartFromText("Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"),
       &genai.Part{
         InlineData: &genai.Blob{
           MIMEType: "image/png",
           Data:     imgData,
         },
       },
     }

     contents := []*genai.Content{
       genai.NewContentFromParts(parts, genai.RoleUser),
     }

     result, _ := client.Models.GenerateContent(
         ctx,
         "gemini-2.5-flash-image",
         contents,
     )

     for _, part := range result.Candidates[0].Content.Parts {
         if part.Text != "" {
             fmt.Println(part.Text)
         } else if part.InlineData != nil {
             imageBytes := part.InlineData.Data
             outputFilename := "gemini_generated_image.png"
             _ = os.WriteFile(outputFilename, imageBytes, 0644)
         }
     }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class TextAndImageToImage {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromText("""
                      Create a picture of my cat eating a nano-banana in
                      a fancy restaurant under the Gemini constellation
                      """),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("src/main/resources/cat.jpg")),
                      "image/jpeg")),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("gemini_generated_image.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    IMG_PATH=/path/to/cat_image.jpeg

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"'Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation\"},
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/jpeg\",
                    \"data\": \"$IMG_BASE64\"
                  }
                }
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > gemini-edited-image.png

![AI-generated image of a cat eating anano banana](https://ai.google.dev/static/gemini-api/docs/images/cat-banana.png)AI-generated image of a cat eating a nano banana

### Multi-turn image editing

Keep generating and editing images conversationally. Chat or multi-turn conversation is the recommended way to iterate on images. The following example shows a prompt to generate an infographic about photosynthesis.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    chat = client.chats.create(
        model="gemini-3-pro-image-preview",
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            tools=[{"google_search": {}}]
        )
    )

    message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

    response = chat.send_message(message)

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("photosynthesis.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const chat = ai.chats.create({
        model: "gemini-3-pro-image-preview",
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          tools: [{googleSearch: {}}],
        },
      });

    await main();

    const message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

    let response = await chat.sendMessage({message});

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("photosynthesis.png", buffer);
          console.log("Image saved as photosynthesis.png");
        }
    }

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3-pro-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
        }
        chat := model.StartChat()

        message := "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

        resp, err := chat.SendMessage(ctx, genai.Text(message))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("photosynthesis.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Chat;
    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.RetrievalConfig;
    import com.google.genai.types.Tool;
    import com.google.genai.types.ToolConfig;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class MultiturnImageEditing {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {

          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .tools(Tool.builder()
                  .googleSearch(GoogleSearch.builder().build())
                  .build())
              .build();

          Chat chat = client.chats.create("gemini-3-pro-image-preview", config);

          GenerateContentResponse response = chat.sendMessage("""
              Create a vibrant infographic that explains photosynthesis
              as if it were a recipe for a plant's favorite food.
              Show the "ingredients" (sunlight, water, CO2)
              and the "finished dish" (sugar/energy).
              The style should be like a page from a colorful
              kids' cookbook, suitable for a 4th grader.
              """);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("photosynthesis.png"), blob.data().get());
              }
            }
          }
          // ...
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "role": "user",
          "parts": [
            {"text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plants favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids cookbook, suitable for a 4th grader."}
          ]
        }],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"]
        }
      }' > turn1_response.json

    cat turn1_response.json
    # Requires jq to parse JSON response
    jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' turn1_response.json | head -1 | base64 --decode > photosynthesis.png

![AI-generated infographic about photosynthesis](https://ai.google.dev/static/gemini-api/docs/images/infographic-eng.png)AI-generated infographic about photosynthesis

You can then use the same chat to change the language on the graphic to Spanish.  

### Python

    message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
    aspect_ratio = "16:9" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
    resolution = "2K" # "1K", "2K", "4K"

    response = chat.send_message(message,
        config=types.GenerateContentConfig(
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
                image_size=resolution
            ),
        ))

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("photosynthesis_spanish.png")

### Javascript

    const message = 'Update this infographic to be in Spanish. Do not change any other elements of the image.';
    const aspectRatio = '16:9';
    const resolution = '2K';

    let response = await chat.sendMessage({
      message,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
        tools: [{googleSearch: {}}],
      },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("photosynthesis2.png", buffer);
          console.log("Image saved as photosynthesis2.png");
        }
    }

### Go

    message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
    aspect_ratio = "16:9" // "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
    resolution = "2K"     // "1K", "2K", "4K"

    model.GenerationConfig.ImageConfig = &pb.ImageConfig{
        AspectRatio: aspect_ratio,
        ImageSize:   resolution,
    }

    resp, err = chat.SendMessage(ctx, genai.Text(message))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("photosynthesis_spanish.png", img.Data, 0644)
            if err != nil {
                log.Fatal(err)
            }
        }
    }

### Java

    String aspectRatio = "16:9"; // "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
    String resolution = "2K"; // "1K", "2K", "4K"

    config = GenerateContentConfig.builder()
        .responseModalities("TEXT", "IMAGE")
        .imageConfig(ImageConfig.builder()
            .aspectRatio(aspectRatio)
            .imageSize(resolution)
            .build())
        .build();

    response = chat.sendMessage(
        "Update this infographic to be in Spanish. " + 
        "Do not change any other elements of the image.",
        config);

    for (Part part : response.parts()) {
      if (part.text().isPresent()) {
        System.out.println(part.text().get());
      } else if (part.inlineData().isPresent()) {
        var blob = part.inlineData().get();
        if (blob.data().isPresent()) {
          Files.write(Paths.get("photosynthesis_spanish.png"), blob.data().get());
        }
      }
    }

### REST

    # Create request2.json by combining history and new prompt
    # Read model's previous response content directly into jq
    jq --argjson user1 '{"role": "user", "parts": [{"text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant'\''s favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids'\'' cookbook, suitable for a 4th grader."}]}' \
      --argjson user2 '{"role": "user", "parts": [{"text": "Update this infographic to be in Spanish. Do not change any other elements of the image."}]}' \
      -f /dev/stdin turn1_response.json > request2.json <<'EOF_JQ_FILTER'
    .candidates[0].content | {
      "contents": [$user1, ., $user2],
      "tools": [{"google_search": {}}],
      "generationConfig": {
        "responseModalities": ["TEXT", "IMAGE"],
        "imageConfig": {
          "aspectRatio": "16:9",
          "imageSize": "2K"
        }
      }
    }
    EOF_JQ_FILTER

    curl -s -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d @request2.json > turn2_response.json

    jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' turn2_response.json | head -1 | base64 --decode > photosynthesis_spanish.png

![AI-generated infographic of photosynthesis in Spanish](https://ai.google.dev/static/gemini-api/docs/images/infographic-spanish.png)AI-generated infographic of photosynthesis in Spanish

## New with Gemini 3 Pro Image

Gemini 3 Pro Image (`gemini-3-pro-image-preview`) is a state-of-the-art image generation and editing model optimized for professional asset production. Designed to tackle the most challenging workflows through advanced reasoning, it excels at complex, multi-turn creation and modification tasks.

- **High-resolution output**: Built-in generation capabilities for 1K, 2K, and 4K visuals.
- **Advanced text rendering**: Capable of generating legible, stylized text for infographics, menus, diagrams, and marketing assets.
- **Grounding with Google Search**: The model can use Google Search as a tool to verify facts and generate imagery based on real-time data (e.g., current weather maps, stock charts, recent events).
- **Thinking mode**: The model utilizes a "thinking" process to reason through complex prompts. It generates interim "thought images" (visible in the backend but not charged) to refine the composition before producing the final high-quality output.
- **Up to 14 reference images**: You can now mix up to 14 reference images to produce the final image.

### Use up to 14 reference images

Gemini 3 Pro Preview lets you to mix up to 14 reference images. These 14 images can include the following:

- Up to 6 images of objects with high-fidelity to include in the final image
- Up to 5 images of humans to maintain character consistency

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    prompt = "An office group photo of these people, they are making funny faces."
    aspect_ratio = "5:4" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
    resolution = "2K" # "1K", "2K", "4K"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            prompt,
            Image.open('person1.png'),
            Image.open('person2.png'),
            Image.open('person3.png'),
            Image.open('person4.png'),
            Image.open('person5.png'),
        ],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
                image_size=resolution
            ),
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("office.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
          'An office group photo of these people, they are making funny faces.';
      const aspectRatio = '5:4';
      const resolution = '2K';

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile1,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile2,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile3,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile4,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile5,
        },
      }
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: contents,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3-pro-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
            ImageConfig: &pb.ImageConfig{
                AspectRatio: "5:4",
                ImageSize:   "2K",
            },
        }

        img1, err := os.ReadFile("person1.png")
        if err != nil { log.Fatal(err) }
        img2, err := os.ReadFile("person2.png")
        if err != nil { log.Fatal(err) }
        img3, err := os.ReadFile("person3.png")
        if err != nil { log.Fatal(err) }
        img4, err := os.ReadFile("person4.png")
        if err != nil { log.Fatal(err) }
        img5, err := os.ReadFile("person5.png")
        if err != nil { log.Fatal(err) }

        parts := []genai.Part{
            genai.Text("An office group photo of these people, they are making funny faces."),
            genai.ImageData{MIMEType: "image/png", Data: img1},
            genai.ImageData{MIMEType: "image/png", Data: img2},
            genai.ImageData{MIMEType: "image/png", Data: img3},
            genai.ImageData{MIMEType: "image/png", Data: img4},
            genai.ImageData{MIMEType: "image/png", Data: img5},
        }

        resp, err := model.GenerateContent(ctx, parts...)
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("office.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class GroupPhoto {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("5:4")
                  .imageSize("2K")
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview",
              Content.fromParts(
                  Part.fromText("An office group photo of these people, they are making funny faces."),
                  Part.fromBytes(Files.readAllBytes(Path.of("person1.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person2.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person3.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person4.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person5.png")), "image/png")
              ), config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("office.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    IMG_PATH1=person1.png
    IMG_PATH2=person2.png
    IMG_PATH3=person3.png
    IMG_PATH4=person4.png
    IMG_PATH5=person5.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG1_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH1" 2>&1)
    IMG2_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH2" 2>&1)
    IMG3_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH3" 2>&1)
    IMG4_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH4" 2>&1)
    IMG5_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH5" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"An office group photo of these people, they are making funny faces.\"},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"$IMG1_BASE64\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"$IMG2_BASE64\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"$IMG3_BASE64\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"$IMG4_BASE64\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"$IMG5_BASE64\"}}
            ]
          }],
          \"generationConfig\": {
            \"responseModalities\": [\"TEXT\", \"IMAGE\"],
            \"imageConfig\": {
              \"aspectRatio\": \"5:4\",
              \"imageSize\": \"2K\"
            }
          }
        }" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | head -1 | base64 --decode > office.png

![AI-generated office group photo](https://ai.google.dev/static/gemini-api/docs/images/office-group-photo.jpeg)AI-generated office group photo

### Grounding with Google Search

Use the[Google Search tool](https://ai.google.dev/gemini-api/docs/google-search)to generate images based on real-time information, such as weather forecasts, stock charts, or recent events.

Note that when using Grounding with Google Search with image generation, image-based search results are not passed to the generation model and are excluded from the response.  

### Python

    from google import genai
    prompt = "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"
    aspect_ratio = "16:9" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['Text', 'Image'],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
            ),
            tools=[{"google_search": {}}]
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("weather.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt = 'Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day';
      const aspectRatio = '16:9';
      const resolution = '2K';

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.Tool;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class SearchGrounding {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("16:9")
                  .build())
              .tools(Tool.builder()
                  .googleSearch(GoogleSearch.builder().build())
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview", """
                  Visualize the current weather forecast for the next 5 days 
                  in San Francisco as a clean, modern weather chart. 
                  Add a visual on what I should wear each day
                  """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("weather.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "imageConfig": {"aspectRatio": "16:9"}
        }
      }' | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | head -1 | base64 --decode > weather.png

![AI-generated five day weather chart for San Francisco](https://ai.google.dev/static/gemini-api/docs/images/weather-forecast.png)AI-generated five day weather chart for San Francisco

The response includes`groundingMetadata`which contains the following required fields:

- **`searchEntryPoint`**: Contains the HTML and CSS to render the required search suggestions.
- **`groundingChunks`**: Returns the top 3 web sources used to ground the generated image

### Generate images up to 4K resolution

Gemini 3 Pro Image generates 1K images by default but can also output 2K and 4K images. To generate higher resolution assets, specify the`image_size`in the`generation_config`.

You must use an uppercase 'K' (e.g., 1K, 2K, 4K). Lowercase parameters (e.g., 1k) will be rejected.  

### Python

    from google import genai
    from google.genai import types

    prompt = "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English." 
    aspect_ratio = "1:1" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
    resolution = "1K" # "1K", "2K", "4K"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
                image_size=resolution
            ),
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("butterfly.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
          'Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.';
      const aspectRatio = '1:1';
      const resolution = '1K';

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3-pro-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
            ImageConfig: &pb.ImageConfig{
                AspectRatio: "1:1",
                ImageSize:   "1K",
            },
        }

        prompt := "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."
        resp, err := model.GenerateContent(ctx, genai.Text(prompt))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("butterfly.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.Tool;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class HiRes {
        public static void main(String[] args) throws IOException {

          try (Client client = new Client()) {
            GenerateContentConfig config = GenerateContentConfig.builder()
                .responseModalities("TEXT", "IMAGE")
                .imageConfig(ImageConfig.builder()
                    .aspectRatio("16:9")
                    .imageSize("4K")
                    .build())
                .build();

            GenerateContentResponse response = client.models.generateContent(
                "gemini-3-pro-image-preview", """
                  Da Vinci style anatomical sketch of a dissected Monarch butterfly.
                  Detailed drawings of the head, wings, and legs on textured
                  parchment with notes in English.
                  """,
                config);

            for (Part part : response.parts()) {
              if (part.text().isPresent()) {
                System.out.println(part.text().get());
              } else if (part.inlineData().isPresent()) {
                var blob = part.inlineData().get();
                if (blob.data().isPresent()) {
                  Files.write(Paths.get("butterfly.png"), blob.data().get());
                }
              }
            }
          }
        }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "imageConfig": {"aspectRatio": "1:1", "imageSize": "1K"}
        }
      }' | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | head -1 | base64 --decode > butterfly.png

The following is an example image generated from this prompt:
![AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.](https://ai.google.dev/static/gemini-api/docs/images/gemini3-4k-image.png)AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.

### Thinking Process

The Gemini 3 Pro Image Preview model is a thinking model and uses a reasoning process ("Thinking") for complex prompts. This feature is enabled by default and cannot be disabled in the API. To learn more about the thinking process, see the[Gemini Thinking](https://ai.google.dev/gemini-api/docs/thinking)guide.

The model generates up to two interim images to test composition and logic. The last image within Thinking is also the final rendered image.

You can check the thoughts that lead to the final image being produced.  

### Python

    for part in response.parts:
        if part.thought:
            if part.text:
                print(part.text)
            elif image:= part.as_image():
                image.show()

### Javascript

    for (const part of response.candidates[0].content.parts) {
      if (part.thought) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync('image.png', buffer);
          console.log('Image saved as image.png');
        }
      }
    }

#### Thought Signatures

Thought signatures are encrypted representations of the model's internal thought process and are used to preserve reasoning context across multi-turn interactions. All responses include a`thought_signature`field. As a general rule, if you receive a thought signature in a model response, you should pass it back exactly as received when sending the conversation history in the next turn. Failure to circulate thought signatures may cause the response to fail. Check the[thought signature](https://ai.google.dev/gemini-api/docs/thought-signatures)documentation for more explanations of signatures overall.
| **Note:** If you use the official[Google Gen AI SDKs](https://ai.google.dev/gemini-api/docs/libraries)and use the chat feature (or append the full model response object directly to history),**thought signatures are handled automatically**. You do not need to manually extract or manage them, or change your code.

Here is how thought signatures work:

- All`inline_data`parts with image`mimetype`which are part of the response should have signature.
- If there are some text parts at the beginning (before any image) right after the thoughts, the first text part should also have a signature.
- Thoughts do not have signatures; If`inline_data`parts with image`mimetype`are part of thoughts, they will not have signatures.

The following code shows an example of where thought signatures are included:  

    [
      {
        "inline_data": {
          "data": "<base64_image_data_0>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_1>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_2>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "text": "Here is a step-by-step guide to baking macarons, presented in three separate images.\n\n### Step 1: Piping the Batter\n\nThe first step after making your macaron batter is to pipe it onto a baking sheet. This requires a steady hand to create uniform circles.\n\n",
        "thought_signature": "<Signature_A>" // The first non-thought part always has a signature
      },
      {
        "inline_data": {
          "data": "<base64_image_data_3>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_B>" // All image parts have a signatures
      },
      {
        "text": "\n\n### Step 2: Baking and Developing Feet\n\nOnce piped, the macarons are baked in the oven. A key sign of a successful bake is the development of \"feet\"---the ruffled edge at the base of each macaron shell.\n\n"
        // Follow-up text parts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_4>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_C>" // All image parts have a signatures
      },
      {
        "text": "\n\n### Step 3: Assembling the Macaron\n\nThe final step is to pair the cooled macaron shells by size and sandwich them together with your desired filling, creating the classic macaron dessert.\n\n"
      },
      {
        "inline_data": {
          "data": "<base64_image_data_5>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_D>" // All image parts have a signatures
      }
    ]

## Other image generation modes

Gemini supports other image interaction modes based on prompt structure and context, including:

- **Text to image(s) and text (interleaved):** Outputs images with related text.
  - Example prompt: "Generate an illustrated recipe for a paella."
- **Image(s) and text to image(s) and text (interleaved)** : Uses input images and text to create new related images and text.
  - Example prompt: (With an image of a furnished room) "What other color sofas would work in my space? can you update the image?"

## Generate images in batch

If you need to generate a lot of images, you can use the[Batch API](https://ai.google.dev/gemini-api/docs/batch-api). You get higher[rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)in exchange for a turnaround of up to 24 hours.

Check the[Batch API image generation documentation](https://ai.google.dev/gemini-api/docs/batch-api#image-generation)and the[cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)for Batch API image examples and code.

## Prompting guide and strategies

Mastering image generation starts with one fundamental principle:
> **Describe the scene, don't just list keywords.**The model's core strength is its deep language understanding. A narrative, descriptive paragraph will almost always produce a better, more coherent image than a list of disconnected words.

### Prompts for generating images

The following strategies will help you create effective prompts to generate exactly the images you're looking for.

#### 1. Photorealistic scenes

For realistic images, use photography terms. Mention camera angles, lens types, lighting, and fine details to guide the model toward a photorealistic result.  

### Template

    A photorealistic [shot type] of [subject], [action or expression], set in
    [environment]. The scene is illuminated by [lighting description], creating
    a [mood] atmosphere. Captured with a [camera/lens details], emphasizing
    [key textures and details]. The image should be in a [aspect ratio] format.

### Prompt

    A photorealistic close-up portrait of an elderly Japanese ceramicist with
    deep, sun-etched wrinkles and a warm, knowing smile. He is carefully
    inspecting a freshly glazed tea bowl. The setting is his rustic,
    sun-drenched workshop. The scene is illuminated by soft, golden hour light
    streaming through a window, highlighting the fine texture of the clay.
    Captured with an 85mm portrait lens, resulting in a soft, blurred background
    (bokeh). The overall mood is serene and masterful. Vertical portrait
    orientation.

### Python

    from google import genai
    from google.genai import types    

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents="A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful.",
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("photorealistic_example.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class PhotorealisticScene {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              """
              A photorealistic close-up portrait of an elderly Japanese ceramicist
              with deep, sun-etched wrinkles and a warm, knowing smile. He is
              carefully inspecting a freshly glazed tea bowl. The setting is his
              rustic, sun-drenched workshop with pottery wheels and shelves of
              clay pots in the background. The scene is illuminated by soft,
              golden hour light streaming through a window, highlighting the
              fine texture of the clay and the fabric of his apron. Captured
              with an 85mm portrait lens, resulting in a soft, blurred
              background (bokeh). The overall mood is serene and masterful.
              """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("photorealistic_example.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("photorealistic_example.png", buffer);
          console.log("Image saved as photorealistic_example.png");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash-image",
            genai.Text("A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful."),
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "photorealistic_example.png"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful."}
          ]
        }]
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > photorealistic_example.png

![A photorealistic close-up portrait of an elderly Japanese ceramicist...](https://ai.google.dev/static/gemini-api/docs/images/photorealistic_example.png)A photorealistic close-up portrait of an elderly Japanese ceramicist...

#### 2. Stylized illustrations \& stickers

To create stickers, icons, or assets, be explicit about the style and request a transparent background.  

### Template

    A [style] sticker of a [subject], featuring [key characteristics] and a
    [color palette]. The design should have [line style] and [shading style].
    The background must be transparent.

### Prompt

    A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's
    munching on a green bamboo leaf. The design features bold, clean outlines,
    simple cel-shading, and a vibrant color palette. The background must be white.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents="A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("red_panda_sticker.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class StylizedIllustration {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              """
              A kawaii-style sticker of a happy red panda wearing a tiny bamboo
              hat. It's munching on a green bamboo leaf. The design features
              bold, clean outlines, simple cel-shading, and a vibrant color
              palette. The background must be white.
              """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("red_panda_sticker.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("red_panda_sticker.png", buffer);
          console.log("Image saved as red_panda_sticker.png");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash-image",
            genai.Text("A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."),
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "red_panda_sticker.png"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It'"'"'s munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."}
          ]
        }]
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > red_panda_sticker.png

![A kawaii-style sticker of a happy red...](https://ai.google.dev/static/gemini-api/docs/images/red_panda_sticker.png)A kawaii-style sticker of a happy red panda...

#### 3. Accurate text in images

Gemini excels at rendering text. Be clear about the text, the font style (descriptively), and the overall design. Use Gemini 3 Pro Image Preview for professional asset production.  

### Template

    Create a [image type] for [brand/concept] with the text "[text to render]"
    in a [font style]. The design should be [style description], with a
    [color scheme].

### Prompt

    Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.

### Python

    from google import genai
    from google.genai import types    

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents="Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
        config=types.GenerateContentConfig(
            image_config=types.ImageConfig(
                aspect_ratio="1:1",
            )
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("logo_example.jpg")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;
    import com.google.genai.types.ImageConfig;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class AccurateTextInImages {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("1:1")
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview",
              """
              Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.
              """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("logo_example.jpg"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.";

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("logo_example.jpg", buffer);
          console.log("Image saved as logo_example.jpg");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-3-pro-image-preview",
            genai.Text("Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."),
            &genai.GenerateContentConfig{
                ImageConfig: &genai.ImageConfig{
                  AspectRatio: "1:1",
                },
            },
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "logo_example.jpg"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a modern, minimalist logo for a coffee shop called '"'"'The Daily Grind'"'"'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."}
          ]
        }],
        "generationConfig": {
          "imageConfig": {
            "aspectRatio": "1:1"
          }
        }
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > logo_example.jpg

![Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...](https://ai.google.dev/static/gemini-api/docs/images/logo_example.jpg)Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...

#### 4. Product mockups \& commercial photography

Perfect for creating clean, professional product shots for e-commerce, advertising, or branding.  

### Template

    A high-resolution, studio-lit product photograph of a [product description]
    on a [background surface/description]. The lighting is a [lighting setup,
    e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
    a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp
    focus on [key detail]. [Aspect ratio].

### Prompt

    A high-resolution, studio-lit product photograph of a minimalist ceramic
    coffee mug in matte black, presented on a polished concrete surface. The
    lighting is a three-point softbox setup designed to create soft, diffused
    highlights and eliminate harsh shadows. The camera angle is a slightly
    elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with
    sharp focus on the steam rising from the coffee. Square image.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents="A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("product_mockup.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class ProductMockup {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              """
              A high-resolution, studio-lit product photograph of a minimalist
              ceramic coffee mug in matte black, presented on a polished
              concrete surface. The lighting is a three-point softbox setup
              designed to create soft, diffused highlights and eliminate harsh
              shadows. The camera angle is a slightly elevated 45-degree shot
              to showcase its clean lines. Ultra-realistic, with sharp focus
              on the steam rising from the coffee. Square image.
              """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("product_mockup.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("product_mockup.png", buffer);
          console.log("Image saved as product_mockup.png");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash-image",
            genai.Text("A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."),
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "product_mockup.png"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."}
          ]
        }]
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > product_mockup.png

![A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...](https://ai.google.dev/static/gemini-api/docs/images/product_mockup.png)A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...

#### 5. Minimalist \& negative space design

Excellent for creating backgrounds for websites, presentations, or marketing materials where text will be overlaid.  

### Template

    A minimalist composition featuring a single [subject] positioned in the
    [bottom-right/top-left/etc.] of the frame. The background is a vast, empty
    [color] canvas, creating significant negative space. Soft, subtle lighting.
    [Aspect ratio].

### Prompt

    A minimalist composition featuring a single, delicate red maple leaf
    positioned in the bottom-right of the frame. The background is a vast, empty
    off-white canvas, creating significant negative space for text. Soft,
    diffused lighting from the top left. Square image.

### Python

    from google import genai
    from google.genai import types    

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents="A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("minimalist_design.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class MinimalistDesign {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              """
              A minimalist composition featuring a single, delicate red maple
              leaf positioned in the bottom-right of the frame. The background
              is a vast, empty off-white canvas, creating significant negative
              space for text. Soft, diffused lighting from the top left.
              Square image.
              """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("minimalist_design.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("minimalist_design.png", buffer);
          console.log("Image saved as minimalist_design.png");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash-image",
            genai.Text("A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."),
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "minimalist_design.png"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."}
          ]
        }]
      }' \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > minimalist_design.png

![A minimalist composition featuring a single, delicate red maple leaf...](https://ai.google.dev/static/gemini-api/docs/images/minimalist_design.png)A minimalist composition featuring a single, delicate red maple leaf...

#### 6. Sequential art (Comic panel / Storyboard)

Builds on character consistency and scene description to create panels for visual storytelling. For accuracy with text and storytelling ability, these prompts work best with Gemini 3 Pro Image Preview.  

### Template

    Make a 3 panel comic in a [style]. Put the character in a [type of scene].

### Prompt

    Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
    text_input = "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[text_input, image_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("comic_panel.jpg")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class ComicPanel {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview",
              Content.fromParts(
                  Part.fromText("""
                      Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.
                      """),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/man_in_white_glasses.jpg")),
                      "image/jpeg")),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("comic_panel.jpg"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/man_in_white_glasses.jpg";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        {text: "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("comic_panel.jpg", buffer);
          console.log("Image saved as comic_panel.jpg");
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        imagePath := "/path/to/your/man_in_white_glasses.jpg"
        imgData, _ := os.ReadFile(imagePath)

        parts := []*genai.Part{
          genai.NewPartFromText("Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."),
          &genai.Part{
            InlineData: &genai.Blob{
              MIMEType: "image/jpeg",
              Data:     imgData,
            },
          },
        }

        contents := []*genai.Content{
          genai.NewContentFromParts(parts, genai.RoleUser),
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-3-pro-image-preview",
            contents,
        )

        for _, part := range result.Candidates[0].Content.Parts {
            if part.Text != "" {
                fmt.Println(part.Text)
            } else if part.InlineData != nil {
                imageBytes := part.InlineData.Data
                outputFilename := "comic_panel.jpg"
                _ = os.WriteFile(outputFilename, imageBytes, 0644)
            }
        }
    }

### REST

    IMG_PATH=/path/to/your/man_in_white_glasses.jpg

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -s -X POST
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"contents\": [{
          \"parts\": [
            {\"text\": \"Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.\"},
            {\"inline_data\": {\"mime_type\":\"image/jpeg\", \"data\": \"$IMG_BASE64\"}}
          ]
        }]
      }" \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > comic_panel.jpg

|------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input                                                                                                            | Output                                                                                                                                                                         |
| ![Man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg)Input image | ![Make a 3 panel comic in a gritty, noir art style...](https://ai.google.dev/static/gemini-api/docs/images/comic_panel.jpg)Make a 3 panel comic in a gritty, noir art style... |

#### 7. Grounding with Google Search

Use Google Search to generate images based on recent or real-time information. This is useful for news, weather, and other time-sensitive topics.  

### Prompt

    Make a simple but stylish graphic of last night's Arsenal game in the Champion's League

### Python

    from google import genai
    from google.genai import types
    prompt = "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"
    aspect_ratio = "16:9" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['Text', 'Image'],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
            ),
            tools=[{"google_search": {}}]
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("football-score.jpg")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.Tool;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class SearchGrounding {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("16:9")
                  .build())
              .tools(Tool.builder()
                  .googleSearch(GoogleSearch.builder().build())
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview", """
                  Make a simple but stylish graphic of last night's Arsenal game in the Champion's League
                  """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("football-score.jpg"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt = "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League";

      const aspectRatio = '16:9';
      const resolution = '2K';

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          },
          tools: [{"google_search": {}}],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("football-score.jpg", buffer);
          console.log("Image saved as football-score.jpg");
        }
      }

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
        pb "google.golang.org/genai/schema"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3-pro-image-preview")
        model.Tools = []*pb.Tool{
            pb.NewGoogleSearchTool(),
        }
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
            ImageConfig: &pb.ImageConfig{
                AspectRatio: "16:9",
            },
        }

        prompt := "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"
        resp, err := model.GenerateContent(ctx, genai.Text(prompt))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("football-score.jpg", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "Make a simple but stylish graphic of last nights Arsenal game in the Champions League"}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "imageConfig": {"aspectRatio": "16:9"}
        }
      }" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | head -1 | base64 --decode > football-score.jpg

![AI-generated graphic of an Arsenal football score](https://ai.google.dev/static/gemini-api/docs/images/football-score.jpg)AI-generated graphic of an Arsenal football score

### Prompts for editing images

These examples show how to provide images alongside your text prompts for editing, composition, and style transfer.

#### 1. Adding and removing elements

Provide an image and describe your change. The model will match the original image's style, lighting, and perspective.  

### Template

    Using the provided image of [subject], please [add/remove/modify] [element]
    to/from the scene. Ensure the change is [description of how the change should
    integrate].

### Prompt

    "Using the provided image of my cat, please add a small, knitted wizard hat
    on its head. Make it look like it's sitting comfortably and matches the soft
    lighting of the photo."

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    # Base image prompt: "A photorealistic picture of a fluffy ginger cat sitting on a wooden floor, looking directly at the camera. Soft, natural light from a window."
    image_input = Image.open('/path/to/your/cat_photo.png')
    text_input = """Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."""

    # Generate an image from a text prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[text_input, image_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("cat_with_hat.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class AddRemoveElements {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromText("""
                      Using the provided image of my cat, please add a small,
                      knitted wizard hat on its head. Make it look like it's
                      sitting comfortably and not falling off.
                      """),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/cat_photo.png")),
                      "image/png")),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("cat_with_hat.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/cat_photo.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        { text: "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off." },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("cat_with_hat.png", buffer);
          console.log("Image saved as cat_with_hat.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imagePath := "/path/to/your/cat_photo.png"
      imgData, _ := os.ReadFile(imagePath)

      parts := []*genai.Part{
        genai.NewPartFromText("Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."),
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData,
          },
        },
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "cat_with_hat.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH=/path/to/your/cat_photo.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off.\"},
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG_BASE64\"
                  }
                }
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > cat_with_hat.png

|---------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input                                                   | Output                                                                                                                                                                                                                              |
| :cat:A photorealistic picture of a fluffy ginger cat... | ![Using the provided image of my cat, please add a small, knitted wizard hat...](https://ai.google.dev/static/gemini-api/docs/images/cat_with_hat.png)Using the provided image of my cat, please add a small, knitted wizard hat... |

#### 2. Inpainting (Semantic masking)

Conversationally define a "mask" to edit a specific part of an image while leaving the rest untouched.  

### Template

    Using the provided image, change only the [specific element] to [new
    element/description]. Keep everything else in the image exactly the same,
    preserving the original style, lighting, and composition.

### Prompt

    "Using the provided image of a living room, change only the blue sofa to be
    a vintage, brown leather chesterfield sofa. Keep the rest of the room,
    including the pillows on the sofa and the lighting, unchanged."

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    # Base image prompt: "A wide shot of a modern, well-lit living room with a prominent blue sofa in the center. A coffee table is in front of it and a large window is in the background."
    living_room_image = Image.open('/path/to/your/living_room.png')
    text_input = """Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."""

    # Generate an image from a text prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[living_room_image, text_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("living_room_edited.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class Inpainting {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/living_room.png")),
                      "image/png"),
                  Part.fromText("""
                      Using the provided image of a living room, change
                      only the blue sofa to be a vintage, brown leather
                      chesterfield sofa. Keep the rest of the room,
                      including the pillows on the sofa and the lighting,
                      unchanged.
                      """)),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("living_room_edited.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/living_room.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
        { text: "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged." },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("living_room_edited.png", buffer);
          console.log("Image saved as living_room_edited.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imagePath := "/path/to/your/living_room.png"
      imgData, _ := os.ReadFile(imagePath)

      parts := []*genai.Part{
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData,
          },
        },
        genai.NewPartFromText("Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."),
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "living_room_edited.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH=/path/to/your/living_room.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG_BASE64\"
                  }
                },
                {\"text\": \"Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged.\"}
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > living_room_edited.png

|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input                                                                                                                                                                    | Output                                                                                                                                                                                                                                                                                                                          |
| ![A wide shot of a modern, well-lit living room...](https://ai.google.dev/static/gemini-api/docs/images/living_room.png)A wide shot of a modern, well-lit living room... | ![Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa...](https://ai.google.dev/static/gemini-api/docs/images/living_room_edited.png)Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa... |

#### 3. Style transfer

Provide an image and ask the model to recreate its content in a different artistic style.  

### Template

    Transform the provided photograph of [subject] into the artistic style of [artist/art style]. Preserve the original composition but render it with [description of stylistic elements].

### Prompt

    "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    # Base image prompt: "A photorealistic, high-resolution photograph of a busy city street in New York at night, with bright neon signs, yellow taxis, and tall skyscrapers."
    city_image = Image.open('/path/to/your/city.png')
    text_input = """Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."""

    # Generate an image from a text prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[city_image, text_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("city_style_transfer.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class StyleTransfer {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/city.png")),
                      "image/png"),
                  Part.fromText("""
                      Transform the provided photograph of a modern city
                      street at night into the artistic style of
                      Vincent van Gogh's 'Starry Night'. Preserve the
                      original composition of buildings and cars, but
                      render all elements with swirling, impasto
                      brushstrokes and a dramatic palette of deep blues
                      and bright yellows.
                      """)),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("city_style_transfer.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/city.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
        { text: "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows." },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("city_style_transfer.png", buffer);
          console.log("Image saved as city_style_transfer.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imagePath := "/path/to/your/city.png"
      imgData, _ := os.ReadFile(imagePath)

      parts := []*genai.Part{
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData,
          },
        },
        genai.NewPartFromText("Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."),
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "city_style_transfer.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH=/path/to/your/city.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG_BASE64\"
                  }
                },
                {\"text\": \"Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows.\"}
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > city_style_transfer.png

|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input                                                                                                                                                                                                       | Output                                                                                                                                                                                                                     |
| ![A photorealistic, high-resolution photograph of a busy city street...](https://ai.google.dev/static/gemini-api/docs/images/city.png)A photorealistic, high-resolution photograph of a busy city street... | ![Transform the provided photograph of a modern city street at night...](https://ai.google.dev/static/gemini-api/docs/images/city_style_transfer.png)Transform the provided photograph of a modern city street at night... |

#### 4. Advanced composition: Combining multiple images

Provide multiple images as context to create a new, composite scene. This is perfect for product mockups or creative collages.  

### Template

    Create a new image by combining the elements from the provided images. Take
    the [element from image 1] and place it with/on the [element from image 2].
    The final image should be a [description of the final scene].

### Prompt

    "Create a professional e-commerce fashion photo. Take the blue floral dress
    from the first image and let the woman from the second image wear it.
    Generate a realistic, full-body shot of the woman wearing the dress, with
    the lighting and shadows adjusted to match the outdoor environment."

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    # Base image prompts:
    # 1. Dress: "A professionally shot photo of a blue floral summer dress on a plain white background, ghost mannequin style."
    # 2. Model: "Full-body shot of a woman with her hair in a bun, smiling, standing against a neutral grey studio background."
    dress_image = Image.open('/path/to/your/dress.png')
    model_image = Image.open('/path/to/your/model.png')

    text_input = """Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment."""

    # Generate an image from a text prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[dress_image, model_image, text_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("fashion_ecommerce_shot.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class AdvancedComposition {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/dress.png")),
                      "image/png"),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/model.png")),
                      "image/png"),
                  Part.fromText("""
                      Create a professional e-commerce fashion photo.
                      Take the blue floral dress from the first image and
                      let the woman from the second image wear it. Generate
                      a realistic, full-body shot of the woman wearing the
                      dress, with the lighting and shadows adjusted to
                      match the outdoor environment.
                      """)),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("fashion_ecommerce_shot.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath1 = "/path/to/your/dress.png";
      const imageData1 = fs.readFileSync(imagePath1);
      const base64Image1 = imageData1.toString("base64");
      const imagePath2 = "/path/to/your/model.png";
      const imageData2 = fs.readFileSync(imagePath2);
      const base64Image2 = imageData2.toString("base64");

      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image1,
          },
        },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image2,
          },
        },
        { text: "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment." },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("fashion_ecommerce_shot.png", buffer);
          console.log("Image saved as fashion_ecommerce_shot.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imgData1, _ := os.ReadFile("/path/to/your/dress.png")
      imgData2, _ := os.ReadFile("/path/to/your/model.png")

      parts := []*genai.Part{
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData1,
          },
        },
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData2,
          },
        },
        genai.NewPartFromText("Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment."),
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "fashion_ecommerce_shot.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH1=/path/to/your/dress.png
    IMG_PATH2=/path/to/your/model.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG1_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH1" 2>&1)
    IMG2_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH2" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG1_BASE64\"
                  }
                },
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG2_BASE64\"
                  }
                },
                {\"text\": \"Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment.\"}
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > fashion_ecommerce_shot.png

|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input 1                                                             | Input 2                                                                                                                                                                  | Output                                                                                                                                                                                |
| :dress:A professionally shot photo of a blue floral summer dress... | ![Full-body shot of a woman with her hair in a bun...](https://ai.google.dev/static/gemini-api/docs/images/model.png)Full-body shot of a woman with her hair in a bun... | ![Create a professional e-commerce fashion photo...](https://ai.google.dev/static/gemini-api/docs/images/fashion_ecommerce_shot.png)Create a professional e-commerce fashion photo... |

#### 5. High-fidelity detail preservation

To ensure critical details (like a face or logo) are preserved during an edit, describe them in great detail along with your edit request.  

### Template

    Using the provided images, place [element from image 2] onto [element from
    image 1]. Ensure that the features of [element from image 1] remain
    completely unchanged. The added element should [description of how the
    element should integrate].

### Prompt

    "Take the first image of the woman with brown hair, blue eyes, and a neutral
    expression. Add the logo from the second image onto her black t-shirt.
    Ensure the woman's face and features remain completely unchanged. The logo
    should look like it's naturally printed on the fabric, following the folds
    of the shirt."

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    # Base image prompts:
    # 1. Woman: "A professional headshot of a woman with brown hair and blue eyes, wearing a plain black t-shirt, against a neutral studio background."
    # 2. Logo: "A simple, modern logo with the letters 'G' and 'A' in a white circle."
    woman_image = Image.open('/path/to/your/woman.png')
    logo_image = Image.open('/path/to/your/logo.png')
    text_input = """Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."""

    # Generate an image from a text prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[woman_image, logo_image, text_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("woman_with_logo.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class HighFidelity {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-2.5-flash-image",
              Content.fromParts(
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/woman.png")),
                      "image/png"),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/logo.png")),
                      "image/png"),
                  Part.fromText("""
                      Take the first image of the woman with brown hair,
                      blue eyes, and a neutral expression. Add the logo
                      from the second image onto her black t-shirt.
                      Ensure the woman's face and features remain
                      completely unchanged. The logo should look like
                      it's naturally printed on the fabric, following
                      the folds of the shirt.
                      """)),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("woman_with_logo.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath1 = "/path/to/your/woman.png";
      const imageData1 = fs.readFileSync(imagePath1);
      const base64Image1 = imageData1.toString("base64");
      const imagePath2 = "/path/to/your/logo.png";
      const imageData2 = fs.readFileSync(imagePath2);
      const base64Image2 = imageData2.toString("base64");

      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image1,
          },
        },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image2,
          },
        },
        { text: "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt." },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("woman_with_logo.png", buffer);
          console.log("Image saved as woman_with_logo.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imgData1, _ := os.ReadFile("/path/to/your/woman.png")
      imgData2, _ := os.ReadFile("/path/to/your/logo.png")

      parts := []*genai.Part{
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData1,
          },
        },
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData2,
          },
        },
        genai.NewPartFromText("Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."),
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash-image",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "woman_with_logo.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH1=/path/to/your/woman.png
    IMG_PATH2=/path/to/your/logo.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG1_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH1" 2>&1)
    IMG2_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH2" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG1_BASE64\"
                  }
                },
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG2_BASE64\"
                  }
                },
                {\"text\": \"Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt.\"}
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > woman_with_logo.png

|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input 1                                                                    | Input 2                                                                                                                                                                     | Output                                                                                                                                                                                                                                                         |
| :woman:A professional headshot of a woman with brown hair and blue eyes... | ![A simple, modern logo with the letters 'G' and 'A'...](https://ai.google.dev/static/gemini-api/docs/images/logo.png)A simple, modern logo with the letters 'G' and 'A'... | ![Take the first image of the woman with brown hair, blue eyes, and a neutral expression...](https://ai.google.dev/static/gemini-api/docs/images/woman_with_logo.png)Take the first image of the woman with brown hair, blue eyes, and a neutral expression... |

#### 6. Bring something to life

Upload a rough sketch or drawing and ask the model to refine it into a finished image.  

### Template

    Turn this rough [medium] sketch of a [subject] into a [style description]
    photo. Keep the [specific features] from the sketch but add [new details/materials].

### Prompt

    "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."

### Python

    from google import genai
    from PIL import Image

    client = genai.Client()

    # Base image prompt: "A rough pencil sketch of a flat sports car on white paper."
    sketch_image = Image.open('/path/to/your/car_sketch.png')
    text_input = """Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."""

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[sketch_image, text_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("car_photo.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class BringToLife {
      public static void main(String[] args) throws IOException {
        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview",
              Content.fromParts(
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/car_sketch.png")),
                      "image/png"),
                  Part.fromText("""
                      Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.
                      """)),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("car_photo.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/car_sketch.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
        { text: "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting." },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("car_photo.png", buffer);
          console.log("Image saved as car_photo.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imgData, _ := os.ReadFile("/path/to/your/car_sketch.png")

      parts := []*genai.Part{
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/png",
            Data:     imgData,
          },
        },
        genai.NewPartFromText("Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."),
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-pro-image-preview",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "car_photo.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH=/path/to/your/car_sketch.png

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/png\",
                    \"data\": \"$IMG_BASE64\"
                  }
                },
                {\"text\": \"Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.\"}
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > car_photo.png

|-------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Input                                                                                                       | Output                                                                                                                            |
| ![Sketch of a car](https://ai.google.dev/static/gemini-api/docs/images/car-sketch.jpg)Rough sketch of a car | ![Output showing the final concept car](https://ai.google.dev/static/gemini-api/docs/images/car-photo.jpg)Polished photo of a car |

#### 7. Character consistency: 360 view

You can generate 360-degree views of a character by iteratively prompting for different angles. For best results, include previously generated images in subsequent prompts to maintain consistency. For complex poses, include a reference image of the desired pose.  

### Template

    A studio portrait of [person] against [background], [looking forward/in profile looking right/etc.]

### Prompt

    A studio portrait of this man against white, in profile looking right

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
    text_input = """A studio portrait of this man against white, in profile looking right"""

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[text_input, image_input],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("man_right_profile.png")

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class CharacterConsistency {
      public static void main(String[] args) throws IOException {
        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3-pro-image-preview",
              Content.fromParts(
                  Part.fromText("""
                      A studio portrait of this man against white, in profile looking right
                      """),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("/path/to/your/man_in_white_glasses.jpg")),
                      "image/jpeg")),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("man_right_profile.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/man_in_white_glasses.jpg";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        { text: "A studio portrait of this man against white, in profile looking right" },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("man_right_profile.png", buffer);
          console.log("Image saved as man_right_profile.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imagePath := "/path/to/your/man_in_white_glasses.jpg"
      imgData, _ := os.ReadFile(imagePath)

      parts := []*genai.Part{
        genai.NewPartFromText("A studio portrait of this man against white, in profile looking right"),
        &genai.Part{
          InlineData: &genai.Blob{
            MIMEType: "image/jpeg",
            Data:     imgData,
          },
        },
      }

      contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-pro-image-preview",
          contents,
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "man_right_profile.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### REST

    IMG_PATH=/path/to/your/man_in_white_glasses.jpg

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    IMG_BASE64=$(base64 "$B64FLAGS" "$IMG_PATH" 2>&1)

    curl -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"A studio portrait of this man against white, in profile looking right\"},
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/jpeg\",
                    \"data\": \"$IMG_BASE64\"
                  }
                }
            ]
          }]
        }"  \
      | grep -o '"data": "[^"]*"' \
      | cut -d'"' -f4 \
      | base64 --decode > man_right_profile.png

|-----------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input                                                                                                                                   | Output 1                                                                                                                                                                        | Output 2                                                                                                                                                                              |
| ![Original input of a man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg)Original image | ![Output of a man in white glasses looking right](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_right.jpg)Man in white glasses looking right | ![Output of a man in white glasses looking forward](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_forward.jpg)Man in white glasses looking forward |

### Best Practices

To elevate your results from good to great, incorporate these professional strategies into your workflow.

- **Be Hyper-Specific:**The more detail you provide, the more control you have. Instead of "fantasy armor," describe it: "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons shaped like falcon wings."
- **Provide Context and Intent:** Explain the*purpose*of the image. The model's understanding of context will influence the final output. For example, "Create a logo for a high-end, minimalist skincare brand" will yield better results than just "Create a logo."
- **Iterate and Refine:**Don't expect a perfect image on the first try. Use the conversational nature of the model to make small changes. Follow up with prompts like, "That's great, but can you make the lighting a bit warmer?" or "Keep everything the same, but change the character's expression to be more serious."
- **Use Step-by-Step Instructions:**For complex scenes with many elements, break your prompt into steps. "First, create a background of a serene, misty forest at dawn. Then, in the foreground, add a moss-covered ancient stone altar. Finally, place a single, glowing sword on top of the altar."
- **Use "Semantic Negative Prompts":**Instead of saying "no cars," describe the desired scene positively: "an empty, deserted street with no signs of traffic."
- **Control the Camera:** Use photographic and cinematic language to control the composition. Terms like`wide-angle shot`,`macro shot`,`low-angle
  perspective`.

## Limitations

- For best performance, use the following languages: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
- Image generation does not support audio or video inputs.
- The model won't always follow the exact number of image outputs that the user explicitly asks for.
- `gemini-2.5-flash-image`works best with up to 3 images as input, while`gemini-3-pro-image-preview`supports 5 images with high fidelity, and up to 14 images in total.
- When generating text for an image, Gemini works best if you first generate the text and then ask for an image with the text.
- All generated images include a[SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Optional configurations

You can optionally configure the response modalities and aspect ratio of the model's output in the`config`field of`generate_content`calls.

### Output types

The model defaults to returning text and image responses (i.e.`response_modalities=['Text', 'Image']`). You can configure the response to return only images without text using`response_modalities=['Image']`.  

### Python

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=['Image']
        )
    )

### JavaScript

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
            responseModalities: ['Image']
        }
      });

### Go

    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash-image",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ResponseModalities: "Image",
        },
      )

### Java

    response = client.models.generateContent(
        "gemini-2.5-flash-image",
        prompt,
        GenerateContentConfig.builder()
            .responseModalities("IMAGE")
            .build());

### REST

    -d '{
      "contents": [{
        "parts": [
          {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
        ]
      }],
      "generationConfig": {
        "responseModalities": ["Image"]
      }
    }' \

### Aspect ratios and image size

The model defaults to matching the output image size to that of your input image, or otherwise generates 1:1 squares. You can control the aspect ratio of the output image using the`aspect_ratio`field under`image_config`in the response request, shown here:  

### Python

    # For gemini-2.5-flash-image
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
        config=types.GenerateContentConfig(
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
            )
        )
    )

    # For gemini-3-pro-image-preview
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
                image_size="2K",
            )
        )
    )

### JavaScript

    // For gemini-2.5-flash-image
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        }
      });

    // For gemini-3-pro-image-preview
    const response_gemini3 = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "2K",
          },
        }
      });

### Go

    // For gemini-2.5-flash-image
    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash-image",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ImageConfig: &genai.ImageConfig{
              AspectRatio: "16:9",
            },
        }
      )

    // For gemini-3-pro-image-preview
    result_gemini3, _ := client.Models.GenerateContent(
        ctx,
        "gemini-3-pro-image-preview",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ImageConfig: &genai.ImageConfig{
              AspectRatio: "16:9",
              ImageSize: "2K",
            },
        }
      )

### Java

    // For gemini-2.5-flash-image
    response = client.models.generateContent(
        "gemini-2.5-flash-image",
        prompt,
        GenerateContentConfig.builder()
            .imageConfig(ImageConfig.builder()
                .aspectRatio("16:9")
                .build())
            .build());

    // For gemini-3-pro-image-preview
    response_gemini3 = client.models.generateContent(
        "gemini-3-pro-image-preview",
        prompt,
        GenerateContentConfig.builder()
            .imageConfig(ImageConfig.builder()
                .aspectRatio("16:9")
                .imageSize("2K")
                .build())
            .build());

### REST

    # For gemini-2.5-flash-image
    -d '{
      "contents": [{
        "parts": [
          {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
        ]
      }],
      "generationConfig": {
        "imageConfig": {
          "aspectRatio": "16:9"
        }
      }
    }' \

    # For gemini-3-pro-image-preview
    -d '{
      "contents": [{
        "parts": [
          {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
        ]
      }],
      "generationConfig": {
        "imageConfig": {
          "aspectRatio": "16:9",
          "imageSize": "2K"
        }
      }
    }' \

The different ratios available and the size of the image generated are listed in the following tables:

**Gemini 2.5 Flash Image**

| Aspect ratio | Resolution | Tokens |
|--------------|------------|--------|
| 1:1          | 1024x1024  | 1290   |
| 2:3          | 832x1248   | 1290   |
| 3:2          | 1248x832   | 1290   |
| 3:4          | 864x1184   | 1290   |
| 4:3          | 1184x864   | 1290   |
| 4:5          | 896x1152   | 1290   |
| 5:4          | 1152x896   | 1290   |
| 9:16         | 768x1344   | 1290   |
| 16:9         | 1344x768   | 1290   |
| 21:9         | 1536x672   | 1290   |

**Gemini 3 Pro Image Preview**

| Aspect ratio | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
|--------------|---------------|-----------|---------------|-----------|---------------|-----------|
| **1:1**      | 1024x1024     | 1120      | 2048x2048     | 1120      | 4096x4096     | 2000      |
| **2:3**      | 848x1264      | 1120      | 1696x2528     | 1120      | 3392x5056     | 2000      |
| **3:2**      | 1264x848      | 1120      | 2528x1696     | 1120      | 5056x3392     | 2000      |
| **3:4**      | 896x1200      | 1120      | 1792x2400     | 1120      | 3584x4800     | 2000      |
| **4:3**      | 1200x896      | 1120      | 2400x1792     | 1120      | 4800x3584     | 2000      |
| **4:5**      | 928x1152      | 1120      | 1856x2304     | 1120      | 3712x4608     | 2000      |
| **5:4**      | 1152x928      | 1120      | 2304x1856     | 1120      | 4608x3712     | 2000      |
| **9:16**     | 768x1376      | 1120      | 1536x2752     | 1120      | 3072x5504     | 2000      |
| **16:9**     | 1376x768      | 1120      | 2752x1536     | 1120      | 5504x3072     | 2000      |
| **21:9**     | 1584x672      | 1120      | 3168x1344     | 1120      | 6336x2688     | 2000      |

## Model selection

Choose the model best suited for your specific use case.

- **Gemini 3 Pro Image Preview (Nano Banana Pro Preview)**is designed for professional asset production and complex instructions. This model features real-world grounding using Google Search, a default "Thinking" process that refines composition prior to generation, and can generate images of up to 4K resolutions.

- **Gemini 2.5 Flash Image (Nano Banana)**is designed for speed and efficiency. This model is optimized for high-volume, low-latency tasks and generates images at 1024px resolution.

### When to use Imagen

In addition to using Gemini's built-in image generation capabilities, you can also access[Imagen](https://ai.google.dev/gemini-api/docs/imagen), our specialized image generation model, through the Gemini API.

|     Attribute     |                                                                                                                 Imagen                                                                                                                 |                                                                                                                                                                                               Gemini Native Image                                                                                                                                                                                                |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Strengths         | Model specializes in image generation.                                                                                                                                                                                                 | **Default recommendation.** Unparalleled flexibility, contextual understanding, and simple, mask-free editing. Uniquely capable of multi-turn conversational editing.                                                                                                                                                                                                                                            |
| Availability      | Generally available                                                                                                                                                                                                                    | Preview (Production usage allowed)                                                                                                                                                                                                                                                                                                                                                                               |
| Latency           | **Low**. Optimized for near-real-time performance.                                                                                                                                                                                     | Higher. More computation is required for its advanced capabilities.                                                                                                                                                                                                                                                                                                                                              |
| Cost              | Cost-effective for specialized tasks. $0.02/image to $0.12/image                                                                                                                                                                       | Token-based pricing. $30 per 1 million tokens for image output (image output tokenized at 1290 tokens per image flat, up to 1024x1024px)                                                                                                                                                                                                                                                                         |
| Recommended tasks | - Image quality, photorealism, artistic detail, or specific styles (e.g., impressionism, anime) are top priorities. - Infusing branding, style, or generating logos and product designs. - Generating advanced spelling or typography. | - Interleaved text and image generation to seamlessly blend text and images. - Combine creative elements from multiple images with a single prompt. - Make highly specific edits to images, modify individual elements with simple language commands, and iteratively work on an image. - Apply a specific design or texture from one image to another while preserving the original subject's form and details. |

Imagen 4 should be your go-to model when starting to generate images with Imagen. Choose Imagen 4 Ultra for advanced use-cases or when you need the best image quality (note that can only generate one image at a time).

## What's next

- Find more examples and code samples in the[cookbook guide](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_Started_Nano_Banana.ipynb).
- Check out the[Veo guide](https://ai.google.dev/gemini-api/docs/video)to learn how to generate videos with the Gemini API.
- To learn more about Gemini models, see[Gemini models](https://ai.google.dev/gemini-api/docs/models/gemini).

<br />

Gemini models can process videos, enabling many frontier developer use cases that would have historically required domain specific models. Some of Gemini's vision capabilities include the ability to: describe, segment, and extract information from videos, answer questions about video content, and refer to specific timestamps within a video.

You can provide videos as input to Gemini in the following ways:

- [Upload a video file](https://ai.google.dev/gemini-api/docs/video-understanding#upload-video)using the File API before making a request. Use this approach for files larger than 20MB, videos longer than approximately 1 minute, or when you want to reuse the file across multiple requests.
- [Pass inline video data](https://ai.google.dev/gemini-api/docs/video-understanding#inline-video)in your request. Use this method for smaller files (\<20MB) and shorter durations.
- [Pass YouTube URLs](https://ai.google.dev/gemini-api/docs/video-understanding#youtube)as part of your request.

### Upload a video file

The following code downloads a sample video, uploads it using the[Files API](https://ai.google.dev/gemini-api/docs/files), waits for it to be processed, and then uses the uploaded file reference to summarize the video.  

### Python

    from google import genai

    client = genai.Client()

    myfile = client.files.upload(file="path/to/sample.mp4")

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=[myfile, "Summarize this video. Then create a quiz with an answer key based on the information in this video."]
    )

    print(response.text)

### JavaScript

    import {
      GoogleGenAI,
      createUserContent,
      createPartFromUri,
    } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const myfile = await ai.files.upload({
        file: "path/to/sample.mp4",
        config: { mimeType: "video/mp4" },
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([
          createPartFromUri(myfile.uri, myfile.mimeType),
          "Summarize this video. Then create a quiz with an answer key based on the information in this video.",
        ]),
      });
      console.log(response.text);
    }

    await main();

### Go

    uploadedFile, _ := client.Files.UploadFromPath(ctx, "path/to/sample.mp4", nil)

    parts := []*genai.Part{
        genai.NewPartFromText("Summarize this video. Then create a quiz with an answer key based on the information in this video."),
        genai.NewPartFromURI(uploadedFile.URI, uploadedFile.MIMEType),
    }

    contents := []*genai.Content{
        genai.NewContentFromParts(parts, genai.RoleUser),
    }

    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash",
        contents,
        nil,
    )

    fmt.Println(result.Text())

### REST

    VIDEO_PATH="path/to/sample.mp4"
    MIME_TYPE=$(file -b --mime-type "${VIDEO_PATH}")
    NUM_BYTES=$(wc -c < "${VIDEO_PATH}")
    DISPLAY_NAME=VIDEO

    tmp_header_file=upload-header.tmp

    echo "Starting file upload..."
    curl "https://generativelanguage.googleapis.com/upload/v1beta/files" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -D ${tmp_header_file} \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

    upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
    rm "${tmp_header_file}"

    echo "Uploading video data..."
    curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${VIDEO_PATH}" 2> /dev/null > file_info.json

    file_uri=$(jq -r ".file.uri" file_info.json)
    echo file_uri=$file_uri

    echo "File uploaded successfully. File URI: ${file_uri}"

    # --- 3. Generate content using the uploaded video file ---
    echo "Generating content from video..."
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              {"file_data":{"mime_type": "'"${MIME_TYPE}"'", "file_uri": "'"${file_uri}"'"}},
              {"text": "Summarize this video. Then create a quiz with an answer key based on the information in this video."}]
            }]
          }' 2> /dev/null > response.json

    jq -r ".candidates[].content.parts[].text" response.json

Always use the Files API when the total request size (including the file, text prompt, system instructions, etc.) is larger than 20 MB, the video duration is significant, or if you intend to use the same video in multiple prompts. The File API accepts video file formats directly.

To learn more about working with media files, see[Files API](https://ai.google.dev/gemini-api/docs/files).

### Pass video data inline

Instead of uploading a video file using the File API, you can pass smaller videos directly in the request to`generateContent`. This is suitable for shorter videos under 20MB total request size.

Here's an example of providing inline video data:  

### Python

    from google import genai
    from google.genai import types

    # Only for videos of size <20Mb
    video_file_name = "/path/to/your/video.mp4"
    video_bytes = open(video_file_name, 'rb').read()

    client = genai.Client()
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=types.Content(
            parts=[
                types.Part(
                    inline_data=types.Blob(data=video_bytes, mime_type='video/mp4')
                ),
                types.Part(text='Please summarize the video in 3 sentences.')
            ]
        )
    )
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    const ai = new GoogleGenAI({});
    const base64VideoFile = fs.readFileSync("path/to/small-sample.mp4", {
      encoding: "base64",
    });

    const contents = [
      {
        inlineData: {
          mimeType: "video/mp4",
          data: base64VideoFile,
        },
      },
      { text: "Please summarize the video in 3 sentences." }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    console.log(response.text);

### REST

**Note:** If you get an`Argument list too long`error, the base64 encoding of your file might be too long for the curl command line. Use the File API method instead for larger files.  

    VIDEO_PATH=/path/to/your/video.mp4

    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
                {
                  "inline_data": {
                    "mime_type":"video/mp4",
                    "data": "'$(base64 $B64FLAGS $VIDEO_PATH)'"
                  }
                },
                {"text": "Please summarize the video in 3 sentences."}
            ]
          }]
        }' 2> /dev/null

### Pass YouTube URLs

| **Preview:** The YouTube URL feature is in preview and is available at no charge. Pricing and rate limits are likely to change.

You can pass YouTube URLs directly to Gemini API as part of your request as follows:  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=types.Content(
            parts=[
                types.Part(
                    file_data=types.FileData(file_uri='https://www.youtube.com/watch?v=9hE5-98ZeCg')
                ),
                types.Part(text='Please summarize the video in 3 sentences.')
            ]
        )
    )
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    const contents = [
      {
        fileData: {
          fileUri: "https://www.youtube.com/watch?v=9hE5-98ZeCg",
        },
      },
      { text: "Please summarize the video in 3 sentences." }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    console.log(response.text);

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      parts := []*genai.Part{
          genai.NewPartFromText("Please summarize the video in 3 sentences."),
          genai.NewPartFromURI("https://www.youtube.com/watch?v=9hE5-98ZeCg","video/mp4"),
      }

      contents := []*genai.Content{
          genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-2.5-flash",
          contents,
          nil,
      )

      fmt.Println(result.Text())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
                {"text": "Please summarize the video in 3 sentences."},
                {
                  "file_data": {
                    "file_uri": "https://www.youtube.com/watch?v=9hE5-98ZeCg"
                  }
                }
            ]
          }]
        }' 2> /dev/null

**Limitations:**

- For the free tier, you can't upload more than 8 hours of YouTube video per day.
- For the paid tier, there is no limit based on video length.
- For models prior to Gemini 2.5, you can upload only 1 video per request. For Gemini 2.5 and later models, you can upload a maximum of 10 videos per request.
- You can only upload public videos (not private or unlisted videos).

## Refer to timestamps in the content

You can ask questions about specific points in time within the video using timestamps of the form`MM:SS`.  

### Python

    prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?" # Adjusted timestamps for the NASA video

### JavaScript

    const prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?";

### Go

        prompt := []*genai.Part{
            genai.NewPartFromURI(currentVideoFile.URI, currentVideoFile.MIMEType),
             // Adjusted timestamps for the NASA video
            genai.NewPartFromText("What are the examples given at 00:05 and " +
                "00:10 supposed to show us?"),
        }

### REST

    PROMPT="What are the examples given at 00:05 and 00:10 supposed to show us?"

## Extract detailed insights from video

Gemini models offer powerful capabilities for understanding video content by processing information from both the audio and visual streams. This lets you extract a rich set of details, including generating descriptions of what is happening in a video and answering questions about its content. For visual descriptions, the model samples the video at a rate of**1 frame per second**. This sampling rate may affect the level of detail in the descriptions, particularly for videos with rapidly changing visuals.  

### Python

    prompt = "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments."

### JavaScript

    const prompt = "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments.";

### Go

        prompt := []*genai.Part{
            genai.NewPartFromURI(currentVideoFile.URI, currentVideoFile.MIMEType),
            genai.NewPartFromText("Describe the key events in this video, providing both audio and visual details. " +
          "Include timestamps for salient moments."),
        }

### REST

    PROMPT="Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments."

## Customize video processing

You can customize video processing in the Gemini API by setting clipping intervals or providing custom frame rate sampling.
| **Tip:** Video clipping and frames per second (FPS) are supported by all models, but the quality is significantly higher from 2.5 series models.

### Set clipping intervals

You can clip video by specifying`videoMetadata`with start and end offsets.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=types.Content(
            parts=[
                types.Part(
                    file_data=types.FileData(file_uri='https://www.youtube.com/watch?v=XEzRZ35urlk'),
                    video_metadata=types.VideoMetadata(
                        start_offset='1250s',
                        end_offset='1570s'
                    )
                ),
                types.Part(text='Please summarize the video in 3 sentences.')
            ]
        )
    )

### JavaScript

    import { GoogleGenAI } from '@google/genai';
    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash';

    async function main() {
    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: 'https://www.youtube.com/watch?v=9hE5-98ZeCg',
              mimeType: 'video/*',
            },
            videoMetadata: {
              startOffset: '40s',
              endOffset: '80s',
            }
          },
          {
            text: 'Please summarize the video in 3 sentences.',
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    console.log(response.text)

    }

    await main();

### Set a custom frame rate

You can set custom frame rate sampling by passing an`fps`argument to`videoMetadata`.
**Note:** Due to built-in per image based safety checks, the same video may get blocked at some fps and not at others due to different extracted frames.  

### Python

    from google import genai
    from google.genai import types

    # Only for videos of size <20Mb
    video_file_name = "/path/to/your/video.mp4"
    video_bytes = open(video_file_name, 'rb').read()

    client = genai.Client()
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=types.Content(
            parts=[
                types.Part(
                    inline_data=types.Blob(
                        data=video_bytes,
                        mime_type='video/mp4'),
                    video_metadata=types.VideoMetadata(fps=5)
                ),
                types.Part(text='Please summarize the video in 3 sentences.')
            ]
        )
    )

By default 1 frame per second (FPS) is sampled from the video. You might want to set low FPS (\< 1) for long videos. This is especially useful for mostly static videos (e.g. lectures). Use a higher FPS for videos requiring granular temporal analysis, such as fast-action understanding or high-speed motion tracking.

## Supported video formats

Gemini supports the following video format MIME types:

- `video/mp4`
- `video/mpeg`
- `video/mov`
- `video/avi`
- `video/x-flv`
- `video/mpg`
- `video/webm`
- `video/wmv`
- `video/3gpp`

## Technical details about videos

- **Supported models \& context** : All Gemini can process video data.
  - Models with a 1M context window can process videos up to 1 hour long at default media resolution or 3 hours long at low media resolution.
- **File API processing** : When using the File API, videos are stored at 1 frame per second (FPS) and audio is processed at 1Kbps (single channel). Timestamps are added every second.
  - These rates are subject to change in the future for improvements in inference.
  - You can override the 1 FPS sampling rate by[setting a custom frame rate](https://ai.google.dev/gemini-api/docs/video-understanding#custom-frame-rate).
- **Token calculation** : Each second of video is tokenized as follows:
  - Individual frames (sampled at 1 FPS):
    - If[`mediaResolution`](https://ai.google.dev/api/generate-content#MediaResolution)is set to low, frames are tokenized at 66 tokens per frame.
    - Otherwise, frames are tokenized at 258 tokens per frame.
  - Audio: 32 tokens per second.
  - Metadata is also included.
  - Total: Approximately 300 tokens per second of video at default media resolution, or 100 tokens per second of video at low media resolution.
- **Medial resolution** : Gemini 3 introduces granular control over multimodal vision processing with the`media_resolution`parameter. The`media_resolution`parameter determines the**maximum number of tokens allocated per input image or video frame.**Higher resolutions improve the model's ability to read fine text or identify small details, but increase token usage and latency.

  For more details about the parameter and how it can impact token calculations, see the[media resolution](https://ai.google.dev/gemini-api/docs/media-resolution)guide.
- **Timestamp format** : When referring to specific moments in a video within your prompt, use the`MM:SS`format (e.g.,`01:15`for 1 minute and 15 seconds).

- **Best practices**:

  - Use only one video per prompt request for optimal results.
  - If combining text and a single video, place the text prompt*after* the video part in the`contents`array.
  - Be aware that fast action sequences might lose detail due to the 1 FPS sampling rate. Consider slowing down such clips if necessary.

## What's next

This guide shows how to upload video files and generate text outputs from video inputs. To learn more, see the following resources:

- [System instructions](https://ai.google.dev/gemini-api/docs/text-generation#system-instructions): System instructions let you steer the behavior of the model based on your specific needs and use cases.
- [Files API](https://ai.google.dev/gemini-api/docs/files): Learn more about uploading and managing files for use with Gemini.
- [File prompting strategies](https://ai.google.dev/gemini-api/docs/files#prompt-guide): The Gemini API supports prompting with text, image, audio, and video data, also known as multimodal prompting.
- [Safety guidance](https://ai.google.dev/gemini-api/docs/safety-guidance): Sometimes generative AI models produce unexpected outputs, such as outputs that are inaccurate, biased, or offensive. Post-processing and human evaluation are essential to limit the risk of harm from such outputs.

<br />

Gemini models can process documents in PDF format, using native vision to understand entire document contexts. This goes beyond just text extraction, allowing Gemini to:

- Analyze and interpret content, including text, images, diagrams, charts, and tables, even in long documents up to 1000 pages.
- Extract information into[structured output](https://ai.google.dev/gemini-api/docs/structured-output)formats.
- Summarize and answer questions based on both the visual and textual elements in a document.
- Transcribe document content (e.g. to HTML), preserving layouts and formatting, for use in downstream applications.

You can also pass non-PDF documents in the same way but Gemini will see them as normal text which will eliminate context like charts or formatting.

## Passing PDF data inline

You can pass PDF data inline in the request to`generateContent`. This is best suited for smaller documents or temporary processing where you don't need to reference the file in subsequent requests. We recommend using the[Files API](https://ai.google.dev/gemini-api/docs/document-processing#large-pdfs)for larger documents that you need to refer to in multi-turn interactions to improve request latency and reduce bandwidth usage.

The following example shows you how to fetch a PDF from a URL and convert it to bytes for processing:  

### Python

    from google import genai
    from google.genai import types
    import httpx

    client = genai.Client()

    doc_url = "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"

    # Retrieve and encode the PDF byte
    doc_data = httpx.get(doc_url).content

    prompt = "Summarize this document"
    response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=[
          types.Part.from_bytes(
            data=doc_data,
            mime_type='application/pdf',
          ),
          prompt])
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

    async function main() {
        const pdfResp = await fetch('https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf')
            .then((response) => response.arrayBuffer());

        const contents = [
            { text: "Summarize this document" },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: Buffer.from(pdfResp).toString("base64")
                }
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents
        });
        console.log(response.text);
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "io"
        "net/http"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, _ := genai.NewClient(ctx, &genai.ClientConfig{
            APIKey:  os.Getenv("GEMINI_API_KEY"),
            Backend: genai.BackendGeminiAPI,
        })

        pdfResp, _ := http.Get("https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf")
        var pdfBytes []byte
        if pdfResp != nil && pdfResp.Body != nil {
            pdfBytes, _ = io.ReadAll(pdfResp.Body)
            pdfResp.Body.Close()
        }

        parts := []*genai.Part{
            &genai.Part{
                InlineData: &genai.Blob{
                    MIMEType: "application/pdf",
                    Data:     pdfBytes,
                },
            },
            genai.NewPartFromText("Summarize this document"),
        }

        contents := []*genai.Content{
            genai.NewContentFromParts(parts, genai.RoleUser),
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            contents,
            nil,
        )

        fmt.Println(result.Text())
    }

### REST

    DOC_URL="https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
    PROMPT="Summarize this document"
    DISPLAY_NAME="base64_pdf"

    # Download the PDF
    wget -O "${DISPLAY_NAME}.pdf" "${DOC_URL}"

    # Check for FreeBSD base64 and set flags accordingly
    if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
    else
      B64FLAGS="-w0"
    fi

    # Base64 encode the PDF
    ENCODED_PDF=$(base64 $B64FLAGS "${DISPLAY_NAME}.pdf")

    # Generate content using the base64 encoded PDF
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GOOGLE_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              {"inline_data": {"mime_type": "application/pdf", "data": "'"$ENCODED_PDF"'"}},
              {"text": "'$PROMPT'"}
            ]
          }]
        }' 2> /dev/null > response.json

    cat response.json
    echo

    jq ".candidates[].content.parts[].text" response.json

    # Clean up the downloaded PDF
    rm "${DISPLAY_NAME}.pdf"

You can also read a PDF from a local file for processing:  

### Python

    from google import genai
    from google.genai import types
    import pathlib

    client = genai.Client()

    # Retrieve and encode the PDF byte
    filepath = pathlib.Path('file.pdf')

    prompt = "Summarize this document"
    response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=[
          types.Part.from_bytes(
            data=filepath.read_bytes(),
            mime_type='application/pdf',
          ),
          prompt])
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from 'fs';

    const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

    async function main() {
        const contents = [
            { text: "Summarize this document" },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: Buffer.from(fs.readFileSync("content/343019_3_art_0_py4t4l_convrt.pdf")).toString("base64")
                }
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents
        });
        console.log(response.text);
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, _ := genai.NewClient(ctx, &genai.ClientConfig{
            APIKey:  os.Getenv("GEMINI_API_KEY"),
            Backend: genai.BackendGeminiAPI,
        })

        pdfBytes, _ := os.ReadFile("path/to/your/file.pdf")

        parts := []*genai.Part{
            &genai.Part{
                InlineData: &genai.Blob{
                    MIMEType: "application/pdf",
                    Data:     pdfBytes,
                },
            },
            genai.NewPartFromText("Summarize this document"),
        }
        contents := []*genai.Content{
            genai.NewContentFromParts(parts, genai.RoleUser),
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            contents,
            nil,
        )

        fmt.Println(result.Text())
    }

## Uploading PDFs using the Files API

We recommend you use Files API for larger files or when you intend to reuse a document across multiple requests. This improves request latency and reduces bandwidth usage by decoupling the file upload from the model requests.
| **Note:** The Files API is available at no cost in all regions where the Gemini API is available. Uploaded files are stored for 48 hours.

### Large PDFs from URLs

Use the File API to simplify uploading and processing large PDF files from URLs:  

### Python

    from google import genai
    from google.genai import types
    import io
    import httpx

    client = genai.Client()

    long_context_pdf_path = "https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/A17_FlightPlan.pdf"

    # Retrieve and upload the PDF using the File API
    doc_io = io.BytesIO(httpx.get(long_context_pdf_path).content)

    sample_doc = client.files.upload(
      # You can pass a path or a file-like object here
      file=doc_io,
      config=dict(
        mime_type='application/pdf')
    )

    prompt = "Summarize this document"

    response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=[sample_doc, prompt])
    print(response.text)

### JavaScript

    import { createPartFromUri, GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

    async function main() {

        const pdfBuffer = await fetch("https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/A17_FlightPlan.pdf")
            .then((response) => response.arrayBuffer());

        const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        const file = await ai.files.upload({
            file: fileBlob,
            config: {
                displayName: 'A17_FlightPlan.pdf',
            },
        });

        // Wait for the file to be processed.
        let getFile = await ai.files.get({ name: file.name });
        while (getFile.state === 'PROCESSING') {
            getFile = await ai.files.get({ name: file.name });
            console.log(`current file status: ${getFile.state}`);
            console.log('File is still processing, retrying in 5 seconds');

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
        if (file.state === 'FAILED') {
            throw new Error('File processing failed.');
        }

        // Add the file to the contents.
        const content = [
            'Summarize this document',
        ];

        if (file.uri && file.mimeType) {
            const fileContent = createPartFromUri(file.uri, file.mimeType);
            content.push(fileContent);
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
        });

        console.log(response.text);

    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "io"
      "net/http"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, _ := genai.NewClient(ctx, &genai.ClientConfig{
        APIKey:  os.Getenv("GEMINI_API_KEY"),
        Backend: genai.BackendGeminiAPI,
      })

      pdfURL := "https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/A17_FlightPlan.pdf"
      localPdfPath := "A17_FlightPlan_downloaded.pdf"

      respHttp, _ := http.Get(pdfURL)
      defer respHttp.Body.Close()

      outFile, _ := os.Create(localPdfPath)
      defer outFile.Close()

      _, _ = io.Copy(outFile, respHttp.Body)

      uploadConfig := &genai.UploadFileConfig{MIMEType: "application/pdf"}
      uploadedFile, _ := client.Files.UploadFromPath(ctx, localPdfPath, uploadConfig)

      promptParts := []*genai.Part{
        genai.NewPartFromURI(uploadedFile.URI, uploadedFile.MIMEType),
        genai.NewPartFromText("Summarize this document"),
      }
      contents := []*genai.Content{
        genai.NewContentFromParts(promptParts, genai.RoleUser), // Specify role
      }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            contents,
            nil,
        )

      fmt.Println(result.Text())
    }

### REST

    PDF_PATH="https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/A17_FlightPlan.pdf"
    DISPLAY_NAME="A17_FlightPlan"
    PROMPT="Summarize this document"

    # Download the PDF from the provided URL
    wget -O "${DISPLAY_NAME}.pdf" "${PDF_PATH}"

    MIME_TYPE=$(file -b --mime-type "${DISPLAY_NAME}.pdf")
    NUM_BYTES=$(wc -c < "${DISPLAY_NAME}.pdf")

    echo "MIME_TYPE: ${MIME_TYPE}"
    echo "NUM_BYTES: ${NUM_BYTES}"

    tmp_header_file=upload-header.tmp

    # Initial resumable request defining metadata.
    # The upload url is in the response headers dump them to a file.
    curl "${BASE_URL}/upload/v1beta/files?key=${GOOGLE_API_KEY}" \
      -D upload-header.tmp \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

    upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
    rm "${tmp_header_file}"

    # Upload the actual bytes.
    curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${DISPLAY_NAME}.pdf" 2> /dev/null > file_info.json

    file_uri=$(jq ".file.uri" file_info.json)
    echo "file_uri: ${file_uri}"

    # Now generate content using that file
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GOOGLE_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              {"text": "'$PROMPT'"},
              {"file_data":{"mime_type": "application/pdf", "file_uri": '$file_uri'}}]
            }]
          }' 2> /dev/null > response.json

    cat response.json
    echo

    jq ".candidates[].content.parts[].text" response.json

    # Clean up the downloaded PDF
    rm "${DISPLAY_NAME}.pdf"

### Large PDFs stored locally

### Python

    from google import genai
    from google.genai import types
    import pathlib
    import httpx

    client = genai.Client()

    # Retrieve and encode the PDF byte
    file_path = pathlib.Path('large_file.pdf')

    # Upload the PDF using the File API
    sample_file = client.files.upload(
      file=file_path,
    )

    prompt="Summarize this document"

    response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=[sample_file, "Summarize this document"])
    print(response.text)

### JavaScript

    import { createPartFromUri, GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

    async function main() {
        const file = await ai.files.upload({
            file: 'path-to-localfile.pdf'
            config: {
                displayName: 'A17_FlightPlan.pdf',
            },
        });

        // Wait for the file to be processed.
        let getFile = await ai.files.get({ name: file.name });
        while (getFile.state === 'PROCESSING') {
            getFile = await ai.files.get({ name: file.name });
            console.log(`current file status: ${getFile.state}`);
            console.log('File is still processing, retrying in 5 seconds');

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
        if (file.state === 'FAILED') {
            throw new Error('File processing failed.');
        }

        // Add the file to the contents.
        const content = [
            'Summarize this document',
        ];

        if (file.uri && file.mimeType) {
            const fileContent = createPartFromUri(file.uri, file.mimeType);
            content.push(fileContent);
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
        });

        console.log(response.text);

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, _ := genai.NewClient(ctx, &genai.ClientConfig{
            APIKey:  os.Getenv("GEMINI_API_KEY"),
            Backend: genai.BackendGeminiAPI,
        })
        localPdfPath := "/path/to/file.pdf"

        uploadConfig := &genai.UploadFileConfig{MIMEType: "application/pdf"}
        uploadedFile, _ := client.Files.UploadFromPath(ctx, localPdfPath, uploadConfig)

        promptParts := []*genai.Part{
            genai.NewPartFromURI(uploadedFile.URI, uploadedFile.MIMEType),
            genai.NewPartFromText("Give me a summary of this pdf file."),
        }
        contents := []*genai.Content{
            genai.NewContentFromParts(promptParts, genai.RoleUser),
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            contents,
            nil,
        )

        fmt.Println(result.Text())
    }

### REST

    NUM_BYTES=$(wc -c < "${PDF_PATH}")
    DISPLAY_NAME=TEXT
    tmp_header_file=upload-header.tmp

    # Initial resumable request defining metadata.
    # The upload url is in the response headers dump them to a file.
    curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
      -D upload-header.tmp \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: application/pdf" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

    upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
    rm "${tmp_header_file}"

    # Upload the actual bytes.
    curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${PDF_PATH}" 2> /dev/null > file_info.json

    file_uri=$(jq ".file.uri" file_info.json)
    echo file_uri=$file_uri

    # Now generate content using that file
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GOOGLE_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              {"text": "Can you add a few more lines to this poem?"},
              {"file_data":{"mime_type": "application/pdf", "file_uri": '$file_uri'}}]
            }]
          }' 2> /dev/null > response.json

    cat response.json
    echo

    jq ".candidates[].content.parts[].text" response.json

You can verify the API successfully stored the uploaded file and get its metadata by calling[`files.get`](https://ai.google.dev/api/rest/v1beta/files/get). Only the`name`(and by extension, the`uri`) are unique.  

### Python

    from google import genai
    import pathlib

    client = genai.Client()

    fpath = pathlib.Path('example.txt')
    fpath.write_text('hello')

    file = client.files.upload(file='example.txt')

    file_info = client.files.get(name=file.name)
    print(file_info.model_dump_json(indent=4))

### REST

    name=$(jq ".file.name" file_info.json)
    # Get the file of interest to check state
    curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
    # Print some information about the file you got
    name=$(jq ".file.name" file_info.json)
    echo name=$name
    file_uri=$(jq ".file.uri" file_info.json)
    echo file_uri=$file_uri

## Passing multiple PDFs

The Gemini API is capable of processing multiple PDF documents (up to 1000 pages) in a single request, as long as the combined size of the documents and the text prompt stays within the model's context window.  

### Python

    from google import genai
    import io
    import httpx

    client = genai.Client()

    doc_url_1 = "https://arxiv.org/pdf/2312.11805"
    doc_url_2 = "https://arxiv.org/pdf/2403.05530"

    # Retrieve and upload both PDFs using the File API
    doc_data_1 = io.BytesIO(httpx.get(doc_url_1).content)
    doc_data_2 = io.BytesIO(httpx.get(doc_url_2).content)

    sample_pdf_1 = client.files.upload(
      file=doc_data_1,
      config=dict(mime_type='application/pdf')
    )
    sample_pdf_2 = client.files.upload(
      file=doc_data_2,
      config=dict(mime_type='application/pdf')
    )

    prompt = "What is the difference between each of the main benchmarks between these two papers? Output these in a table."

    response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=[sample_pdf_1, sample_pdf_2, prompt])
    print(response.text)

### JavaScript

    import { createPartFromUri, GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

    async function uploadRemotePDF(url, displayName) {
        const pdfBuffer = await fetch(url)
            .then((response) => response.arrayBuffer());

        const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        const file = await ai.files.upload({
            file: fileBlob,
            config: {
                displayName: displayName,
            },
        });

        // Wait for the file to be processed.
        let getFile = await ai.files.get({ name: file.name });
        while (getFile.state === 'PROCESSING') {
            getFile = await ai.files.get({ name: file.name });
            console.log(`current file status: ${getFile.state}`);
            console.log('File is still processing, retrying in 5 seconds');

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
        if (file.state === 'FAILED') {
            throw new Error('File processing failed.');
        }

        return file;
    }

    async function main() {
        const content = [
            'What is the difference between each of the main benchmarks between these two papers? Output these in a table.',
        ];

        let file1 = await uploadRemotePDF("https://arxiv.org/pdf/2312.11805", "PDF 1")
        if (file1.uri && file1.mimeType) {
            const fileContent = createPartFromUri(file1.uri, file1.mimeType);
            content.push(fileContent);
        }
        let file2 = await uploadRemotePDF("https://arxiv.org/pdf/2403.05530", "PDF 2")
        if (file2.uri && file2.mimeType) {
            const fileContent = createPartFromUri(file2.uri, file2.mimeType);
            content.push(fileContent);
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
        });

        console.log(response.text);
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "io"
        "net/http"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, _ := genai.NewClient(ctx, &genai.ClientConfig{
            APIKey:  os.Getenv("GEMINI_API_KEY"),
            Backend: genai.BackendGeminiAPI,
        })

        docUrl1 := "https://arxiv.org/pdf/2312.11805"
        docUrl2 := "https://arxiv.org/pdf/2403.05530"
        localPath1 := "doc1_downloaded.pdf"
        localPath2 := "doc2_downloaded.pdf"

        respHttp1, _ := http.Get(docUrl1)
        defer respHttp1.Body.Close()

        outFile1, _ := os.Create(localPath1)
        _, _ = io.Copy(outFile1, respHttp1.Body)
        outFile1.Close()

        respHttp2, _ := http.Get(docUrl2)
        defer respHttp2.Body.Close()

        outFile2, _ := os.Create(localPath2)
        _, _ = io.Copy(outFile2, respHttp2.Body)
        outFile2.Close()

        uploadConfig1 := &genai.UploadFileConfig{MIMEType: "application/pdf"}
        uploadedFile1, _ := client.Files.UploadFromPath(ctx, localPath1, uploadConfig1)

        uploadConfig2 := &genai.UploadFileConfig{MIMEType: "application/pdf"}
        uploadedFile2, _ := client.Files.UploadFromPath(ctx, localPath2, uploadConfig2)

        promptParts := []*genai.Part{
            genai.NewPartFromURI(uploadedFile1.URI, uploadedFile1.MIMEType),
            genai.NewPartFromURI(uploadedFile2.URI, uploadedFile2.MIMEType),
            genai.NewPartFromText("What is the difference between each of the " +
                                  "main benchmarks between these two papers? " +
                                  "Output these in a table."),
        }
        contents := []*genai.Content{
            genai.NewContentFromParts(promptParts, genai.RoleUser),
        }

        modelName := "gemini-2.5-flash"
        result, _ := client.Models.GenerateContent(
            ctx,
            modelName,
            contents,
            nil,
        )

        fmt.Println(result.Text())
    }

### REST

    DOC_URL_1="https://arxiv.org/pdf/2312.11805"
    DOC_URL_2="https://arxiv.org/pdf/2403.05530"
    DISPLAY_NAME_1="Gemini_paper"
    DISPLAY_NAME_2="Gemini_1.5_paper"
    PROMPT="What is the difference between each of the main benchmarks between these two papers? Output these in a table."

    # Function to download and upload a PDF
    upload_pdf() {
      local doc_url="$1"
      local display_name="$2"

      # Download the PDF
      wget -O "${display_name}.pdf" "${doc_url}"

      local MIME_TYPE=$(file -b --mime-type "${display_name}.pdf")
      local NUM_BYTES=$(wc -c < "${display_name}.pdf")

      echo "MIME_TYPE: ${MIME_TYPE}"
      echo "NUM_BYTES: ${NUM_BYTES}"

      local tmp_header_file=upload-header.tmp

      # Initial resumable request
      curl "${BASE_URL}/upload/v1beta/files?key=${GOOGLE_API_KEY}" \
        -D "${tmp_header_file}" \
        -H "X-Goog-Upload-Protocol: resumable" \
        -H "X-Goog-Upload-Command: start" \
        -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
        -H "Content-Type: application/json" \
        -d "{'file': {'display_name': '${display_name}'}}" 2> /dev/null

      local upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      # Upload the PDF
      curl "${upload_url}" \
        -H "Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Offset: 0" \
        -H "X-Goog-Upload-Command: upload, finalize" \
        --data-binary "@${display_name}.pdf" 2> /dev/null > "file_info_${display_name}.json"

      local file_uri=$(jq ".file.uri" "file_info_${display_name}.json")
      echo "file_uri for ${display_name}: ${file_uri}"

      # Clean up the downloaded PDF
      rm "${display_name}.pdf"

      echo "${file_uri}"
    }

    # Upload the first PDF
    file_uri_1=$(upload_pdf "${DOC_URL_1}" "${DISPLAY_NAME_1}")

    # Upload the second PDF
    file_uri_2=$(upload_pdf "${DOC_URL_2}" "${DISPLAY_NAME_2}")

    # Now generate content using both files
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GOOGLE_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              {"file_data": {"mime_type": "application/pdf", "file_uri": '$file_uri_1'}},
              {"file_data": {"mime_type": "application/pdf", "file_uri": '$file_uri_2'}},
              {"text": "'$PROMPT'"}
            ]
          }]
        }' 2> /dev/null > response.json

    cat response.json
    echo

    jq ".candidates[].content.parts[].text" response.json

## Technical details

Gemini supports PDF files up to 50MB or 1000 pages. This limit applies to both inline data and Files API uploads. Each document page is equivalent to 258 tokens.

While there are no specific limits to the number of pixels in a document besides the model's[context window](https://ai.google.dev/gemini-api/docs/long-context), larger pages are scaled down to a maximum resolution of 3072 x 3072 while preserving their original aspect ratio, while smaller pages are scaled up to 768 x 768 pixels. There is no cost reduction for pages at lower sizes, other than bandwidth, or performance improvement for pages at higher resolution.

### Gemini 3 models

Gemini 3 introduces granular control over multimodal vision processing with the`media_resolution`parameter. You can now set the resolution to low, medium, or high per individual media part. With this addition, the processing of PDF documents has been updated:

1. **Native text inclusion:**Text natively embedded in the PDF is extracted and provided to the model.
2. **Billing \& token reporting:**
   - You are**not charged** for tokens originating from the extracted**native text**in PDFs.
   - In the`usage_metadata`section of the API response, tokens generated from processing PDF pages (as images) are now counted under the`IMAGE`modality, not a separate`DOCUMENT`modality as in some earlier versions.

For more details about the media resolution parameter, see the[Media resolution](https://ai.google.dev/gemini-api/docs/media-resolution)guide.

### Document types

Technically, you can pass other MIME types for document understanding, like TXT, Markdown, HTML, XML, etc. However, document vision***only meaningfully understands PDFs***. Other types will be extracted as pure text, and the model won't be able to interpret what we see in the rendering of those files. Any file-type specifics like charts, diagrams, HTML tags, Markdown formatting, etc., will be lost.

### Best practices

For best results:

- Rotate pages to the correct orientation before uploading.
- Avoid blurry pages.
- If using a single page, place the text prompt after the page.

## What's next

To learn more, see the following resources:

- [File prompting strategies](https://ai.google.dev/gemini-api/docs/files#prompt-guide): The Gemini API supports prompting with text, image, audio, and video data, also known as multimodal prompting.
- [System instructions](https://ai.google.dev/gemini-api/docs/text-generation#system-instructions): System instructions let you steer the behavior of the model based on your specific needs and use cases.
<br />

<br />

The Gemini API can transform text input into single speaker or multi-speaker audio using native text-to-speech (TTS) generation capabilities. Text-to-speech (TTS) generation is*[controllable](https://ai.google.dev/gemini-api/docs/speech-generation#controllable)* , meaning you can use natural language to structure interactions and guide the*style* ,*accent* ,*pace* , and*tone*of the audio.

The TTS capability differs from speech generation provided through the[Live API](https://ai.google.dev/gemini-api/docs/live), which is designed for interactive, unstructured audio, and multimodal inputs and outputs. While the Live API excels in dynamic conversational contexts, TTS through the Gemini API is tailored for scenarios that require exact text recitation with fine-grained control over style and sound, such as podcast or audiobook generation.

This guide shows you how to generate single-speaker and multi-speaker audio from text.
| **Preview:** Native text-to-speech (TTS) is in[Preview](https://ai.google.dev/gemini-api/docs/models#preview).

## Before you begin

Ensure you use a Gemini 2.5 model variant with native text-to-speech (TTS) capabilities, as listed in the[Supported models](https://ai.google.dev/gemini-api/docs/speech-generation#supported-models)section. For optimal results, consider which model best fits your specific use case.

You may find it useful to[test the Gemini 2.5 TTS models in AI Studio](https://aistudio.google.com/generate-speech)before you start building.
| **Note:** TTS models accept text-only inputs and produce audio-only outputs. For a complete list of restrictions specific to TTS models, review the[Limitations](https://ai.google.dev/gemini-api/docs/speech-generation#limitations)section.

## Single-speaker text-to-speech

To convert text to single-speaker audio, set the response modality to "audio", and pass a`SpeechConfig`object with`VoiceConfig`set. You'll need to choose a voice name from the prebuilt[output voices](https://ai.google.dev/gemini-api/docs/speech-generation#voices).

This example saves the output audio from the model in a wave file:  

### Python

    from google import genai
    from google.genai import types
    import wave

    # Set up the wave file to save the output:
    def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
       with wave.open(filename, "wb") as wf:
          wf.setnchannels(channels)
          wf.setsampwidth(sample_width)
          wf.setframerate(rate)
          wf.writeframes(pcm)

    client = genai.Client()

    response = client.models.generate_content(
       model="gemini-2.5-flash-preview-tts",
       contents="Say cheerfully: Have a wonderful day!",
       config=types.GenerateContentConfig(
          response_modalities=["AUDIO"],
          speech_config=types.SpeechConfig(
             voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                   voice_name='Kore',
                )
             )
          ),
       )
    )

    data = response.candidates[0].content.parts[0].inline_data.data

    file_name='out.wav'
    wave_file(file_name, data) # Saves the file to current directory

| For more code samples, refer to the "TTS - Get Started" file in the cookbooks repository:
|
| [View on GitHub](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_TTS.ipynb)

### JavaScript

    import {GoogleGenAI} from '@google/genai';
    import wav from 'wav';

    async function saveWaveFile(
       filename,
       pcmData,
       channels = 1,
       rate = 24000,
       sampleWidth = 2,
    ) {
       return new Promise((resolve, reject) => {
          const writer = new wav.FileWriter(filename, {
                channels,
                sampleRate: rate,
                bitDepth: sampleWidth * 8,
          });

          writer.on('finish', resolve);
          writer.on('error', reject);

          writer.write(pcmData);
          writer.end();
       });
    }

    async function main() {
       const ai = new GoogleGenAI({});

       const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
          config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                   voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                   },
                },
          },
       });

       const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
       const audioBuffer = Buffer.from(data, 'base64');

       const fileName = 'out.wav';
       await saveWaveFile(fileName, audioBuffer);
    }
    await main();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -X POST \
      -H "Content-Type: application/json" \
      -d '{
            "contents": [{
              "parts":[{
                "text": "Say cheerfully: Have a wonderful day!"
              }]
            }],
            "generationConfig": {
              "responseModalities": ["AUDIO"],
              "speechConfig": {
                "voiceConfig": {
                  "prebuiltVoiceConfig": {
                    "voiceName": "Kore"
                  }
                }
              }
            },
            "model": "gemini-2.5-flash-preview-tts",
        }' | jq -r '.candidates[0].content.parts[0].inlineData.data' | \
              base64 --decode >out.pcm
    # You may need to install ffmpeg.
    ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav

## Multi-speaker text-to-speech

For multi-speaker audio, you'll need a`MultiSpeakerVoiceConfig`object with each speaker (up to 2) configured as a`SpeakerVoiceConfig`. You'll need to define each`speaker`with the same names used in the[prompt](https://ai.google.dev/gemini-api/docs/speech-generation#controllable):  

### Python

    from google import genai
    from google.genai import types
    import wave

    # Set up the wave file to save the output:
    def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
       with wave.open(filename, "wb") as wf:
          wf.setnchannels(channels)
          wf.setsampwidth(sample_width)
          wf.setframerate(rate)
          wf.writeframes(pcm)

    client = genai.Client()

    prompt = """TTS the following conversation between Joe and Jane:
             Joe: How's it going today Jane?
             Jane: Not too bad, how about you?"""

    response = client.models.generate_content(
       model="gemini-2.5-flash-preview-tts",
       contents=prompt,
       config=types.GenerateContentConfig(
          response_modalities=["AUDIO"],
          speech_config=types.SpeechConfig(
             multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                   types.SpeakerVoiceConfig(
                      speaker='Joe',
                      voice_config=types.VoiceConfig(
                         prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Kore',
                         )
                      )
                   ),
                   types.SpeakerVoiceConfig(
                      speaker='Jane',
                      voice_config=types.VoiceConfig(
                         prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Puck',
                         )
                      )
                   ),
                ]
             )
          )
       )
    )

    data = response.candidates[0].content.parts[0].inline_data.data

    file_name='out.wav'
    wave_file(file_name, data) # Saves the file to current directory

### JavaScript

    import {GoogleGenAI} from '@google/genai';
    import wav from 'wav';

    async function saveWaveFile(
       filename,
       pcmData,
       channels = 1,
       rate = 24000,
       sampleWidth = 2,
    ) {
       return new Promise((resolve, reject) => {
          const writer = new wav.FileWriter(filename, {
                channels,
                sampleRate: rate,
                bitDepth: sampleWidth * 8,
          });

          writer.on('finish', resolve);
          writer.on('error', reject);

          writer.write(pcmData);
          writer.end();
       });
    }

    async function main() {
       const ai = new GoogleGenAI({});

       const prompt = `TTS the following conversation between Joe and Jane:
             Joe: How's it going today Jane?
             Jane: Not too bad, how about you?`;

       const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                   multiSpeakerVoiceConfig: {
                      speakerVoiceConfigs: [
                            {
                               speaker: 'Joe',
                               voiceConfig: {
                                  prebuiltVoiceConfig: { voiceName: 'Kore' }
                               }
                            },
                            {
                               speaker: 'Jane',
                               voiceConfig: {
                                  prebuiltVoiceConfig: { voiceName: 'Puck' }
                               }
                            }
                      ]
                   }
                }
          }
       });

       const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
       const audioBuffer = Buffer.from(data, 'base64');

       const fileName = 'out.wav';
       await saveWaveFile(fileName, audioBuffer);
    }

    await main();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -X POST \
      -H "Content-Type: application/json" \
      -d '{
      "contents": [{
        "parts":[{
          "text": "TTS the following conversation between Joe and Jane:
                    Joe: Hows it going today Jane?
                    Jane: Not too bad, how about you?"
        }]
      }],
      "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
          "multiSpeakerVoiceConfig": {
            "speakerVoiceConfigs": [{
                "speaker": "Joe",
                "voiceConfig": {
                  "prebuiltVoiceConfig": {
                    "voiceName": "Kore"
                  }
                }
              }, {
                "speaker": "Jane",
                "voiceConfig": {
                  "prebuiltVoiceConfig": {
                    "voiceName": "Puck"
                  }
                }
              }]
          }
        }
      },
      "model": "gemini-2.5-flash-preview-tts",
    }' | jq -r '.candidates[0].content.parts[0].inlineData.data' | \
        base64 --decode > out.pcm
    # You may need to install ffmpeg.
    ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav

## Controlling speech style with prompts

You can control style, tone, accent, and pace using natural language prompts for both single- and multi-speaker TTS. For example, in a single-speaker prompt, you can say:  

    Say in an spooky whisper:
    "By the pricking of my thumbs...
    Something wicked this way comes"

In a multi-speaker prompt, provide the model with each speaker's name and corresponding transcript. You can also provide guidance for each speaker individually:  

    Make Speaker1 sound tired and bored, and Speaker2 sound excited and happy:

    Speaker1: So... what's on the agenda today?
    Speaker2: You're never going to guess!

Try using a[voice option](https://ai.google.dev/gemini-api/docs/speech-generation#voices)that corresponds to the style or emotion you want to convey, to emphasize it even more. In the previous prompt, for example,*Enceladus* 's breathiness might emphasize "tired" and "bored", while*Puck*'s upbeat tone could complement "excited" and "happy".

## Generating a prompt to convert to audio

The TTS models only output audio, but you can use[other models](https://ai.google.dev/gemini-api/docs/models)to generate a transcript first, then pass that transcript to the TTS model to read aloud.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    transcript = client.models.generate_content(
       model="gemini-2.5-flash",
       contents="""Generate a short transcript around 100 words that reads
                like it was clipped from a podcast by excited herpetologists.
                The hosts names are Dr. Anya and Liam.""").text

    response = client.models.generate_content(
       model="gemini-2.5-flash-preview-tts",
       contents=transcript,
       config=types.GenerateContentConfig(
          response_modalities=["AUDIO"],
          speech_config=types.SpeechConfig(
             multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                   types.SpeakerVoiceConfig(
                      speaker='Dr. Anya',
                      voice_config=types.VoiceConfig(
                         prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Kore',
                         )
                      )
                   ),
                   types.SpeakerVoiceConfig(
                      speaker='Liam',
                      voice_config=types.VoiceConfig(
                         prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Puck',
                         )
                      )
                   ),
                ]
             )
          )
       )
    )

    # ...Code to stream or save the output

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {

    const transcript = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: "Generate a short transcript around 100 words that reads like it was clipped from a podcast by excited herpetologists. The hosts names are Dr. Anya and Liam.",
       })

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash-preview-tts",
       contents: transcript,
       config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
             multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                       {
                         speaker: "Dr. Anya",
                         voiceConfig: {
                            prebuiltVoiceConfig: {voiceName: "Kore"},
                         }
                      },
                      {
                         speaker: "Liam",
                         voiceConfig: {
                            prebuiltVoiceConfig: {voiceName: "Puck"},
                        }
                      }
                    ]
                  }
                }
          }
      });
    }
    // ..JavaScript code for exporting .wav file for output audio

    await main();

## Voice options

TTS models support the following 30 voice options in the`voice_name`field:  

|----------------------------|----------------------------------|--------------------------------|
| **Zephyr** --*Bright*      | **Puck** --*Upbeat*              | **Charon** --*Informative*     |
| **Kore** --*Firm*          | **Fenrir** --*Excitable*         | **Leda** --*Youthful*          |
| **Orus** --*Firm*          | **Aoede** --*Breezy*             | **Callirrhoe** --*Easy-going*  |
| **Autonoe** --*Bright*     | **Enceladus** --*Breathy*        | **Iapetus** --*Clear*          |
| **Umbriel** --*Easy-going* | **Algieba** --*Smooth*           | **Despina** --*Smooth*         |
| **Erinome** --*Clear*      | **Algenib** --*Gravelly*         | **Rasalgethi** --*Informative* |
| **Laomedeia** --*Upbeat*   | **Achernar** --*Soft*            | **Alnilam** --*Firm*           |
| **Schedar** --*Even*       | **Gacrux** --*Mature*            | **Pulcherrima** --*Forward*    |
| **Achird** --*Friendly*    | **Zubenelgenubi** --*Casual*     | **Vindemiatrix** --*Gentle*    |
| **Sadachbia** --*Lively*   | **Sadaltager** --*Knowledgeable* | **Sulafat** --*Warm*           |

You can hear all the voice options in[AI Studio](https://aistudio.google.com/generate-speech).

## Supported languages

The TTS models detect the input language automatically. They support the following 24 languages:

|        Language        |      BCP-47 Code       |       Language       | BCP-47 Code |
|------------------------|------------------------|----------------------|-------------|
| Arabic (Egyptian)      | `ar-EG`                | German (Germany)     | `de-DE`     |
| English (US)           | `en-US`                | Spanish (US)         | `es-US`     |
| French (France)        | `fr-FR`                | Hindi (India)        | `hi-IN`     |
| Indonesian (Indonesia) | `id-ID`                | Italian (Italy)      | `it-IT`     |
| Japanese (Japan)       | `ja-JP`                | Korean (Korea)       | `ko-KR`     |
| Portuguese (Brazil)    | `pt-BR`                | Russian (Russia)     | `ru-RU`     |
| Dutch (Netherlands)    | `nl-NL`                | Polish (Poland)      | `pl-PL`     |
| Thai (Thailand)        | `th-TH`                | Turkish (Turkey)     | `tr-TR`     |
| Vietnamese (Vietnam)   | `vi-VN`                | Romanian (Romania)   | `ro-RO`     |
| Ukrainian (Ukraine)    | `uk-UA`                | Bengali (Bangladesh) | `bn-BD`     |
| English (India)        | `en-IN`\&`hi-IN`bundle | Marathi (India)      | `mr-IN`     |
| Tamil (India)          | `ta-IN`                | Telugu (India)       | `te-IN`     |

## Supported models

|                                                   Model                                                   | Single speaker | Multispeaker |
|-----------------------------------------------------------------------------------------------------------|----------------|--------------|
| [Gemini 2.5 Flash Preview TTS](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-preview-tts) | ✔️             | ✔️           |
| [Gemini 2.5 Pro Preview TTS](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro-preview-tts)     | ✔️             | ✔️           |

## Limitations

- TTS models can only receive text inputs and generate audio outputs.
- A TTS session has a[context window](https://ai.google.dev/gemini-api/docs/long-context)limit of 32k tokens.
- Review[Languages](https://ai.google.dev/gemini-api/docs/speech-generation#languages)section for language support.

## Prompting guide

The**Gemini Native Audio Generation Text-to-Speech (TTS)** model differentiates itself from traditional TTS models by using a large language model that knows***not only what to say, but also how to say it***.

To unlock this capability, users can think of themselves as directors setting a scene for a virtual voice talent to perform. To craft a prompt, we recommend considering the following components: an**Audio Profile** that defines the character's core identity and archetype; a**Scene description** that establishes the physical environment and emotional "vibe"; and**Director's Notes**that offer more precise performance guidance regarding style, accent and pace control.

By providing nuanced instructions such as a precise regional accent, specific paralinguistic features (e.g. breathiness), or pacing, users can leverage the model's context awareness to generate highly dynamic, natural and expressive audio performances. For optimal performance, we recommend the**Transcript** and directorial prompts align,*so that "who is saying it"* matches with*"what is said"* and*"how it is being said."*

The purpose of this guide is to offer fundamental direction and spark ideas when developing audio experiences using Gemini TTS audio generation. We are excited to witness what you create!

### Prompting structure

A robust prompt ideally includes the following elements that come together to craft a great performance:

- **Audio Profile**- Establishes a persona for the voice, defining a character identity, archetype and any other characteristics like age, background etc.
- **Scene**- Sets the stage. Describes both the physical environment and the "vibe".
- **Director's Notes**- Performance guidance where you can break down which instructions are important for your virtual talent to take note of. Examples are style, breathing, pacing, articulation and accent.
- **Sample context**- Gives the model a contextual starting point, so your virtual actor enters the scene you set up naturally.
- **Transcript**- The text that the model will speak out. For best performance, remember that the transcript topic and writing style should correlate to the directions you are giving.

| **Note:** Have Gemini help you build your prompt, just give it a blank outline of the format below and ask it to sketch out a character for you.

Example full prompt:  

    # AUDIO PROFILE: Jaz R.
    ## "The Morning Hype"

    ## THE SCENE: The London Studio
    It is 10:00 PM in a glass-walled studio overlooking the moonlit London skyline,
    but inside, it is blindingly bright. The red "ON AIR" tally light is blazing.
    Jaz is standing up, not sitting, bouncing on the balls of their heels to the
    rhythm of a thumping backing track. Their hands fly across the faders on a
    massive mixing desk. It is a chaotic, caffeine-fueled cockpit designed to wake
    up an entire nation.

    ### DIRECTOR'S NOTES
    Style:
    * The "Vocal Smile": You must hear the grin in the audio. The soft palate is
    always raised to keep the tone bright, sunny, and explicitly inviting.
    * Dynamics: High projection without shouting. Punchy consonants and elongated
    vowels on excitement words (e.g., "Beauuutiful morning").

    Pace: Speaks at an energetic pace, keeping up with the fast music.  Speaks
    with A "bouncing" cadence. High-speed delivery with fluid transitions --- no dead
    air, no gaps.

    Accent: Jaz is from Brixton, London

    ### SAMPLE CONTEXT
    Jaz is the industry standard for Top 40 radio, high-octane event promos, or any
    script that requires a charismatic Estuary accent and 11/10 infectious energy.

    #### TRANSCRIPT
    Yes, massive vibes in the studio! You are locked in and it is absolutely
    popping off in London right now. If you're stuck on the tube, or just sat
    there pretending to work... stop it. Seriously, I see you. Turn this up!
    We've got the project roadmap landing in three, two... let's go!

### Detailed Prompting Strategies

Let's break down each element of the prompt.

#### Audio Profile

Briefly describe the persona of the character.

- **Name.**Giving your character a name helps ground the model and tight performance together, Refer to the character by name when setting the scene and context
- **Role.**Core identity and archetype of the character that's playing out in the scene. e.g., Radio DJ, Podcaster, News reporter etc.

Examples:  

    # AUDIO PROFILE: Jaz R.
    ## "The Morning Hype"

<br />

    # AUDIO PROFILE: Monica A.
    ## "The Beauty Influencer"

#### Scene

Set the context for the scene, including location, mood, and environmental details that establish the tone and vibe. Describe what is happening around the character and how it affects them. The scene provides the environmental context for the entire interaction and guides the acting performance in a subtle, organic way.

Examples:  

    ## THE SCENE: The London Studio
    It is 10:00 PM in a glass-walled studio overlooking the moonlit London skyline,
    but inside, it is blindingly bright. The red "ON AIR" tally light is blazing.
    Jaz is standing up, not sitting, bouncing on the balls of their heels to the
    rhythm of a thumping backing track. Their hands fly across the faders on a
    massive mixing desk. It is a chaotic, caffeine-fueled cockpit designed to
    wake up an entire nation.

<br />

    ## THE SCENE: Homegrown Studio
    A meticulously sound-treated bedroom in a suburban home. The space is
    deadened by plush velvet curtains and a heavy rug, but there is a
    distinct "proximity effect."

#### Directors notes

This critical section includes specific performance guidance. You can skip all the other elements, but we recommend you include this element.

Define only what's important to the performance, being careful to not overspecify. Too many strict rules will limit the models' creativity and may result in a worse performance. Balance the role and scene description with the specific performance rules.

The most common directions are**Style, Pacing and Accent**, but the model is not limited to these, nor requires them. Feel free to include custom instructions to cover any additional details important to your performance, and go into as much or as little detail as necessary.

For example:  

    ### DIRECTOR'S NOTES

    Style: Enthusiastic and Sassy GenZ beauty YouTuber

    Pacing: Speaks at an energetic pace, keeping up with the extremely fast, rapid
    delivery influencers use in short form videos.

    Accent: Southern california valley girl from Laguna Beach |

**Style:**

Sets the tone and Style of the generated speech. Include things like upbeat, energetic, relaxed, bored etc. to guide the performance. Be descriptive and provide as much detail as necessary:*"Infectious enthusiasm. The listener should feel like they are part of a massive, exciting community event."* works better than simply saying*"energetic and enthusiastic".*

You can even try terms that are popular in the voiceover industry, like "vocal smile". You can layer as many style characteristics as you want.

Examples:

Simple Emotion  

    DIRECTORS NOTES
    ...
    Style: Frustrated and angry developer who can't get the build to run.
    ...

More depth  

    DIRECTORS NOTES
    ...
    Style: Sassy GenZ beauty YouTuber, who mostly creates content for YouTube Shorts.
    ...

Complex  

    DIRECTORS NOTES
    Style:
    * The "Vocal Smile": You must hear the grin in the audio. The soft palate is
    always raised to keep the tone bright, sunny, and explicitly inviting.
    *Dynamics: High projection without shouting. Punchy consonants and
    elongated vowels on excitement words (e.g., "Beauuutiful morning").

**Accent:**

Describe the desired accent. The more specific you are, the better the results are. For example use "*British English accent as heard in Croydon, England* " vs "*British Accent*".

Examples:  

    ### DIRECTORS NOTES
    ...
    Accent: Southern california valley girl from Laguna Beach
    ...

<br />

    ### DIRECTORS NOTES
    ...
    Accent: Jaz is a from Brixton, London
    ...

**Pacing:**

Overall pacing and pace variation throughout the piece.

Examples:

Simple  

    ### DIRECTORS NOTES
    ...
    Pacing: Speak as fast as possible
    ...

More Depth  

    ### DIRECTORS NOTES
    ...
    Pacing: Speaks at a faster, energetic pace, keeping up with fast paced music.
    ...

Complex  

    ### DIRECTORS NOTES
    ...
    Pacing: The "Drift": The tempo is incredibly slow and liquid. Words bleed into each other. There is zero urgency.
    ...

**Give it a try**

Try some of these examples yourself on[AI Studio](https://aistudio.google.com/generate-speech), play with our[TTS App](http://aistudio.google.com/app/apps/bundled/synergy_intro)and let Gemini put you in the directors chair. Keep these tips in mind to make great vocal performances:

- Remember to keep the entire prompt coherent -- the script and direction go hand in hand in creating a great performance.
- Don't feel you have to describe everything, sometimes giving the model space to fill in the gaps helps naturalness. (Just like a talented actor)
- If you ever are feeling stuck, have Gemini lend you a hand to help you craft your script or performance.

## What's next

- Try the[audio generation cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_TTS.ipynb).
- Gemini's[Live API](https://ai.google.dev/gemini-api/docs/live)offers interactive audio generation options you can interleave with other modalities.
- For working with audio*inputs* , visit the[Audio understanding](https://ai.google.dev/gemini-api/docs/audio)guide.

these are important for your understand and fix your code, this all possible I can see issues in code.


this code has issues ai want to solve them using above documentation.
<br />

The Gemini API provides a code execution tool that enables the model to generate and run Python code. The model can then learn iteratively from the code execution results until it arrives at a final output. You can use code execution to build applications that benefit from code-based reasoning. For example, you can use code execution to solve equations or process text. You can also use the[libraries](https://ai.google.dev/gemini-api/docs/code-execution#supported-libraries)included in the code execution environment to perform more specialized tasks.

Gemini is only able to execute code in Python. You can still ask Gemini to generate code in another language, but the model can't use the code execution tool to run it.

## Enable code execution

To enable code execution, configure the code execution tool on the model. This allows the model to generate and run code.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="What is the sum of the first 50 prime numbers? "
        "Generate and run code for the calculation, and make sure you get all 50.",
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    let response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "What is the sum of the first 50 prime numbers? " +
          "Generate and run code for the calculation, and make sure you get all 50.",
      ],
      config: {
        tools: [{ codeExecution: {} }],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    parts.forEach((part) => {
      if (part.text) {
        console.log(part.text);
      }

      if (part.executableCode && part.executableCode.code) {
        console.log(part.executableCode.code);
      }

      if (part.codeExecutionResult && part.codeExecutionResult.output) {
        console.log(part.codeExecutionResult.output);
      }
    });

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            genai.Text("What is the sum of the first 50 prime numbers? " +
                      "Generate and run code for the calculation, and make sure you get all 50."),
            config,
        )

        fmt.Println(result.Text())
        fmt.Println(result.ExecutableCode())
        fmt.Println(result.CodeExecutionResult())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -d ' {"tools": [{"code_execution": {}}],
        "contents": {
          "parts":
            {
                "text": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50."
            }
        },
    }'

| **Note:** This REST example doesn't parse the JSON response as shown in the example output.

The output might look something like the following, which has been formatted for readability:  

    Okay, I need to calculate the sum of the first 50 prime numbers. Here's how I'll
    approach this:

    1.  **Generate Prime Numbers:** I'll use an iterative method to find prime
        numbers. I'll start with 2 and check if each subsequent number is divisible
        by any number between 2 and its square root. If not, it's a prime.
    2.  **Store Primes:** I'll store the prime numbers in a list until I have 50 of
        them.
    3.  **Calculate the Sum:**  Finally, I'll sum the prime numbers in the list.

    Here's the Python code to do this:

    def is_prime(n):
      """Efficiently checks if a number is prime."""
      if n <= 1:
        return False
      if n <= 3:
        return True
      if n % 2 == 0 or n % 3 == 0:
        return False
      i = 5
      while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
          return False
        i += 6
      return True

    primes = []
    num = 2
    while len(primes) < 50:
      if is_prime(num):
        primes.append(num)
      num += 1

    sum_of_primes = sum(primes)
    print(f'{primes=}')
    print(f'{sum_of_primes=}')

    primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
    71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229]
    sum_of_primes=5117

    The sum of the first 50 prime numbers is 5117.

This output combines several content parts that the model returns when using code execution:

- `text`: Inline text generated by the model
- `executableCode`: Code generated by the model that is meant to be executed
- `codeExecutionResult`: Result of the executable code

The naming conventions for these parts vary by programming language.

## Code Execution with images (Gemini 3)

The Gemini 3 Flash model can now write and execute Python code to actively manipulate and inspect images. This capability is called*Visual Thinking*.

**Use cases**

- **Zoom and inspect**: The model implicitly detects when details are too small (e.g., reading a distant gauge) and writes code to crop and re-examine the area at higher resolution.
- **Visual math**: The model can run multi-step calculations using code (e.g., summing line items on a receipt).
- **Image annotation**: The model can annotate images to answer questions, such as drawing arrows to show relationships.

| **Note:** While the model automatically handles zooming for small details, you should prompt it explicitly to use code for other tasks, such as "Write code to count the number of gears" or "Rotate this image to make it upright".

### Enabling visual thinking

Visual Thinking is officially supported in Gemini 3 Flash. You can activate this behavior by enabling both Code Execution as a tool and Thinking.  

### Python

    from google import genai
    from google.genai import types
    import requests
    from PIL import Image
    import io

    image_path = "https://goo.gle/instrument-img"
    image_bytes = requests.get(image_path).content
    image = types.Part.from_bytes(
      data=image_bytes, mime_type="image/jpeg"
    )

    # Ensure you have your API key set
    client = genai.Client(api_key="GEMINI_API_KEY")

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[image, "Zoom into the expression pedals and tell me how many pedals are there?"],
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)
        if part.as_image() is not None:
            # display() is a standard function in Jupyter/Colab notebooks
            display(Image.open(io.BytesIO(part.as_image().image_bytes)))

### JavaScript

    async function main() {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // 1. Prepare Image Data
      const imageUrl = "https://goo.gle/instrument-img";
      const response = await fetch(imageUrl);
      const imageArrayBuffer = await response.arrayBuffer();
      const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

      // 2. Call the API with Code Execution enabled
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageData,
            },
          },
          { text: "Zoom into the expression pedals and tell me how many pedals are there?" }
        ],
        config: {
          tools: [{ codeExecution: {} }],
        },
      });

      // 3. Process the response (Text, Code, and Execution Results)
      const candidates = result.response.candidates;
      if (candidates && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.text) {
            console.log("Text:", part.text);
          }
          if (part.executableCode) {
            console.log(`\nGenerated Code (${part.executableCode.language}):\n`, part.executableCode.code);
          }
          if (part.codeExecutionResult) {
            console.log(`\nExecution Output (${part.codeExecutionResult.outcome}):\n`, part.codeExecutionResult.output);
          }
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "io"
        "log"
        "net/http"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        // Initialize Client (Reads GEMINI_API_KEY from env)
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        // 1. Download the image
        imageResp, err := http.Get("https://goo.gle/instrument-img")
        if err != nil {
            log.Fatal(err)
        }
        defer imageResp.Body.Close()

        imageBytes, err := io.ReadAll(imageResp.Body)
        if err != nil {
            log.Fatal(err)
        }

        // 2. Configure Code Execution Tool
        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        // 3. Generate Content
        result, err := client.Models.GenerateContent(
            ctx,
            "gemini-3-flash-preview",
            []*genai.Content{
                {
                    Parts: []*genai.Part{
                        {InlineData: &genai.Blob{MIMEType: "image/jpeg", Data: imageBytes}},
                        {Text: "Zoom into the expression pedals and tell me how many pedals are there?"},
                    },
                    Role: "user",
                },
            },
            config,
        )
        if err != nil {
            log.Fatal(err)
        }

        // 4. Parse Response (Text, Code, Output)
        for _, cand := range result.Candidates {
            for _, part := range cand.Content.Parts {
                if part.Text != "" {
                    fmt.Println("Text:", part.Text)
                }
                if part.ExecutableCode != nil {
                    fmt.Printf("\nGenerated Code (%s):\n%s\n", 
                        part.ExecutableCode.Language, 
                        part.ExecutableCode.Code)
                }
                if part.CodeExecutionResult != nil {
                    fmt.Printf("\nExecution Output (%s):\n%s\n", 
                        part.CodeExecutionResult.Outcome, 
                        part.CodeExecutionResult.Output)
                }
            }
        }
    }

### REST

    IMG_URL="https://goo.gle/instrument-img"
    MODEL="gemini-3-flash-preview"

    MIME_TYPE=$(curl -sIL "$IMG_URL" | grep -i '^content-type:' | awk -F ': ' '{print $2}' | sed 's/\r$//' | head -n 1)
    if [[ -z "$MIME_TYPE" || ! "$MIME_TYPE" == image/* ]]; then
      MIME_TYPE="image/jpeg"
    fi

    if [[ "$(uname)" == "Darwin" ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -b 0)
    elif [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64)
    else
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -w0)
    fi

    curl "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent?key=$GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
                {
                  "inline_data": {
                    "mime_type":"'"$MIME_TYPE"'",
                    "data": "'"$IMAGE_B64"'"
                  }
                },
                {"text": "Zoom into the expression pedals and tell me how many pedals are there?"}
            ]
          }],
          "tools": [
            {
              "code_execution": {}
            }
          ]
        }'

## Use code execution in chat

You can also use code execution as part of a chat.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    chat = client.chats.create(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    response = chat.send_message("I have a math question for you.")
    print(response.text)

    response = chat.send_message(
        "What is the sum of the first 50 prime numbers? "
        "Generate and run code for the calculation, and make sure you get all 50."
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)

### JavaScript

    import {GoogleGenAI} from "@google/genai";

    const ai = new GoogleGenAI({});

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "I have a math question for you:" }],
        },
        {
          role: "model",
          parts: [{ text: "Great! I'm ready for your math question. Please ask away." }],
        },
      ],
      config: {
        tools: [{codeExecution:{}}],
      }
    });

    const response = await chat.sendMessage({
      message: "What is the sum of the first 50 prime numbers? " +
                "Generate and run code for the calculation, and make sure you get all 50."
    });
    console.log("Chat response:", response.text);

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        chat, _ := client.Chats.Create(
            ctx,
            "gemini-2.5-flash",
            config,
            nil,
        )

        result, _ := chat.SendMessage(
                        ctx,
                        genai.Part{Text: "What is the sum of the first 50 prime numbers? " +
                                              "Generate and run code for the calculation, and " +
                                              "make sure you get all 50.",
                                  },
                    )

        fmt.Println(result.Text())
        fmt.Println(result.ExecutableCode())
        fmt.Println(result.CodeExecutionResult())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{"tools": [{"code_execution": {}}],
        "contents": [
            {
                "role": "user",
                "parts": [{
                    "text": "Can you print \"Hello world!\"?"
                }]
            },{
                "role": "model",
                "parts": [
                  {
                    "text": ""
                  },
                  {
                    "executable_code": {
                      "language": "PYTHON",
                      "code": "\nprint(\"hello world!\")\n"
                    }
                  },
                  {
                    "code_execution_result": {
                      "outcome": "OUTCOME_OK",
                      "output": "hello world!\n"
                    }
                  },
                  {
                    "text": "I have printed \"hello world!\" using the provided python code block. \n"
                  }
                ],
            },{
                "role": "user",
                "parts": [{
                    "text": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50."
                }]
            }
        ]
    }'

## Input/output (I/O)

Starting with[Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash), code execution supports file input and graph output. Using these input and output capabilities, you can upload CSV and text files, ask questions about the files, and have[Matplotlib](https://matplotlib.org/)graphs generated as part of the response. The output files are returned as inline images in the response.

### I/O pricing

When using code execution I/O, you're charged for input tokens and output tokens:

**Input tokens:**

- User prompt

**Output tokens:**

- Code generated by the model
- Code execution output in the code environment
- Thinking tokens
- Summary generated by the model

### I/O details

When you're working with code execution I/O, be aware of the following technical details:

- The maximum runtime of the code environment is 30 seconds.
- If the code environment generates an error, the model may decide to regenerate the code output. This can happen up to 5 times.
- The maximum file input size is limited by the model token window. In AI Studio, using Gemini Flash 2.0, the maximum input file size is 1 million tokens (roughly 2MB for text files of the supported input types). If you upload a file that's too large, AI Studio won't let you send it.
- Code execution works best with text and CSV files.
- The input file can be passed in`part.inlineData`or`part.fileData`(uploaded via the[Files API](https://ai.google.dev/gemini-api/docs/files)), and the output file is always returned as`part.inlineData`.

|                                                                                         |                     Single turn                     |         Bidirectional (Multimodal Live API)         |
|-----------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|
| Models supported                                                                        | All Gemini 2.0 and 2.5 models                       | Only Flash experimental models                      |
| File input types supported                                                              | .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts | .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts |
| Plotting libraries supported                                                            | Matplotlib, seaborn                                 | Matplotlib, seaborn                                 |
| [Multi-tool use](https://ai.google.dev/gemini-api/docs/function-calling#multi-tool-use) | Yes (code execution + grounding only)               | Yes                                                 |

## Billing

There's no additional charge for enabling code execution from the Gemini API. You'll be billed at the current rate of input and output tokens based on the Gemini model you're using.

Here are a few other things to know about billing for code execution:

- You're only billed once for the input tokens you pass to the model, and you're billed for the final output tokens returned to you by the model.
- Tokens representing generated code are counted as output tokens. Generated code can include text and multimodal output like images.
- Code execution results are also counted as output tokens.

The billing model is shown in the following diagram:

![code execution billing model](https://ai.google.dev/static/gemini-api/docs/images/code-execution-diagram.png)

- You're billed at the current rate of input and output tokens based on the Gemini model you're using.
- If Gemini uses code execution when generating your response, the original prompt, the generated code, and the result of the executed code are labeled*intermediate tokens* and are billed as*input tokens*.
- Gemini then generates a summary and returns the generated code, the result of the executed code, and the final summary. These are billed as*output tokens*.
- The Gemini API includes an intermediate token count in the API response, so you know why you're getting additional input tokens beyond your initial prompt.

## Limitations

- The model can only generate and execute code. It can't return other artifacts like media files.
- In some cases, enabling code execution can lead to regressions in other areas of model output (for example, writing a story).
- There is some variation in the ability of the different models to use code execution successfully.

## Supported tools combinations

Code execution tool can be combined with[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)to power more complex use cases.

## Supported libraries

The code execution environment includes the following libraries:

- attrs
- chess
- contourpy
- fpdf
- geopandas
- imageio
- jinja2
- joblib
- jsonschema
- jsonschema-specifications
- lxml
- matplotlib
- mpmath
- numpy
- opencv-python
- openpyxl
- packaging
- pandas
- pillow
- protobuf
- pylatex
- pyparsing
- PyPDF2
- python-dateutil
- python-docx
- python-pptx
- reportlab
- scikit-learn
- scipy
- seaborn
- six
- striprtf
- sympy
- tabulate
- tensorflow
- toolz
- xlrd

You can't install your own libraries.
| **Note:** Only`matplotlib`is supported for graph rendering using code execution.

## What's next

- Try the[code execution Colab](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Code_Execution.ipynb).
- Learn about other Gemini API tools:
  - [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)
  - [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/grounding)
<br />

The Gemini Deep Research Agent autonomously plans, executes, and synthesizes multi-step research tasks. Powered by Gemini 3 Pro, it navigates complex information landscapes using web search and your own data to produce detailed, cited reports.

Research tasks involve iterative searching and reading and can take several minutes to complete. You must use**background execution** (set`background=true`) to run the agent asynchronously and poll for results. See[Handling long running tasks](https://ai.google.dev/gemini-api/docs/deep-research#long-running-tasks)for more details.
| **Preview:** The Gemini Deep Research Agent is currently in preview. The Deep Research agent is exclusively available using the[Interactions API](https://ai.google.dev/gemini-api/docs/interactions). You cannot access it through`generate_content`.

The following example shows how to start a research task in the background and poll for results.  

### Python

    import time
    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        input="Research the history of Google TPUs.",
        agent='deep-research-pro-preview-12-2025',
        background=True
    )

    print(f"Research started: {interaction.id}")

    while True:
        interaction = client.interactions.get(interaction.id)
        if interaction.status == "completed":
            print(interaction.outputs[-1].text)
            break
        elif interaction.status == "failed":
            print(f"Research failed: {interaction.error}")
            break
        time.sleep(10)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        input: 'Research the history of Google TPUs.',
        agent: 'deep-research-pro-preview-12-2025',
        background: true
    });

    console.log(`Research started: ${interaction.id}`);

    while (true) {
        const result = await client.interactions.get(interaction.id);
        if (result.status === 'completed') {
            console.log(result.outputs[result.outputs.length - 1].text);
            break;
        } else if (result.status === 'failed') {
            console.log(`Research failed: ${result.error}`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

### REST

    # 1. Start the research task
    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Research the history of Google TPUs.",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true
    }'

    # 2. Poll for results (Replace INTERACTION_ID)
    # curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID" \
    # -H "x-goog-api-key: $GEMINI_API_KEY"

## Research with your own data

Deep Research has access to a variety of tools. By default, the agent has access to information on the public internet using the`google_search`and`url_context`tool. You don't need to specify these tools by default. However, if you additionally want to give the agent access to your own data by using the[File Search](https://ai.google.dev/gemini-api/docs/file-search)tool you will need to add it as shown in the following example.
**Experimental:** Using Deep Research with`file_search`is still experimental.  

### Python

    import time
    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        input="Compare our 2025 fiscal year report against current public web news.",
        agent="deep-research-pro-preview-12-2025",
        background=True,
        tools=[
            {
                "type": "file_search",
                "file_search_store_names": ['fileSearchStores/my-store-name']
            }
        ]
    )

### JavaScript

    const interaction = await client.interactions.create({
        input: 'Compare our 2025 fiscal year report against current public web news.',
        agent: 'deep-research-pro-preview-12-2025',
        background: true,
        tools: [
            { type: 'file_search', file_search_store_names: ['fileSearchStores/my-store-name'] },
        ]
    });

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Compare our 2025 fiscal year report against current public web news.",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true,
        "tools": [
            {"type": "file_search", "file_search_store_names": ["fileSearchStores/my-store-name"]},
        ]
    }'

## Steerability and formatting

You can steer the agent's output by providing specific formatting instructions in your prompt. This allows you to structure reports into specific sections and subsections, include data tables, or adjust tone for different audiences (e.g., "technical," "executive," "casual").

Define the desired output format explicitly in your input text.  

### Python

    prompt = """
    Research the competitive landscape of EV batteries.

    Format the output as a technical report with the following structure:
    1. Executive Summary
    2. Key Players (Must include a data table comparing capacity and chemistry)
    3. Supply Chain Risks
    """

    interaction = client.interactions.create(
        input=prompt,
        agent="deep-research-pro-preview-12-2025",
        background=True
    )

### JavaScript

    const prompt = `
    Research the competitive landscape of EV batteries.

    Format the output as a technical report with the following structure:
    1. Executive Summary
    2. Key Players (Must include a data table comparing capacity and chemistry)
    3. Supply Chain Risks
    `;

    const interaction = await client.interactions.create({
        input: prompt,
        agent: 'deep-research-pro-preview-12-2025',
        background: true,
    });

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Research the competitive landscape of EV batteries.\n\nFormat the output as a technical report with the following structure: \n1. Executive Summary\n2. Key Players (Must include a data table comparing capacity and chemistry)\n3. Supply Chain Risks",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true
    }'

## Handling long-running tasks

Deep Research is a multi-step process involving planning, searching, reading, and writing. This cycle typically exceeds the standard timeout limits of synchronous API calls.

Agents are required to use`background=True`. The API returns a partial`Interaction`object immediately. You can use the`id`property to retrieve an interaction for polling. The interaction state will transition from`in_progress`to`completed`or`failed`.

### Streaming

Deep Research supports streaming to receive real-time updates on the research progress. You must set`stream=True`and`background=True`.
| **Note:** To receive intermediate reasoning steps (thoughts) and progress updates, you must enable**thinking summaries** in the`agent_config`. If this is not set to`"auto"`, the stream may only provide the final results without the real-time thought process.

The following example shows how to start a research task and process the stream. Crucially, it demonstrates how to track the`interaction_id`from the`interaction.start`event. You will need this ID to resume the stream if a network interruption occurs. This code also introduces an`event_id`variable which lets you resume from the specific point where you disconnected.  

### Python

    stream = client.interactions.create(
        input="Research the history of Google TPUs.",
        agent="deep-research-pro-preview-12-2025",
        background=True,
        stream=True,
        agent_config={
            "type": "deep-research",
            "thinking_summaries": "auto"
        }
    )

    interaction_id = None
    last_event_id = None

    for chunk in stream:
        if chunk.event_type == "interaction.start":
            interaction_id = chunk.interaction.id
            print(f"Interaction started: {interaction_id}")

        if chunk.event_id:
            last_event_id = chunk.event_id

        if chunk.event_type == "content.delta":
            if chunk.delta.type == "text":
                print(chunk.delta.text, end="", flush=True)
            elif chunk.delta.type == "thought_summary":
                print(f"Thought: {chunk.delta.content.text}", flush=True)

        elif chunk.event_type == "interaction.complete":
            print("\nResearch Complete")

### JavaScript

    const stream = await client.interactions.create({
        input: 'Research the history of Google TPUs.',
        agent: 'deep-research-pro-preview-12-2025',
        background: true,
        stream: true,
        agent_config: {
            type: 'deep-research',
            thinking_summaries: 'auto'
        }
    });

    let interactionId;
    let lastEventId;

    for await (const chunk of stream) {
        // 1. Capture Interaction ID
        if (chunk.event_type === 'interaction.start') {
            interactionId = chunk.interaction.id;
            console.log(`Interaction started: ${interactionId}`);
        }

        // 2. Track IDs for potential reconnection
        if (chunk.event_id) lastEventId = chunk.event_id;

        // 3. Handle Content
        if (chunk.event_type === 'content.delta') {
            if (chunk.delta.type === 'text') {
                process.stdout.write(chunk.delta.text);
            } else if (chunk.delta.type === 'thought_summary') {
                console.log(`Thought: ${chunk.delta.content.text}`);
            }
        } else if (chunk.event_type === 'interaction.complete') {
            console.log('\nResearch Complete');
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Research the history of Google TPUs.",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true,
        "stream": true,
        "agent_config": {
            "type": "deep-research",
            "thinking_summaries": "auto"
        }
    }'
    # Note: Look for the 'interaction.start' event to get the interaction ID.

### Reconnecting to stream

Network interruptions can occur during long-running research tasks. To handle this gracefully, your application should catch connection errors and resume the stream using`client.interactions.get()`.

You must provide two values to resume:

1. **Interaction ID:** Acquired from the`interaction.start`event in the initial stream.
2. **Last Event ID:** The ID of the last successfully processed event. This tells the server to resume sending events*after*that specific point. If not provided, you will get the beginning of the stream.

The following examples demonstrate a resilient pattern: attempting to stream the initial`create`request, and falling back to a`get`loop if the connection drops.  

### Python

    import time
    from google import genai

    client = genai.Client()

    # Configuration
    agent_name = 'deep-research-pro-preview-12-2025'
    prompt = 'Compare golang SDK test frameworks'

    # State tracking
    last_event_id = None
    interaction_id = None
    is_complete = False

    def process_stream(event_stream):
        """Helper to process events from any stream source."""
        global last_event_id, interaction_id, is_complete
        for event in event_stream:
            # Capture Interaction ID
            if event.event_type == "interaction.start":
                interaction_id = event.interaction.id
                print(f"Interaction started: {interaction_id}")

            # Capture Event ID
            if event.event_id:
                last_event_id = event.event_id

            # Print content
            if event.event_type == "content.delta":
                if event.delta.type == "text":
                    print(event.delta.text, end="", flush=True)
                elif event.delta.type == "thought_summary":
                    print(f"Thought: {event.delta.content.text}", flush=True)

            # Check completion
            if event.event_type in ['interaction.complete', 'error']:
                is_complete = True

    # 1. Attempt initial streaming request
    try:
        print("Starting Research...")
        initial_stream = client.interactions.create(
            input=prompt,
            agent=agent_name,
            background=True,
            stream=True,
            agent_config={
                "type": "deep-research",
                "thinking_summaries": "auto"
            }
        )
        process_stream(initial_stream)
    except Exception as e:
        print(f"\nInitial connection dropped: {e}")

    # 2. Reconnection Loop
    # If the code reaches here and is_complete is False, we resume using .get()
    while not is_complete and interaction_id:
        print(f"\nConnection lost. Resuming from event {last_event_id}...")
        time.sleep(2) 

        try:
            resume_stream = client.interactions.get(
                id=interaction_id,
                stream=True,
                last_event_id=last_event_id
            )
            process_stream(resume_stream)
        except Exception as e:
            print(f"Reconnection failed, retrying... ({e})")

### JavaScript

    let lastEventId;
    let interactionId;
    let isComplete = false;

    // Helper to handle the event logic
    const handleStream = async (stream) => {
        for await (const chunk of stream) {
            if (chunk.event_type === 'interaction.start') {
                interactionId = chunk.interaction.id;
            }
            if (chunk.event_id) lastEventId = chunk.event_id;

            if (chunk.event_type === 'content.delta') {
                if (chunk.delta.type === 'text') {
                    process.stdout.write(chunk.delta.text);
                } else if (chunk.delta.type === 'thought_summary') {
                    console.log(`Thought: ${chunk.delta.content.text}`);
                }
            } else if (chunk.event_type === 'interaction.complete') {
                isComplete = true;
            }
        }
    };

    // 1. Start the task with streaming
    try {
        const stream = await client.interactions.create({
            input: 'Compare golang SDK test frameworks',
            agent: 'deep-research-pro-preview-12-2025',
            background: true,
            stream: true,
            agent_config: {
                type: 'deep-research',
                thinking_summaries: 'auto'
            }
        });
        await handleStream(stream);
    } catch (e) {
        console.log('\nInitial stream interrupted.');
    }

    // 2. Reconnect Loop
    while (!isComplete && interactionId) {
        console.log(`\nReconnecting to interaction ${interactionId} from event ${lastEventId}...`);
        try {
            const stream = await client.interactions.get(interactionId, {
                stream: true,
                last_event_id: lastEventId
            });
            await handleStream(stream);
        } catch (e) {
            console.log('Reconnection failed, retrying in 2s...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

### REST

    # 1. Start the research task (Initial Stream)
    # Watch for event: interaction.start to get the INTERACTION_ID
    # Watch for "event_id" fields to get the LAST_EVENT_ID
    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Compare golang SDK test frameworks",
        "agent": "deep-research-pro-preview-12-2025",
        "background": true,
        "stream": true,
        "agent_config": {
            "type": "deep-research",
            "thinking_summaries": "auto"
        }
    }'

    # ... Connection interrupted ...

    # 2. Reconnect (Resume Stream)
    # Pass the INTERACTION_ID and the LAST_EVENT_ID you saved.
    curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID?stream=true&last_event_id=LAST_EVENT_ID&alt=sse" \
    -H "x-goog-api-key: $GEMINI_API_KEY"

## Follow-up questions and interactions

You can continue the conversation after the agent returns the final report by using the`previous_interaction_id`. This lets you to ask for clarification, summarization or elaboration on specific sections of the research without restarting the entire task.  

### Python

    import time
    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        input="Can you elaborate on the second point in the report?",
        model="gemini-3-pro-preview",
        previous_interaction_id="COMPLETED_INTERACTION_ID"
    )

    print(interaction.outputs[-1].text)

### JavaScript

    const interaction = await client.interactions.create({
        input: 'Can you elaborate on the second point in the report?',
        agent: 'deep-research-pro-preview-12-2025',
        previous_interaction_id: 'COMPLETED_INTERACTION_ID'
    });
    console.log(interaction.outputs[-1].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "input": "Can you elaborate on the second point in the report?",
        "agent": "deep-research-pro-preview-12-2025",
        "previous_interaction_id": "COMPLETED_INTERACTION_ID"
    }'

## When to use Gemini Deep Research Agent

Deep Research is an**agent**, not just a model. It is best suited for workloads that require an "analyst-in-a-box" approach rather than low-latency chat.

|   Feature    |           Standard Gemini Models           |                         Gemini Deep Research Agent                          |
|--------------|--------------------------------------------|-----------------------------------------------------------------------------|
| **Latency**  | Seconds                                    | Minutes (Async/Background)                                                  |
| **Process**  | Generate -\> Output                        | Plan -\> Search -\> Read -\> Iterate -\> Output                             |
| **Output**   | Conversational text, code, short summaries | Detailed reports, long-form analysis, comparative tables                    |
| **Best For** | Chatbots, extraction, creative writing     | Market analysis, due diligence, literature reviews, competitive landscaping |

## Availability and pricing

| **Note:** Google Search tool calls are free of charge until January 5th, 2026. After this date, standard pricing applies.

- **Availability:**Accessible using the Interactions API in Google AI Studio and Gemini API.
- **Pricing:** See the[Pricing page](https://ai.google.dev/gemini-api/docs/pricing#pricing-for-agents)for specific rates and details.

## Safety considerations

Giving an agent access to the web and your private files requires careful consideration of safety risks.

- **Prompt injection using files:**The agent reads the contents of the files you provide. Ensure that uploaded documents (PDFs, text files) come from trusted sources. A malicious file could contain hidden text designed to manipulate the agent's output.
- **Web content risks:** The agent searches the public web. While we implement robust safety filters, there is a risk that the agent may encounter and process malicious web pages. We recommend reviewing the`citations`provided in the response to verify the sources.
- **Exfiltration:**Be cautious when asking the agent to summarize sensitive internal data if you are also allowing it to browse the web.

## Best practices

- **Prompt for unknowns:** Instruct the agent on how to handle missing data. For example, add*"If specific figures for 2025 are not available, explicitly state they are projections or unavailable rather than estimating"*to your prompt.
- **Provide context:**Ground the agent's research by providing background information or constraints directly in the input prompt.
- **Multimodal inputs**Deep Research Agent supports multi-modal inputs. Use cautiously, as this increases costs and risks context window overflow.

## Limitations

- **Beta status**: The Interactions API is in public beta. Features and schemas may change.
- **Custom tools:**You cannot currently provide custom Function Calling tools or remote MCP (Model Context Protocol) servers to the Deep Research agent.
- **Structured output and plan approval:**The Deep Research Agent currently doesn't support human approved planning or structured outputs.
- **Max research time:**The Deep Research agent has a maximum research time of 60 minutes. Most tasks should complete within 20 minutes.
- **Store requirement:** Agent execution using`background=True`requires`store=True`.
- **Google search:** [Google Search](https://ai.google.dev/gemini-api/docs/google-search)is enabled by default and[specific restrictions](https://ai.google.dev/gemini-api/terms#use-restrictions2)apply to the grounded results.
- **Audio inputs:**Audio inputs are not supported.

## What's next

- Learn more about the[Interactions API](https://ai.google.dev/gemini-api/docs/interactions).
- Read about the[Gemini 3 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-3)model that powers this agent.
- Learn how to use your own data using the[File Search](https://ai.google.dev/gemini-api/docs/file-search)tool.
<br />

| **Note:** Gemini 3 billing for Grounding with Google Search will begin on January 5, 2026.

Grounding with Google Search connects the Gemini model to real-time web content and works with all available languages. This allows Gemini to provide more accurate answers and cite verifiable sources beyond its knowledge cutoff.

Grounding helps you build applications that can:

- **Increase factual accuracy:**Reduce model hallucinations by basing responses on real-world information.
- **Access real-time information:**Answer questions about recent events and topics.
- **Provide citations:**Build user trust by showing the sources for the model's claims.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    grounding_tool = types.Tool(
        google_search=types.GoogleSearch()
    )

    config = types.GenerateContentConfig(
        tools=[grounding_tool]
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Who won the euro 2024?",
        config=config,
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    const groundingTool = {
      googleSearch: {},
    };

    const config = {
      tools: [groundingTool],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Who won the euro 2024?",
      config,
    });

    console.log(response.text);

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {"text": "Who won the euro 2024?"}
            ]
          }
        ],
        "tools": [
          {
            "google_search": {}
          }
        ]
      }'

You can learn more by trying the[Search tool notebook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Search_Grounding.ipynb).

## How grounding with Google Search works

When you enable the`google_search`tool, the model handles the entire workflow of searching, processing, and citing information automatically.

![grounding-overview](https://ai.google.dev/static/gemini-api/docs/images/google-search-tool-overview.png)

1. **User Prompt:** Your application sends a user's prompt to the Gemini API with the`google_search`tool enabled.
2. **Prompt Analysis:**The model analyzes the prompt and determines if a Google Search can improve the answer.
3. **Google Search:**If needed, the model automatically generates one or multiple search queries and executes them.
4. **Search Results Processing:**The model processes the search results, synthesizes the information, and formulates a response.
5. **Grounded Response:** The API returns a final, user-friendly response that is grounded in the search results. This response includes the model's text answer and`groundingMetadata`with the search queries, web results, and citations.

## Understanding the grounding response

When a response is successfully grounded, the response includes a`groundingMetadata`field. This structured data is essential for verifying claims and building a rich citation experience in your application.  

    {
      "candidates": [
        {
          "content": {
            "parts": [
              {
                "text": "Spain won Euro 2024, defeating England 2-1 in the final. This victory marks Spain's record fourth European Championship title."
              }
            ],
            "role": "model"
          },
          "groundingMetadata": {
            "webSearchQueries": [
              "UEFA Euro 2024 winner",
              "who won euro 2024"
            ],
            "searchEntryPoint": {
              "renderedContent": "<!-- HTML and CSS for the search widget -->"
            },
            "groundingChunks": [
              {"web": {"uri": "https://vertexaisearch.cloud.google.com.....", "title": "aljazeera.com"}},
              {"web": {"uri": "https://vertexaisearch.cloud.google.com.....", "title": "uefa.com"}}
            ],
            "groundingSupports": [
              {
                "segment": {"startIndex": 0, "endIndex": 85, "text": "Spain won Euro 2024, defeatin..."},
                "groundingChunkIndices": [0]
              },
              {
                "segment": {"startIndex": 86, "endIndex": 210, "text": "This victory marks Spain's..."},
                "groundingChunkIndices": [0, 1]
              }
            ]
          }
        }
      ]
    }

The Gemini API returns the following information with the`groundingMetadata`:

- `webSearchQueries`: Array of the search queries used. This is useful for debugging and understanding the model's reasoning process.
- `searchEntryPoint`: Contains the HTML and CSS to render the required Search Suggestions. Full usage requirements are detailed in the[Terms of Service](https://ai.google.dev/gemini-api/terms#grounding-with-google-search).
- `groundingChunks`: Array of objects containing the web sources (`uri`and`title`).
- `groundingSupports`: Array of chunks to connect model response`text`to the sources in`groundingChunks`. Each chunk links a text`segment`(defined by`startIndex`and`endIndex`) to one or more`groundingChunkIndices`. This is the key to building inline citations.

Grounding with Google Search can also be used in combination with the[URL context tool](https://ai.google.dev/gemini-api/docs/url-context)to ground responses in both public web data and the specific URLs you provide.

## Attributing sources with inline citations

The API returns structured citation data, giving you complete control over how you display sources in your user interface. You can use the`groundingSupports`and`groundingChunks`fields to link the model's statements directly to their sources. Here is a common pattern for processing the metadata to create a response with inline, clickable citations.  

### Python

    def add_citations(response):
        text = response.text
        supports = response.candidates[0].grounding_metadata.grounding_supports
        chunks = response.candidates[0].grounding_metadata.grounding_chunks

        # Sort supports by end_index in descending order to avoid shifting issues when inserting.
        sorted_supports = sorted(supports, key=lambda s: s.segment.end_index, reverse=True)

        for support in sorted_supports:
            end_index = support.segment.end_index
            if support.grounding_chunk_indices:
                # Create citation string like [1](link1)[2](link2)
                citation_links = []
                for i in support.grounding_chunk_indices:
                    if i < len(chunks):
                        uri = chunks[i].web.uri
                        citation_links.append(f"[{i + 1}]({uri})")

                citation_string = ", ".join(citation_links)
                text = text[:end_index] + citation_string + text[end_index:]

        return text

    # Assuming response with grounding metadata
    text_with_citations = add_citations(response)
    print(text_with_citations)

### JavaScript

    function addCitations(response) {
        let text = response.text;
        const supports = response.candidates[0]?.groundingMetadata?.groundingSupports;
        const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

        // Sort supports by end_index in descending order to avoid shifting issues when inserting.
        const sortedSupports = [...supports].sort(
            (a, b) => (b.segment?.endIndex ?? 0) - (a.segment?.endIndex ?? 0),
        );

        for (const support of sortedSupports) {
            const endIndex = support.segment?.endIndex;
            if (endIndex === undefined || !support.groundingChunkIndices?.length) {
            continue;
            }

            const citationLinks = support.groundingChunkIndices
            .map(i => {
                const uri = chunks[i]?.web?.uri;
                if (uri) {
                return `[${i + 1}](${uri})`;
                }
                return null;
            })
            .filter(Boolean);

            if (citationLinks.length > 0) {
            const citationString = citationLinks.join(", ");
            text = text.slice(0, endIndex) + citationString + text.slice(endIndex);
            }
        }

        return text;
    }

    const textWithCitations = addCitations(response);
    console.log(textWithCitations);

The new response with inline citations will look like this:  

    Spain won Euro 2024, defeating England 2-1 in the final.[1](https:/...), [2](https:/...), [4](https:/...), [5](https:/...) This victory marks Spain's record-breaking fourth European Championship title.[5]((https:/...), [2](https:/...), [3](https:/...), [4](https:/...)

## Pricing

When you use Grounding with Google Search with Gemini 3, your project is billed for each search query that the model decides to execute. If the model decides to execute multiple search queries to answer a single prompt (for example, searching for`"UEFA Euro 2024 winner"`and`"Spain vs England Euro 2024 final
score"`within the same API call), this counts as two billable uses of the tool for that request. This only applies to Gemini 3 models; when you use search grounding with Gemini 2.5 or older models, your project is billed per prompt.

For detailed pricing information, see the[Gemini API pricing page](https://ai.google.dev/gemini-api/docs/pricing).
| **Note:** Gemini 3 billing for Grounding with Google Search will start January 5, 2026.

## Supported models

Experimental and Preview models are not included. You can find their capabilities on the[model overview](https://ai.google.dev/gemini-api/docs/models)page.

|         Model         | Grounding with Google Search |
|-----------------------|------------------------------|
| Gemini 2.5 Pro        | ✔️                           |
| Gemini 2.5 Flash      | ✔️                           |
| Gemini 2.5 Flash-Lite | ✔️                           |
| Gemini 2.0 Flash      | ✔️                           |
| Gemini 1.5 Pro        | ✔️                           |
| Gemini 1.5 Flash      | ✔️                           |

| **Note:** Older models use a`google_search_retrieval`tool. For all current models, use the`google_search`tool as shown in the examples.

## Supported tools combinations

You can use Grounding with Google Search with other tools like[code execution](https://ai.google.dev/gemini-api/docs/code-execution)and[URL context](https://ai.google.dev/gemini-api/docs/url-context)to power more complex use cases.

## Grounding with Gemini 1.5 Models (Legacy)

While the`google_search`tool is recommended for Gemini 2.0 and later, Gemini 1.5 supports a legacy tool named`google_search_retrieval`. This tool provides a`dynamic`mode that allows the model to decide whether to perform a search based on its confidence that the prompt requires fresh information. If the model's confidence is above a`dynamic_threshold`you set (a value between 0.0 and 1.0), it will perform a search.  

### Python

    # Note: This is a legacy approach for Gemini 1.5 models.
    # The 'google_search' tool is recommended for all new development.
    import os
    from google import genai
    from google.genai import types

    client = genai.Client()

    retrieval_tool = types.Tool(
        google_search_retrieval=types.GoogleSearchRetrieval(
            dynamic_retrieval_config=types.DynamicRetrievalConfig(
                mode=types.DynamicRetrievalConfigMode.MODE_DYNAMIC,
                dynamic_threshold=0.7 # Only search if confidence > 70%
            )
        )
    )

    config = types.GenerateContentConfig(
        tools=[retrieval_tool]
    )

    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents="Who won the euro 2024?",
        config=config,
    )
    print(response.text)
    if not response.candidates[0].grounding_metadata:
      print("\nModel answered from its own knowledge.")

### JavaScript

    // Note: This is a legacy approach for Gemini 1.5 models.
    // The 'googleSearch' tool is recommended for all new development.
    import { GoogleGenAI, DynamicRetrievalConfigMode } from "@google/genai";

    const ai = new GoogleGenAI({});

    const retrievalTool = {
      googleSearchRetrieval: {
        dynamicRetrievalConfig: {
          mode: DynamicRetrievalConfigMode.MODE_DYNAMIC,
          dynamicThreshold: 0.7, // Only search if confidence > 70%
        },
      },
    };

    const config = {
      tools: [retrievalTool],
    };

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Who won the euro 2024?",
      config,
    });

    console.log(response.text);
    if (!response.candidates?.[0]?.groundingMetadata) {
      console.log("\nModel answered from its own knowledge.");
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \

      -H "Content-Type: application/json" \
      -X POST \
      -d '{
        "contents": [
          {"parts": [{"text": "Who won the euro 2024?"}]}
        ],
        "tools": [{
          "google_search_retrieval": {
            "dynamic_retrieval_config": {
              "mode": "MODE_DYNAMIC",
              "dynamic_threshold": 0.7
            }
          }
        }]
      }'

## What's next

- Try the[Grounding with Google Search in the Gemini API Cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Search_Grounding.ipynb).
- Learn about other available tools, like[Function Calling](https://ai.google.dev/gemini-api/docs/function-calling).
- Learn how to augment prompts with specific URLs using the[URL context tool](https://ai.google.dev/gemini-api/docs/url-context).

<br />

The Gemini API provides a code execution tool that enables the model to generate and run Python code. The model can then learn iteratively from the code execution results until it arrives at a final output. You can use code execution to build applications that benefit from code-based reasoning. For example, you can use code execution to solve equations or process text. You can also use the[libraries](https://ai.google.dev/gemini-api/docs/code-execution#supported-libraries)included in the code execution environment to perform more specialized tasks.

Gemini is only able to execute code in Python. You can still ask Gemini to generate code in another language, but the model can't use the code execution tool to run it.

## Enable code execution

To enable code execution, configure the code execution tool on the model. This allows the model to generate and run code.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="What is the sum of the first 50 prime numbers? "
        "Generate and run code for the calculation, and make sure you get all 50.",
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    let response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "What is the sum of the first 50 prime numbers? " +
          "Generate and run code for the calculation, and make sure you get all 50.",
      ],
      config: {
        tools: [{ codeExecution: {} }],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    parts.forEach((part) => {
      if (part.text) {
        console.log(part.text);
      }

      if (part.executableCode && part.executableCode.code) {
        console.log(part.executableCode.code);
      }

      if (part.codeExecutionResult && part.codeExecutionResult.output) {
        console.log(part.codeExecutionResult.output);
      }
    });

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        result, _ := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            genai.Text("What is the sum of the first 50 prime numbers? " +
                      "Generate and run code for the calculation, and make sure you get all 50."),
            config,
        )

        fmt.Println(result.Text())
        fmt.Println(result.ExecutableCode())
        fmt.Println(result.CodeExecutionResult())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -d ' {"tools": [{"code_execution": {}}],
        "contents": {
          "parts":
            {
                "text": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50."
            }
        },
    }'

| **Note:** This REST example doesn't parse the JSON response as shown in the example output.

The output might look something like the following, which has been formatted for readability:  

    Okay, I need to calculate the sum of the first 50 prime numbers. Here's how I'll
    approach this:

    1.  **Generate Prime Numbers:** I'll use an iterative method to find prime
        numbers. I'll start with 2 and check if each subsequent number is divisible
        by any number between 2 and its square root. If not, it's a prime.
    2.  **Store Primes:** I'll store the prime numbers in a list until I have 50 of
        them.
    3.  **Calculate the Sum:**  Finally, I'll sum the prime numbers in the list.

    Here's the Python code to do this:

    def is_prime(n):
      """Efficiently checks if a number is prime."""
      if n <= 1:
        return False
      if n <= 3:
        return True
      if n % 2 == 0 or n % 3 == 0:
        return False
      i = 5
      while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
          return False
        i += 6
      return True

    primes = []
    num = 2
    while len(primes) < 50:
      if is_prime(num):
        primes.append(num)
      num += 1

    sum_of_primes = sum(primes)
    print(f'{primes=}')
    print(f'{sum_of_primes=}')

    primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
    71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229]
    sum_of_primes=5117

    The sum of the first 50 prime numbers is 5117.

This output combines several content parts that the model returns when using code execution:

- `text`: Inline text generated by the model
- `executableCode`: Code generated by the model that is meant to be executed
- `codeExecutionResult`: Result of the executable code

The naming conventions for these parts vary by programming language.

## Code Execution with images (Gemini 3)

The Gemini 3 Flash model can now write and execute Python code to actively manipulate and inspect images. This capability is called*Visual Thinking*.

**Use cases**

- **Zoom and inspect**: The model implicitly detects when details are too small (e.g., reading a distant gauge) and writes code to crop and re-examine the area at higher resolution.
- **Visual math**: The model can run multi-step calculations using code (e.g., summing line items on a receipt).
- **Image annotation**: The model can annotate images to answer questions, such as drawing arrows to show relationships.

| **Note:** While the model automatically handles zooming for small details, you should prompt it explicitly to use code for other tasks, such as "Write code to count the number of gears" or "Rotate this image to make it upright".

### Enabling visual thinking

Visual Thinking is officially supported in Gemini 3 Flash. You can activate this behavior by enabling both Code Execution as a tool and Thinking.  

### Python

    from google import genai
    from google.genai import types
    import requests
    from PIL import Image
    import io

    image_path = "https://goo.gle/instrument-img"
    image_bytes = requests.get(image_path).content
    image = types.Part.from_bytes(
      data=image_bytes, mime_type="image/jpeg"
    )

    # Ensure you have your API key set
    client = genai.Client(api_key="GEMINI_API_KEY")

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[image, "Zoom into the expression pedals and tell me how many pedals are there?"],
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)
        if part.as_image() is not None:
            # display() is a standard function in Jupyter/Colab notebooks
            display(Image.open(io.BytesIO(part.as_image().image_bytes)))

### JavaScript

    async function main() {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // 1. Prepare Image Data
      const imageUrl = "https://goo.gle/instrument-img";
      const response = await fetch(imageUrl);
      const imageArrayBuffer = await response.arrayBuffer();
      const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

      // 2. Call the API with Code Execution enabled
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageData,
            },
          },
          { text: "Zoom into the expression pedals and tell me how many pedals are there?" }
        ],
        config: {
          tools: [{ codeExecution: {} }],
        },
      });

      // 3. Process the response (Text, Code, and Execution Results)
      const candidates = result.response.candidates;
      if (candidates && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.text) {
            console.log("Text:", part.text);
          }
          if (part.executableCode) {
            console.log(`\nGenerated Code (${part.executableCode.language}):\n`, part.executableCode.code);
          }
          if (part.codeExecutionResult) {
            console.log(`\nExecution Output (${part.codeExecutionResult.outcome}):\n`, part.codeExecutionResult.output);
          }
        }
      }
    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "io"
        "log"
        "net/http"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        // Initialize Client (Reads GEMINI_API_KEY from env)
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        // 1. Download the image
        imageResp, err := http.Get("https://goo.gle/instrument-img")
        if err != nil {
            log.Fatal(err)
        }
        defer imageResp.Body.Close()

        imageBytes, err := io.ReadAll(imageResp.Body)
        if err != nil {
            log.Fatal(err)
        }

        // 2. Configure Code Execution Tool
        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        // 3. Generate Content
        result, err := client.Models.GenerateContent(
            ctx,
            "gemini-3-flash-preview",
            []*genai.Content{
                {
                    Parts: []*genai.Part{
                        {InlineData: &genai.Blob{MIMEType: "image/jpeg", Data: imageBytes}},
                        {Text: "Zoom into the expression pedals and tell me how many pedals are there?"},
                    },
                    Role: "user",
                },
            },
            config,
        )
        if err != nil {
            log.Fatal(err)
        }

        // 4. Parse Response (Text, Code, Output)
        for _, cand := range result.Candidates {
            for _, part := range cand.Content.Parts {
                if part.Text != "" {
                    fmt.Println("Text:", part.Text)
                }
                if part.ExecutableCode != nil {
                    fmt.Printf("\nGenerated Code (%s):\n%s\n", 
                        part.ExecutableCode.Language, 
                        part.ExecutableCode.Code)
                }
                if part.CodeExecutionResult != nil {
                    fmt.Printf("\nExecution Output (%s):\n%s\n", 
                        part.CodeExecutionResult.Outcome, 
                        part.CodeExecutionResult.Output)
                }
            }
        }
    }

### REST

    IMG_URL="https://goo.gle/instrument-img"
    MODEL="gemini-3-flash-preview"

    MIME_TYPE=$(curl -sIL "$IMG_URL" | grep -i '^content-type:' | awk -F ': ' '{print $2}' | sed 's/\r$//' | head -n 1)
    if [[ -z "$MIME_TYPE" || ! "$MIME_TYPE" == image/* ]]; then
      MIME_TYPE="image/jpeg"
    fi

    if [[ "$(uname)" == "Darwin" ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -b 0)
    elif [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64)
    else
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -w0)
    fi

    curl "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent?key=$GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
                {
                  "inline_data": {
                    "mime_type":"'"$MIME_TYPE"'",
                    "data": "'"$IMAGE_B64"'"
                  }
                },
                {"text": "Zoom into the expression pedals and tell me how many pedals are there?"}
            ]
          }],
          "tools": [
            {
              "code_execution": {}
            }
          ]
        }'

## Use code execution in chat

You can also use code execution as part of a chat.  

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    chat = client.chats.create(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            tools=[types.Tool(code_execution=types.ToolCodeExecution)]
        ),
    )

    response = chat.send_message("I have a math question for you.")
    print(response.text)

    response = chat.send_message(
        "What is the sum of the first 50 prime numbers? "
        "Generate and run code for the calculation, and make sure you get all 50."
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        if part.executable_code is not None:
            print(part.executable_code.code)
        if part.code_execution_result is not None:
            print(part.code_execution_result.output)

### JavaScript

    import {GoogleGenAI} from "@google/genai";

    const ai = new GoogleGenAI({});

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "I have a math question for you:" }],
        },
        {
          role: "model",
          parts: [{ text: "Great! I'm ready for your math question. Please ask away." }],
        },
      ],
      config: {
        tools: [{codeExecution:{}}],
      }
    });

    const response = await chat.sendMessage({
      message: "What is the sum of the first 50 prime numbers? " +
                "Generate and run code for the calculation, and make sure you get all 50."
    });
    console.log("Chat response:", response.text);

### Go

    package main

    import (
        "context"
        "fmt"
        "os"
        "google.golang.org/genai"
    )

    func main() {

        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        config := &genai.GenerateContentConfig{
            Tools: []*genai.Tool{
                {CodeExecution: &genai.ToolCodeExecution{}},
            },
        }

        chat, _ := client.Chats.Create(
            ctx,
            "gemini-2.5-flash",
            config,
            nil,
        )

        result, _ := chat.SendMessage(
                        ctx,
                        genai.Part{Text: "What is the sum of the first 50 prime numbers? " +
                                              "Generate and run code for the calculation, and " +
                                              "make sure you get all 50.",
                                  },
                    )

        fmt.Println(result.Text())
        fmt.Println(result.ExecutableCode())
        fmt.Println(result.CodeExecutionResult())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{"tools": [{"code_execution": {}}],
        "contents": [
            {
                "role": "user",
                "parts": [{
                    "text": "Can you print \"Hello world!\"?"
                }]
            },{
                "role": "model",
                "parts": [
                  {
                    "text": ""
                  },
                  {
                    "executable_code": {
                      "language": "PYTHON",
                      "code": "\nprint(\"hello world!\")\n"
                    }
                  },
                  {
                    "code_execution_result": {
                      "outcome": "OUTCOME_OK",
                      "output": "hello world!\n"
                    }
                  },
                  {
                    "text": "I have printed \"hello world!\" using the provided python code block. \n"
                  }
                ],
            },{
                "role": "user",
                "parts": [{
                    "text": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50."
                }]
            }
        ]
    }'

## Input/output (I/O)

Starting with[Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash), code execution supports file input and graph output. Using these input and output capabilities, you can upload CSV and text files, ask questions about the files, and have[Matplotlib](https://matplotlib.org/)graphs generated as part of the response. The output files are returned as inline images in the response.

### I/O pricing

When using code execution I/O, you're charged for input tokens and output tokens:

**Input tokens:**

- User prompt

**Output tokens:**

- Code generated by the model
- Code execution output in the code environment
- Thinking tokens
- Summary generated by the model

### I/O details

When you're working with code execution I/O, be aware of the following technical details:

- The maximum runtime of the code environment is 30 seconds.
- If the code environment generates an error, the model may decide to regenerate the code output. This can happen up to 5 times.
- The maximum file input size is limited by the model token window. In AI Studio, using Gemini Flash 2.0, the maximum input file size is 1 million tokens (roughly 2MB for text files of the supported input types). If you upload a file that's too large, AI Studio won't let you send it.
- Code execution works best with text and CSV files.
- The input file can be passed in`part.inlineData`or`part.fileData`(uploaded via the[Files API](https://ai.google.dev/gemini-api/docs/files)), and the output file is always returned as`part.inlineData`.

|                                                                                         |                     Single turn                     |         Bidirectional (Multimodal Live API)         |
|-----------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|
| Models supported                                                                        | All Gemini 2.0 and 2.5 models                       | Only Flash experimental models                      |
| File input types supported                                                              | .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts | .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts |
| Plotting libraries supported                                                            | Matplotlib, seaborn                                 | Matplotlib, seaborn                                 |
| [Multi-tool use](https://ai.google.dev/gemini-api/docs/function-calling#multi-tool-use) | Yes (code execution + grounding only)               | Yes                                                 |

## Billing

There's no additional charge for enabling code execution from the Gemini API. You'll be billed at the current rate of input and output tokens based on the Gemini model you're using.

Here are a few other things to know about billing for code execution:

- You're only billed once for the input tokens you pass to the model, and you're billed for the final output tokens returned to you by the model.
- Tokens representing generated code are counted as output tokens. Generated code can include text and multimodal output like images.
- Code execution results are also counted as output tokens.

The billing model is shown in the following diagram:

![code execution billing model](https://ai.google.dev/static/gemini-api/docs/images/code-execution-diagram.png)

- You're billed at the current rate of input and output tokens based on the Gemini model you're using.
- If Gemini uses code execution when generating your response, the original prompt, the generated code, and the result of the executed code are labeled*intermediate tokens* and are billed as*input tokens*.
- Gemini then generates a summary and returns the generated code, the result of the executed code, and the final summary. These are billed as*output tokens*.
- The Gemini API includes an intermediate token count in the API response, so you know why you're getting additional input tokens beyond your initial prompt.

## Limitations

- The model can only generate and execute code. It can't return other artifacts like media files.
- In some cases, enabling code execution can lead to regressions in other areas of model output (for example, writing a story).
- There is some variation in the ability of the different models to use code execution successfully.

## Supported tools combinations

Code execution tool can be combined with[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)to power more complex use cases.

## Supported libraries

The code execution environment includes the following libraries:

- attrs
- chess
- contourpy
- fpdf
- geopandas
- imageio
- jinja2
- joblib
- jsonschema
- jsonschema-specifications
- lxml
- matplotlib
- mpmath
- numpy
- opencv-python
- openpyxl
- packaging
- pandas
- pillow
- protobuf
- pylatex
- pyparsing
- PyPDF2
- python-dateutil
- python-docx
- python-pptx
- reportlab
- scikit-learn
- scipy
- seaborn
- six
- striprtf
- sympy
- tabulate
- tensorflow
- toolz
- xlrd

You can't install your own libraries.
| **Note:** Only`matplotlib`is supported for graph rendering using code execution.

## What's next

- Try the[code execution Colab](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Code_Execution.ipynb).
- Learn about other Gemini API tools:
  - [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)
  - [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/grounding)

  The URL context tool lets you provide additional context to the models in the
form of URLs. By including URLs in your request, the model will access
the content from those pages (as long as it's not a URL type listed in the
[limitations section](https://ai.google.dev/gemini-api/docs/url-context#limitations)) to inform
and enhance its response.

The URL context tool is useful for tasks like the following:

- **Extract Data**: Pull specific info like prices, names, or key findings from multiple URLs.
- **Compare Documents**: Analyze multiple reports, articles, or PDFs to identify differences and track trends.
- **Synthesize \& Create Content**: Combine information from several source URLs to generate accurate summaries, blog posts, or reports.
- **Analyze Code \& Docs**: Point to a GitHub repository or technical documentation to explain code, generate setup instructions, or answer questions.

The following example shows how to compare two recipes from different websites.  

### Python

    from google import genai
    from google.genai.types import Tool, GenerateContentConfig

    client = genai.Client()
    model_id = "gemini-2.5-flash"

    tools = [
      {"url_context": {}},
    ]

    url1 = "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592"
    url2 = "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/"

    response = client.models.generate_content(
        model=model_id,
        contents=f"Compare the ingredients and cooking times from the recipes at {url1} and {url2}",
        config=GenerateContentConfig(
            tools=tools,
        )
    )

    for each in response.candidates[0].content.parts:
        print(each.text)

    # For verification, you can inspect the metadata to see which URLs the model retrieved
    print(response.candidates[0].url_context_metadata)

### Javascript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
        ],
        config: {
          tools: [{urlContext: {}}],
        },
      });
      console.log(response.text);

      // For verification, you can inspect the metadata to see which URLs the model retrieved
      console.log(response.candidates[0].urlContextMetadata)
    }

    await main();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
          "contents": [
              {
                  "parts": [
                      {"text": "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/"}
                  ]
              }
          ],
          "tools": [
              {
                  "url_context": {}
              }
          ]
      }' > result.json

    cat result.json

## How it works

The URL Context tool uses a two-step retrieval process to
balance speed, cost, and access to fresh data. When you provide a URL, the tool
first attempts to fetch the content from an internal index cache. This acts as a
highly optimized cache. If a URL is not available in the index (for example, if
it's a very new page), the tool automatically falls back to do a live fetch.
This directly accesses the URL to retrieve its content in real-time.

## Combining with other tools

You can combine the URL context tool with other tools to create more powerful
workflows.

### Grounding with search

When both URL context and
[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/grounding) are enabled,
the model can use its search capabilities to find
relevant information online and then use the URL context tool to get a more
in-depth understanding of the pages it finds. This approach is powerful for
prompts that require both broad searching and deep analysis of specific pages.  

### Python

    from google import genai
    from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, UrlContext

    client = genai.Client()
    model_id = "gemini-2.5-flash"

    tools = [
          {"url_context": {}},
          {"google_search": {}}
      ]

    response = client.models.generate_content(
        model=model_id,
        contents="Give me three day events schedule based on <var translate="no">YOUR_URL</var>. Also let me know what needs to taken care of considering weather and commute.",
        config=GenerateContentConfig(
            tools=tools,
        )
    )

    for each in response.candidates[0].content.parts:
        print(each.text)
    # get URLs retrieved for context
    print(response.candidates[0].url_context_metadata)

### Javascript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            "Give me three day events schedule based on <var translate="no">YOUR_URL</var>. Also let me know what needs to taken care of considering weather and commute.",
        ],
        config: {
          tools: [
            {urlContext: {}},
            {googleSearch: {}}
            ],
        },
      });
      console.log(response.text);
      // To get URLs retrieved for context
      console.log(response.candidates[0].urlContextMetadata)
    }

    await main();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
          "contents": [
              {
                  "parts": [
                      {"text": "Give me three day events schedule based on <var translate="no">YOUR_URL</var>. Also let me know what needs to taken care of considering weather and commute."}
                  ]
              }
          ],
          "tools": [
              {
                  "url_context": {}
              },
              {
                  "google_search": {}
              }
          ]
      }' > result.json

    cat result.json

## Understanding the response

When the model uses the URL context tool, the response includes a
`url_context_metadata` object. This object lists the URLs the model retrieved
content from and the status of each retrieval attempt, which is useful for
verification and debugging.

The following is an example of that part of the response
(parts of the response have been omitted for brevity):  

    {
      "candidates": [
        {
          "content": {
            "parts": [
              {
                "text": "... \n"
              }
            ],
            "role": "model"
          },
          ...
          "url_context_metadata": {
            "url_metadata": [
              {
                "retrieved_url": "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592",
                "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
              },
              {
                "retrieved_url": "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
                "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
              }
            ]
          }
        }
    }

For complete detail about this object , see the
[`UrlContextMetadata` API reference](https://ai.google.dev/api/generate-content#UrlContextMetadata).

### Safety checks

The system performs a content moderation check on the URL to confirm
they meet safety standards. If the URL you provided fails this check, you will
get an `url_retrieval_status` of `URL_RETRIEVAL_STATUS_UNSAFE`.

### Token count

The content retrieved from the URLs you specify in your prompt is counted
as part of the input tokens. You can see the token count for your prompt and
tools usage in the [`usage_metadata`](https://ai.google.dev/api/generate-content#UsageMetadata)
object of the model output. The following is an example output:  

    'usage_metadata': {
      'candidates_token_count': 45,
      'prompt_token_count': 27,
      'prompt_tokens_details': [{'modality': <MediaModality.TEXT: 'TEXT'>,
        'token_count': 27}],
      'thoughts_token_count': 31,
      'tool_use_prompt_token_count': 10309,
      'tool_use_prompt_tokens_details': [{'modality': <MediaModality.TEXT: 'TEXT'>,
        'token_count': 10309}],
      'total_token_count': 10412
      }

Price per token depends on the model used, see the
[pricing](https://ai.google.dev/gemini-api/docs/pricing) page for details.

## Supported models

- [gemini-2.5-pro](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro)
- [gemini-2.5-flash](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash)
- [gemini-2.5-flash-lite](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-lite)
- [gemini-live-2.5-flash-preview](https://ai.google.dev/gemini-api/docs/models#live-api)
- [gemini-2.0-flash-live-001](https://ai.google.dev/gemini-api/docs/models#live-api-2.0)

## Best Practices

- **Provide specific URLs**: For the best results, provide direct URLs to the content you want the model to analyze. The model will only retrieve content from the URLs you provide, not any content from nested links.
- **Check for accessibility**: Verify that the URLs you provide don't lead to pages that require a login or are behind a paywall.
- **Use the complete URL**: Provide the full URL, including the protocol (e.g., https://www.google.com instead of just google.com).

## Limitations

- **Pricing** : Content retrieved from URLs counts as input tokens. Rate limit and pricing is the based on the model used. See the [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) and [pricing](https://ai.google.dev/gemini-api/docs/pricing) pages for details.
- **Request limit**: The tool can process up to 20 URLs per request.
- **URL content size**: The maximum size for content retrieved from a single URL is 34MB.

### Supported and unsupported content types

The tool can extract content from URLs with the following content types:

- Text (text/html, application/json, text/plain, text/xml, text/css, text/javascript , text/csv, text/rtf)
- Image (image/png, image/jpeg, image/bmp, image/webp)
- PDF (application/pdf)

The following content types are **not** supported:

- Paywalled content
- YouTube videos (See [video understanding](https://ai.google.dev/gemini-api/docs/video-understanding#youtube) to learn how to process YouTube URLs)
- Google workspace files like Google docs or spreadsheets
- Video and audio files

## What's next

- Explore the [URL context cookbook](https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb#url-context) for more examples.

<br />

The Gemini API enables Retrieval Augmented Generation ("RAG") through the File Search tool. File Search imports, chunks, and indexes your data to enable fast retrieval of relevant information based on a provided prompt. This information is then used as context to the model, allowing the model to provide more accurate and relevant answers.

To make File Search simple and affordable for developers, we're making file storage and embedding generation at query time free of charge. You only pay for creating embeddings when you first index your files (at the applicable embedding model cost) and the normal Gemini model input / output tokens cost. This new billing paradigm makes the File Search Tool both easier and more cost-effective to build and scale with.

## Directly upload to File Search store

This examples shows how to directly upload a file to the[file search store](https://ai.google.dev/api/file-search/file-search-stores#method:-media.uploadtofilesearchstore):  

### Python

    from google import genai
    from google.genai import types
    import time

    client = genai.Client()

    # File name will be visible in citations
    file_search_store = client.file_search_stores.create(config={'display_name': 'your-fileSearchStore-name'})

    operation = client.file_search_stores.upload_to_file_search_store(
      file='sample.txt',
      file_search_store_name=file_search_store.name,
      config={
          'display_name' : 'display-file-name',
      }
    )

    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="""Can you tell me about [insert question]""",
        config=types.GenerateContentConfig(
            tools=[
                types.Tool(
                    file_search=types.FileSearch(
                        file_search_store_names=[file_search_store.name]
                    )
                )
            ]
        )
    )

    print(response.text)

### JavaScript

    const { GoogleGenAI } = require('@google/genai');

    const ai = new GoogleGenAI({});

    async function run() {
      // File name will be visible in citations
      const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'your-fileSearchStore-name' }
      });

      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: 'file.txt',
        fileSearchStoreName: fileSearchStore.name,
        config: {
          displayName: 'file-name',
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Can you tell me about [insert question]",
        config: {
          tools: [
            {
              fileSearch: {
                fileSearchStoreNames: [fileSearchStore.name]
              }
            }
          ]
        }
      });

      console.log(response.text);
    }

    run();

Check the API reference for[`uploadToFileSearchStore`](https://ai.google.dev/api/file-search/file-search-stores#method:-media.uploadtofilesearchstore)for more information.

## Importing files

Alternatively, you can upload an existing file and[import it to your file search store](https://ai.google.dev/api/file-search/file-search-stores#method:-filesearchstores.importfile):  

### Python

    from google import genai
    from google.genai import types
    import time

    client = genai.Client()

    # File name will be visible in citations
    sample_file = client.files.upload(file='sample.txt', config={'name': 'display_file_name'})

    file_search_store = client.file_search_stores.create(config={'display_name': 'your-fileSearchStore-name'})

    operation = client.file_search_stores.import_file(
        file_search_store_name=file_search_store.name,
        file_name=sample_file.name
    )

    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="""Can you tell me about [insert question]""",
        config=types.GenerateContentConfig(
            tools=[
                types.Tool(
                    file_search=types.FileSearch(
                        file_search_store_names=[file_search_store.name]
                    )
                )
            ]
        )
    )

    print(response.text)

### JavaScript

    const { GoogleGenAI } = require('@google/genai');

    const ai = new GoogleGenAI({});

    async function run() {
      // File name will be visible in citations
      const sampleFile = await ai.files.upload({
        file: 'sample.txt',
        config: { name: 'file-name' }
      });

      const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'your-fileSearchStore-name' }
      });

      let operation = await ai.fileSearchStores.importFile({
        fileSearchStoreName: fileSearchStore.name,
        fileName: sampleFile.name
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation: operation });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Can you tell me about [insert question]",
        config: {
          tools: [
            {
              fileSearch: {
                fileSearchStoreNames: [fileSearchStore.name]
              }
            }
          ]
        }
      });

      console.log(response.text);
    }

    run();

Check the API reference for[`importFile`](https://ai.google.dev/api/file-search/file-search-stores#method:-filesearchstores.importfile)for more information.

## Chunking configuration

When you import a file into a File Search store, it's automatically broken down into chunks, embedded, indexed, and uploaded to your File Search store. If you need more control over the chunking strategy, you can specify a[`chunking_config`](https://ai.google.dev/api/file-search/file-search-stores#request-body_5)setting to set a maximum number of tokens per chunk and maximum number of overlapping tokens.  

### Python

    operation = client.file_search_stores.upload_to_file_search_store(
        file_search_store_name=file_search_store.name,
        file_name=sample_file.name,
        config={
            'chunking_config': {
              'white_space_config': {
                'max_tokens_per_chunk': 200,
                'max_overlap_tokens': 20
              }
            }
        }
    )

### JavaScript

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: 'file.txt',
      fileSearchStoreName: fileSearchStore.name,
      config: {
        displayName: 'file-name',
        chunkingConfig: {
          whiteSpaceConfig: {
            maxTokensPerChunk: 200,
            maxOverlapTokens: 20
          }
        }
      }
    });

To use your File Search store, pass it as a tool to the`generateContent`method, as shown in the[Upload](https://ai.google.dev/gemini-api/docs/file-search#upload)and[Import](https://ai.google.dev/gemini-api/docs/file-search#importing-files)examples.

## How it works

File Search uses a technique called semantic search to find information relevant to the user prompt. Unlike standard keyword-based search, semantic search understands the meaning and context of your query.

When you import a file, it's converted into numerical representations called[embeddings](https://ai.google.dev/gemini-api/docs/embeddings), which capture the semantic meaning of the text. These embeddings are stored in a specialized File Search database. When you make a query, it's also converted into an embedding. Then the system performs a File Search to find the most similar and relevant document chunks from the File Search store.

Here's a breakdown of the process for using the File Search`uploadToFileSearchStore`API:

1. **Create a File Search store**: A File Search store contains the processed data from your files. It's the persistent container for the embeddings that the semantic search will operate on.

2. **Upload a file and import into a File Search store** : Simultaneously upload a file and import the results into your File Search store. This creates a temporary`File`object, which is a reference to your raw document. That data is then chunked, converted into File Search embeddings, and indexed. The`File`object gets deleted after 48 hours, while the data imported into the File Search store will be stored indefinitely until you choose to delete it.

3. **Query with File Search** : Finally, you use the`FileSearch`tool in a`generateContent`call. In the tool configuration, you specify a`FileSearchRetrievalResource`, which points to the`FileSearchStore`you want to search. This tells the model to perform a semantic search on that specific File Search store to find relevant information to ground its response.

![The indexing and querying process of File Search](https://ai.google.dev/static/gemini-api/docs/images/File-search.png)The indexing and querying process of File Search

In this diagram, the dotted line from from*Documents* to*Embedding model* (using[`gemini-embedding-001`](https://ai.google.dev/gemini-api/docs/embeddings)) represents the`uploadToFileSearchStore`API (bypassing*File storage* ). Otherwise, using the[Files API](https://ai.google.dev/gemini-api/docs/files)to separately create and then import files moves the indexing process from*Documents* to*File storage* and then to*Embedding model*.

## File Search stores

A File Search store is a container for your document embeddings. While raw files uploaded through the File API are deleted after 48 hours, the data imported into a File Search store is stored indefinitely until you manually delete it. You can create multiple File Search stores to organize your documents. The`FileSearchStore`API lets you create, list, get, and delete to manage your file search stores. File Search store names are globally scoped.

Here are some examples of how to manage your File Search stores:  

### Python

    file_search_store = client.file_search_stores.create(config={'display_name': 'my-file_search-store-123'})

    for file_search_store in client.file_search_stores.list():
        print(file_search_store)

    my_file_search_store = client.file_search_stores.get(name='fileSearchStores/my-file_search-store-123')

    client.file_search_stores.delete(name='fileSearchStores/my-file_search-store-123', config={'force': True})

### JavaScript

    const fileSearchStore = await ai.fileSearchStores.create({
      config: { displayName: 'my-file_search-store-123' }
    });

    const fileSearchStores = await ai.fileSearchStores.list();
    for await (const store of fileSearchStores) {
      console.log(store);
    }

    const myFileSearchStore = await ai.fileSearchStores.get({
      name: 'fileSearchStores/my-file_search-store-123'
    });

    await ai.fileSearchStores.delete({
      name: 'fileSearchStores/my-file_search-store-123',
      config: { force: true }
    });

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" 
        -d '{ "displayName": "My Store" }'

    curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${GEMINI_API_KEY}" \

    curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123?key=${GEMINI_API_KEY}"

    curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123?key=${GEMINI_API_KEY}"

The[File Search Documents](https://ai.google.dev/api/file-search/documents)API reference for methods and fields related to managing documents in your file stores.

## File metadata

You can add custom metadata to your files to help filter them or provide additional context. Metadata is a set of key-value pairs.  

### Python

    op = client.file_search_stores.import_file(
        file_search_store_name=file_search_store.name,
        file_name=sample_file.name,
        custom_metadata=[
            {"key": "author", "string_value": "Robert Graves"},
            {"key": "year", "numeric_value": 1934}
        ]
    )

### JavaScript

    let operation = await ai.fileSearchStores.importFile({
      fileSearchStoreName: fileSearchStore.name,
      fileName: sampleFile.name,
      config: {
        customMetadata: [
          { key: "author", stringValue: "Robert Graves" },
          { key: "year", numericValue: 1934 }
        ]
      }
    });

This is useful when you have multiple documents in a File Search store and want to search only a subset of them.  

### Python

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Tell me about the book 'I, Claudius'",
        config=types.GenerateContentConfig(
            tools=[
                types.Tool(
                    file_search=types.FileSearch(
                        file_search_store_names=[file_search_store.name],
                        metadata_filter="author=Robert Graves",
                    )
                )
            ]
        )
    )

    print(response.text)

### JavaScript

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tell me about the book 'I, Claudius'",
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [fileSearchStore.name],
              metadataFilter: 'author="Robert Graves"',
            }
          }
        ]
      }
    });

    console.log(response.text);

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
                "contents": [{
                    "parts":[{"text": "Tell me about the book I, Claudius"}]          
                }],
                "tools": [{
                    "file_search": { 
                        "file_search_store_names":["'$STORE_NAME'"],
                        "metadata_filter": "author = \"Robert Graves\""
                    }
                }]
            }' 2> /dev/null > response.json

    cat response.json

Guidance on implementing list filter syntax for`metadata_filter`can be found at[google.aip.dev/160](https://google.aip.dev/160)

## Citations

When you use File Search, the model's response may include citations that specify which parts of your uploaded documents were used to generate the answer. This helps with fact-checking and verification.

You can access citation information through the`grounding_metadata`attribute of the response.  

### Python

    print(response.candidates[0].grounding_metadata)

### JavaScript

    console.log(JSON.stringify(response.candidates?.[0]?.groundingMetadata, null, 2));

## Supported models

The following models support File Search:

- [`gemini-3-pro-preview`](https://ai.google.dev/gemini-api/docs/models#gemini-3-pro)
- [`gemini-2.5-pro`](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro)
- [`gemini-2.5-flash`](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash)and its preview versions
- [`gemini-2.5-flash-lite`](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-lite)and its preview versions

## Supported file types

File Search supports a wide range of file formats, listed in the following sections.

### Application file types

- `application/dart`
- `application/ecmascript`
- `application/json`
- `application/ms-java`
- `application/msword`
- `application/pdf`
- `application/sql`
- `application/typescript`
- `application/vnd.curl`
- `application/vnd.dart`
- `application/vnd.ibm.secure-container`
- `application/vnd.jupyter`
- `application/vnd.ms-excel`
- `application/vnd.oasis.opendocument.text`
- `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.template`
- `application/x-csh`
- `application/x-hwp`
- `application/x-hwp-v5`
- `application/x-latex`
- `application/x-php`
- `application/x-powershell`
- `application/x-sh`
- `application/x-shellscript`
- `application/x-tex`
- `application/x-zsh`
- `application/xml`
- `application/zip`

### Text file types

- `text/1d-interleaved-parityfec`
- `text/RED`
- `text/SGML`
- `text/cache-manifest`
- `text/calendar`
- `text/cql`
- `text/cql-extension`
- `text/cql-identifier`
- `text/css`
- `text/csv`
- `text/csv-schema`
- `text/dns`
- `text/encaprtp`
- `text/enriched`
- `text/example`
- `text/fhirpath`
- `text/flexfec`
- `text/fwdred`
- `text/gff3`
- `text/grammar-ref-list`
- `text/hl7v2`
- `text/html`
- `text/javascript`
- `text/jcr-cnd`
- `text/jsx`
- `text/markdown`
- `text/mizar`
- `text/n3`
- `text/parameters`
- `text/parityfec`
- `text/php`
- `text/plain`
- `text/provenance-notation`
- `text/prs.fallenstein.rst`
- `text/prs.lines.tag`
- `text/prs.prop.logic`
- `text/raptorfec`
- `text/rfc822-headers`
- `text/rtf`
- `text/rtp-enc-aescm128`
- `text/rtploopback`
- `text/rtx`
- `text/sgml`
- `text/shaclc`
- `text/shex`
- `text/spdx`
- `text/strings`
- `text/t140`
- `text/tab-separated-values`
- `text/texmacs`
- `text/troff`
- `text/tsv`
- `text/tsx`
- `text/turtle`
- `text/ulpfec`
- `text/uri-list`
- `text/vcard`
- `text/vnd.DMClientScript`
- `text/vnd.IPTC.NITF`
- `text/vnd.IPTC.NewsML`
- `text/vnd.a`
- `text/vnd.abc`
- `text/vnd.ascii-art`
- `text/vnd.curl`
- `text/vnd.debian.copyright`
- `text/vnd.dvb.subtitle`
- `text/vnd.esmertec.theme-descriptor`
- `text/vnd.exchangeable`
- `text/vnd.familysearch.gedcom`
- `text/vnd.ficlab.flt`
- `text/vnd.fly`
- `text/vnd.fmi.flexstor`
- `text/vnd.gml`
- `text/vnd.graphviz`
- `text/vnd.hans`
- `text/vnd.hgl`
- `text/vnd.in3d.3dml`
- `text/vnd.in3d.spot`
- `text/vnd.latex-z`
- `text/vnd.motorola.reflex`
- `text/vnd.ms-mediapackage`
- `text/vnd.net2phone.commcenter.command`
- `text/vnd.radisys.msml-basic-layout`
- `text/vnd.senx.warpscript`
- `text/vnd.sosi`
- `text/vnd.sun.j2me.app-descriptor`
- `text/vnd.trolltech.linguist`
- `text/vnd.wap.si`
- `text/vnd.wap.sl`
- `text/vnd.wap.wml`
- `text/vnd.wap.wmlscript`
- `text/vtt`
- `text/wgsl`
- `text/x-asm`
- `text/x-bibtex`
- `text/x-boo`
- `text/x-c`
- `text/x-c++hdr`
- `text/x-c++src`
- `text/x-cassandra`
- `text/x-chdr`
- `text/x-coffeescript`
- `text/x-component`
- `text/x-csh`
- `text/x-csharp`
- `text/x-csrc`
- `text/x-cuda`
- `text/x-d`
- `text/x-diff`
- `text/x-dsrc`
- `text/x-emacs-lisp`
- `text/x-erlang`
- `text/x-gff3`
- `text/x-go`
- `text/x-haskell`
- `text/x-java`
- `text/x-java-properties`
- `text/x-java-source`
- `text/x-kotlin`
- `text/x-lilypond`
- `text/x-lisp`
- `text/x-literate-haskell`
- `text/x-lua`
- `text/x-moc`
- `text/x-objcsrc`
- `text/x-pascal`
- `text/x-pcs-gcd`
- `text/x-perl`
- `text/x-perl-script`
- `text/x-python`
- `text/x-python-script`
- `text/x-r-markdown`
- `text/x-rsrc`
- `text/x-rst`
- `text/x-ruby-script`
- `text/x-rust`
- `text/x-sass`
- `text/x-scala`
- `text/x-scheme`
- `text/x-script.python`
- `text/x-scss`
- `text/x-setext`
- `text/x-sfv`
- `text/x-sh`
- `text/x-siesta`
- `text/x-sos`
- `text/x-sql`
- `text/x-swift`
- `text/x-tcl`
- `text/x-tex`
- `text/x-vbasic`
- `text/x-vcalendar`
- `text/xml`
- `text/xml-dtd`
- `text/xml-external-parsed-entity`
- `text/yaml`

## Rate limits

The File Search API has the following limits to enforce service stability:

- **Maximum file size / per document limit**: 100 MB
- **Total size of project File Search stores** (based on user tier):
  - **Free**: 1 GB
  - **Tier 1**: 10 GB
  - **Tier 2**: 100 GB
  - **Tier 3**: 1 TB
- **Recommendation**: Limit the size of each File Search store to under 20 GB to ensure optimal retrieval latencies.

| **Note:** The limit on File Search store size is computed on the backend, based on the size of your input plus the embeddings generated and stored with it. This is typically approximately 3 times the size of your input data.

## Pricing

- Developers are charged for embeddings at indexing time based on existing[embeddings pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-embedding)($0.15 per 1M tokens).
- Storage is free of charge.
- Query time embeddings are free of charge.
- Retrieved document tokens are charged as regular[context tokens](https://ai.google.dev/gemini-api/docs/tokens).

## What's next

- Visit the API reference for[File Search Stores](https://ai.google.dev/api/file-search/file-search-stores)and File Search[Documents](https://ai.google.dev/api/file-search/documents).

<br />

<br />

The Live API enables low-latency, real-time voice and video interactions with Gemini. It processes continuous streams of audio, video, or text to deliver immediate, human-like spoken responses, creating a natural conversational experience for your users.

![Live API Overview](https://ai.google.dev/static/gemini-api/docs/images/live-api-overview.png)

Live API offers a comprehensive set of features such as[Voice Activity Detection](https://ai.google.dev/gemini-api/docs/live-guide#interruptions),[tool use and function calling](https://ai.google.dev/gemini-api/docs/live-tools),[session management](https://ai.google.dev/gemini-api/docs/live-session)(for managing long running conversations) and[ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)(for secure client-sided authentication).

This page gets you up and running with examples and basic code samples.

[Try the Live API in Google AI Studiomic](https://aistudio.google.com/live)

## Choose an implementation approach

When integrating with Live API, you'll need to choose one of the following implementation approaches:

- **Server-to-server** : Your backend connects to the Live API using[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). Typically, your client sends stream data (audio, video, text) to your server, which then forwards it to the Live API.
- **Client-to-server** : Your frontend code connects directly to the Live API using[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)to stream data, bypassing your backend.

**Note:** Client-to-server generally offers better performance for streaming audio and video, since it bypasses the need to send the stream to your backend first. It's also easier to set up since you don't need to implement a proxy that sends data from your client to your server and then your server to the API. However, for production environments, in order to mitigate security risks, we recommend using[ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)instead of standard API keys.  

## Partner integrations

To streamline the development of real-time audio and video apps, you can use a third-party integration that supports the Gemini Live API over WebRTC or WebSockets.  
[Pipecat by Daily
Create a real-time AI chatbot using Gemini Live and Pipecat.](https://docs.pipecat.ai/guides/features/gemini-live)[LiveKit
Use the Gemini Live API with LiveKit Agents.](https://docs.livekit.io/agents/models/realtime/plugins/gemini/)[Fishjam by Software Mansion
Create live video and audio streaming applications with Fishjam.](https://docs.fishjam.io/tutorials/gemini-live-integration)[Agent Development Kit (ADK)
Implement the Live API with Agent Development Kit (ADK).](https://google.github.io/adk-docs/streaming/)[Vision Agents by Stream
Build real-time voice and video AI applications with Vision Agents.](https://visionagents.ai/integrations/gemini)[Voximplant
Connect inbound and outbound calls to Live API with Voximplant.](https://voximplant.com/products/gemini-client)

## Get started

Microphone streamAudio file stream

This server-side example**streams audio from the microphone** and plays the returned audio. For complete end-to-end examples including a client application, see[Example applications](https://ai.google.dev/gemini-api/docs/live#example-applications).

The input audio format should be in 16-bit PCM, 16kHz, mono format, and the received audio uses a sample rate of 24kHz.  

### Python

Install helpers for audio streaming. Additional system-level dependencies (e.g.`portaudio`) might be required. Refer to the[PyAudio docs](https://pypi.org/project/PyAudio/)for detailed installation steps.  

    pip install pyaudio

**Note:** **Use headphones**. This script uses the system default audio input and output, which often won't include echo cancellation. To prevent the model from interrupting itself, use headphones.  

    import asyncio
    from google import genai
    import pyaudio

    client = genai.Client()

    # --- pyaudio config ---
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    SEND_SAMPLE_RATE = 16000
    RECEIVE_SAMPLE_RATE = 24000
    CHUNK_SIZE = 1024

    pya = pyaudio.PyAudio()

    # --- Live API config ---
    MODEL = "gemini-2.5-flash-native-audio-preview-12-2025"
    CONFIG = {
        "response_modalities": ["AUDIO"],
        "system_instruction": "You are a helpful and friendly AI assistant.",
    }

    audio_queue_output = asyncio.Queue()
    audio_queue_mic = asyncio.Queue(maxsize=5)
    audio_stream = None

    async def listen_audio():
        """Listens for audio and puts it into the mic audio queue."""
        global audio_stream
        mic_info = pya.get_default_input_device_info()
        audio_stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=SEND_SAMPLE_RATE,
            input=True,
            input_device_index=mic_info["index"],
            frames_per_buffer=CHUNK_SIZE,
        )
        kwargs = {"exception_on_overflow": False} if __debug__ else {}
        while True:
            data = await asyncio.to_thread(audio_stream.read, CHUNK_SIZE, **kwargs)
            await audio_queue_mic.put({"data": data, "mime_type": "audio/pcm"})

    async def send_realtime(session):
        """Sends audio from the mic audio queue to the GenAI session."""
        while True:
            msg = await audio_queue_mic.get()
            await session.send_realtime_input(audio=msg)

    async def receive_audio(session):
        """Receives responses from GenAI and puts audio data into the speaker audio queue."""
        while True:
            turn = session.receive()
            async for response in turn:
                if (response.server_content and response.server_content.model_turn):
                    for part in response.server_content.model_turn.parts:
                        if part.inline_data and isinstance(part.inline_data.data, bytes):
                            audio_queue_output.put_nowait(part.inline_data.data)

            # Empty the queue on interruption to stop playback
            while not audio_queue_output.empty():
                audio_queue_output.get_nowait()

    async def play_audio():
        """Plays audio from the speaker audio queue."""
        stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=RECEIVE_SAMPLE_RATE,
            output=True,
        )
        while True:
            bytestream = await audio_queue_output.get()
            await asyncio.to_thread(stream.write, bytestream)

    async def run():
        """Main function to run the audio loop."""
        try:
            async with client.aio.live.connect(
                model=MODEL, config=CONFIG
            ) as live_session:
                print("Connected to Gemini. Start speaking!")
                async with asyncio.TaskGroup() as tg:
                    tg.create_task(send_realtime(live_session))
                    tg.create_task(listen_audio())
                    tg.create_task(receive_audio(live_session))
                    tg.create_task(play_audio())
        except asyncio.CancelledError:
            pass
        finally:
            if audio_stream:
                audio_stream.close()
            pya.terminate()
            print("\nConnection closed.")

    if __name__ == "__main__":
        try:
            asyncio.run(run())
        except KeyboardInterrupt:
            print("Interrupted by user.")

### JavaScript

Install helpers for audio streaming. Additional system-level dependencies might be required (`sox`for Mac/Windows or`ALSA`for Linux). Refer to the[speaker](https://www.npmjs.com/package/speaker)and[mic](https://www.npmjs.com/package/mic)docs for detailed installation steps.  

    npm install mic speaker

**Note:** **Use headphones**. This script uses the system default audio input and output, which often won't include echo cancellation. To prevent the model from interrupting itself, use headphones.  

    import { GoogleGenAI, Modality } from '@google/genai';
    import mic from 'mic';
    import Speaker from 'speaker';

    const ai = new GoogleGenAI({});
    // WARNING: Do not use API keys in client-side (browser based) applications
    // Consider using Ephemeral Tokens instead
    // More information at: https://ai.google.dev/gemini-api/docs/ephemeral-tokens

    // --- Live API config ---
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const config = {
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are a helpful and friendly AI assistant.",
    };

    async function live() {
      const responseQueue = [];
      const audioQueue = [];
      let speaker;

      async function waitMessage() {
        while (responseQueue.length === 0) {
          await new Promise((resolve) => setImmediate(resolve));
        }
        return responseQueue.shift();
      }

      function createSpeaker() {
        if (speaker) {
          process.stdin.unpipe(speaker);
          speaker.end();
        }
        speaker = new Speaker({
          channels: 1,
          bitDepth: 16,
          sampleRate: 24000,
        });
        speaker.on('error', (err) => console.error('Speaker error:', err));
        process.stdin.pipe(speaker);
      }

      async function messageLoop() {
        // Puts incoming messages in the audio queue.
        while (true) {
          const message = await waitMessage();
          if (message.serverContent && message.serverContent.interrupted) {
            // Empty the queue on interruption to stop playback
            audioQueue.length = 0;
            continue;
          }
          if (message.serverContent && message.serverContent.modelTurn && message.serverContent.modelTurn.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              if (part.inlineData && part.inlineData.data) {
                audioQueue.push(Buffer.from(part.inlineData.data, 'base64'));
              }
            }
          }
        }
      }

      async function playbackLoop() {
        // Plays audio from the audio queue.
        while (true) {
          if (audioQueue.length === 0) {
            if (speaker) {
              // Destroy speaker if no more audio to avoid warnings from speaker library
              process.stdin.unpipe(speaker);
              speaker.end();
              speaker = null;
            }
            await new Promise((resolve) => setImmediate(resolve));
          } else {
            if (!speaker) createSpeaker();
            const chunk = audioQueue.shift();
            await new Promise((resolve) => {
              speaker.write(chunk, () => resolve());
            });
          }
        }
      }

      // Start loops
      messageLoop();
      playbackLoop();

      // Connect to Gemini Live API
      const session = await ai.live.connect({
        model: model,
        config: config,
        callbacks: {
          onopen: () => console.log('Connected to Gemini Live API'),
          onmessage: (message) => responseQueue.push(message),
          onerror: (e) => console.error('Error:', e.message),
          onclose: (e) => console.log('Closed:', e.reason),
        },
      });

      // Setup Microphone for input
      const micInstance = mic({
        rate: '16000',
        bitwidth: '16',
        channels: '1',
      });
      const micInputStream = micInstance.getAudioStream();

      micInputStream.on('data', (data) => {
        // API expects base64 encoded PCM data
        session.sendRealtimeInput({
          audio: {
            data: data.toString('base64'),
            mimeType: "audio/pcm;rate=16000"
          }
        });
      });

      micInputStream.on('error', (err) => {
        console.error('Microphone error:', err);
      });

      micInstance.start();
      console.log('Microphone started. Speak now...');
    }

    live().catch(console.error);

## Example applications

Check out the following example applications that illustrate how to use Live API for end-to-end use cases:

- [Live audio starter app](https://aistudio.google.com/apps/bundled/live_audio?showPreview=true&showCode=true&showAssistant=false)on AI Studio, using JavaScript libraries to connect to Live API and stream bidirectional audio through your microphone and speakers.
- See the[Partner integrations](https://ai.google.dev/gemini-api/docs/live#partner-integrations)for additional examples and getting started guides.

## What's next

- Read the full Live API[Capabilities](https://ai.google.dev/gemini-api/docs/live-guide)guide for key capabilities and configurations; including Voice Activity Detection and native audio features.
- Read the[Tool use](https://ai.google.dev/gemini-api/docs/live-tools)guide to learn how to integrate Live API with tools and function calling.
- Read the[Session management](https://ai.google.dev/gemini-api/docs/live-session)guide for managing long running conversations.
- Read the[Ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)guide for secure authentication in[client-to-server](https://ai.google.dev/gemini-api/docs/live#implementation-approach)applications.
- For more information about the underlying WebSockets API, see the[WebSockets API reference](https://ai.google.dev/api/live).
<br />

<br />

| **Preview:** The Live API is in preview.

This is a comprehensive guide that covers capabilities and configurations available with the Live API. See[Get started with Live API](https://ai.google.dev/gemini-api/docs/live)page for a overview and sample code for common use cases.

## Before you begin

- **Familiarize yourself with core concepts:** If you haven't already done so, read the[Get started with Live API](https://ai.google.dev/gemini-api/docs/live)page first. This will introduce you to the fundamental principles of the Live API, how it works, and the different[implementation approaches](https://ai.google.dev/gemini-api/docs/live#implementation-approach).
- **Try the Live API in AI Studio:** You may find it useful to try the Live API in[Google AI Studio](https://aistudio.google.com/app/live)before you start building. To use the Live API in Google AI Studio, select**Stream**.

## Establishing a connection

The following example shows how to create a connection with an API key:  

### Python

    import asyncio
    from google import genai

    client = genai.Client()

    model = "gemini-2.5-flash-native-audio-preview-12-2025"
    config = {"response_modalities": ["AUDIO"]}

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            print("Session started")
            # Send content...

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const config = { responseModalities: [Modality.AUDIO] };

    async function main() {

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            console.debug(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      console.debug("Session started");
      // Send content...

      session.close();
    }

    main();

## Interaction modalities

The following sections provide examples and supporting context for the different input and output modalities available in Live API.

### Sending and receiving audio

The most common audio example,**audio-to-audio** , is covered in the[Getting started](https://ai.google.dev/gemini-api/docs/live#audio-to-audio)guide.

### Audio formats

Audio data in the Live API is always raw, little-endian, 16-bit PCM. Audio output always uses a sample rate of 24kHz. Input audio is natively 16kHz, but the Live API will resample if needed so any sample rate can be sent. To convey the sample rate of input audio, set the MIME type of each audio-containing[Blob](https://ai.google.dev/api/caching#Blob)to a value like`audio/pcm;rate=16000`.

### Sending text

Here's how you can send text:  

### Python

    message = "Hello, how are you?"
    await session.send_client_content(turns=message, turn_complete=True)

### JavaScript

    const message = 'Hello, how are you?';
    session.sendClientContent({ turns: message, turnComplete: true });

#### Incremental content updates

Use incremental updates to send text input, establish session context, or restore session context. For short contexts you can send turn-by-turn interactions to represent the exact sequence of events:  

### Python

    turns = [
        {"role": "user", "parts": [{"text": "What is the capital of France?"}]},
        {"role": "model", "parts": [{"text": "Paris"}]},
    ]

    await session.send_client_content(turns=turns, turn_complete=False)

    turns = [{"role": "user", "parts": [{"text": "What is the capital of Germany?"}]}]

    await session.send_client_content(turns=turns, turn_complete=True)

### JavaScript

    let inputTurns = [
      { "role": "user", "parts": [{ "text": "What is the capital of France?" }] },
      { "role": "model", "parts": [{ "text": "Paris" }] },
    ]

    session.sendClientContent({ turns: inputTurns, turnComplete: false })

    inputTurns = [{ "role": "user", "parts": [{ "text": "What is the capital of Germany?" }] }]

    session.sendClientContent({ turns: inputTurns, turnComplete: true })

For longer contexts it's recommended to provide a single message summary to free up the context window for subsequent interactions. See[Session Resumption](https://ai.google.dev/gemini-api/docs/live-session#session-resumption)for another method for loading session context.

### Audio transcriptions

In addition to the model response, you can also receive transcriptions of both the audio output and the audio input.

To enable transcription of the model's audio output, send`output_audio_transcription`in the setup config. The transcription language is inferred from the model's response.  

### Python

    import asyncio
    from google import genai
    from google.genai import types

    client = genai.Client()
    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    config = {
        "response_modalities": ["AUDIO"],
        "output_audio_transcription": {}
    }

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            message = "Hello? Gemini are you there?"

            await session.send_client_content(
                turns={"role": "user", "parts": [{"text": message}]}, turn_complete=True
            )

            async for response in session.receive():
                if response.server_content.model_turn:
                    print("Model turn:", response.server_content.model_turn)
                if response.server_content.output_transcription:
                    print("Transcript:", response.server_content.output_transcription.text)

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

    const config = {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {}
    };

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          }
        }
        return turns;
      }

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      const inputTurns = 'Hello how are you?';
      session.sendClientContent({ turns: inputTurns });

      const turns = await handleTurn();

      for (const turn of turns) {
        if (turn.serverContent && turn.serverContent.outputTranscription) {
          console.debug('Received output transcription: %s\n', turn.serverContent.outputTranscription.text);
        }
      }

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

To enable transcription of the model's audio input, send`input_audio_transcription`in setup config.  

### Python

    import asyncio
    from pathlib import Path
    from google import genai
    from google.genai import types

    client = genai.Client()
    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    config = {
        "response_modalities": ["AUDIO"],
        "input_audio_transcription": {},
    }

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            audio_data = Path("16000.pcm").read_bytes()

            await session.send_realtime_input(
                audio=types.Blob(data=audio_data, mime_type='audio/pcm;rate=16000')
            )

            async for msg in session.receive():
                if msg.server_content.input_transcription:
                    print('Transcript:', msg.server_content.input_transcription.text)

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';
    import * as fs from "node:fs";
    import pkg from 'wavefile';
    const { WaveFile } = pkg;

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

    const config = {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {}
    };

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          }
        }
        return turns;
      }

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      // Send Audio Chunk
      const fileBuffer = fs.readFileSync("16000.wav");

      // Ensure audio conforms to API requirements (16-bit PCM, 16kHz, mono)
      const wav = new WaveFile();
      wav.fromBuffer(fileBuffer);
      wav.toSampleRate(16000);
      wav.toBitDepth("16");
      const base64Audio = wav.toBase64();

      // If already in correct format, you can use this:
      // const fileBuffer = fs.readFileSync("sample.pcm");
      // const base64Audio = Buffer.from(fileBuffer).toString('base64');

      session.sendRealtimeInput(
        {
          audio: {
            data: base64Audio,
            mimeType: "audio/pcm;rate=16000"
          }
        }
      );

      const turns = await handleTurn();
      for (const turn of turns) {
        if (turn.text) {
          console.debug('Received text: %s\n', turn.text);
        }
        else if (turn.data) {
          console.debug('Received inline data: %s\n', turn.data);
        }
        else if (turn.serverContent && turn.serverContent.inputTranscription) {
          console.debug('Received input transcription: %s\n', turn.serverContent.inputTranscription.text);
        }
      }

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

### Stream audio and video

| To see an example of how to use the Live API in a streaming audio and video format, run the "Live API - Get Started" file in the cookbooks repository:
|
| [View on Colab](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.py)

### Change voice and language

[Native audio output](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output)models support any of the voices available for our[Text-to-Speech (TTS)](https://ai.google.dev/gemini-api/docs/speech-generation#voices)models. You can listen to all the voices in[AI Studio](https://aistudio.google.com/app/live).

To specify a voice, set the voice name within the`speechConfig`object as part of the session configuration:  

### Python

    config = {
        "response_modalities": ["AUDIO"],
        "speech_config": {
            "voice_config": {"prebuilt_voice_config": {"voice_name": "Kore"}}
        },
    }

### JavaScript

    const config = {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
    };

| **Note:** If you're using the`generateContent`API, the set of available voices is slightly different. See the[audio generation guide](https://ai.google.dev/gemini-api/docs/audio-generation#voices)for`generateContent`audio generation voices.

The Live API supports[multiple languages](https://ai.google.dev/gemini-api/docs/live-guide#supported-languages).[Native audio output](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output)models automatically choose the appropriate language and don't support explicitly setting the language code.

## Native audio capabilities

Our latest models feature[native audio output](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-native-audio), which provides natural, realistic-sounding speech and improved multilingual performance. Native audio also enables advanced features like[affective (emotion-aware) dialogue](https://ai.google.dev/gemini-api/docs/live-guide#affective-dialog),[proactive audio](https://ai.google.dev/gemini-api/docs/live-guide#proactive-audio)(where the model intelligently decides when to respond to input), and["thinking"](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output-thinking).

### Affective dialog

This feature lets Gemini adapt its response style to the input expression and tone.

To use affective dialog, set the api version to`v1alpha`and set`enable_affective_dialog`to`true`in the setup message:  

### Python

    client = genai.Client(http_options={"api_version": "v1alpha"})

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        enable_affective_dialog=True
    )

### JavaScript

    const ai = new GoogleGenAI({ httpOptions: {"apiVersion": "v1alpha"} });

    const config = {
      responseModalities: [Modality.AUDIO],
      enableAffectiveDialog: true
    };

### Proactive audio

When this feature is enabled, Gemini can proactively decide not to respond if the content is not relevant.

To use it, set the api version to`v1alpha`and configure the`proactivity`field in the setup message and set`proactive_audio`to`true`:  

### Python

    client = genai.Client(http_options={"api_version": "v1alpha"})

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        proactivity={'proactive_audio': True}
    )

### JavaScript

    const ai = new GoogleGenAI({ httpOptions: {"apiVersion": "v1alpha"} });

    const config = {
      responseModalities: [Modality.AUDIO],
      proactivity: { proactiveAudio: true }
    }

### Thinking

The latest native audio output model`gemini-2.5-flash-native-audio-preview-12-2025`supports[thinking capabilities](https://ai.google.dev/gemini-api/docs/thinking), with dynamic thinking enabled by default.

The`thinkingBudget`parameter guides the model on the number of thinking tokens to use when generating a response. You can disable thinking by setting`thinkingBudget`to`0`. For more info on the`thinkingBudget`configuration details of the model, see the[thinking budgets documentation](https://ai.google.dev/gemini-api/docs/thinking#set-budget).  

### Python

    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"]
        thinking_config=types.ThinkingConfig(
            thinking_budget=1024,
        )
    )

    async with client.aio.live.connect(model=model, config=config) as session:
        # Send audio input and receive audio

### JavaScript

    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const config = {
      responseModalities: [Modality.AUDIO],
      thinkingConfig: {
        thinkingBudget: 1024,
      },
    };

    async function main() {

      const session = await ai.live.connect({
        model: model,
        config: config,
        callbacks: ...,
      });

      // Send audio input and receive audio

      session.close();
    }

    main();

Additionally, you can enable thought summaries by setting`includeThoughts`to`true`in your configuration. See[thought summaries](https://ai.google.dev/gemini-api/docs/thinking#summaries)for more info:  

### Python

    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"]
        thinking_config=types.ThinkingConfig(
            thinking_budget=1024,
            include_thoughts=True
        )
    )

### JavaScript

    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const config = {
      responseModalities: [Modality.AUDIO],
      thinkingConfig: {
        thinkingBudget: 1024,
        includeThoughts: true,
      },
    };

## Voice Activity Detection (VAD)

Voice Activity Detection (VAD) allows the model to recognize when a person is speaking. This is essential for creating natural conversations, as it allows a user to interrupt the model at any time.

When VAD detects an interruption, the ongoing generation is canceled and discarded. Only the information already sent to the client is retained in the session history. The server then sends a[`BidiGenerateContentServerContent`](https://ai.google.dev/api/live#bidigeneratecontentservercontent)message to report the interruption.

The Gemini server then discards any pending function calls and sends a`BidiGenerateContentServerContent`message with the IDs of the canceled calls.  

### Python

    async for response in session.receive():
        if response.server_content.interrupted is True:
            # The generation was interrupted

            # If realtime playback is implemented in your application,
            # you should stop playing audio and clear queued playback here.

### JavaScript

    const turns = await handleTurn();

    for (const turn of turns) {
      if (turn.serverContent && turn.serverContent.interrupted) {
        // The generation was interrupted

        // If realtime playback is implemented in your application,
        // you should stop playing audio and clear queued playback here.
      }
    }

### Automatic VAD

By default, the model automatically performs VAD on a continuous audio input stream. VAD can be configured with the[`realtimeInputConfig.automaticActivityDetection`](https://ai.google.dev/api/live#RealtimeInputConfig.AutomaticActivityDetection)field of the[setup configuration](https://ai.google.dev/api/live#BidiGenerateContentSetup).

When the audio stream is paused for more than a second (for example, because the user switched off the microphone), an[`audioStreamEnd`](https://ai.google.dev/api/live#BidiGenerateContentRealtimeInput.FIELDS.bool.BidiGenerateContentRealtimeInput.audio_stream_end)event should be sent to flush any cached audio. The client can resume sending audio data at any time.  

### Python

    # example audio file to try:
    # URL = "https://storage.googleapis.com/generativeai-downloads/data/hello_are_you_there.pcm"
    # !wget -q $URL -O sample.pcm
    import asyncio
    from pathlib import Path
    from google import genai
    from google.genai import types

    client = genai.Client()
    model = "gemini-live-2.5-flash-preview"

    config = {"response_modalities": ["TEXT"]}

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            audio_bytes = Path("sample.pcm").read_bytes()

            await session.send_realtime_input(
                audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
            )

            # if stream gets paused, send:
            # await session.send_realtime_input(audio_stream_end=True)

            async for response in session.receive():
                if response.text is not None:
                    print(response.text)

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    // example audio file to try:
    // URL = "https://storage.googleapis.com/generativeai-downloads/data/hello_are_you_there.pcm"
    // !wget -q $URL -O sample.pcm
    import { GoogleGenAI, Modality } from '@google/genai';
    import * as fs from "node:fs";

    const ai = new GoogleGenAI({});
    const model = 'gemini-live-2.5-flash-preview';
    const config = { responseModalities: [Modality.TEXT] };

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          }
        }
        return turns;
      }

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      // Send Audio Chunk
      const fileBuffer = fs.readFileSync("sample.pcm");
      const base64Audio = Buffer.from(fileBuffer).toString('base64');

      session.sendRealtimeInput(
        {
          audio: {
            data: base64Audio,
            mimeType: "audio/pcm;rate=16000"
          }
        }

      );

      // if stream gets paused, send:
      // session.sendRealtimeInput({ audioStreamEnd: true })

      const turns = await handleTurn();
      for (const turn of turns) {
        if (turn.text) {
          console.debug('Received text: %s\n', turn.text);
        }
        else if (turn.data) {
          console.debug('Received inline data: %s\n', turn.data);
        }
      }

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

With`send_realtime_input`, the API will respond to audio automatically based on VAD. While`send_client_content`adds messages to the model context in order,`send_realtime_input`is optimized for responsiveness at the expense of deterministic ordering.

### Automatic VAD configuration

For more control over the VAD activity, you can configure the following parameters. See[API reference](https://ai.google.dev/api/live#automaticactivitydetection)for more info.  

### Python

    from google.genai import types

    config = {
        "response_modalities": ["TEXT"],
        "realtime_input_config": {
            "automatic_activity_detection": {
                "disabled": False, # default
                "start_of_speech_sensitivity": types.StartSensitivity.START_SENSITIVITY_LOW,
                "end_of_speech_sensitivity": types.EndSensitivity.END_SENSITIVITY_LOW,
                "prefix_padding_ms": 20,
                "silence_duration_ms": 100,
            }
        }
    }

### JavaScript

    import { GoogleGenAI, Modality, StartSensitivity, EndSensitivity } from '@google/genai';

    const config = {
      responseModalities: [Modality.TEXT],
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: false, // default
          startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
          endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
          prefixPaddingMs: 20,
          silenceDurationMs: 100,
        }
      }
    };

### Disable automatic VAD

Alternatively, the automatic VAD can be disabled by setting`realtimeInputConfig.automaticActivityDetection.disabled`to`true`in the setup message. In this configuration the client is responsible for detecting user speech and sending[`activityStart`](https://ai.google.dev/api/live#BidiGenerateContentRealtimeInput.FIELDS.BidiGenerateContentRealtimeInput.ActivityStart.BidiGenerateContentRealtimeInput.activity_start)and[`activityEnd`](https://ai.google.dev/api/live#BidiGenerateContentRealtimeInput.FIELDS.BidiGenerateContentRealtimeInput.ActivityEnd.BidiGenerateContentRealtimeInput.activity_end)messages at the appropriate times. An`audioStreamEnd`isn't sent in this configuration. Instead, any interruption of the stream is marked by an`activityEnd`message.  

### Python

    config = {
        "response_modalities": ["TEXT"],
        "realtime_input_config": {"automatic_activity_detection": {"disabled": True}},
    }

    async with client.aio.live.connect(model=model, config=config) as session:
        # ...
        await session.send_realtime_input(activity_start=types.ActivityStart())
        await session.send_realtime_input(
            audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
        )
        await session.send_realtime_input(activity_end=types.ActivityEnd())
        # ...

### JavaScript

    const config = {
      responseModalities: [Modality.TEXT],
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: true,
        }
      }
    };

    session.sendRealtimeInput({ activityStart: {} })

    session.sendRealtimeInput(
      {
        audio: {
          data: base64Audio,
          mimeType: "audio/pcm;rate=16000"
        }
      }

    );

    session.sendRealtimeInput({ activityEnd: {} })

## Token count

You can find the total number of consumed tokens in the[usageMetadata](https://ai.google.dev/api/live#usagemetadata)field of the returned server message.  

### Python

    async for message in session.receive():
        # The server will periodically send messages that include UsageMetadata.
        if message.usage_metadata:
            usage = message.usage_metadata
            print(
                f"Used {usage.total_token_count} tokens in total. Response token breakdown:"
            )
            for detail in usage.response_tokens_details:
                match detail:
                    case types.ModalityTokenCount(modality=modality, token_count=count):
                        print(f"{modality}: {count}")

### JavaScript

    const turns = await handleTurn();

    for (const turn of turns) {
      if (turn.usageMetadata) {
        console.debug('Used %s tokens in total. Response token breakdown:\n', turn.usageMetadata.totalTokenCount);

        for (const detail of turn.usageMetadata.responseTokensDetails) {
          console.debug('%s\n', detail);
        }
      }
    }

## Media resolution

You can specify the media resolution for the input media by setting the`mediaResolution`field as part of the session configuration:  

### Python

    from google.genai import types

    config = {
        "response_modalities": ["AUDIO"],
        "media_resolution": types.MediaResolution.MEDIA_RESOLUTION_LOW,
    }

### JavaScript

    import { GoogleGenAI, Modality, MediaResolution } from '@google/genai';

    const config = {
        responseModalities: [Modality.TEXT],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
    };

## Limitations

Consider the following limitations of the Live API when you plan your project.

### Response modalities

You can only set one response modality (`TEXT`or`AUDIO`) per session in the session configuration. Setting both results in a config error message. This means that you can configure the model to respond with either text or audio, but not both in the same session.

### Client authentication

The Live API only provides server-to-server authentication by default. If you're implementing your Live API application using a[client-to-server approach](https://ai.google.dev/gemini-api/docs/live#implementation-approach), you need to use[ephemeral tokens](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)to mitigate security risks.

### Session duration

Audio-only sessions are limited to 15 minutes, and audio plus video sessions are limited to 2 minutes. However, you can configure different[session management techniques](https://ai.google.dev/gemini-api/docs/live-session)for unlimited extensions on session duration.

### Context window

A session has a context window limit of:

- 128k tokens for[native audio output](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output)models
- 32k tokens for other Live API models

## Supported languages

Live API supports the following languages.
| **Note:** [Native audio output](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output)models automatically choose the appropriate language and don't support explicitly setting the language code.

|          Language          | BCP-47 Code |       Language        | BCP-47 Code |
|----------------------------|-------------|-----------------------|-------------|
| German (Germany)           | `de-DE`     | English (Australia)\* | `en-AU`     |
| English (UK)\*             | `en-GB`     | English (India)       | `en-IN`     |
| English (US)               | `en-US`     | Spanish (US)          | `es-US`     |
| French (France)            | `fr-FR`     | Hindi (India)         | `hi-IN`     |
| Portuguese (Brazil)        | `pt-BR`     | Arabic (Generic)      | `ar-XA`     |
| Spanish (Spain)\*          | `es-ES`     | French (Canada)\*     | `fr-CA`     |
| Indonesian (Indonesia)     | `id-ID`     | Italian (Italy)       | `it-IT`     |
| Japanese (Japan)           | `ja-JP`     | Turkish (Turkey)      | `tr-TR`     |
| Vietnamese (Vietnam)       | `vi-VN`     | Bengali (India)       | `bn-IN`     |
| Gujarati (India)\*         | `gu-IN`     | Kannada (India)\*     | `kn-IN`     |
| Marathi (India)            | `mr-IN`     | Malayalam (India)\*   | `ml-IN`     |
| Tamil (India)              | `ta-IN`     | Telugu (India)        | `te-IN`     |
| Dutch (Netherlands)        | `nl-NL`     | Korean (South Korea)  | `ko-KR`     |
| Mandarin Chinese (China)\* | `cmn-CN`    | Polish (Poland)       | `pl-PL`     |
| Russian (Russia)           | `ru-RU`     | Thai (Thailand)       | `th-TH`     |

*Languages marked with an asterisk* (\*)*are not available for[Native audio](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-output)*.

## What's next

- Read the[Tool Use](https://ai.google.dev/gemini-api/docs/live-tools)and[Session Management](https://ai.google.dev/gemini-api/docs/live-session)guides for essential information on using the Live API effectively.
- Try the Live API in[Google AI Studio](https://aistudio.google.com/app/live).
- For more info about the Live API models, see[Gemini 2.5 Flash Native Audio](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-native-audio)on the Models page.
- Try more examples in the[Live API cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.ipynb), the[Live API Tools cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_tools.ipynb), and the[Live API Get Started script](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.py).
<br />

Tool use allows Live API to go beyond just conversation by enabling it to perform actions in the real-world and pull in external context while maintaining a real time connection. You can define tools such as[Function calling](https://ai.google.dev/gemini-api/docs/function-calling)and[Google Search](https://ai.google.dev/gemini-api/docs/grounding)with the Live API.

## Overview of supported tools

Here's a brief overview of the available tools for Live API models:

|         Tool         | `gemini-2.5-flash-native-audio-preview-12-2025` |
|----------------------|-------------------------------------------------|
| **Search**           | Yes                                             |
| **Function calling** | Yes                                             |
| **Google Maps**      | No                                              |
| **Code execution**   | No                                              |
| **URL context**      | No                                              |

## Function calling

Live API supports function calling, just like regular content generation requests. Function calling lets the Live API interact with external data and programs, greatly increasing what your applications can accomplish.

You can define function declarations as part of the session configuration. After receiving tool calls, the client should respond with a list of`FunctionResponse`objects using the`session.send_tool_response`method.

See the[Function calling tutorial](https://ai.google.dev/gemini-api/docs/function-calling)to learn more.
**Note:** Unlike the`generateContent`API, the Live API doesn't support automatic tool response handling. You must handle tool responses manually in your client code.  

### Python

    import asyncio
    import wave
    from google import genai
    from google.genai import types

    client = genai.Client()

    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    # Simple function definitions
    turn_on_the_lights = {"name": "turn_on_the_lights"}
    turn_off_the_lights = {"name": "turn_off_the_lights"}

    tools = [{"function_declarations": [turn_on_the_lights, turn_off_the_lights]}]
    config = {"response_modalities": ["AUDIO"], "tools": tools}

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            prompt = "Turn on the lights please"
            await session.send_client_content(turns={"parts": [{"text": prompt}]})

            wf = wave.open("audio.wav", "wb")
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)  # Output is 24kHz

            async for response in session.receive():
                if response.data is not None:
                    wf.writeframes(response.data)
                elif response.tool_call:
                    print("The tool was called")
                    function_responses = []
                    for fc in response.tool_call.function_calls:
                        function_response = types.FunctionResponse(
                            id=fc.id,
                            name=fc.name,
                            response={ "result": "ok" } # simple, hard-coded function response
                        )
                        function_responses.append(function_response)

                    await session.send_tool_response(function_responses=function_responses)

            wf.close()

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';
    import * as fs from "node:fs";
    import pkg from 'wavefile';  // npm install wavefile
    const { WaveFile } = pkg;

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

    // Simple function definitions
    const turn_on_the_lights = { name: "turn_on_the_lights" } // , description: '...', parameters: { ... }
    const turn_off_the_lights = { name: "turn_off_the_lights" }

    const tools = [{ functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }]

    const config = {
      responseModalities: [Modality.AUDIO],
      tools: tools
    }

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          } else if (message.toolCall) {
            done = true;
          }
        }
        return turns;
      }

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      const inputTurns = 'Turn on the lights please';
      session.sendClientContent({ turns: inputTurns });

      let turns = await handleTurn();

      for (const turn of turns) {
        if (turn.toolCall) {
          console.debug('A tool was called');
          const functionResponses = [];
          for (const fc of turn.toolCall.functionCalls) {
            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: { result: "ok" } // simple, hard-coded function response
            });
          }

          console.debug('Sending tool response...\n');
          session.sendToolResponse({ functionResponses: functionResponses });
        }
      }

      // Check again for new messages
      turns = await handleTurn();

      // Combine audio data strings and save as wave file
      const combinedAudio = turns.reduce((acc, turn) => {
          if (turn.data) {
              const buffer = Buffer.from(turn.data, 'base64');
              const intArray = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
              return acc.concat(Array.from(intArray));
          }
          return acc;
      }, []);

      const audioBuffer = new Int16Array(combinedAudio);

      const wf = new WaveFile();
      wf.fromScratch(1, 24000, '16', audioBuffer);  // output is 24kHz
      fs.writeFileSync('audio.wav', wf.toBuffer());

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

From a single prompt, the model can generate multiple function calls and the code necessary to chain their outputs. This code executes in a sandbox environment, generating subsequent[BidiGenerateContentToolCall](https://ai.google.dev/api/live#bidigeneratecontenttoolcall)messages.

## Asynchronous function calling

Function calling executes sequentially by default, meaning execution pauses until the results of each function call are available. This ensures sequential processing, which means you won't be able to continue interacting with the model while the functions are being run.

If you don't want to block the conversation, you can tell the model to run the functions asynchronously. To do so, you first need to add a`behavior`to the function definitions:  

### Python

    # Non-blocking function definitions
    turn_on_the_lights = {"name": "turn_on_the_lights", "behavior": "NON_BLOCKING"} # turn_on_the_lights will run asynchronously
    turn_off_the_lights = {"name": "turn_off_the_lights"} # turn_off_the_lights will still pause all interactions with the model

### JavaScript

    import { GoogleGenAI, Modality, Behavior } from '@google/genai';

    // Non-blocking function definitions
    const turn_on_the_lights = {name: "turn_on_the_lights", behavior: Behavior.NON_BLOCKING}

    // Blocking function definitions
    const turn_off_the_lights = {name: "turn_off_the_lights"}

    const tools = [{ functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }]

`NON-BLOCKING`ensures the function runs asynchronously while you can continue interacting with the model.

Then you need to tell the model how to behave when it receives the`FunctionResponse`using the`scheduling`parameter. It can either:

- Interrupt what it's doing and tell you about the response it got right away (`scheduling="INTERRUPT"`),
- Wait until it's finished with what it's currently doing (`scheduling="WHEN_IDLE"`),
- Or do nothing and use that knowledge later on in the discussion (`scheduling="SILENT"`)

### Python

    # for a non-blocking function definition, apply scheduling in the function response:
      function_response = types.FunctionResponse(
          id=fc.id,
          name=fc.name,
          response={
              "result": "ok",
              "scheduling": "INTERRUPT" # Can also be WHEN_IDLE or SILENT
          }
      )

### JavaScript

    import { GoogleGenAI, Modality, Behavior, FunctionResponseScheduling } from '@google/genai';

    // for a non-blocking function definition, apply scheduling in the function response:
    const functionResponse = {
      id: fc.id,
      name: fc.name,
      response: {
        result: "ok",
        scheduling: FunctionResponseScheduling.INTERRUPT  // Can also be WHEN_IDLE or SILENT
      }
    }

## Grounding with Google Search

You can enable Grounding with Google Search as part of the session configuration. This increases the Live API's accuracy and prevents hallucinations. See the[Grounding tutorial](https://ai.google.dev/gemini-api/docs/grounding)to learn more.  

### Python

    import asyncio
    import wave
    from google import genai
    from google.genai import types

    client = genai.Client()

    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    tools = [{'google_search': {}}]
    config = {"response_modalities": ["AUDIO"], "tools": tools}

    async def main():
        async with client.aio.live.connect(model=model, config=config) as session:
            prompt = "When did the last Brazil vs. Argentina soccer match happen?"
            await session.send_client_content(turns={"parts": [{"text": prompt}]})

            wf = wave.open("audio.wav", "wb")
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)  # Output is 24kHz

            async for chunk in session.receive():
                if chunk.server_content:
                    if chunk.data is not None:
                        wf.writeframes(chunk.data)

                    # The model might generate and execute Python code to use Search
                    model_turn = chunk.server_content.model_turn
                    if model_turn:
                        for part in model_turn.parts:
                            if part.executable_code is not None:
                                print(part.executable_code.code)

                            if part.code_execution_result is not None:
                                print(part.code_execution_result.output)

            wf.close()

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';
    import * as fs from "node:fs";
    import pkg from 'wavefile';  // npm install wavefile
    const { WaveFile } = pkg;

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

    const tools = [{ googleSearch: {} }]
    const config = {
      responseModalities: [Modality.AUDIO],
      tools: tools
    }

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          } else if (message.toolCall) {
            done = true;
          }
        }
        return turns;
      }

      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: config,
      });

      const inputTurns = 'When did the last Brazil vs. Argentina soccer match happen?';
      session.sendClientContent({ turns: inputTurns });

      let turns = await handleTurn();

      let combinedData = '';
      for (const turn of turns) {
        if (turn.serverContent && turn.serverContent.modelTurn && turn.serverContent.modelTurn.parts) {
          for (const part of turn.serverContent.modelTurn.parts) {
            if (part.executableCode) {
              console.debug('executableCode: %s\n', part.executableCode.code);
            }
            else if (part.codeExecutionResult) {
              console.debug('codeExecutionResult: %s\n', part.codeExecutionResult.output);
            }
            else if (part.inlineData && typeof part.inlineData.data === 'string') {
              combinedData += atob(part.inlineData.data);
            }
          }
        }
      }

      // Convert the base64-encoded string of bytes into a Buffer.
      const buffer = Buffer.from(combinedData, 'binary');

      // The buffer contains raw bytes. For 16-bit audio, we need to interpret every 2 bytes as a single sample.
      const intArray = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES_PER_ELEMENT);

      const wf = new WaveFile();
      // The API returns 16-bit PCM audio at a 24kHz sample rate.
      wf.fromScratch(1, 24000, '16', intArray);
      fs.writeFileSync('audio.wav', wf.toBuffer());

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

## Combining multiple tools

You can combine multiple tools within the Live API, increasing your application's capabilities even more:  

### Python

    prompt = """
    Hey, I need you to do two things for me.

    1. Use Google Search to look up information about the largest earthquake in California the week of Dec 5 2024?
    2. Then turn on the lights

    Thanks!
    """

    tools = [
        {"google_search": {}},
        {"function_declarations": [turn_on_the_lights, turn_off_the_lights]},
    ]

    config = {"response_modalities": ["AUDIO"], "tools": tools}

    # ... remaining model call

### JavaScript

    const prompt = `Hey, I need you to do two things for me.

    1. Use Google Search to look up information about the largest earthquake in California the week of Dec 5 2024?
    2. Then turn on the lights

    Thanks!
    `

    const tools = [
      { googleSearch: {} },
      { functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }
    ]

    const config = {
      responseModalities: [Modality.AUDIO],
      tools: tools
    }

    // ... remaining model call

## What's next

- Check out more examples of using tools with the Live API in the[Tool use cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_tools.ipynb).
- Get the full story on features and configurations from the[Live API Capabilities guide](https://ai.google.dev/gemini-api/docs/live-guide).
<br />

In the Live API, a session refers to a persistent connection where input and output are streamed continuously over the same connection (read more about[how it works](https://ai.google.dev/gemini-api/docs/live)). This unique session design enables low latency and supports unique features, but can also introduce challenges, like session time limits, and early termination. This guide covers strategies for overcoming the session management challenges that can arise when using the Live API.

## Session lifetime

Without compression, audio-only sessions are limited to 15 minutes, and audio-video sessions are limited to 2 minutes. Exceeding these limits will terminate the session (and therefore, the connection), but you can use[context window compression](https://ai.google.dev/gemini-api/docs/live-session#context-window-compression)to extend sessions to an unlimited amount of time.

The lifetime of a connection is limited as well, to around 10 minutes. When the connection terminates, the session terminates as well. In this case, you can configure a single session to stay active over multiple connections using[session resumption](https://ai.google.dev/gemini-api/docs/live-session#session-resumption). You'll also receive a[GoAway message](https://ai.google.dev/gemini-api/docs/live-session#goaway-message)before the connection ends, allowing you to take further actions.

## Context window compression

To enable longer sessions, and avoid abrupt connection termination, you can enable context window compression by setting the[contextWindowCompression](https://ai.google.dev/api/live#BidiGenerateContentSetup.FIELDS.ContextWindowCompressionConfig.BidiGenerateContentSetup.context_window_compression)field as part of the session configuration.

In the[ContextWindowCompressionConfig](https://ai.google.dev/api/live#contextwindowcompressionconfig), you can configure a[sliding-window mechanism](https://ai.google.dev/api/live#ContextWindowCompressionConfig.FIELDS.ContextWindowCompressionConfig.SlidingWindow.ContextWindowCompressionConfig.sliding_window)and the[number of tokens](https://ai.google.dev/api/live#ContextWindowCompressionConfig.FIELDS.int64.ContextWindowCompressionConfig.trigger_tokens)that triggers compression.  

### Python

    from google.genai import types

    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        context_window_compression=(
            # Configures compression with default parameters.
            types.ContextWindowCompressionConfig(
                sliding_window=types.SlidingWindow(),
            )
        ),
    )

### JavaScript

    const config = {
      responseModalities: [Modality.AUDIO],
      contextWindowCompression: { slidingWindow: {} }
    };

## Session resumption

To prevent session termination when the server periodically resets the WebSocket connection, configure the[sessionResumption](https://ai.google.dev/api/live#BidiGenerateContentSetup.FIELDS.SessionResumptionConfig.BidiGenerateContentSetup.session_resumption)field within the[setup configuration](https://ai.google.dev/api/live#BidiGenerateContentSetup).

Passing this configuration causes the server to send[SessionResumptionUpdate](https://ai.google.dev/api/live#SessionResumptionUpdate)messages, which can be used to resume the session by passing the last resumption token as the[`SessionResumptionConfig.handle`](https://ai.google.dev/api/live#SessionResumptionConfig.FIELDS.string.SessionResumptionConfig.handle)of the subsequent connection.

Resumption tokens are valid for 2 hr after the last sessions termination.  

### Python

    import asyncio
    from google import genai
    from google.genai import types

    client = genai.Client()
    model = "gemini-2.5-flash-native-audio-preview-12-2025"

    async def main():
        print(f"Connecting to the service with handle {previous_session_handle}...")
        async with client.aio.live.connect(
            model=model,
            config=types.LiveConnectConfig(
                response_modalities=["AUDIO"],
                session_resumption=types.SessionResumptionConfig(
                    # The handle of the session to resume is passed here,
                    # or else None to start a new session.
                    handle=previous_session_handle
                ),
            ),
        ) as session:
            while True:
                await session.send_client_content(
                    turns=types.Content(
                        role="user", parts=[types.Part(text="Hello world!")]
                    )
                )
                async for message in session.receive():
                    # Periodically, the server will send update messages that may
                    # contain a handle for the current state of the session.
                    if message.session_resumption_update:
                        update = message.session_resumption_update
                        if update.resumable and update.new_handle:
                            # The handle should be retained and linked to the session.
                            return update.new_handle

                    # For the purposes of this example, placeholder input is continually fed
                    # to the model. In non-sample code, the model inputs would come from
                    # the user.
                    if message.server_content and message.server_content.turn_complete:
                        break

    if __name__ == "__main__":
        asyncio.run(main())

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';

    const ai = new GoogleGenAI({});
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

    async function live() {
      const responseQueue = [];

      async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
          message = responseQueue.shift();
          if (message) {
            done = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return message;
      }

      async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
          const message = await waitMessage();
          turns.push(message);
          if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
          }
        }
        return turns;
      }

    console.debug('Connecting to the service with handle %s...', previousSessionHandle)
    const session = await ai.live.connect({
      model: model,
      callbacks: {
        onopen: function () {
          console.debug('Opened');
        },
        onmessage: function (message) {
          responseQueue.push(message);
        },
        onerror: function (e) {
          console.debug('Error:', e.message);
        },
        onclose: function (e) {
          console.debug('Close:', e.reason);
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        sessionResumption: { handle: previousSessionHandle }
        // The handle of the session to resume is passed here, or else null to start a new session.
      }
    });

    const inputTurns = 'Hello how are you?';
    session.sendClientContent({ turns: inputTurns });

    const turns = await handleTurn();
    for (const turn of turns) {
      if (turn.sessionResumptionUpdate) {
        if (turn.sessionResumptionUpdate.resumable && turn.sessionResumptionUpdate.newHandle) {
          let newHandle = turn.sessionResumptionUpdate.newHandle
          // ...Store newHandle and start new session with this handle here
        }
      }
    }

      session.close();
    }

    async function main() {
      await live().catch((e) => console.error('got error', e));
    }

    main();

## Receiving a message before the session disconnects

The server sends a[GoAway](https://ai.google.dev/api/live#GoAway)message that signals that the current connection will soon be terminated. This message includes the[timeLeft](https://ai.google.dev/api/live#GoAway.FIELDS.google.protobuf.Duration.GoAway.time_left), indicating the remaining time and lets you take further action before the connection will be terminated as ABORTED.  

### Python

    async for response in session.receive():
        if response.go_away is not None:
            # The connection will soon be terminated
            print(response.go_away.time_left)

### JavaScript

    const turns = await handleTurn();

    for (const turn of turns) {
      if (turn.goAway) {
        console.debug('Time left: %s\n', turn.goAway.timeLeft);
      }
    }

## Receiving a message when the generation is complete

The server sends a[generationComplete](https://ai.google.dev/api/live#BidiGenerateContentServerContent.FIELDS.bool.BidiGenerateContentServerContent.generation_complete)message that signals that the model finished generating the response.  

### Python

    async for response in session.receive():
        if response.server_content.generation_complete is True:
            # The generation is complete

### JavaScript

    const turns = await handleTurn();

    for (const turn of turns) {
      if (turn.serverContent && turn.serverContent.generationComplete) {
        // The generation is complete
      }
    }

## What's next

Explore more ways to work with the Live API in the full[Capabilities](https://ai.google.dev/gemini-api/docs/live)guide, the[Tool use](https://ai.google.dev/gemini-api/docs/live-tools)page, or the[Live API cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.ipynb).
<br />

Ephemeral tokens are short-lived authentication tokens for accessing the Gemini API through[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). They are designed to enhance security when you are connecting directly from a user's device to the API (a[client-to-server](https://ai.google.dev/gemini-api/docs/live#implementation-approach)implementation). Like standard API keys, ephemeral tokens can be extracted from client-side applications such as web browsers or mobile apps. But because ephemeral tokens expire quickly and can be restricted, they significantly reduce the security risks in a production environment. You should use them when accessing the Live API directly from client-side applications to enhance API key security.
| **Note:** At this time, ephemeral tokens are only compatible with[Live API](https://ai.google.dev/gemini-api/docs/live).

## How ephemeral tokens work

Here's how ephemeral tokens work at a high level:

1. Your client (e.g. web app) authenticates with your backend.
2. Your backend requests an ephemeral token from Gemini API's provisioning service.
3. Gemini API issues a short-lived token.
4. Your backend sends the token to the client for WebSocket connections to Live API. You can do this by swapping your API key with an ephemeral token.
5. The client then uses the token as if it were an API key.

![Ephemeral tokens overview](https://ai.google.dev/static/gemini-api/docs/images/Live_API_01.png)

This enhances security because even if extracted, the token is short-lived, unlike a long-lived API key deployed client-side. Since the client sends data directly to Gemini, this also improves latency and avoids your backends needing to proxy the real time data.

## Create an ephemeral token

Here is a simplified example of how to get an ephemeral token from Gemini. By default, you'll have 1 minute to start new Live API sessions using the token from this request (`newSessionExpireTime`), and 30 minutes to send messages over that connection (`expireTime`).  

### Python

    import datetime

    now = datetime.datetime.now(tz=datetime.timezone.utc)

    client = genai.Client(
        http_options={'api_version': 'v1alpha',}
    )

    token = client.auth_tokens.create(
        config = {
        'uses': 1, # The ephemeral token can only be used to start a single session
        'expire_time': now + datetime.timedelta(minutes=30), # Default is 30 minutes in the future
        # 'expire_time': '2025-05-17T00:00:00Z',   # Accepts isoformat.
        'new_session_expire_time': now + datetime.timedelta(minutes=1), # Default 1 minute in the future
        'http_options': {'api_version': 'v1alpha'},
      }
    )

    # You'll need to pass the value under token.name back to your client to use it

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const client = new GoogleGenAI({});
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const token: AuthToken = await client.authTokens.create({
        config: {
          uses: 1, // The default
          expireTime: expireTime // Default is 30 mins
          newSessionExpireTime: new Date(Date.now() + (1 * 60 * 1000)), // Default 1 minute in the future
          httpOptions: {apiVersion: 'v1alpha'},
        },
      });

For`expireTime`value constraints, defaults, and other field specs, see the[API reference](https://ai.google.dev/api/live#ephemeral-auth-tokens). Within the`expireTime`timeframe, you'll need[`sessionResumption`](https://ai.google.dev/gemini-api/docs/live-session#session-resumption)to reconnect the call every 10 minutes (this can be done with the same token even if`uses: 1`).

It's also possible to lock an ephemeral token to a set of configurations. This might be useful to further improve security of your application and keep your system instructions on the server side.  

### Python

    client = genai.Client(
        http_options={'api_version': 'v1alpha',}
    )

    token = client.auth_tokens.create(
        config = {
        'uses': 1,
        'live_connect_constraints': {
            'model': 'gemini-2.5-flash-native-audio-preview-12-2025',
            'config': {
                'session_resumption':{},
                'temperature':0.7,
                'response_modalities':['AUDIO']
            }
        },
        'http_options': {'api_version': 'v1alpha'},
        }
    )

    # You'll need to pass the value under token.name back to your client to use it

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const client = new GoogleGenAI({});
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const token = await client.authTokens.create({
        config: {
            uses: 1, // The default
            expireTime: expireTime,
            liveConnectConstraints: {
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    sessionResumption: {},
                    temperature: 0.7,
                    responseModalities: ['AUDIO']
                }
            },
            httpOptions: {
                apiVersion: 'v1alpha'
            }
        }
    });

    // You'll need to pass the value under token.name back to your client to use it

You can also lock a subset of fields, see the[SDK documentation](https://googleapis.github.io/python-genai/genai.html#genai.types.CreateAuthTokenConfig.lock_additional_fields)for more info.

## Connect to Live API with an ephemeral token

Once you have an ephemeral token, you use it as if it were an API key (but remember, it only works for the live API, and only with the`v1alpha`version of the API).

The use of ephemeral tokens only adds value when deploying applications that follow[client-to-server implementation](https://ai.google.dev/gemini-api/docs/live#implementation-approach)approach.  

### JavaScript

    import { GoogleGenAI, Modality } from '@google/genai';

    // Use the token generated in the "Create an ephemeral token" section here
    const ai = new GoogleGenAI({
      apiKey: token.name
    });
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const config = { responseModalities: [Modality.AUDIO] };

    async function main() {

      const session = await ai.live.connect({
        model: model,
        config: config,
        callbacks: { ... },
      });

      // Send content...

      session.close();
    }

    main();

| **Note:** If not using the SDK, note that ephemeral tokens must either be passed in an`access_token`query parameter, or in an HTTP`Authorization`prefixed by the[auth-scheme](https://datatracker.ietf.org/doc/html/rfc7235#section-2.1)`Token`.

See[Get started with Live API](https://ai.google.dev/gemini-api/docs/live)for more examples.

## Best practices

- Set a short expiration duration using the`expire_time`parameter.
- Tokens expire, requiring re-initiation of the provisioning process.
- Verify secure authentication for your own backend. Ephemeral tokens will only be as secure as your backend authentication method.
- Generally, avoid using ephemeral tokens for backend-to-Gemini connections, as this path is typically considered secure.

## Limitations

Ephemeral tokens are only compatible with[Live API](https://ai.google.dev/gemini-api/docs/live)at this time.

## What's next

- Read the Live API[reference](https://ai.google.dev/api/live#ephemeral-auth-tokens)on ephemeral tokens for more information.

