import { NextResponse } from "next/server";
import { getPack } from "../../../../lib/store";

export async function GET(
  _request: Request,
  { params }: { params: { packId: string } }
) {
  const pack = await getPack(params.packId);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  return NextResponse.json(pack);
}
