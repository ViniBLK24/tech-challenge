import { NextResponse } from "next/server";
import { swaggerSpec } from "@/shared/lib/swagger";

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
