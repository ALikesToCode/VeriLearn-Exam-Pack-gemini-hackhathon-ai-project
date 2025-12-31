import { NextResponse } from "next/server";
import { getPack, updatePack } from "../../../../lib/store";
import { buildAnkiExport } from "../../../../lib/veriexports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packId = searchParams.get("packId");
  const format = searchParams.get("format") === "tsv" ? "tsv" : "csv";

  if (!packId) {
    return NextResponse.json({ error: "Missing packId" }, { status: 400 });
  }

  const pack = await getPack(packId);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const delimiter = format === "tsv" ? "\t" : ",";
  const content = buildAnkiExport(pack, delimiter);
  await updatePack(pack.id, {
    exports: {
      ...(pack.exports ?? {}),
      ankiCsv: format === "csv" ? `/api/export/anki?packId=${pack.id}&format=csv` : pack.exports?.ankiCsv,
      ankiTsv: format === "tsv" ? `/api/export/anki?packId=${pack.id}&format=tsv` : pack.exports?.ankiTsv
    }
  });

  return new NextResponse(content, {
    headers: {
      "Content-Type": format === "tsv" ? "text/tab-separated-values" : "text/csv",
      "Content-Disposition": `attachment; filename=\"${pack.title.replace(/\s+/g, "-")}-anki.${format}\"`
    }
  });
}
