import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const variantId = parseInt(resolvedParams.id);

    if (isNaN(variantId)) {
      return NextResponse.json(
        { error: "ID de variante inválido" },
        { status: 400 }
      );
    }

    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    console.log(
      `Obteniendo valoraciones para variante ${variantId}, página ${page}, límite ${limit}`
    );

    // Para fines de demostración, generamos datos simulados
    const mockRatings = {
      ratings: [
        {
          id: 1,
          variantId,
          customerId: 1,
          customerName: "Juan Pérez",
          customerPhoto: null,
          rating: 5,
          review:
            "Excelente producto, muy satisfecho con la compra. La calidad es increíble y el precio es muy bueno.",
          title: "Compra perfecta",
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 días atrás
          images: [
            {
              id: 1,
              ratingId: 1,
              imageUrl: "https://via.placeholder.com/150",
            },
            {
              id: 2,
              ratingId: 1,
              imageUrl: "https://via.placeholder.com/150",
            },
          ],
        },
        {
          id: 2,
          variantId,
          customerId: 2,
          customerName: "María García",
          customerPhoto: null,
          rating: 4,
          review:
            "Buen producto, pero tardó un poco en llegar. La calidad es buena.",
          title: "Buena compra",
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 días atrás
          images: [],
        },
        {
          id: 3,
          variantId,
          customerId: 3,
          customerName: "Carlos Rodríguez",
          customerPhoto: null,
          rating: 5,
          review:
            "Increíble producto, superó mis expectativas. Lo recomiendo totalmente.",
          title: "Excelente calidad",
          verifiedPurchase: false,
          createdAt: new Date(Date.now() - 86400000 * 10), // 10 días atrás
          images: [
            {
              id: 3,
              ratingId: 3,
              imageUrl: "https://via.placeholder.com/150",
            },
          ],
        },
      ],
      summary: {
        totalRatings: 10,
        averageRating: 4.5,
        fiveStar: 7,
        fourStar: 2,
        threeStar: 1,
        twoStar: 0,
        oneStar: 0,
        verifiedPurchases: 8,
      },
      totalCount: 10,
      page,
      totalPages: 2,
    };

    return NextResponse.json(mockRatings);
  } catch (error) {
    console.error("Error al obtener valoraciones de variante:", error);
    return NextResponse.json(
      { error: "Error al obtener valoraciones" },
      { status: 500 }
    );
  }
}
