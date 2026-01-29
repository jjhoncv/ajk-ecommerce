import { NextRequest, NextResponse } from "next/server";
import { TagService } from "@/module/tags/service";
import { TagMapper } from "@/module/tags/core";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await TagService.getById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(TagMapper.toResponse(item));
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Error fetching tag" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const item = await TagService.update(params.id, body);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(TagMapper.toResponse(item));
  } catch (error) {
    console.error("Error updating tag:", error);
    const message = error instanceof Error ? error.message : "Error updating tag";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await TagService.delete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Error deleting tag" }, { status: 500 });
  }
}
