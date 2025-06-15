import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params

  try {
    const productId = parseInt(resolvedParams.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    // Obtener parámetros de consulta
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')

    // Para fines de demostración, generamos datos simulados
    const mockRatings = {
      ratings: [
        {
          id: 1,
          variantId: 1,
          customerId: 1,
          customerName: 'Juan Pérez',
          customerPhoto: null,
          rating: 5,
          review:
            'Excelente producto, muy satisfecho con la compra. La calidad es increíble y el precio es muy bueno.',
          title: 'Compra perfecta',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 días atrás
          images: [
            {
              id: 1,
              ratingId: 1,
              imageUrl: '/no-image.webp'
            },
            {
              id: 2,
              ratingId: 1,
              imageUrl: '/no-image.webp'
            }
          ]
        },
        {
          id: 2,
          variantId: 2,
          customerId: 2,
          customerName: 'María García',
          customerPhoto: null,
          rating: 4,
          review:
            'Buen producto, pero tardó un poco en llegar. La calidad es buena.',
          title: 'Buena compra',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 días atrás
          images: []
        },
        {
          id: 3,
          variantId: 3,
          customerId: 3,
          customerName: 'Carlos Rodríguez',
          customerPhoto: null,
          rating: 5,
          review:
            'Increíble producto, superó mis expectativas. Lo recomiendo totalmente.',
          title: 'Excelente calidad',
          verifiedPurchase: false,
          createdAt: new Date(Date.now() - 86400000 * 10), // 10 días atrás
          images: [
            {
              id: 3,
              ratingId: 3,
              imageUrl: '/no-image.webp'
            }
          ]
        },
        {
          id: 4,
          variantId: 4,
          customerId: 4,
          customerName: 'Ana Martínez',
          customerPhoto: null,
          rating: 3,
          review: 'Producto aceptable, pero esperaba más por el precio pagado.',
          title: 'Cumple su función',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 15), // 15 días atrás
          images: []
        },
        {
          id: 5,
          variantId: 5,
          customerId: 5,
          customerName: 'Pedro López',
          customerPhoto: null,
          rating: 4,
          review: 'Buen producto, relación calidad-precio adecuada.',
          title: 'Recomendable',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 20), // 20 días atrás
          images: []
        }
      ],
      summary: {
        productId,
        totalRatings: 15,
        averageRating: 4.2,
        fiveStar: 8,
        fourStar: 4,
        threeStar: 2,
        twoStar: 1,
        oneStar: 0,
        verifiedPurchases: 12
      },
      totalCount: 15,
      page,
      totalPages: 3
    }

    return NextResponse.json(mockRatings)
  } catch (error) {
    console.error('Error al obtener valoraciones de producto:', error)
    return NextResponse.json(
      { error: 'Error al obtener valoraciones' },
      { status: 500 }
    )
  }
}
