import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import ProductVariantModel from "@/models/ProductVariantModel";
import ProductModel from "@/models/ProductModel";
import { hydrateProductDTO } from "@/utils/hydrators/product-card.hydrator";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";
import CategoryModel from "@/models/CategoryModel";

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
    notFound();
  }

  try {
    // Obtener la variante específica
    const variant = await ProductVariantModel.getVariantById(variantId);

    if (!variant) {
      notFound();
    }

    // Obtener el producto completo con todas sus variantes
    const productId =
      variant.productId || (variant as { product_id?: number }).product_id;

    const productDTO = await ProductModel.getProductById(productId!);

    if (!productDTO) {
      notFound();
    }

    // Hidratar el producto
    const { product } = hydrateProductDTO(productDTO);

    // Encontrar el índice de la variante específica en el array de variantes
    const selectedVariantIndex = product.variants.findIndex(
      (v) => v.id === variantId
    );

    if (selectedVariantIndex === -1) {
      notFound();
    }

    // Obtener datos para el layout
    const homeData = await getHomeData();
    const categories = await CategoryModel.getCategories();

    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Header categories={categories} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <ProductDetail
            product={product}
            initialSelectedVariantIndex={selectedVariantIndex}
          />
        </main>
        <Footer
          sections={homeData.footerSections}
          socialLinks={homeData.socialLinks}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading product variant:", error);
    notFound();
  }
}
