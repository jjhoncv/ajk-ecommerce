import { NextRequest, NextResponse } from 'next/server';
import { getProductVariant } from '@/services/product/productVariant';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variantId = parseInt(params.id);

    if (isNaN(variantId)) {
      return NextResponse.json(
        { error: 'ID de variante inválido' },
        { status: 400 }
      );
    }

    // Usar el servicio existente para obtener la variante completa
    const variantData = await getProductVariant(variantId);

    if (!variantData) {
      return NextResponse.json(
        { error: 'Variante no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(variantData);

  } catch (error) {
    console.error('Error fetching product variant:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
