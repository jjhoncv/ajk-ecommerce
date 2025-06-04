import { Metadata } from "next";
import Link from "next/link";
import ProductDetail from "@/components/product/ProductDetail";
import ProductVariantModel from "@/models/ProductVariantModel";
import ProductModel from "@/models/ProductModel";
import { hydrateProductDTO } from "@/utils/hydrators/product-card.hydrator";
import Layout from "@/components/layout/Layout";

interface ProductVariantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductVariantPageProps): Promise<Metadata> {
  const { id } = await params;
  const variantId = parseInt(id);

  if (isNaN(variantId)) {
    return {
      title: "Variante no encontrada",
    };
  }

  try {
    const variant = await ProductVariantModel.getVariantById(variantId);

    if (!variant) {
      return {
        title: "Variante no encontrada",
      };
    }

    const product = await ProductModel.getProductById(variant.productId);

    if (!product) {
      return {
        title: "Producto no encontrado",
      };
    }

    // Construir el título con los atributos de la variante
    const attributeValues = variant.attributes
      .map((attr) => attr.value)
      .join(" - ");
    const title = `${product.name} - ${attributeValues}`;

    return {
      title,
      description:
        product.description || `${title} - Compra online en TechStore`,
      openGraph: {
        title,
        description:
          product.description || `${title} - Compra online en TechStore`,
        images:
          variant.images.length > 0 ? [variant.images[0].imageUrlNormal] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
    };
  }
}

export default async function ProductVariantPage({
  params,
}: ProductVariantPageProps) {
  const { id } = await params;
  const variantId = parseInt(id);

  if (isNaN(variantId)) {
    return (
      <Layout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ID de variante inválido
            </h1>
            <p className="text-gray-600 mb-6">
              El ID de la variante proporcionado no es válido.
            </p>
            <Link
              href="/"
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  try {
    // Obtener la variante específica
    const variant = await ProductVariantModel.getVariantById(variantId);

    if (!variant) {
      return (
        <Layout>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Variante no encontrada
              </h1>
              <p className="text-gray-600 mb-6">
                La variante del producto que estás buscando no existe o ha sido
                eliminada.
              </p>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Volver al inicio
                </Link>
                <Link
                  href="/search"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Buscar productos
                </Link>
              </div>
            </div>
          </main>
        </Layout>
      );
    }

    // Obtener el producto completo con todas sus variantes
    const productId =
      variant.productId || (variant as { product_id?: number }).product_id;

    const productDTO = await ProductModel.getProductById(productId!);

    if (!productDTO) {
      return (
        <Layout>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Producto no encontrado
              </h1>
              <p className="text-gray-600 mb-6">
                El producto asociado a esta variante no existe o ha sido
                eliminado.
              </p>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Volver al inicio
                </Link>
                <Link
                  href="/search"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Buscar productos
                </Link>
              </div>
            </div>
          </main>
        </Layout>
      );
    }

    // Hidratar el producto
    const { product } = hydrateProductDTO(productDTO);

    // Encontrar el índice de la variante específica en el array de variantes
    const selectedVariantIndex = product.variants.findIndex(
      (v) => v.id === variantId
    );

    if (selectedVariantIndex === -1) {
      return (
        <Layout>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Variante no disponible
              </h1>
              <p className="text-gray-600 mb-6">
                Esta variante específica no está disponible en este momento.
              </p>
              <div className="space-x-4">
                <Link
                  href={`/productos/${productDTO.id}`}
                  className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Ver producto principal
                </Link>
                <Link
                  href="/search"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Buscar productos
                </Link>
              </div>
            </div>
          </main>
        </Layout>
      );
    }

    return (
      <Layout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <ProductDetail
            product={product}
            initialSelectedVariantIndex={selectedVariantIndex}
          />
        </main>
      </Layout>
    );
  } catch (error) {
    console.error("Error loading product variant:", error);
    return (
      <Layout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Error al cargar el producto
            </h1>
            <p className="text-gray-600 mb-6">
              Ocurrió un error al intentar cargar la información del producto.
              Por favor, inténtalo de nuevo más tarde.
            </p>
            <div className="space-x-4">
              <Link
                href="/"
                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Volver al inicio
              </Link>
              <Link
                href="/search"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Buscar productos
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }
}
