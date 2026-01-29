import { NextRequest, NextResponse } from "next/server";
import { TagService } from "@/module/tags/service";
import { TagMapper } from "@/module/tags/core";

export async function GET() {
  try {
    const items = await TagService.getAll();
    return NextResponse.json(items.map(TagMapper.toResponse));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Error fetching tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await TagService.create(body);
    return NextResponse.json(TagMapper.toResponse(item), { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    const message = error instanceof Error ? error.message : "Error creating tag";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
