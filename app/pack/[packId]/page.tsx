import { notFound } from "next/navigation";
import { getPack } from "../../../lib/store";

export default async function PackSharePage({
  params
}: {
  params: { packId: string };
}) {
  const { packId } = params;
  const pack = await getPack(packId);

  if (!pack) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="shell py-10">
        <div className="flex flex-col gap-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">VeriLearn Share Pack</p>
            <h1 className="text-3xl font-serif text-slate-900">{pack.title}</h1>
            <p className="text-sm text-slate-500">
              Generated {new Date(pack.createdAt).toLocaleString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                href={`/api/export/pdf?packId=${pack.id}`}
              >
                Download PDF
              </a>
              <a
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                href={`/api/export/html?packId=${pack.id}`}
              >
                View HTML Export
              </a>
              <a
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                href={`/api/export/anki?packId=${pack.id}`}
              >
                Anki CSV/TSV
              </a>
            </div>
          </header>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">Blueprint</h2>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600">
              {pack.blueprint.topics.map((topic) => (
                <li key={topic.id} className="flex items-center justify-between">
                  <span>{topic.title}</span>
                  <span className="text-slate-400">{topic.weight}%</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">Evidence-backed Notes</h2>
            <div className="mt-4 grid gap-6">
              {pack.notes.map((note) => (
                <article key={note.lectureId} className="rounded-xl border border-slate-100 p-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {note.lectureTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{note.summary}</p>
                  {note.keyTakeaways.length ? (
                    <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                      {note.keyTakeaways.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {note.citations.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {note.citations.slice(0, 4).map((citation) => (
                        <a
                          key={`${note.lectureId}-${citation.timestamp}`}
                          href={citation.url}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                        >
                          {citation.timestamp}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
