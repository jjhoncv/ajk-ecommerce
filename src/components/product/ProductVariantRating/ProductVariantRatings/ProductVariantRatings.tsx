"use client";
import { Products, ProductVariants } from "@/types/domain";
import React from "react";
import { ProductVariantRatingAdd } from "../ProductVariantRatingAdd/ProductVariantRatingAdd";
import { EmptyRatings } from "./EmptyRatings";
import { useRatingsData } from "./hooks/useRatingsData";
import { LoadingState } from "./LoadingState";
import { RatingList } from "./RatingList";
import { RatingSummary } from "./RatingSummary";
import { RatingTabs } from "./RatingTabs";

interface ProductVariantRatingsProps {
  variant: ProductVariants;
  product: Products;
}

export const ProductVariantRatings: React.FC<ProductVariantRatingsProps> = ({
  variant,
  product
}) => {
  const {
    ratings,
    loading,
    activeTab,
    page,
    hasNoRatings,
    handleTabChange,
    handlePageChange,
    handleRatingAdded,
  } = useRatingsData({
    variantId: variant.id,
    productId: variant.productId,
  });

  const renderContent = () => {
    if (loading && !ratings) {
      return <LoadingState />;
    }

    if (hasNoRatings) {
      return <EmptyRatings />;
    }

    if (!ratings) return null;

    return (
      <>
        <RatingSummary summary={ratings.summary} />

        <RatingTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variantCount={activeTab === "variant" ? ratings.summary.totalRatings : 0}
          productCount={activeTab === "product" ? ratings.summary.totalRatings : 0}
        />

        <RatingList
          ratings={ratings.ratings}
          currentPage={page}
          totalPages={ratings.totalPages}
          onPageChange={handlePageChange}
          activeTab={activeTab}
        />
      </>
    );
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold mb-6">Valoraciones</h2>

      {renderContent()}

      {/* Formulario para añadir valoración - SIEMPRE se muestra */}
      <ProductVariantRatingAdd
        variant={variant}
        product={product}
        onRatingAdded={handleRatingAdded}
      />
    </div>
  );
};