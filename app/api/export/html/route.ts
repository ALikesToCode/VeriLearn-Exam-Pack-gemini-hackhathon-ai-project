import { NextResponse } from "next/server";
import { getPack, updatePack } from "../../../../lib/store";
import { buildHtml } from "../../../../lib/veriexports";

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

  const html = buildHtml(pack);
  await updatePack(pack.id, {
    exports: {
      ...(pack.exports ?? {}),
      html: `/api/export/html?packId=${pack.id}`
    }
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename=\"${pack.title.replace(/\s+/g, "-")}.html\"`
    }
  });
}
