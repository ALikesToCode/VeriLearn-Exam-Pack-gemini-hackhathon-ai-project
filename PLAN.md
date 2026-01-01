# VeriLearn Exam Pack - Hackathon Plan

Goal: turn lecture playlists into a trusted, evidence-backed exam prep system that feels like a product in a 3-minute demo and scores high on Technical Execution, Innovation, Impact, and Demo.

## Win Criteria
- Judges understand the product in under 30 seconds.
- End-to-end flow works live: playlist -> notes + questions -> exam simulator -> remediation.
- Every claim and answer is grounded with citations to video timestamps and (optional) screenshots.
- Outputs are exportable (PDF + Anki + share link) and look polished.

## Product Promise
"Paste a playlist and exam date; VeriLearn builds a syllabus-aligned exam plan, evidence-backed notes, and a practice system that targets your weaknesses."

## Scope

### Must-Have (Grand Prize Magnets)
- Evidence-anchored notes with timestamp citations and deep links.
- Evidence-anchored question bank with auto-verification and regeneration.
- Exam simulator with grading and remediation links.

### Should-Have
- Blueprint builder: topics, prerequisites, weights, and revision order.
- Adaptive practice engine (mastery tracking + spaced repetition).
- Export pack: PDF + Anki + share link.

### Stretch
- Deep Research blueprint report (syllabus + past papers) via `deep-research-pro-preview-12-2025` (Interactions API, background mode).
- Live oral-viva mode via streaming responses (Interactions API or streamGenerateContent). Optional TTS via Gemini 2.5 TTS models.
- "Assist mode" computer-use for resource collection (not supported on Gemini 3; only if we switch to a 2.5 model).

## System Architecture (Modules)
- VeriMap: syllabus mapping + topic graph + weights.
- VeriNotes: evidence-backed notes + keyframes + citations.
- VeriBank: question generation with strict JSON schemas.
- VeriVerify: quality gates (evidence, ambiguity, distractors, coverage).
- VeriCoach: adaptive practice + mastery model.
- VeriExam: timed mock exam + grading + analytics.
- VeriExports: PDF/Anki/share outputs.
- VeriVault: user docs ingestion + retrieval for grounding.

## Data Contracts (JSON)
- Blueprint: topics, prerequisites, weights, exam styles, revision order.
- Note: concept, summary, timestamps, screenshots, citations.
- Question: type, difficulty, bloom, time, tags, stem, options, answer, rationale, citations.
- Exam: sections, timing, marks, question IDs.
- Mastery: concept_id, score, streak, last_seen.

Strict JSON schemas for anything the UI consumes.

## Workflow (Pipeline)
1) Ingest playlist and metadata (week structure, video IDs).
2) Optional Gemini video understanding (Files API or inline video) -> chapters, concepts, keyframes; otherwise use transcripts.
3) VeriMap builds blueprint (optionally from Deep Research report).
4) VeriNotes generates notes with timestamp evidence.
5) VeriBank generates questions as structured JSON.
6) VeriVerify validates and regenerates low-quality questions.
7) VeriCoach updates mastery and schedules practice.
8) VeriExam builds and grades mock exams.
9) VeriExports produces PDF/Anki/share artifacts.

## Gemini Features Used (Judging Visibility)
- Video understanding for chapters, concepts, and timestamps (via Files API or inline video).
- Structured outputs (JSON schema) for questions and blueprints (generateContent uses `responseMimeType` + `responseJsonSchema`; Interactions uses `response_format`).
- File Search tool (`file_search`) for grounding against slides, syllabus, PDFs.
- Code Execution tool (`code_execution`) to verify numericals and rubric checks.
- Interactions API for long-running, resumable jobs with progress (`previous_interaction_id`).
- Streaming responses for oral-viva mode (Interactions streaming or streamGenerateContent).
- Deep Research agent for syllabus and past-paper blueprint (stretch).
- Computer-use for resource collection (stretch, opt-in; not supported on Gemini 3).

## Evidence and Trust (Non-Negotiables)
- Every note and answer includes timestamps.
- Optional screenshot evidence for slides/diagrams.
- "Show me where this is taught" deep links.
- Citation enforcement: ungrounded claims flagged for review.

## Quality Gates
- Evidence check: answer supported by timestamps or documents.
- Ambiguity check: multiple interpretations rejected.
- Distractor check: MCQ options are plausible but wrong.
- Coverage check: matches blueprint topic weights.
- Regenerate loop for failures.

## Demo Story (3-Minute)
1) Paste playlist + exam date -> show progress + ETA.
2) Open Exam Pack: blueprint + notes with citations.
3) Start Mock Exam: answer 2 questions (1 right, 1 wrong).
4) Show grading + "show evidence" timestamps.
5) Export PDF / share link.

## Milestones (Hackathon-Optimized)

### M1 - Core Pipeline (Day 1-2)
- Blueprint generator (basic, playlist-only).
- Evidence-backed notes with timestamps.
- Question generation with JSON schema.

### M2 - Verification + Exam Flow (Day 2-3)
- Verification gates + regen loop.
- Mock exam generator + grading + analytics.
- Basic adaptive practice (mastery tracking).

### M3 - Polish + Exports (Day 3-4)
- PDF + Anki + share link.
- UI/UX for evidence links and remediation.
- Demo script + dataset.

### M4 - Stretch Features (Day 4+)
- Deep Research blueprint report.
- Live oral-viva mode via streaming (text) and optional TTS.
- Assist mode (computer-use; only on non-Gemini 3 models).

## Risks and Mitigations
- Hallucinated answers -> evidence gating + regen loop.
- Latency on long playlists -> resumable jobs + progress UI.
- Unclear exam alignment -> Deep Research report + manual overrides.
- Demo instability -> cache a known playlist and prebuild assets.
- Tooling limitations (Gemini 3: no computer use or Maps grounding, no remote MCP, built-in tools cannot mix with function calling) -> separate passes or backend tools.

## Testing and Validation
- Golden playlist with expected blueprint and sample questions.
- Regression checks on JSON schema validity.
- Verify timestamp links open correctly.
- PDF export check (notes, questions, answer key).

## Deliverables
- Working web demo.
- Exam Pack PDF + Anki export.
- Devpost writeup + 3-minute demo video.
- Architecture diagram and module map.
VeriLearn Exam Pack – Project Execution Package
1. Full Implementation Plan
Project Structure and Directory Layout
A clear separation of backend services and frontend interface will ensure maintainability and scalability. Below is the proposed file and directory structure for VeriLearn Exam Pack:
    • Root Directory (verilearn/):
    • backend/ – Python backend service (API and processing logic).
        ◦ app.py – Entry point for the Flask/FastAPI server (or equivalent) orchestrating requests.
        ◦ services/ – Core service modules implementing the core logic:
        ◦ verimap.py – Module for playlist parsing and course mapping (VeriMap).
        ◦ verinotes.py – Module for generating lecture notes and summaries (VeriNotes).
        ◦ veribank.py – Module for question generation and answer key management (VeriBank).
        ◦ veriverify.py – Module for evidence verification and citation enforcement (VeriVerify).
        ◦ vericoach.py – Module for interactive quiz and tutoring logic (VeriCoach).
        ◦ veriexam.py – Module for exam simulation and grading logic (VeriExam).
        ◦ veriexports.py – Module for exporting content (e.g. PDF generation via Pandoc) (VeriExports).
        ◦ verivault.py – Module for data storage and retrieval (VeriVault).
        ◦ models/ – Code interfacing with the Gemini API and related ML models:
        ◦ gemini_client.py – Wrapper for calling Gemini models (`gemini-3-pro-preview`, `gemini-3-flash-preview`) with configured tools.
        ◦ transcript_extractor.py – Utility to fetch or transcribe video content (could use YouTube API or offline transcription).
        ◦ utils/ – Utility functions and helpers:
        ◦ video_downloader.py – Handles video downloading (for screenshots) if needed.
        ◦ screenshot_tool.py – Utility for capturing video frames at timestamps (using OpenCV as in the script).
        ◦ prompt_templates.py – Stores prompt templates/format strings for various tasks (notes generation, question generation, etc.).
        ◦ settings.py – Configuration constants (model names, API keys, etc.).
        ◦ data/ – Storage for intermediate and output files (could be structured by course or user):
        ◦ study_materials/ – Default output directory for generated study packs (can contain subfolders per playlist or user).
        ◦ screenshots/ – Subdirectory for captured screenshot images used in notes.
        ◦ pdf/ – Subdirectory for generated PDFs.
        ◦ cache/ – (Optional) cache for transcripts or partial outputs for resumability.
    • frontend/ – Frontend application (e.g. React, Vue, or static web):
        ◦ index.html / index.jsx – Main UI for user input (enter playlist URL, etc.) and viewing results.
        ◦ components/ – UI components for notes display, quiz interface, progress indicators, etc.
        ◦ services/ – Frontend API calls and state management (to call backend endpoints).
        ◦ assets/ – Any static assets (logo, CSS, etc.).
    • docs/ – Documentation and diagrams for the project (not deployed, but for DevPost presentation).
This layout cleanly separates concerns: the backend contains all logic for processing videos and generating content, while the frontend deals with user interaction and presentation. Each core module (VeriMap, VeriNotes, etc.) has its own file for clarity. This modular design will make it easier to extend or swap components (for example, updating the veriexports.py module to use a different PDF generator in future).
Module Responsibilities and Roles
Each module in the backend has a distinct responsibility in the system, corresponding to features of the VeriLearn Exam Pack:
    • VeriMap (verimap.py): Handles ingestion of the video playlist or list of lecture URLs. It reads structured playlist files or URLs and organizes them into a course hierarchy (weeks, lectures, etc.). This module is responsible for parsing inputs (e.g., a text file where each line is LECTURE_ID:TITLE:VIDEO_URL) and creating an internal representation of the course map. It groups lectures by week or topic (e.g., W1L1 for Week 1 Lecture 1) and stores metadata like titles and durations. API Contract: Provides an interface parse_playlist(input) that returns a data structure like Course -> {Week -> [Lectures]} including video URLs and titles. It may also fetch video metadata (length, title) for use in prompts.
    • VeriNotes (verinotes.py): Generates comprehensive study notes for each lecture (or each week, depending on the mode). This is where the integration of the existing video_study_generator.py logic occurs. It uses the Gemini LLM to transcribe or understand the video and produce a structured markdown document with key sections (summary, detailed notes, key takeaways, etc.). It also includes placeholders or markers for visual content. Integration: We will refactor the logic from VideoStudyGenerator class in video_study_generator.py into this module. For example, the prompt engineering and content assembly done in video_study_generator.py will be encapsulated here. The module will:
    • Accept as input a video URL (and optional lecture title/ID).
    • Retrieve the video’s transcript or audio (using transcript_extractor.py and possibly speeding up via video_downloader).
    • Construct an LLM prompt to generate notes, following the format: including summary, lecture subsections, self-assessment questions, etc. (the prompt template can be drawn from the original script’s guidelines). For week-level summaries, it will gather multiple lecture info to feed the model[1].
    • Invoke the Gemini model (via gemini_client.py) to generate the content, with function tools enabled for screenshots.
    • Handle any function calls for screenshots: the model might return function call requests like take_screenshot(timestamp, description) for important visuals[2][3]. The module will use screenshot_tool.py to capture the frame from the video at the given timestamp and store it, returning a reference ID to the model. The model’s final output will include references to these screenshots (e.g., "Screenshot reference: XYZ").
    • After generation, embed the actual image links into the markdown. For example, add a "Visual References" section where each recommended screenshot is inserted with description and timestamp[4]. This was done in the script by updating the markdown content to include ![description](./screenshots/image_file) at the end of the notes[4].
    • Ensure the content is evidence-rich: where possible the model is instructed to anchor facts in the video content (e.g. "At 01:20, the lecturer explains X...") and to include citations or timestamps for key points. (More on evidence verification in VeriVerify below.)
