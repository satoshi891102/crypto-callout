import { NextResponse } from "next/server";
import { homePageData } from "@/data/mock-home";

export async function GET() {
  return NextResponse.json(homePageData);
}
