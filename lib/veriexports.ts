import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { Pack } from "./types";

function wrapText(text: string, maxWidth: number, font: PDFFont, size: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function escapeField(value: string, delimiter: string) {
  const needsQuotes = value.includes(delimiter) || value.includes("\n") || value.includes("\"");
  if (!needsQuotes) return value;
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function buildPdf(pack: Pack) {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  const margin = 48;
  let cursorY = height - margin;

  const drawLine = (text: string, size: number, font = regular) => {
    if (cursorY < margin) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      cursorY = height - margin;
    }
    page.drawText(text, {
      x: margin,
      y: cursorY,
      size,
      font,
      color: rgb(0.12, 0.12, 0.12)
    });
    cursorY -= size * 1.4;
  };

  const drawParagraph = (text: string, size = 11, font = regular) => {
    const lines = wrapText(text, width - margin * 2, font, size);
    lines.forEach((line) => drawLine(line, size, font));
  };

  drawLine(pack.title, 20, bold);
  drawLine(`Generated: ${new Date(pack.createdAt).toLocaleString()}`, 10, regular);
  drawLine(" ", 8, regular);

  drawLine("Blueprint", 14, bold);
  pack.blueprint.topics.forEach((topic, index) => {
    drawParagraph(
      `${index + 1}. ${topic.title} (Weight ${topic.weight}%)`,
      11,
      regular
    );
  });
  drawLine(" ", 8, regular);

  drawLine("Notes", 14, bold);
  pack.notes.forEach((note) => {
    drawLine(note.lectureTitle, 12, bold);
    drawParagraph(note.summary, 11, regular);
    note.keyTakeaways.forEach((takeaway) => {
      drawParagraph(`• ${takeaway}`, 10, regular);
    });
    if (note.visuals?.length) {
      drawParagraph("Visual references:", 10, bold);
      note.visuals.forEach((visual) => {
        drawParagraph(
          `• [${visual.timestamp}] ${visual.description} (${visual.url})`,
          9,
          regular
        );
      });
    }
    drawLine(" ", 8, regular);
  });

  drawLine("Question Bank", 14, bold);
  pack.questions.forEach((question, index) => {
    drawParagraph(`${index + 1}. ${question.stem}`, 11, bold);
    if (question.options) {
      question.options.forEach((option) => {
        drawParagraph(`(${option.id}) ${option.text}`, 10, regular);
      });
    }
    drawParagraph(`Answer: ${question.answer}`, 10, regular);
    drawLine(" ", 8, regular);
  });

  return pdfDoc.save();
}

export function buildAnkiExport(pack: Pack, delimiter: string) {
  const rows = pack.questions.map((question) => {
    const options = question.options
      ? question.options.map((option) => `${option.id}. ${option.text}`).join(" | ")
      : "";
    const citations = question.citations
      .map((citation) => `${citation.timestamp} ${citation.url}`)
      .join(" | ");
    const front = [question.stem, options].filter(Boolean).join("\n");
    const back = [
      `Answer: ${question.answer}`,
      question.rationale ? `Why: ${question.rationale}` : "",
      citations ? `Evidence: ${citations}` : ""
    ]
      .filter(Boolean)
      .join("\n");
    return [escapeField(front, delimiter), escapeField(back, delimiter)].join(delimiter);
  });

  return rows.join("\n");
}

export function buildHtml(pack: Pack) {
  const notesHtml = pack.notes
    .map((note) => {
      const sectionsHtml = note.sections
        .map(
          (section) => `
            <section class="note-section">
              <h4>${escapeHtml(section.heading)}</h4>
              <ul>
                ${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
              </ul>
            </section>`
        )
        .join("");

      const citationsHtml = note.citations
        .map(
          (citation) =>
            `<a href="${escapeHtml(citation.url)}" target="_blank" rel="noreferrer">${escapeHtml(
              citation.timestamp
            )}</a>`
        )
        .join("");

      const visualsHtml = note.visuals?.length
        ? `
          <div class="visuals">
            ${note.visuals
              .map((visual) => {
                if (visual.sprite) {
                  const sprite = visual.sprite;
                  const scale = 2;
                  const width = sprite.width * scale;
                  const height = sprite.height * scale;
                  const backgroundSize = `${sprite.columns * sprite.width * scale}px ${
                    sprite.rows * sprite.height * scale
                  }px`;
                  const backgroundPosition = `-${sprite.col * sprite.width * scale}px -${
                    sprite.row * sprite.height * scale
                  }px`;
                  return `
                    <figure>
                      <div class="sprite" style="width:${width}px;height:${height}px;background-image:url('${escapeHtml(
                        sprite.spriteUrl
                      )}');background-size:${backgroundSize};background-position:${backgroundPosition};"></div>
                      <figcaption>${escapeHtml(visual.timestamp)} - ${escapeHtml(
                        visual.description
                      )}</figcaption>
                    </figure>`;
                }
                return `
                  <figure>
                    <img src="${escapeHtml(visual.url)}" alt="${escapeHtml(
                  visual.description
                )}" />
                    <figcaption>${escapeHtml(visual.timestamp)} - ${escapeHtml(
                  visual.description
                )}</figcaption>
                  </figure>`;
              })
              .join("")}
          </div>`
        : "";

      return `
        <article class="note">
          <h3>${escapeHtml(note.lectureTitle)}</h3>
          <p>${escapeHtml(note.summary)}</p>
          ${sectionsHtml}
          <div class="meta">
            <strong>Key takeaways:</strong>
            <span>${note.keyTakeaways.map((item) => escapeHtml(item)).join(" - ")}</span>
          </div>
          <div class="citations">${citationsHtml}</div>
          ${visualsHtml}
        </article>`;
    })
    .join("");

  const questionsHtml = pack.questions
    .map((question, index) => {
      const options = question.options
        ? `<ul class="options">${question.options
            .map(
              (option) =>
                `<li><strong>${escapeHtml(option.id)}.</strong> ${escapeHtml(option.text)}</li>`
            )
            .join("")}</ul>`
        : "";
      const citations = question.citations
        .map(
          (citation) =>
            `<a href="${escapeHtml(citation.url)}" target="_blank" rel="noreferrer">${escapeHtml(
              citation.timestamp
            )}</a>`
        )
        .join("");

      return `
        <div class="question">
          <h4>${index + 1}. ${escapeHtml(question.stem)}</h4>
          ${options}
          <div class="answer"><strong>Answer:</strong> ${escapeHtml(question.answer)}</div>
          <div class="rationale">${escapeHtml(question.rationale)}</div>
          <div class="citations">${citations}</div>
        </div>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pack.title)}</title>
    <style>
      body { font-family: "Space Grotesk", Arial, sans-serif; margin: 0; background: #f7f2e7; color: #111b21; }
      header { padding: 32px; background: #ffffff; border-bottom: 1px solid #e7dcc8; }
      h1 { margin: 0 0 8px; font-size: 2rem; }
      main { padding: 32px; display: grid; gap: 24px; }
      .note, .question { background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #e7dcc8; }
      .note h3 { margin-top: 0; }
      .note-section h4 { margin-bottom: 6px; }
      .meta { margin-top: 12px; font-size: 0.95rem; }
      .citations { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
      .citations a { font-size: 0.85rem; background: #f4b86033; padding: 4px 10px; border-radius: 999px; text-decoration: none; color: inherit; }
      .visuals { display: grid; gap: 12px; margin-top: 12px; }
      figure { margin: 0; }
      img { width: 100%; border-radius: 12px; border: 1px solid #e7dcc8; }
      .sprite { border-radius: 12px; border: 1px solid #e7dcc8; background-repeat: no-repeat; background-color: #fff; }
      figcaption { font-size: 0.85rem; color: #5c676f; margin-top: 6px; }
      .options { padding-left: 18px; color: #5c676f; }
      .answer { margin-top: 12px; font-weight: 600; }
      .rationale { margin-top: 6px; color: #5c676f; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(pack.title)}</h1>
      <p>Generated ${escapeHtml(new Date(pack.createdAt).toLocaleString())}</p>
    </header>
    <main>
      <section>
        <h2>Blueprint</h2>
        <ul>
          ${pack.blueprint.topics
            .map(
              (topic) =>
                `<li>${escapeHtml(topic.title)} - Weight ${topic.weight}% - Order ${
                  topic.revisionOrder
                }</li>`
            )
            .join("")}
        </ul>
      </section>
      <section>
        <h2>Evidence-backed Notes</h2>
        ${notesHtml}
      </section>
      <section>
        <h2>Question Bank</h2>
        ${questionsHtml}
      </section>
    </main>
  </body>
</html>`;
}