API Contract: generate_notes(lecture: VideoInfo) -> NoteDocument. It returns a structured result (e.g., a dataclass containing the markdown content, word count, reading time, list of image references). It may produce multiple output formats (MD, HTML, PDF) depending on requested formats, but the core output is a Markdown of the notes.
    • VeriBank (veribank.py): Creates an exam question bank from the video content. It uses the LLM to generate questions (multiple-choice, short answer, true/false, etc.) based on each lecture or an entire week’s material. This module ensures that for each question, there is an answer key and an evidence reference (e.g., the section of notes or timestamp where the answer can be found). It can tap into the content from VeriNotes (using the transcript or notes as context) to formulate questions. The existing script hints at generating self-assessment questions as part of the notes[5] – we will extend that by producing a full question bank. API Contract: generate_question_bank(content: NoteDocument) -> List[Question]. Each Question item might be a structured object containing: the question text, type, multiple choices (if any), correct answer (or solution explanation), and a reference (citation) for the solution. The correct answers and explanations will be stored internally (in VeriVault or memory) and not exposed to the user in the study notes (so that users can test themselves).
    • VeriVerify (veriverify.py): Ensures that all generated content (notes and answers) are grounded in real evidence and flags any potential hallucinations or unsupported claims. This module implements evidence gating:
    • During note generation, it can use verification steps to check that any factual claim the model made is present in the transcript or a trusted source. For example, after VeriNotes produces a draft, VeriVerify might cross-check it against the original video transcript text or perform a web search if something seems off. In practice, this could be a smaller LLM (like Gemini 3 Flash) that takes each statement and asks "Is this supported by the video transcript? Provide the timestamp or mark for removal." (This step can be done if time permits, or simplified by prompting the main LLM to always include the source timestamp for facts).
    • For quiz answers, VeriVerify can double-check that the provided correct answer is actually correct by referencing the notes or transcript. It could also ensure that each answer explanation has a citation (like "as explained at 10:15 in the video").
    • Gemini Tool Use: If needed, the verification step can invoke built-in tools like `google_search` or `url_context` in a dedicated call (no custom function calling in the same request). For Mermaid fixes or fact-checking, we can also perform search in the backend and pass excerpts into the model.
API Contract: Exposes methods like verify_notes(note_doc: NoteDocument) -> VerifiedNoteDocument (which might annotate or adjust the content to ensure citations) and verify_answer(question, answer) -> bool/confidence (to be used when a user submits an answer, cross-checking if the answer is correct and well-supported by evidence).
    • VeriCoach (vericoach.py): Implements an interactive tutoring agent for oral or chat-based quizzes. This module uses a conversational approach (likely with the real-time Gemini API) to engage the learner:
    • It can ask the learner questions from the VeriBank in a dialogue format. For example, it selects a question, poses it via text or voice, and awaits the user's answer.
    • Using speech-to-text (if voice input) or direct text input, it takes the user's response and evaluates it (possibly using the LLM or a simple keyword match if multiple-choice). Based on correctness, it provides immediate feedback or hints. For an oral quiz mode, the system might use text-to-speech to read out questions and possibly the evaluation (this can be integrated with available TTS/STT services, though for the scope of the hackathon a text interface might suffice with the option for voice).
    • Gemini Model Usage: For live conversation, use Interactions API streaming or streamGenerateContent to handle back-and-forth dialogue. Live API is optional and only if we add real-time audio (paired with TTS/STT). The model can maintain context over the conversation and switch to explanation mode as needed.
    • Assist Mode (Computer Use): This is only available on non-Gemini 3 models. For Gemini 3 we disable it and instead use external tools in the backend or code execution in a separate call. If we enable it later, we gate by model (e.g., Gemini 2.5) and keep it strictly sandboxed.
API Contract: This may be exposed via WebSocket or a streaming HTTP endpoint rather than traditional request/response. For example: - POST /coach-session to start a new tutoring session (returns a session ID or WebSocket token). - POST /coach-session/{id}/user-message to send a user’s answer or question to the coach. - STREAM /coach-session/{id}/next to get the next response/question from the coach (streamed for real-time feel). For simplicity, the hackathon implementation could use a regular endpoint that returns the next question or feedback given the last answer. The specifics depend on whether a real-time interface is needed; at minimum, vericoach.py will have functions like start_session(topics) -> session_id and process_answer(session_id, user_answer) -> CoachReply to produce the next prompt or feedback.
    • VeriExam (veriexam.py): Creates an exam simulation environment using the question bank. This module manages the flow of a practice exam:
    • It can assemble a subset of questions for a test (e.g., 10 random questions from the bank or specific number per lecture).
    • It times the exam if needed and collects user answers (though timing might be optional in study mode).
    • Once the user completes the exam (submits all answers), VeriExam grades the responses. For objective questions (multiple-choice, true/false), grading is automatic by comparing with the known correct answers stored from VeriBank. For open-ended questions, we can use the LLM to evaluate the answer’s correctness or simply mark them for manual/self review with provided solutions.
    • After grading, it compiles a results report: score, which questions were correct/incorrect, and crucially provides remediation guidance for incorrect answers. Remediation might mean pointing the user to the part of the notes or video where the topic was covered (e.g., “Review Section 2.3 in notes or video at 15:45 for this concept”). The system can generate an explanation for each wrong answer using the LLM, citing the relevant note or reference.
API Contract: Endpoints could include: - POST /start-exam with parameters (like which course or playlist, number of questions) -> returns an exam_id and the list of questions (with IDs). - POST /submit-answer – (or one per question) submit an answer to a question. Alternatively, submit all at once at end. - POST /finish-exam – finalize the exam attempt and get results. However, a simpler design: the frontend can retrieve the question list via GET /generate-pack or a similar call (since the pack includes the questions), and then use a single POST /submit-answer per question or a batch submission. We will detail endpoints in the API section. Internally, veriexam.py functions like grade_answers(exam_id, user_answers) -> ResultReport would perform the grading using VeriBank’s answer key and possibly VeriVerify for free text answers.
    • VeriExports (veriexports.py): Responsible for exporting the study materials into various formats for the user. Initially, the primary export is a PDF exam pack that includes the notes, images, and possibly the list of questions (without answers) for offline study. We will adapt the logic from pandoc_pdf_generator.py here. Specifically, this module will:
    • Take the markdown notes generated by VeriNotes (which include image references and structured sections) and convert them to PDF. The pandoc_pdf_generator.py script uses Pandoc behind the scenes to do this conversion. We will create a class PDFGenerator inside veriexports.py similar to the one in that script, allowing for options like margin size, inclusion of diagrams (Mermaid support), etc.
    • If Mermaid diagrams are included in the markdown (the note generator might include diagrams using Mermaid syntax for class structures or processes[7]), the PDF generation should handle them. If a Mermaid diagram fails to render via pandoc, the module can use the Gemini model to attempt a fix[8][9]. If we need external references, we run a separate call with `google_search` or perform search in the backend and pass excerpts to the model (built-in tools cannot be mixed with custom function calling).
    • Additionally, VeriExports can provide other formats: HTML (for a web view of notes), or a JSON export (containing structured data of notes and questions). The existing video_study_generator.py already supports outputting HTML and JSON, so we will carry over that capability. JSON is especially useful if we want to feed the content to other applications (or for debugging).
API Contract: Endpoints like: - GET /export/pdf?pack_id=XYZ – will return the PDF file (or a URL to download it). This will invoke veriexports.generate_pdf(pack) internally if not already done. - We might also have GET /export/html?pack_id=XYZ for an HTML version, though the primary use is likely the PDF. Internally, veriexports.py will provide generate_pdf(note_doc: Path/Markdown, options) -> Path and similar functions for other formats.
    • VeriVault (verivault.py): Acts as the storage layer for the system’s data. For a production-ready service, this would interface with databases or cloud storage:
    • It stores user-generated content (if users upload custom videos or if user accounts exist).
    • It keeps the transcripts downloaded or generated from videos (to avoid re-transcribing the same video repeatedly).
    • It stores the generated study notes, question banks, and answer keys (e.g., in a database or as files in the study_materials/ directory). In the CLI script, all outputs were saved in a local folder structure; we will adopt a similar approach but make it accessible via the API. For example, after processing a playlist, VeriVault may have an entry for that playlist with references to files: notes markdown, notes HTML, PDF, images, etc., as well as the data objects for questions/answers.
    • If the system supports accounts or multiple users, VeriVault would handle user authentication data and which packs belong to which user.
    • VeriVault will also support resumability: It can keep track of progress when generating a pack – e.g., mark which lectures have been processed. If the generation job is interrupted or the user adds new videos to the playlist, the system can resume and only process the deltas. In the CLI, the --skip-existing logic prevented redoing already processed videos[10][11]. In our service, VeriVault can similarly record completed items and let VeriNotes/VeriBank skip those next time, significantly speeding up subsequent runs or recovery from errors.
