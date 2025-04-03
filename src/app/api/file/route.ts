import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req.method);

  return NextResponse.json({ name: "File Uploaded" });
}
