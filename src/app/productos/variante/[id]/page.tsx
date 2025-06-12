import productModel from "@/backend/product";
import productVariantModel from "@/backend/product-variant";
import Layout from "@/components/layout/Layout";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    const variant = await productVariantModel.getVariantById(variantId);

    if (!variant) {
      return {
        title: "Variante no encontrada",
      };
    }

    const product = await productModel.getProductById(variant.productId);

    if (!product) {
      return {
        title: "Producto no encontrado",
      };
    }

    // Construir el título con los atributos de la variante
    const attributeValues = variant.variantAttributeOptions
      .map((vao) => vao.attributeOptions?.[0]?.value)
      .filter(Boolean)
      .join(" - ");
    const title = `${product.name} - ${attributeValues}`;

    // Obtener la primera imagen disponible
    const firstImage = variant.attributeImages?.[0]?.imageUrlNormal ||
      variant.variantImages?.[0]?.imageUrlNormal;

    return {
      title,
      description:
        product.description || `${title} - Compra online en TechStore`,
      openGraph: {
        title,
        description:
          product.description || `${title} - Compra online en TechStore`,
        images: firstImage ? [firstImage] : [],
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
        <main className="max-w-[1920px] mx-auto px-12 py-8">
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
    const variant = await productVariantModel.getVariantById(variantId);

    if (!variant) {
      return (
        <Layout>
          <main className="max-w-[1920px] mx-auto px-12 py-8">
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

    // Obtener el producto completo
    const product = await productModel.getProductById(variant.productId);

    if (!product) {
      return (
        <Layout>
          <main className="max-w-[1920px] mx-auto px-12 py-8">
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

    // Obtener atributos de la variante
    const variantAttributes = variant.variantAttributeOptions.map(vao => ({
      name: vao.attributeOptions?.[0]?.value || '',
      attributeId: vao.attributeOptions?.[0]?.attributeId
    }));

    // Obtener imagen principal
    const mainImage = variant.attributeImages.find(img =>
      img.attributeOptionId === variant.variantAttributeOptions[0]?.attributeOptionId
    ) || variant.attributeImages[0];

    return (
      <Layout>
        <main className="max-w-[1920px] mx-auto px-12 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
              <li>/</li>
              <li><Link href="/search" className="hover:text-primary">Productos</Link></li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {mainImage && mainImage.imageUrlNormal && (
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={mainImage.imageUrlNormal}
                    alt={mainImage.altText || 'Imagen del producto'}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              )}

              {/* Thumbnails */}
              {variant.attributeImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {variant.attributeImages.map((image) => (
                    image.imageUrlThumb && (
                      <div key={image.id} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer">
                        <Image
                          src={image.imageUrlThumb}
                          alt={image.altText || 'Imagen del producto'}
                          width={150}
                          height={150}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">
                  SKU: {variant.sku}
                </p>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-primary">
                    S/ {variant.price}
                  </span>
                </div>
              </div>

              {/* Atributos */}
              {variantAttributes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Características:</h3>
                  <div className="space-y-2">
                    {variantAttributes.map((attr, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                          {attr.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Stock disponible:</span>
                  <span className={`text-sm font-medium ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variant.stock > 0 ? `${variant.stock} unidades` : 'Agotado'}
                  </span>
                </div>
              </div>

              {/* Ratings */}
              {variant.ratings && variant.ratings.averageRating && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(variant.ratings!.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {variant.ratings.averageRating} ({variant.ratings.totalRatings} reseñas)
                    </span>
                  </div>
                </div>
              )}

              {/* Descripción */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Descripción:</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-4">
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={variant.stock === 0}
                >
                  {variant.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>

                <div className="flex space-x-4">
                  <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                    Agregar a favoritos
                  </button>
                  <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                    Comparar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  } catch (error) {
    console.error("Error loading product variant:", error);
    return (
      <Layout>
        <main className="max-w-[1920px] mx-auto px-12 py-8">
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