API Contract: This is an internal module, so rather than external endpoints, it provides a data access interface to other modules. For example: - save_study_pack(course_id, notes, questions, assets) – saves results. - load_study_pack(course_id) – retrieve saved pack (for later downloads or review). - mark_lecture_done(course_id, lecture_id) – record that one lecture’s notes are completed (useful for tracking progress in a long playlist). - If we implement user accounts: save_user_progress(user_id, exam_result) etc., to allow impact measurement (like scores, improvement over time).
All these modules interact within the backend orchestrator, typically the logic in app.py that receives API calls and calls the appropriate modules in sequence.
Integration of Existing Code (video_study_generator & pandoc_pdf_generator)
The provided scripts video_study_generator.py and pandoc_pdf_generator.py are prototypical implementations of key features. We will integrate and refactor their capabilities into the modules above:
    • video_study_generator.py Integration: This script already handles reading playlists, calling Gemini or Vertex AI to generate markdown notes, taking screenshots, and saving files. Our plan:
    • The CLI argument parsing in main() will be replaced by our API inputs, but the underlying class VideoStudyGenerator (or its methods) can be adapted. We will likely use the VideoStudyGenerator class as a starting point for the implementation of VeriMap + VeriNotes + VeriBank combined pipeline.
    • The parallel processing logic from the script (using ThreadPoolExecutor for multiple videos) will be adapted for the backend’s batch processing of lectures. For example, if the user inputs a playlist of 10 videos, VeriNotes could spawn threads or background tasks for each video’s note generation, similar to how the script does[12], to speed up processing. We'll ensure thread-safety around the Gemini API calls and file writes.
    • The intelligent screenshot functionality will be fully reused. In video_study_generator.py, the model is instructed and equipped with a take_screenshot tool function[13][2]. When the model's output includes a function call (via OpenAI function calling or similar mechanism in the Gemini API), the script’s logic saves the image and then inserts the markdown for it[4]. We will integrate this by registering a similar function in our gemini_client.py when we call the model. The result is that our notes come out with rich visual context automatically. (This is a big innovation and we will highlight it in our Devpost as such.)
    • The script also supports both streaming output (token by token) and non-streaming modes. In a backend scenario, we can use streaming to send partial progress back to the client (e.g., via Server-Sent Events or WebSocket), giving real-time feedback like "Currently processing Lecture 3...". However, since our API is primarily asynchronous (we'll return a job ID and then poll for status), streaming can be an internal optimization but we won't stream large texts directly in HTTP responses. Instead, we’ll capture the model’s streamed tokens and perhaps log or store them incrementally for progress monitoring. (Advanced: possibly send periodic progress events to frontend, e.g., "50% done, Lecture 3 summary complete").
    • Multi-format output: The script can output Markdown, HTML, PDF, JSON as specified. We will incorporate this flexibility in the API via request parameters (for example, client can request which formats to generate). Markdown and JSON might be default (JSON could contain the structured representation of notes and questions). PDF and HTML can be optional or generated on-demand via VeriExports.
    • pandoc_pdf_generator.py Integration: This script focuses on converting markdown to PDF using Pandoc, and optionally fixing Mermaid diagrams with the help of Gemini.
    • We will embed this logic into VeriExports.generate_pdf(). It will call Pandoc via a subprocess similarly. If use_mermaid is enabled and Pandoc fails on a diagram, our module will catch the error, and then utilize the Gemini API (likely the same gemini_client but possibly a different prompt) to attempt an automatic fix[8][9]. If we need external references, we do a separate `google_search` call or backend search and pass results into the fix prompt (built-in tools cannot be mixed with custom function calling).
    • We will maintain parallel PDF generation if needed (the script had a --parallel option to process multiple files at once[14]). In our case, generating one PDF at a time is fine (usually one per study pack), but if a user requests PDFs for multiple packs simultaneously, the server can handle them concurrently (depending on load, likely fine since these are separate subprocess calls).
    • The output PDFs will be saved (likely in data/pdf/ with a filename corresponding to the course or playlist). We will also make the PDF accessible via the API or a direct link for the user to download.
    • One addition: packaging multiple lectures or weeks into one PDF. If the course is multi-week, we might generate a single PDF containing the entire course’s notes for convenience (the script already supports combining weekly content into one doc for a week[15], and by extension we can combine all weeks). We will ensure the PDF generator can take either a single markdown or a directory of markdowns and produce one combined PDF study guide.
Gemini API Feature Mapping: We will leverage specific features of the Gemini API for corresponding functionalities:
- Gemini 3 Pro Preview (`gemini-3-pro-preview`) for complex, long-form tasks (notes, week summaries, cross-lecture synthesis).
- Gemini 3 Flash Preview (`gemini-3-flash-preview`) for fast tasks (verification, classification, short responses).
- Streaming for coach: `streamGenerateContent` or Interactions streaming for text. Live API is optional and only if we add audio.
- Built-in tools: `google_search`, `url_context`, `file_search`, `code_execution` used in separate calls. Built-in tools cannot be combined with custom function calling yet.
- Custom function calling: `take_screenshot` and other app-specific tools. If we need search + screenshots, we do two passes (external search or a separate built-in-tool call).
- Deep Research: use the Interactions agent `deep-research-pro-preview-12-2025` with `background=true` and polling (store must remain true).
- Structured output: `response_mime_type` + `response_json_schema` in generateContent, or `response_format` in Interactions.
- Thought signatures: required for function-calling and image workflows; use SDK history to preserve them automatically.
Tool Usage Flow (Gemini Agent and Screenshot Capture)
To clarify how the tools and model interact in the generation pipeline, here is the flow:
1. Transcript & Prompt Preparation: Once VeriMap provides the video URL and title, and we have a transcript or video file, VeriNotes formulates a prompt for Gemini. It also informs the model about available custom functions such as `take_screenshot`.
2. LLM Generation with Function Calls: We call Gemini with function-calling enabled only for our custom tools (e.g., `take_screenshot`). The model emits `functionCall` parts (not raw JSON) when it needs a screenshot. We must preserve thought signatures across the tool call/response chain (SDK handles this if we append full history).
3. Screenshot Capture: The backend receives the function call, executes `screenshot_tool.py` (cv2 seek + capture), and returns a `functionResponse` with the reference info.
4. Completion and Post-processing: Once generation finishes, VeriNotes replaces screenshot references with markdown image links.
5. Verification Pass (optional): If we need external facts, we use a separate call with a built-in tool (`google_search` or `url_context`) or perform search in the backend. Built-in tools cannot be combined with custom function calling in the same request.
6. Question Generation: VeriBank calls the model with JSON schema outputs for questions and citations.
7. Packaging: VeriExports generates PDFs and stores outputs in VeriVault.
By using the Gemini model’s tool calling features, the system behaves as a mini agent that can augment its responses with visuals and verified info. This is a standout technical feature of our implementation.
Milestone Schedule (M1–M4)
To ensure timely delivery for the hackathon, we propose a four-milestone schedule aligning with development phases and judging criteria:
    • M1: Core Pipeline Implementation (Week 1) – Focus: Technical Execution. In this milestone, we implement the basic end-to-end flow for a single video input. This includes:
    • Setting up the project skeleton and environment (Gemini API keys, etc.).
    • Implementing VeriMap for a single video (no grouping needed yet).
    • Implementing VeriNotes to call Gemini and generate notes from one video. Verify that we can get a structured markdown with key sections from a known lecture (test on a short YouTube video).
    • Integrate screenshot tool calling for that video. By end of M1, we should be able to input a YouTube URL and get a markdown file with text and at least placeholders for images (if not actual images yet).
    • Partial integration of VeriBank: have the model generate a couple of sample questions from the video content and display them in the notes (possibly under a "Quiz Questions" section in the markdown).
    • (If time, quick PDF export of that single markdown using pandoc manually.)
    • Success criteria for M1: Demo a single lecture conversion to study notes (in Markdown or HTML) with at least one image and some questions, showing the basic functionality works.
    • M2: Multi-Video Playlist & Enhanced Content (Week 2) – Focus: Depth and Innovation. Now we extend to support an entire playlist or course:
    • Expand VeriMap to handle structured lists (group lectures by week/topic as in input file). Test with a multi-lecture playlist file (e.g., the provided notes-genai or similar structure).
    • Ensure VeriNotes can iterate through multiple videos. Implement parallel processing of videos for speed (as in the script, use --parallel logic to process videos concurrently where possible)[12]. Careful with rate limits of the API when parallelizing.
    • Combine weekly content: implement the logic for week summaries (the script’s process_week_videos() that creates one document per week covering all lectures[20]). We should have the system output both individual lecture notes and a compiled week note if multiple lectures exist in a week.
    • Improve the richness of notes: incorporate the "Key Takeaways" section and "Further Reading" suggestions at the end of each week’s notes (as hinted in the prompt template in the script[5]).
    • Fully integrate screenshot capturing: by now, actual images should be captured and embedded in the notes. Validate by checking the output folder for screenshots/ images and the markdown references to them.
    • Enhance VeriBank: generate a comprehensive question bank (at least a few questions per lecture or a dozen per week). Make sure answer keys are stored (but not yet exposed to user).
    • Success criteria for M2: Input a playlist of, say, 5 videos and produce a well-structured set of notes (could be split by week if tagged, or as one continuous document if not) with multiple images and a quiz section. Show that the system can handle batch processing of videos and output aggregated content. This demonstrates innovation in automating multi-video summarization.
    • M3: Interactive Features and Verification (Week 3) – Focus: Impact and Polish. This milestone adds the interactive learning aspects and solidifies content accuracy:
    • Implement VeriExam functionality: create an endpoint or UI where the user can take a quiz generated from their content. We’ll start with a simple approach: multiple-choice questions auto-graded. The frontend can display one question at a time or all questions, let the user answer, then call an API to check answers (VeriExam uses VeriBank’s keys to respond with correct/incorrect and an explanation).
    • Implement VeriCoach (basic version): a chat interface in the frontend that allows the user to ask questions about the material or have the AI ask them questions. At minimum, support text-based Q&A: e.g., user asks “Can you explain X in simpler terms?” and the model (using the notes as context) responds. Or the model asks “What is Y?” and the user answers, and the model gives feedback. This demonstrates the impact by providing personalized coaching.
    • Add verification steps (VeriVerify) for important parts: e.g., ensure every quiz answer has a reference. If any are missing, have the LLM generate a justification or pull the relevant part of the notes. We can also integrate a “Check Answer” feature where after the user answers an open question, VeriVerify’s verify_answer can use a smaller LLM to compare user answer with the reference answer and score it. This provides deeper insight rather than just right/wrong (impactful feedback).
    • Authentication/authorization: If we plan to have multiple users or protect the API, implement a simple auth (this could be as basic as a token required in requests, or a login system). For hackathon demo, a full OAuth might not be needed, but we ensure the backend can be easily extended to multi-user. This is also when we ensure our environment variables (API keys, etc.) are handled securely (no hard-coding in frontend, etc.).
    • Success criteria for M3: Demonstrate a user taking a quiz and receiving feedback. Show an interactive Q&A (even if via text in a console or simple webchat) where the AI tutor answers questions about the notes or quizzes the user. All answers and explanations presented should include references (like “According to the notes (Lecture 2, 10:45)...”) indicating evidence backing. This milestone greatly boosts the project’s impact on learning outcomes.
    • M4: Final Touches – Exports, Performance, UX (Week 4 up to submission) – Focus: Presentation. In the last stage, we refine the project for submission and user experience:
    • Complete VeriExports by integrating the Pandoc PDF generation. Ensure the PDF output is nicely formatted (table of contents if multiple sections, images in place, proper fonts). If possible, use a custom Pandoc template to make the PDF look polished (e.g., cover page with course title, Devpost branding if needed, etc.).
    • Improve the frontend UI: make it intuitive (add progress bars for generation process, so the user knows things are happening; display notes in an elegant reader view; list the quiz questions clearly with input controls for answers; show results with green/red highlights, etc.). Polish the styling and perhaps add a theme consistent with “VeriLearn” branding.
    • Conduct end-to-end testing with a variety of playlists (technical courses, non-technical talks, etc.) to see how the system performs. Identify any performance bottlenecks (maybe a single video taking too long, or memory issues with long transcripts). Introduce optimizations: e.g., limit transcript length by chunking very long videos, use the thinking_level="low" setting for simpler tasks to speed up[21], or use the flash model by default for generation if quality is acceptable.
    • Add resiliency features: if a particular video fails (maybe due to an API hiccup or unsupported format), handle it gracefully – skip it and notify in the results (the CLI would list failures[22]). Our API can include in the final response which videos succeeded or failed, and the frontend can inform the user (with an option to retry the failed ones).
    • Ensure traceability and logging: all steps should log meaningful messages (on server side) for debugging. Also, capture usage metrics if possible (for judging impact).
    • Prepare the Devpost presentation: gather screenshots of the app in action, maybe a short video of using it, and outline how it excels in the judging criteria. The documentation (like this report) will be finalized and included as part of the submission (likely in the project’s README or Devpost text).
    • Success criteria for M4: A fully functional web application where a judge can input a YouTube playlist URL and receive a downloadable study pack (PDF/HTML), try out a quiz, and chat with the tutor. The app should be stable and user-friendly by this point, with all major planned features demonstrated.
Throughout all milestones, we’ll maintain alignment with Devpost criteria: - We’ll emphasize the technical execution (multiple integrated components, use of cutting-edge LLM features, robust architecture), - highlight innovation (the combination of video analysis, AI notes, auto-generated visuals, and interactive learning is novel), - show impact (how this tool can help learners digest content faster and more effectively), - and ensure our presentation (both the app’s UI and our documentation) is top-notch and polished.
By following this plan, we ensure steady progress and a comprehensive final product. Each milestone builds upon the previous, adding layers of functionality while allowing testing and adjustment at each stage.

2. System Architecture Document
High-Level Architecture Overview
The VeriLearn Exam Pack system follows a service-oriented architecture with a clear separation between frontend, backend services, and external AI/Storage components. At a high level, the system comprises:
    • Frontend Application (Client): This is the interface through which users interact (likely a web application). The frontend is responsible for:
    • Accepting user input (e.g., a playlist URL or uploaded list of videos, and user actions like starting a quiz).
    • Displaying the generated notes, questions, and quiz/exam interface.
    • Providing real-time feedback to the user (progress updates, results, etc.).
    • Communicating with the backend via HTTP requests or WebSocket for interactive features.
    • Backend Orchestrator (Web Server): A central web service (e.g., running on Flask, FastAPI, or Node if using JS for backend) that exposes RESTful (or GraphQL) endpoints. This orchestrator receives requests from the frontend and delegates tasks to the appropriate internal modules (VeriMap, VeriNotes, etc.). It handles high-level flow control, such as:
    • Creating a job for generating a study pack and managing its state.
    • Orchestrating multi-step processes (for example, first call VeriMap, then loop through VeriNotes for each video, then call VeriBank, etc.).
    • Applying authentication checks on requests.
    • Aggregating results to send back to the client.
    • AI Agents (Gemini LLMs): While not a “service” we run, these are external endpoints (Google’s Vertex AI Gemini models) which our backend calls for generative tasks. We can think of each model usage as calling an external microservice specialized in AI:
    • Gemini 3 Pro Preview (`gemini-3-pro-preview`) – used for heavy tasks (notes generation, complex reasoning).
    • Gemini 3 Flash Preview (`gemini-3-flash-preview`) – used for fast tasks (verifications, simple Q&A generation).
    • Gemini streaming sessions (Interactions API or streamGenerateContent) – used for interactive sessions. Live API only if we add audio.
    • These are accessible through the gemini_client.py which abstracts the API calls (be it REST or SDK calls to Vertex AI). The client also handles tool integration (function calling). This part of the system might be conceptualized as an AI Orchestration layer, where the model sometimes acts as an agent calling tools and returning results.
    • Data Storage:
    • VeriVault Storage: Could be realized with a database (for metadata and text) and a file storage (for larger files like PDFs and images). For example, a Postgres or Firebase DB to store user info, course info, question/answer text; and a cloud storage bucket or local filesystem for the generated markdown, PDFs, and images.
    • Cache: Might use an in-memory store like Redis to maintain job status and partial results during generation (especially if multiple workers or for quick lookup of transcripts).
    • The video transcripts and possibly video files (for screenshot usage) are stored here. The system might download video files to extract frames[23][24], so a temporary storage for videos or frames is needed (likely under data/temp/ or directly in data/screenshots/ for frames and data/videos/ for any downloaded video segments).
    • External Services:
    • YouTube API / YT-DLP: For obtaining video information and transcripts. We may call YouTube Data API to get captions or use yt-dlp (youtube-dl) to download the video or its subtitles. This is a supporting service for VeriMap/VeriNotes.
    • Authentication Provider: If we implement login via Google/GitHub or similar, that external OAuth service would be part of the architecture for user management.
    • Speech-to-Text and Text-to-Speech: For oral quiz, if implemented, external services (like Google Cloud Speech-to-Text and a TTS engine) would be used by VeriCoach to process voice. This is optional and can be added as an extension: they would sit between the frontend and VeriCoach (frontend records audio -> sends to STT -> text goes to backend; backend gets text reply -> sends to TTS -> audio to frontend).
Putting it together, the high-level flow is: 1. User inputs playlist URL in Frontend. 2. Frontend calls POST /generate-pack on Backend. 3. Backend (Orchestrator) creates a job entry in DB/cache, triggers processing: - Calls VeriMap to parse playlist and get list of videos. - For each video, calls VeriNotes (possibly in parallel threads or sequentially). - VeriNotes calls Gemini API (external) to generate note content with tools as needed. - Screenshots taken are stored in file storage, references updated. - After notes for all videos (or each week) are ready, calls VeriBank to generate questions (calls Gemini again). - Stores the final assembled pack (notes+questions) in VeriVault (DB + files). - Notifies (through job status) that pack is ready. 4. Frontend polls or gets a WebSocket event that pack generation is complete. It then may call GET /get-pack or similar to retrieve the content (or might have been directly delivered in the response if waiting synchronously). 5. User can now view notes and questions. When user wants to take quiz: - Frontend calls POST /submit-answer for each question (or a batch) to Backend, which checks answer via VeriExam (which uses VeriBank stored answers). - Backend returns correctness and explanation (possibly via VeriVerify to fetch the reference snippet). 6. If user engages VeriCoach: - Frontend opens a WebSocket to Backend (say at /coach/{session}). - Backend uses a streaming Gemini session to generate questions and evaluate answers in a loop, sending each message back through the WebSocket. 7. At any point, user can request export: - Frontend calls GET /export/pdf?pack_id=XYZ. - Backend checks if PDF exists in VeriVault; if not, calls VeriExports to generate via Pandoc and stores it, then streams it back or gives a URL. - Similarly for any other export formats.
All these components work in concert. The architecture ensures scalability by design: - The heavy lifting (LLM calls, PDF generation) can be offloaded to separate worker processes or threads. In a cloud deployment, one could use task queues (e.g., Celery or Cloud Tasks) to manage the generate-pack job in the background. - The stateless nature of the web API (each request is independent, except WebSocket for chat) means we can run multiple instances behind a load balancer if needed, all sharing the same DB/Storage. - Caching transcripts and partial outputs means if two users request notes for the same public playlist, we can reuse results rather than duplicate work (improving efficiency).
For clarity to Devpost judges, here’s a conceptual breakdown of services in a diagram form (textually described):
    • Client (Browser) → Backend (Flask API) → LLM Service (Gemini)
↘︎ Custom Function Tools (Screenshot) + Built-in Tools (Search/URL/Code) in separate calls
↘︎ Database/Storage (for results)
↘︎ YouTube API (for transcripts)
And interactive flows: - Client Quiz → Backend → VeriExam (logic) → Database (for answers) → Backend → Client (result)
- Client Coach (WebSocket) ↔︎ Backend ↔︎ Gemini streaming session (Interactions or streamGenerateContent).
Module-Level Component Diagram and Interactions
We have introduced the modules in the implementation plan; here we detail how they interconnect, effectively creating a component diagram:
    • VeriMap: entry component for input processing. It takes a playlist identifier (URL or file) and outputs a structured list of video entries (with IDs, titles, URLs). It might call out to YouTube API (or a local parser if it’s a text file input) to get video metadata. It then passes the list to the orchestrator or directly triggers VeriNotes for each entry. In code, VeriMap.parse_input() will be called by the generate-pack handler, then for each video in the list, VeriNotes.generate_notes(video) is invoked.
    • VeriNotes: for each video, it may operate independently (thus can be parallelized). It interacts with:
    • Gemini API: sends prompts, receives content and function calls.
    • Screenshot Tool: invoked during generation when Gemini requests.
    • Transcript Extractor: may be called at the start to get textual content of video. If we use multimodal input, we pass video via the Files API (preferred for >20MB) or inline for short clips; Gemini samples ~1 fps by default, so long videos still benefit from transcripts for precision.
    • Once notes are generated, VeriNotes returns the markdown content (and possibly a parsed structure) to the orchestrator. If grouping by week, VeriNotes might accumulate multiple lectures and then call Gemini once for the combined summary (the orchestrator can call VeriNotes.generate_week_summary(week_videos) which internally uses multiple VideoInfo inputs and a different prompt format).
    • VeriBank: likely called after all notes are done (or could be interwoven, e.g., generate questions per lecture right after its notes). It primarily interacts with Gemini (to generate questions). It also may use VeriNotes outputs as input context (i.e., it will read the notes content to formulate questions). The output (Question objects) it produces are handed to VeriVault for storage and to the orchestrator to include in the API response.
    • VeriVerify: sits somewhat aside as a checker. It can be invoked:
    • Post-generation of notes and questions, to validate content. It might use the transcript (from VeriMap or an internal store) to check notes.
    • During user quiz answering, to verify freeform answers.
    • It can utilize Gemini (maybe Flash model) or simple string matching for verification. It also could use a search (tool) if needed to find a reference.
    • It outputs either a “pass” or details of issues found, which the orchestrator can log or even display (e.g., “2 facts could not be verified automatically”).
    • VeriCoach: interacts with Gemini in a conversational manner. It might need to maintain state (context of conversation, which questions have been asked). This state can be kept in memory (if the WebSocket is sticky to one backend instance) or in a cache/DB keyed by session ID. VeriCoach will use the question bank from VeriBank if acting as quizmaster, or use the notes content to answer any user question as a knowledge base (similar to a chatbot that read the notes). It likely uses the same Gemini model but in a different mode (e.g., a continuous chat completion endpoint). The orchestrator ensures messages are routed to this module for processing.
    • VeriExam: uses VeriBank’s data (question & answers). It doesn’t necessarily call external models unless for grading long answers. It interacts with VeriVault to record the attempt results (score, etc.). The orchestrator may handle session creation for an exam (like generate a random set of questions from bank if needed). In a sense, VeriExam is a simple business-logic component – it ensures the user’s answers are compared to keys and compiles results.
    • VeriExports: interacts with the filesystem/Pandoc and possibly Gemini for diagram fixes. When called, it will:
    • Load the markdown from storage (VeriVault path).
    • Spawn Pandoc process to convert to PDF. If errors (like Mermaid issues), call Gemini (which might use search).
    • Save the PDF back to storage.
    • The orchestrator will then send the PDF file or its URL to the user.
    • VeriVault: is utilized by all others for storing or retrieving data:
    • After each lecture note is generated, VeriNotes might call VeriVault.store_note(lecture_id, content, images) to save it.
    • VeriBank on completion calls VeriVault.store_questions(course_id, questions) and VeriVault.store_answers(course_id, answers) (answers separate for security).
    • When the user requests the pack or an export, the orchestrator uses VeriVault to get the necessary files.
    • If a job is halted and resumed, VeriVault helps by providing already done parts so we only generate missing pieces (just as the script did skipping existing outputs[10]).
    • If multi-user, VeriVault queries are always user-scoped (so one user can’t access another’s data).
Module-Level Diagram Description: To visualize the component interactions:
User → Frontend → Backend Orchestrator → [VeriMap -> (YouTube API)] 
                                         → [VeriNotes -> Gemini LLM + Tools -> Screenshot] 
                                         → [VeriBank -> Gemini LLM] 
                                         → [VeriVerify -> Gemini LLM/Search] 
                                         → [VeriVault (DB/File)] 
                                         → [VeriExports -> Pandoc/Gemini] 
                                         → [VeriExam (logic)] 
                                         → [VeriCoach -> Gemini LLM + Tools]
                                         → Back to Frontend → User
The arrows indicate calls or data flows. For instance, Backend calls VeriMap, gets list → iteratively calls VeriNotes (each time calling out to LLM and tools) → stores results → calls VeriBank, etc. Meanwhile, if the user is in a coaching session, that goes directly to VeriCoach which uses LLM and possibly the question bank.
We maintain a clear boundary between the stateless front-facing API and the stateful generation processes. The generation (pack creation) can be thought of as a batch job that could run on a worker. The interactive parts (quiz and coach) are more real-time but short-lived.
Data Flow Diagrams
We detail two main data flows: (A) Playlist to Study Pack generation, and (B) Question answering and feedback loop.
A. Playlist Input → Notes & Exam Pack Output:
    1. Input Phase: User provides a playlist (e.g., a YouTube Playlist URL or uploads a structured list file). This data goes to the backend via generate-pack endpoint.
    2. Parsing: VeriMap parses the input:
    3. If a YouTube playlist URL, it may fetch the list of video URLs via YouTube API.
    4. If a local structured text, it reads lines. Each line yields lecture_id, title, url. Lecture IDs like "W1L1" help grouping.
    5. Produces a list of (lecture_id, title, url), possibly grouped in a dict by week (e.g., {"W1": [ (W1L1,...), (W1L2,...) ], "W2": [...], ...}).
    6. Video Processing Loop: For each video in the list (this could be parallelized):
    7. Transcription/Prep: The system obtains the video’s content. If the Gemini model supports direct video input (some advanced models might take video or audio), we use that. Otherwise, we use an external method: YouTube transcripts if available, or run an audio transcription (using Whisper or GCP speech API). The transcript text is saved for reference.
    8. LLM Prompting: A prompt is constructed for that video. It may include the transcript (or summary of it if very long) and instructions for output format.
    9. LLM Generation: Call Gemini (Pro model by default for quality). It generates the notes:
        ◦ The raw output might be streamed. As it comes, we can capture partial text (for progress) but ultimately we need the final text.
        ◦ If the model triggers tool use (screenshot), the data flows: Model → Backend function call → cv2 extracts frame → image file path stored → reference returned to Model → Model continues.
        ◦ The model may return a final message that includes, say, some JSON for screenshots (like the script does: it attempted to parse a JSON array of recommendations[18]). Our updated prompt likely allows direct function calls instead, simplifying the parsing.
    10. Post-process: After getting the model’s output for that video, we integrate any screenshots (embedding the actual image references in markdown)[4]. Now we have a complete markdown for Lecture i. This is stored (VeriVault) and also kept in memory.
    11. Progress update: Mark lecture i as done. If parallel, this happens out of order potentially; we keep track of how many done out of total.
    12. Weekly Collation: If the course is structured in weeks, once all lectures of a week are processed, we optionally call Gemini again to create a weekly summary document. The data flow: we feed the titles and key points of each lecture (could be their summaries) into a prompt that asks to “Summarize week X covering lectures A, B, C; integrate them into one coherent set of notes with cross-links, and add weekly exercises and further reading.” The output is a single markdown for that week. (The script explicitly had an option to generate one document per week with all lectures as subsections[15].) This weekly doc might also contain additional overall questions that span lectures.
    13. This weekly collation uses the results of step 3 as input context, rather than raw transcripts.
    14. It then replaces the individual lecture notes or complements them. We may decide to output both (individual lecture notes and a combined version).
    15. Question Bank Generation: After notes are ready, we compile a context to generate questions:
    16. We can either generate questions per lecture (and combine) or generate per week or for the whole course. Likely more precise to do it per lecture or week so that the context the model sees is bounded.
    17. Data to LLM: e.g., “Given the notes above, produce 5 questions that test understanding, along with the correct answer and a brief explanation for each.” We use maybe Gemini Flash here because each chunk is smaller and we want speed. If quality suffers, use Pro in high-thinking for question generation as well.
    18. Model returns questions (structured). This data is parsed into Question objects and stored. We keep the answers hidden (not sending to frontend yet).
    19. Packaging: Once notes and questions are prepared:
    20. We assemble a study pack object. This could be a JSON with sections: course info, notes (perhaps as links to files or inline content), questions list (without answers), and references to where answers can be found.
    21. If requested, we immediately call VeriExports to make a PDF of the entire note set. This involves merging all markdown (if multiple files) or using the week docs, and invoking Pandoc. This process yields a PDF which is saved.
    22. The backend updates the job status to "completed" and records where the outputs are (in DB).
    23. Output Phase: The user/front-end is informed:
    24. If polling, a GET /status/{job} now shows status "completed" and possibly includes a URL or ID to retrieve the results.
    25. The user can then fetch the notes and questions. We might have GET /study-pack/{id} that returns the JSON or an HTML page. Or the initial POST /generate-pack could have blocked until completion if we chose synchronous for simplicity (but likely asynchronous is better for long playlists).
    26. The user sees the notes (rendered nicely) and a list of quiz questions (possibly with a “Show answer” button for each or an interactive mode requiring submission).
B. User Answers → Feedback (Exam/Quiz Flow):
Once the study pack is delivered, the user might engage with the quiz in two ways: through the formal exam simulator or through the coach in practice mode.
    • Non-Interactive Quiz (VeriExam):
    • The user clicks “Start Quiz” on the frontend. The frontend may simply display the list of questions one by one, or generate a random subset if we allow (if so, the selection logic is either in frontend or we call an endpoint to get a random exam).
    • For each question, the user submits an answer. On submission (e.g., pressing a “Check” button):
        ◦ The frontend sends POST /submit-answer with payload: {question_id: ..., answer: "user's answer"}. If we do one at a time, or we could do all at once in finish-exam.
        ◦ The backend (VeriExam or Orchestrator) receives this. It looks up the correct answer for that question from VeriBank/VeriVault.
        ◦ If the question is multiple-choice, it's straightforward to compare (e.g., correct option "C" vs user answer).
        ◦ If open text, VeriExam can call VeriVerify’s answer checking: e.g., prompt an LLM: “The question was X. The correct answer is Y. The user answered Z. Evaluate if Z is correct or not and give a score 0 or 1 with rationale.” This way even open answers can be judged with AI help. For hackathon simplicity, we might restrict to objectively gradable questions or keywords.
        ◦ The backend responds with the result: correct/incorrect, and a brief explanation or the correct answer. It will include the citation or reference (which we stored). For example:
        ◦ { "correct": false, 
  "explanation": "The correct answer is the **spleen**, as discussed in Lecture 3 at 04:20.",
  "ref": "Lecture3 04:20"
}
        ◦ This way the user can learn from mistakes. The reference might be used to hyperlink to the notes or even play the video at that timestamp.
        ◦ If we do a full exam at once: the user answers all, then calls an endpoint to grade all. The backend then returns a summary with each question’s result and overall score.
    • The frontend shows the feedback for that question (or all questions at end). We ensure that for each incorrect answer, the explanation points them back to the learning material (notes or video). This closed-loop from question to learning content amplifies impact by reinforcing the correct knowledge.
    • The system might allow multiple attempts or just review mode after finishing.
    • Interactive Quiz/Coaching (VeriCoach):
    • User enters a chat or oral quiz section of the app. They might click "Practice with AI Coach". The frontend then either opens a WebSocket or starts polling an endpoint for a conversation.
    • The backend (VeriCoach module) starts a session. It might greet the user and ask how they want to proceed (open Q&A or quiz mode).
    • If quiz mode: VeriCoach picks a question from the bank and asks the user (sends it via WebSocket or as a response which frontend displays as the coach's message). This is essentially the AI leading the quiz.
    • The user responds (voice or text). The frontend sends the user’s answer to the backend (over WebSocket or POST).
    • VeriCoach receives the answer, and then uses either simple checking or the LLM to form a response. Likely, we’d let the LLM generate a tutor-like response:
        ◦ If correct: “Correct! 🎉 That’s right, the spleen does X. You’ve got it.”
        ◦ If incorrect: “Not quite. The correct organ is the spleen, which... [explanation]. Don’t worry, this was a tricky one.”
        ◦ Optionally, the coach might follow up: “Would you like to review this topic or try another question?” This adaptability shows a dynamic learning path (innovation in user engagement).
    • This loop continues until the user stops. Throughout, VeriCoach keeps context of what was asked and possibly avoids repeating questions or tracks performance to adjust difficulty (future enhancement).
    • For open Q&A (user asks something): the user types a question (“I didn’t understand how X works.”). The backend then uses the LLM (with the notes as knowledge base) to answer. It might do a retrieval: search the notes for relevant section, feed that as context to Gemini Flash in chat mode to answer clearly. The answer is returned to frontend and shown as AI’s response, possibly with a reference to the notes or external source if used.
This interactive flow ensures the learning is two-way and continuous, rather than just a static output of content.
Gemini Model Selection Strategy
Given the variety of tasks, choosing the right model for the job is critical for both performance and quality. Our strategy:
    • Gemini 3 Pro Preview (`gemini-3-pro-preview`) – Use for tasks requiring complex reasoning, long-form generation, or handling large context:
    • Notes Generation: The lecture transcripts and the requirement to produce structured, pedagogically-sound notes is complex. Pro’s advanced reasoning will help it follow the format strictly and include all key points. It also might better handle tool usage decisions (like deciding which visuals are important enough for a screenshot).
    • Weekly/Course Summaries: Summarizing multiple lectures and threading concepts together is a strategic task suited to Pro.
    • Mermaid Diagram Fixing: This is a coding/problem-solving task (debugging syntax). Pro might handle it better than Flash due to deeper reasoning needed.
    • Assist Mode Complex Queries: If the user asks a very complex question during coaching (like “How does concept X relate to concept Y from another lecture?”), Pro can be engaged for a more thorough answer.
    • Gemini 3 Flash Preview (`gemini-3-flash-preview`) – Use for tasks where speed is important and context is limited:
    • Question Generation: After each lecture, generating a set of questions is relatively contained. We prefer Flash here to save time and cost, then verify or regenerate as needed.
    • Verification and Classification: Short checks and rubric validation benefit from Flash’s speed.
    • Chat Q&A (basic): Use Flash with notes context for quick responses; escalate to Pro for deep explanations.
    • Streaming mode – Use for interactive dialogue:
    • Streaming is a delivery mode, not a separate model. We will use Interactions streaming or streamGenerateContent with whichever model fits. If we add audio, we can pair with TTS separately.
    • Tooling and constraints:
    • Built-in tools (`google_search`, `url_context`, `file_search`, `code_execution`) are used in separate calls and cannot be combined with custom function calling yet.
    • Custom function calling is reserved for `take_screenshot` and similar app tools. If we need search + screenshots, we run two passes or search outside the model.
    • Computer-use is not supported on Gemini 3; only enable on a 2.5 model if we add it later.
    • Generation tuning: keep temperature at the Gemini 3 default (1.0) and rely on JSON schemas for determinism. Use thinking_level for latency/cost control (do not mix with thinking_budget).
To summarize, Gemini 3 Pro Preview is our “thinking cap” and Gemini 3 Flash Preview is our “workhorse sprinter”. We will calibrate prompts and the number of examples to compensate for Flash’s lighter reasoning when needed (e.g., providing a structured prompt). The architecture allows easy switching since gemini_client will have model name and we can pass a parameter to each module about which model to use.
Evidence Gating and Verification Architecture
A core value proposition of VeriLearn is that all generated content is verifiable and trusted. The system is architected to enforce evidence-backed output at multiple levels:
    • Prompt-Level Instruction: From the outset, our prompts to Gemini include directions to cite sources or references. For the lecture notes, the "source" is primarily the lecture video itself. So the model is instructed to refer to the lecturer or the slide timing for factual claims (for example: “If you state an important fact or definition, mention which part of the lecture it came from, e.g., ‘At 12:45, the professor mentions…’”). Similarly, for visual elements it explicitly references the timestamp by design[26]. This ensures the raw output we get is already annotated with evidence markers.
    • Inclusion of Timestamps: The simplest form of citation in this context is the timestamp in the video. By scanning the output and ensuring important points have "at [HH:MM:SS]" references, we make the content traceable to the original video. Our code post-process (VeriVerify or part of VeriNotes) can enforce that if a section of notes has no timestamp for a long stretch, we might insert one if possible. Because we have the transcript with timestamps, we could even map sentences back to times. (A possible approach: after generation, align sentences from notes with transcript text to find where it likely came from, then annotate. This is advanced, but even partial matching could provide a timestamp.)
    • Cross-Verification with Transcript: VeriVerify will utilize the transcripts to check facts. For example, if the notes say "The capital of France is Berlin", we clearly know that's wrong. But let's assume something subtler: The notes claim "Algorithm X has a time complexity of O(n²)". VeriVerify can search the transcript for "O(n^2" or "n squared" to see if the instructor said that. If not found, that's a hallucination or error. VeriVerify could then either flag it (and possibly remove or mark it) or attempt to verify via web search (maybe the instructor didn't say it but it's true generally – then an external source can confirm it).
    • Another technique: generate potential verification questions. A research paper suggests using LLM to create verification queries for claims and then find supporting evidence[27]. We might not implement that fully, but conceptually it’s in line.
    • Citation for External Info: If our model goes beyond the video content (perhaps in Further Reading sections or additional context the user asks), we instruct it to provide a proper citation (URL or title of source). If we need a URL, we use a separate call with `google_search` or fetch sources in the backend and pass them into the prompt.
    • During Quiz Answer Checking: Evidence gating continues when the student answers questions. If a student is unsure and provides a partially correct answer, the system (via VeriVerify) might check the relevant portion of notes to see if the key points of the correct answer were mentioned by the student. Essentially, the evidence (notes/transcript) is used as a grading rubric. This encourages students to answer with evidence as well (“According to the lecture, ...”), fostering good practices.
    • LLM as Verifier: We can also use an approach of having a second pass by the LLM to verify the first pass’s work. For instance, after generating the notes, we might prompt Gemini (maybe a different instance or a simpler prompt) with something like: "Here are notes generated from a lecture. Verify each factual claim against the transcript provided. List any statements that cannot be confirmed or seem incorrect." The model could then highlight any issues. This would be an AI guardrail to catch hallucinations. If found, we could handle it by either removing that claim or appending a disclaimer in the text (“[Needs verification]”).
    • User Transparency: The architecture ensures that for any answer given to the user (whether in the notes or by the coach), the source is not far. We incorporate the references right into the content delivery. For example, the coach might answer a question and say "... which you can find explained on page 5 of your notes." The exam feedback directly points to where the topic was covered. This not only validates the answer but also guides the student back to the learning material for review, closing the feedback loop.
    • Access Control: Another angle of verification is that users cannot cheat by getting answers without evidence. For instance, the answer key is not exposed until after they attempt an answer. The system won’t just spill all answers; it gates the answers behind either an attempt or an explicit user request for explanation. This encourages actual engagement and self-assessment.
The evidence-first design adds some overhead (we have to gather and include these citations), but we consider it essential for trust. It transforms the AI from a black-box answer generator to a tool that also teaches how to find and trust information. As judges often value responsible AI use, this architecture element is a strong point.
In summary, our verification architecture is a combination of: - Designing prompts that produce cited output, - Automated cross-checks using transcripts and web, - Storing and linking source data (transcripts, URLs), - And gating the reveal of information to encourage learning.
Performance Considerations and Batching/Resumability
Scaling to long playlists or large courses is a key consideration. Some steps we take in architecture and implementation:
    • Parallel Processing: As mentioned, we support parallel generation of multiple lectures. The CLI had --parallel with a worker pool[12]. In our backend, we can spawn threads or asynchronous tasks for each video. We will, however, be mindful of:
    • API Rate Limits: The Gemini API likely has rate or concurrency limits. We may need to restrict to a certain number of concurrent calls. This can be configured (e.g., at most 2 parallel LLM calls initially). The code’s --max-workers allows tuning concurrency.
    • Memory/CPU: Processing videos (especially downloading video for screenshots or transcribing audio) can be CPU and memory heavy. Parallelizing 5+ videos could strain a single server. We might implement a queue system where only a few heavy tasks run concurrently, others wait.
    • Streaming vs Batch: We note that in parallel mode, streaming of output was limited[28]. Since streaming to the client is not our main approach (we do background jobs), this is fine. But internally, not streaming means we wait for full results which might slightly increase latency but simplifies combining outputs. We could choose to stream within each thread just to monitor progress.
    • Batching Requests to LLM: If the model or cost is a bottleneck, we could batch smaller tasks together. For example, instead of calling the LLM 10 times for 10 short videos, maybe combine transcripts of 2-3 smaller videos into one prompt (treat them as one lecture for summary). But this could reduce clarity. Another kind of batching is multi-task prompting: e.g., ask the model to produce notes and questions in one go for a short video – however, separating concerns usually yields better structure. We opt for sequential steps per video for clarity, except possibly the combined week summary which is a form of batching content.
    • Resumability:
    • The system is designed to not start from scratch if interrupted. VeriVault maintains what’s done. If the generate-pack job fails halfway (say network error or crash after 3 videos done out of 10), the user (or an automated retry) can call it again. VeriMap will list all videos; VeriNotes will detect that some lectures already have outputs saved and skip them by reusing existing content[10]. We have a flag or detection (like the script’s skip_existing=True option) to control this. This means we need to ensure idempotency in storing: each lecture’s output saved with a unique lecture_id key so we know it’s done.
    • For extremely long videos, we might break up processing into parts (not currently explicitly in plan, but if an hour-long video’s transcript is huge, perhaps we could chunk it and use multiple model calls then join sections).
    • If using an asynchronous job queue (like Celery), we can also leverage its retry mechanism to restart failed tasks automatically a few times.
    • The front-end could allow the user to manually re-trigger processing for failed items (e.g., “Retry failed videos” button if any).
    • Caching:
    • Caching transcripts: If a video URL has been processed before (even by another user), and we store transcripts and possibly even the model-generated notes, we can skip redoing it. For identical content, this saves time and cost. We just need a key, which could be the video ID and the model version used (since different model or prompt versions might yield different notes, but caching per model used is possible).
    • Caching LLM outputs for identical inputs is tricky because our input includes the video content. But if, say, two users independently request notes for the same publicly available lecture, we can serve the stored result immediately after the first time.
    • We also consider partial caching: e.g., the screenshot recommendations might be deterministic given the same model and video, so those could be cached by video ID to avoid calling the LLM for them if notes are regenerated (though our design does it in one pass with notes).
    • Memory Management:
    • Large transcripts and multiple images can bloat memory usage. We will stream reading of transcripts if needed (not loading whole 100-page text into memory at once).
    • After each lecture processing, we can dump the data to disk (free memory) and only keep summary info (like word_count, etc.). The script prints word counts and times for each video[29] for the user; we similarly will track these stats but can discard full content from RAM once saved.
    • Performance of PDF Generation:
    • Converting a large markdown to PDF can be slow especially with many images or diagrams. Pandoc might take tens of seconds for a long document. To handle this, we might do PDF generation in a separate worker thread so as not to block the main API. The user can be alerted that “PDF is being prepared” and then given a link when ready.
    • We also ensure not to oversample images – the screenshot images can be heavy if too many or high DPI. We set a reasonable DPI (the script defaulted to 300dpi[30] which is fine for print). We could downscale images if needed to reduce PDF size.
    • Scalability:
    • In anticipation of more users or more simultaneous jobs, the architecture could be deployed on cloud where we scale the backend instances. The stateless nature of the API and offloading of state to DB means we can spin up multiple workers. A load balancer can route requests; the job queue (if used) can distribute tasks to multiple consumers.
    • If a single user gives a very large job (e.g., a playlist of 100 videos), it might tie up a lot of resources. We might implement an internal limit or at least sequential processing beyond a threshold to avoid hogging threads. Also possibly notify the user in the UI that this will take a long time, and maybe suggest splitting the playlist or doing it week by week.
    • Using the faster model (Flash) where possible is also a performance strategy, as it’s 3-4x faster for many tasks[31][17], which translates to handling more load on the system.
    • Monitoring and Logging:
    • Performance isn’t just speed, but also detecting bottlenecks. We will instrument the code to log times for each major step (time to get transcript, time to get LLM response for notes, etc.). This can help in optimizing or at least explaining where time goes if needed for judges.
    • We can also monitor the number of tokens generated to estimate cost (useful if there’s a cost constraint in hackathon or to demonstrate efficiency).
In conclusion, the system is built to handle intensive tasks by parallelism and careful resource management, and to handle failures by caching and resume logic. This ensures that even if we push it to generate an entire course pack, it can do so reliably and within a reasonable time frame, providing a smooth user experience.

3. Application API Documentation
We now outline the external API of VeriLearn Exam Pack. This includes the endpoints available, their request/response schema, and how clients (typically the frontend) should use them. We also cover authentication, real-time communication, error handling, and logging.
Base URL: The API base URL is assumed to be https://api.verilearn.com/v1 (for example). All endpoints described are relative to this base.
Authentication & Authorization
All endpoints (except possibly a health check or static content) require an API key or user token. For simplicity, our hackathon implementation might use an API key approach: - The client must include an HTTP header Authorization: Bearer <token> for each request. The token could be a static API key distributed to allowed clients or a JWT if user login is implemented. - If we have user accounts, endpoints that fetch or modify data are scoped to the authenticated user. For example, generating a pack ties it to the user’s ID in the database so that only that user can access it later (or share it explicitly). - Some endpoints might be rate-limited per user/token to prevent abuse (especially the heavy generate endpoint).
For Devpost purposes, we can note that we’ll include a simple auth token to protect the API if deployed publicly, though the demo might have it disabled or a common token for ease of testing.
Endpoint: POST /generate-pack
Description: Initiates the generation of a study pack (notes and question bank) for a given input playlist or list of videos.
Request Body Schema:
{
  "input": "<playlist_url or file_id>",
  "options": {
    "structured": false,
    "formats": ["md", "pdf"], 
    "parallel": true,
    "model": "gemini-3-pro-preview",
    "includeScreenshots": true
  }
}
- input: The identifier for the video content. This can be a YouTube playlist URL (e.g., "https://youtube.com/playlist?list=..."), a single video URL (if the user just wants one video), or an identifier for an uploaded file containing the structured list (if the user uploaded a custom list of URLs). - options.structured: Boolean, set true if input is a structured list (or a file containing LECTURE_ID:TITLE:URL lines). If false and the input is a playlist URL, the backend will attempt to fetch and structure it automatically. - options.formats: An array of output formats the user wants. Options include "md" (Markdown notes), "html" (an HTML version of notes), "pdf" (PDF pack), "json" (a JSON export of structured notes & questions). Default might be ["md","json"] as in the script, and others optional. - options.parallel: Whether to enable parallel processing of multiple videos (default true for playlists). It might be automatically false if only one video. - options.model: Choice of model for generation. Could accept values like `gemini-3-pro-preview` or `gemini-3-flash-preview` (or other supported IDs). By default, we use Pro for best quality[32]. - Other possible options: includeScreenshots (to toggle the screenshot feature on/off if the user maybe doesn’t want images), speed for video playback speed if we integrated that (the script had a speed option to possibly use a faster audio playback for transcription), etc. We can expose some advanced settings for power users, but these are optional.
Response: - On success (202 Accepted): We do not immediately return the whole pack (since it can take time). Instead, we return a job identifier and initial status.
{
  "job_id": "abcd1234",
  "status": "processing",
  "total_videos": 10,
  "videos_processed": 0,
  "estimated_time": 120
}
- job_id: Unique ID for this generation job (could be UUID or a shortened hash). - status: "processing" indicates it has started. (If we chose to do it synchronously for a single video, we might return "completed" with results directly, but assume async for general case.) - total_videos: Number of videos detected (for user info). - videos_processed: Number done so far (0 at start). - estimated_time: Rough guess in seconds (we could provide or leave null; might be calculated as total_videos * avg_time_per_video. Perhaps we update it later). - On error: If input is invalid or immediately fails:
{
  "error": "Invalid playlist URL or access denied.",
  "code": 400
}
Standard HTTP error codes will be used (400 for bad input, 401 for unauthorized if no auth, 500 for server errors, etc.).
Behavior: - The backend immediately spawns a background process to handle the pack generation. Meanwhile, the client can use the job_id to poll for status or results. - If the client wants to wait synchronously (maybe for a single video case), we could also allow a query param ?sync=true and if so, hold the request open until completion and then return the final data. But for hackathon, async with polling is safer.
Endpoint: GET /status/{job_id}
Description: Check the current status of a running job or retrieve results when done.
Response Schema:
{
  "job_id": "abcd1234",
  "status": "processing",    // or "completed" or "failed"
  "videos_processed": 3,
  "total_videos": 10,
  "current_task": "Generating notes for Lecture 4",
  "error": null
}
- If status is "processing", you get progress info: - videos_processed: how many completed. - current_task: a friendly description (if available, e.g., which lecture is in progress or if combining weeks, etc.). - Could also include a partial list of completed lecture IDs or their titles (so frontend could show which ones are done). For brevity maybe not needed. - If status is "completed", additional fields may be present:
{
  "status": "completed",
  "pack_id": "course_XYZ",
  "notes_url": "/study-pack/course_XYZ/notes.html",
  "pdf_url": "/study-pack/course_XYZ/pack.pdf",
  "summary": {
      "total_words": 15000,
      "total_questions": 30,
      "processing_time": 118.5
   }
}
- pack_id: an identifier for the generated pack (could be same as job_id or derived from input). - notes_url: an endpoint or S3 link to view the notes (here maybe an HTML version). - pdf_url: if PDF was requested and ready, a link to download it. - We might also directly include some content in the response for convenience: - e.g., an array of question objects (without answers) so the frontend can immediately render the quiz. Or at least the count of questions and perhaps the first few. - But since these could be large (notes content), probably better to provide URLs or require separate fetch. - summary: some metadata about the pack (word count, number of questions, time taken, etc.) – this is similar to what the script printed as final summary[33], now formatted for API. - If status is "failed", then error field will contain details:
{
  "status": "failed",
  "error": "Failed at video 4 due to network timeout.",
  "failed_video": "W2L1"
}
and possibly a flag if it’s retryable. The client could then choose to call POST /generate-pack again with an option to resume (we might handle that under the hood automatically by reading what’s done).
Note: We could unify this with the result endpoint, but splitting status and final result retrieval allows continuous polling. Alternatively, we might design a WebSocket or Server-Sent Events channel for status. In our hackathon case, polling is simpler to implement.
Endpoint: GET /study-pack/{pack_id}
Description: Retrieve the content of a generated study pack. This is called after a job is complete (either using the pack_id from status, or the same job_id if we equate them).
Response:
{
  "pack_id": "course_XYZ",
  "title": "Course XYZ - Exam Prep Pack",
  "notes": "## Lecture 1: Introduction...\n ... (markdown or HTML content)...",
  "questions": [
    {
      "id": "q1",
      "question": "What is ...?",
      "options": ["A ...", "B ...", "C ...", "D ..."],   // if MCQ, otherwise null or omitted
      "type": "multiple-choice"
    },
    ...
  ]
}
- title: Title of the course/pack (could be derived from playlist name or first video title). - notes: The study notes content. Possibly by default we give markdown text. If the client wants HTML, we might have a parameter or separate endpoint (notes.html vs notes.md). Alternatively, we could provide an array of sections/lectures in structured form. For simplicity, raw markdown or pre-rendered HTML (sanitized) is fine. - questions: List of question objects. Each includes: - id: An identifier. - question: The question text. - options: If it's multiple-choice, an array of option texts. If it's open-ended, this field might be omitted or an empty list. - type: e.g., "multiple-choice", "true/false", "short-answer". - (We explicitly do NOT include the correct answer or explanation here, to prevent spoiling.) - We might also include a weeks structure if applicable, like grouping notes by week in an array. But if we merged notes into one big content in generation, no need.
Notes: This endpoint could be omitted if the info is partially given in /status completed and others via direct links. But having it is convenient for a single call to get everything for rendering. In practice, our frontend might have already what it needs if it got notes_url and questions via status. We can decide either approach: - Combine status and results in one when completed, - Or separate get-pack.
For clarity here, we show get-pack returning the final content. Authentication ensures only the user who requested generation (or an authorized one) can fetch it.
Endpoint: POST /submit-answer
Description: Submit an answer to a specific question (or a batch of answers) for grading and feedback.
Request Body (single answer mode):
{
  "pack_id": "course_XYZ",
  "question_id": "q1",
  "answer": "C"
}
- pack_id: identifies which pack’s question is being answered (so we can find the answer key). - question_id: the specific question being answered. - answer: the user's answer. For MCQ this could be the letter or the text; for open, it's their written answer string.
(Alternatively, for open answers we might allow an array if multi-part, but likely a simple string is fine.)
Response (single answer):
{
  "question_id": "q1",
  "correct": false,
  "correct_answer": "C",
  "explanation": "The correct answer is C, **Neural networks**, because ... (as mentioned in Lecture 2 @ 13:45)."
}
- correct: boolean indicating if the user's answer was right. - correct_answer: the actual correct answer (or letter). We include it now for learning purposes. - explanation: a detailed explanation or reference. This will often be a snippet from the notes or an explanation the model generated when creating the question. We ensure it contains the evidence, e.g., a timestamp or note reference. - We might also include a score field if the question is partially correct or if multiple points (for simplicity, each question is 1 point so correct =1, incorrect=0 implicitly). - If the question was open-ended and the answer is somewhat correct, we might mark correct=true if it meets criteria or false with explanation noting missing elements. This is tough to do perfectly, but we can attempt via LLM or keywords.
Batch mode: We could allow submitting multiple answers at once:
{
  "pack_id": "course_XYZ",
  "answers": [
    {"question_id": "q1", "answer": "C"},
    {"question_id": "q2", "answer": "True"},
    {"question_id": "q3", "answer": "the spleen"}
  ]
}
Response would then be an array of results or an object with each question_id as key. But implementing batch isn't much harder, it’s just looping internally. It might be more efficient to grade all at once if using LLM (giving the LLM the list of Qs and As to check in one prompt), but that could be complicated. We'll likely handle one by one in the backend but batch in the API for network efficiency if needed.
Real-time aspect: For quizzes, real-time isn't crucial; a slight delay is okay. But we could pre-generate feedback for all questions when we created them (the explanation field is essentially that). So grading a selected option is just a lookup to see if it matches the stored correct option and then returning the stored explanation. That’s instantaneous.
Endpoint: GET /get-remediation
Description: (If needed) Retrieve remediation or further learning resources for a given topic or an entire pack.
This endpoint can serve as a way to get additional help after an exam: - If a user did poorly on certain questions, the frontend can call /get-remediation?pack_id=XYZ&topics=[list] to get targeted notes or links. - Or simpler, it might return a summary of which topics to review based on incorrect answers.
Example: Request: GET /get-remediation?pack_id=course_XYZ Response:
{
  "pack_id": "course_XYZ",
  "remediation": [
    {
      "topic": "Backpropagation",
      "advice": "Review Lecture 3, slides 10-12, and re-read the example in the notes. You might also watch this supplementary video: <url>.",
      "unanswered_questions": ["q5", "q8"]
    },
    ...
  ]
}
This is quite domain-specific. For hackathon MVP, we might not implement a full remediation endpoint. Instead, the explanation we give per question serves as remediation. However, we mention it because it was in the user’s request list, and it shows extensibility: - We could generate this by analyzing which questions were wrong and grouping them by topic, then giving advice (the LLM could generate advice if we feed it the wrong Qs and relevant notes).
If time doesn’t permit full development, we might skip a dedicated endpoint and just include remedial info in the feedback of each question. But for completeness, we describe it.
Endpoint: GET /export/pdf
Description: Get the PDF version of the study pack. This endpoint triggers PDF generation if not already done, or fetches it if available.
Query Parameters: pack_id=course_XYZ (and possibly download=true if we want to force a download vs inline display).
Behavior: - If PDF is already generated and stored (VeriVault has a path), it will read the file and return it with appropriate headers (Content-Type: application/pdf). - If PDF is not yet generated (maybe user chose not to initially), the backend will either: - Synchronously generate it then return (if it's reasonably fast). - Or respond with 202 Accepted and initiate generation (similar to generate-pack flow but just for PDF). Then the user would poll a /export/status?pack_id or something. This might be overkill; likely we generate on the fly since we have the content.
Response: - On success, binary PDF data is returned (or if through an HTTP link, a redirect to a cloud storage URL). - On error, JSON with error message (like pack not found or generation failed) and status code.
We also allow similar endpoints for other formats if needed: - GET /export/html?pack_id=... could return a consolidated HTML of notes (for embedding in an iframe or new tab). - GET /export/json?pack_id=... for raw data (though /study-pack is essentially that).
Additional Endpoints (if any)
    • User Management: if we had signup/login, /login, /register, etc. But not our focus here.
    • List Packs: GET /study-packs – returns a list of packs a user has generated (with metadata like title, date, etc.). Good for allowing user to revisit old packs without regenerating.
    • Delete Pack: DELETE /study-pack/{pack_id} to remove data, if needed (cleanup).
    • Live Quiz endpoints (if not using pure WebSocket):
    • e.g., POST /coach/{session_id} with a message and get response. However, WebSocket is more suitable for that use case to handle back-and-forth.
    • WebSocket / WS: If we implement, it would likely be at a path like ws://api.verilearn.com/coach/{session_id}. The messages would be JSON with at least role: "user"/"assistant" and content. The protocol can be simple since it's 1-1 chat.
Real-Time Updates and Progress
We have partly covered this in the /status endpoint approach. To make the user experience better during long generation tasks, we have two strategies:
    1. Polling: The frontend can poll /status/{job_id} every few seconds to get updates. The status response includes how many videos done and possibly the last processed lecture. This can be displayed as a progress bar (% = videos_processed/total_videos * 100). If videos_processed increments, the UI could even update a list showing which lecture notes are ready (if we choose to display incrementally).
    2. The CLI in the script output progress to console as each video completed[34]. We mimic that in the API by making those states available via status.
    3. Server-Sent Events or WebSocket: For a more dynamic approach, the backend can push updates. We could implement an SSE endpoint /events/{job_id} that clients can subscribe to and get text/event-stream updates like:
    • event: progress
data: {"videos_processed": 1, "current":"W1L2"}
    • and
    • event: completed
data: {"pack_id": "course_XYZ"}
    • This avoids continuous polling. WebSocket could do similar but SSE is simpler for one-way notifications.
    4. For hackathon, polling might be easier to implement given time, but if we aim for slick presentation, demonstrating real-time push is impressive.
For the coaching (bi-directional real-time), WebSocket is the chosen method because quick back-and-forth is needed. Implementation detail: we need to integrate the WebSocket handling in our backend (if using FastAPI, it supports WebSocket routes). The messages would carry user answers and send back AI questions/feedback as they are ready. We should also handle session termination (closing WS when done or on error).
Retry Logic and Error Handling
The system should gracefully handle transient errors. Some possible errors and our approach:
    • LLM API Errors: If the Gemini API call fails (network issue or rate limit), our backend (VeriNotes or VeriBank) should catch that exception. The video_study_generator.py had retry logic for generation (e.g., _generate_content_with_retry likely does a few retries with backoff). We will incorporate similar logic:
    • If an LLM call fails, wait a few seconds and retry up to N times. If still fails, mark that lecture as failed.
    • The overall job doesn’t abort immediately unless a critical number of failures occur. We continue with other videos if possible, and in the final status mark which lectures failed.
    • The user could then decide to retry generation for those failed parts (maybe by re-calling generate-pack with a parameter to only do failed ones, or just re-run entire playlist which will skip done ones and attempt the failed again).
    • Video Download/Transcription Errors: If the video is unavailable (private or removed) or transcription fails, we catch that:
    • Mark that lecture as failed with a reason ("Video inaccessible" or "Transcript not found").
    • Continue with others.
    • In the final output, perhaps include a note in place of that lecture: "Lecture 4 could not be processed: Transcript unavailable."
    • Possibly present this in the UI so the user knows.
    • Screenshot Failure: Sometimes cv2 might not capture a frame (maybe timestamp beyond video length, etc.). In the script, they handle it and generate an error ref ID[35]. Our approach:
    • If a screenshot fails, we simply skip that image. The model’s output reference might remain, but our post-processing can detect if an image file is missing and either remove that reference or note "[Screenshot failed]".
    • This is minor and doesn’t stop the whole job.
    • Timeouts: For very long videos, an LLM call might run into token limits or timeouts.
    • We can mitigate by splitting the video into parts (not currently in plan, but possible extension).
    • Or use thinking_level="low" for those to encourage less verbose output if needed (do not combine with thinking_budget).
    • The backend itself might have an overall timeout per request, but since we offload to background, the HTTP request returns quickly. We ensure our worker doesn’t hang indefinitely by perhaps using timeouts on LLM API calls or having a watchdog.
    • Error Responses:
    • We design error messages to be informative. The API will typically respond with JSON containing error and maybe details field.
    • Standardize error codes (e.g., 400 for client input issues: "Invalid input, missing URL"; 403 for auth issues; 500 for internal errors possibly with a request ID for us to trace logs).
    • For tool errors, they often are logged but not exposed. E.g., if mermaid fix fails even after retries, the PDF generator prints a message[36][37]. In our system, if PDF generation ultimately fails (say Pandoc not installed or file too large), we return an error like 500 with "PDF generation failed. Please try again later or contact support." and log the internal cause.
    • Logging & Traceability:
    • Each job gets a log trail (we can associate logs by job_id).
    • If an error occurs, we log it server-side with context (stack trace, which video ID, etc.) to aid debugging.
    • For the user, we may not expose all details (to avoid confusion), but we might give enough: e.g., "Lecture 2 processing failed due to an unexpected error" in the status.
    • Trace IDs: We could include a header X-Request-ID in responses so if a user reports an issue, we can find it in logs.
    • Security: Any input that interacts with external systems is sanitized:
    • E.g., if we use `google_search` or `url_context`, ensure it cannot be misused (restrict queries, cap results, filter domains if needed).
    • User-provided file inputs (structured list) need parsing carefully to avoid code injection (though it's just text lines).
    • The Pandora’s box is the code execution tool (if we implement it). We would run it in a sandbox (maybe using Pyodide or a container). For hackathon, we likely won't go that far in implementation.
    • Rate limiting: Possibly not needed for a demo, but if open to public, limit how many generate-pack calls per minute per user or set a max playlist length.
API Contracts for Each Module
Finally, to connect API endpoints to the internal modules (this is more for developer documentation):
    • POST /generate-pack
    • Internally calls: VeriMap.parse_input, then for each video calls VeriNotes.generate_notes, collects results, calls VeriBank.generate_question_bank, stores via VeriVault. Possibly triggers VeriExports.generate_pdf if requested.
    • Returns: Job tracking info (the heavy work happens asynchronously in these modules).
    • GET /status/{job_id}
    • Internally: VeriVault.get_job_status(job_id) to retrieve progress from DB or memory. This might read partial results or flags updated by the generation process. Or if generation is done, it might compile the response including links (which it forms via known storage paths).
    • Returns: Status info (no heavy processing, just retrieval).
    • GET /study-pack/{pack_id}
    • Internally: VeriVault.fetch_pack(pack_id) which returns the notes content and question list from storage (could be from DB or by reading files).
    • Possibly VeriVault.fetch_notes(pack_id) and VeriVault.fetch_questions(pack_id) separately and combine.
    • If notes are stored only as files, the backend might open the markdown file, and if needed convert it to HTML for output (or the frontend could do markdown rendering itself, in which case just send markdown).
    • Returns: The study pack content.
    • POST /submit-answer
    • Internally: VeriExam.grade_answer(pack_id, q_id, answer).
        ◦ VeriExam uses VeriVault to get the correct answer (and explanation) for q_id.
        ◦ If short-answer, VeriExam could call VeriVerify.evaluate_answer(q, user_answer) for a correctness check.
        ◦ It then returns an object with correctness and explanation.
    • Returns: Grading result.
    • GET /export/pdf
    • Internally: VeriExports.generate_pdf(pack_id) if needed. This uses VeriVault to get the path to the markdown notes, runs Pandoc, possibly calls Gemini for fixes.
        ◦ It sets the output file path and saves it through VeriVault.record_export(pack_id, "pdf", file_path).
        ◦ If multiple requests come, it should not regenerate if one is in progress or done, to save resources.
    • Returns: PDF file.
    • WebSocket / coach
    • Internally: On a new connection, VeriCoach.start_session(pack_id or user_id) is called to initialize context (load notes and questions for reference).
    • For each message, VeriCoach.handle_message(session, message) is called:
        ◦ If message from user contains an answer to a quiz question, VeriCoach uses VeriExam.grade_answer or a simpler check to respond.
        ◦ If message is a user question, VeriCoach either finds answer in notes or forwards to Gemini (with notes context).
        ◦ If message is an open request like "let's do a quiz", VeriCoach picks a question and sends it.
        ◦ Maintains session state (could store in a dict in memory, or require the full conversation history sent each time if stateless – but WS allows stateful).
    • Returns (via WS): JSON messages for each coach prompt or feedback.
Example Usage Flow (API in action)
To illustrate how a developer or the frontend would use the API, consider a simple scenario:
    • The user enters a playlist URL and clicks "Generate Pack". The frontend sends:
    • POST /generate-pack
Authorization: Bearer abc123
Content-Type: application/json

{"input": "https://youtube.com/playlist?list=PL123...", "options": {"formats": ["md","pdf"]}}
    • Response:
    • {"job_id": "job_001", "status": "processing", "total_videos": 5, "videos_processed": 0}
    • The frontend starts polling every 5 seconds:
    • GET /status/job_001
Authorization: Bearer abc123
    • It might get:
        ◦ After first video done: {"job_id":"job_001","status":"processing","videos_processed":1,"total_videos":5,"current_task":"Generating notes for Lecture 2"}
        ◦ Midway: {"videos_processed":3,"total_videos":5,"current_task":"Generating question bank"}
        ◦ Finally: {"status":"completed","pack_id":"user123_pack42","notes_url":"/study-pack/user123_pack42/notes.html","pdf_url":"/study-pack/user123_pack42/pack.pdf"}
    • Once completed, the frontend either navigates to or fetches the notes:
    • GET /study-pack/user123_pack42
Authorization: Bearer abc123
    • It receives the JSON with notes and questions.
    • The frontend renders notes (maybe using a markdown library for the notes field if it’s markdown).
    • The frontend shows questions one by one in a quiz section. For each answer user submits, it calls:
    • POST /submit-answer
Authorization: Bearer abc123

{"pack_id":"user123_pack42","question_id":"q5","answer":"B"}
    • If wrong, response might be:
    • {"question_id":"q5","correct":false,"correct_answer":"C","explanation":"The correct answer is C. In Lecture 2, the professor explained that ... see 12:00 in the video."}
    • The frontend then displays that explanation and maybe marks question as red (incorrect).
    • If the user wants, they click "Download PDF". The frontend either uses the pdf_url given (which might be a direct link if we serve static files) or calls the endpoint if dynamic:
    • GET /export/pdf?pack_id=user123_pack42
Authorization: Bearer abc123
    • The response is the PDF binary which triggers a download in browser.
    • For an interactive session, the frontend would:
    • Connect via WebSocket to /coach/session?pack_id=user123_pack42 (or first POST to create session, then connect).
    • The user sees a message from coach: "Hi! Let's test your knowledge. First question: ...?"
    • They answer, the frontend sends through WS: {"answer": "Neurons"}.
    • The server responds: {"correct": true, "feedback": "Correct! You nailed it."} or similar.
    • And maybe immediately the next question arrives.
Conclusion and Alignment with Judging Criteria
The API design above, combined with the system and implementation plan, provides a comprehensive and technically robust interface for the VeriLearn Exam Pack.
    • Technical Execution: The API endpoints cover all required functionality with careful attention to error handling, asynchronous processing, and integration with the advanced capabilities of the Gemini AI models. The design shows how each piece will be implemented using state-of-the-art techniques (function calling, multi-model usage, etc.), demonstrating feasibility and technical depth.
    • Innovation: The ability to turn passive video content into an active learning experience via an API is innovative. Our API not only delivers static content (notes) but also interactive services (quizzes, coaching), showing a platform that could be integrated into e-learning systems or other applications. Features like screenshot tool integration and AI-assisted diagram fixes are exposed behind the scenes, but their outcomes (rich notes, error-free diagrams) are evident to the user.
    • Impact: By documenting the endpoints and usage, we highlight how developers (or the frontend we build) can leverage this to help learners. For example, a third-party could use /generate-pack to create study guides for any educational video content, amplifying reach. The API makes our solution extensible beyond just our app, which can broaden impact if made public.
    • Presentation: We've structured the documentation clearly with headings, bullet points, and examples, making it easy to follow. This mirrors how the final project presentation can cleanly articulate each piece. The consistent citation of source lines from the code[12] etc., adds credibility that we built on proven components.
By following this execution package, the development team (and judges reviewing it) can see that VeriLearn Exam Pack is not just an idea, but a carefully planned project ready to deliver a novel and valuable tool for learners, implemented with rigor and clarity.

[1] [2] [3] [4] [5] [7] [10] [11] [12] [13] [15] [18] [19] [20] [21] [22] [23] [24] [25] [26] [28] [29] [32] [33] [34] [35] video_study_generator.py
file://file_00000000300871fa87c558d6427a3ffa
[6] [8] [9] [14] [30] [36] [37] pandoc_pdf_generator.py
file://file_000000007b6872079a847ac2a76d4b07
[16] [17] Gemini 3 Flash: Google's Fastest AI Yet (Full Breakdown)
https://juliangoldie.com/gemini-3-flash-update/
[27] [PDF] Enhancing Factual Accuracy and Citation Generation in LLMs via ...
https://arxiv.org/pdf/2509.05741
[31] TAI #184: Gemini 3 Flash is 3x Faster and 4x Cheaper than Pro and ...
https://newsletter.towardsai.net/p/tai-184-gemini-3-flash-is-3x-faster
