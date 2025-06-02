import { NextRequest, NextResponse } from "next/server";
import RatingModel from "@/models/RatingModel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Datos recibidos:", body);

    // Validar datos requeridos
    if (!body.variantId || !body.customerId || !body.rating) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Validar rating (1-5)
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "La valoración debe estar entre 1 y 5" },
        { status: 400 }
      );
    }

    // Para fines de demostración, simulamos la creación de una valoración
    // en lugar de usar la base de datos real
    const mockRating = {
      id: Math.floor(Math.random() * 1000),
      variantId: body.variantId,
      customerId: body.customerId,
      customerName: "Usuario Demo",
      customerPhoto: null,
      rating: body.rating,
      review: body.review || null,
      title: body.title || null,
      verifiedPurchase: body.verifiedPurchase || false,
      createdAt: new Date(),
      images: body.images
        ? body.images.map((url: string, index: number) => ({
            id: index + 1,
            ratingId: Math.floor(Math.random() * 1000),
            imageUrl: url,
          }))
        : [],
    };

    return NextResponse.json(mockRating);
  } catch (error) {
    console.error("Error al crear valoración:", error);
    return NextResponse.json(
      { error: "Error al crear valoración" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get("id") || "");

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de valoración inválido" },
        { status: 400 }
      );
    }

    await RatingModel.deleteRating(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar valoración:", error);
    return NextResponse.json(
      { error: "Error al eliminar valoración" },
      { status: 500 }
    );
  }
}
