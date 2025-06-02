import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import ProductDetail from "@/components/product/ProductDetail";
import ProductService from "@/services/productService";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await ProductService.getProductById(parseInt(params.id));

  if (!product) {
    return {
      title: "Producto no encontrado | AJK E-commerce",
      description:
        "El producto que estás buscando no existe o ha sido eliminado.",
    };
  }

  return {
    title: `${product.name} | AJK E-commerce`,
    description: product.description || `Detalles del producto ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id);
  const product = await ProductService.getProductById(productId);
  const homeData = await getHomeData();

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header megaMenuCategories={homeData.megaMenuCategories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {product ? (
          <ProductDetail product={product} />
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Producto no encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              El producto que estás buscando no existe o ha sido eliminado.
            </p>
            <Link
              href="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </main>
      <Footer
        sections={homeData.footerSections}
        socialLinks={homeData.socialLinks}
      />
    </div>
  );
}
