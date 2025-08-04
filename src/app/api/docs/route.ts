import { NextResponse } from "next/server";
import { swaggerSpec } from "@/utils/swagger";

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
