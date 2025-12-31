import { NextResponse } from "next/server";
import { getPack, updatePack } from "../../../../lib/store";
import { buildPdf } from "../../../../lib/veriexports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packId = searchParams.get("packId");

  if (!packId) {
    return NextResponse.json({ error: "Missing packId" }, { status: 400 });
  }

  const pack = await getPack(packId);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const pdfBytes = await buildPdf(pack);
  await updatePack(pack.id, {
    exports: {
      ...(pack.exports ?? {}),
      pdf: `/api/export/pdf?packId=${pack.id}`
    }
  });

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"${pack.title.replace(/\s+/g, "-")}.pdf\"`
    }
  });
}
