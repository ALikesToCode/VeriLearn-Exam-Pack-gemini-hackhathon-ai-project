import { NextResponse } from "next/server";
import { listPacks } from "../../../lib/store";

export async function GET() {
  const packs = await listPacks();
  return NextResponse.json({ packs });
}
