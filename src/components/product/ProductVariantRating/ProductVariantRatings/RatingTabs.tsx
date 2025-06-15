interface RatingTabsProps {
  activeTab: "variant" | "product";
  onTabChange: (tab: "variant" | "product") => void;
  variantCount: number;
  productCount: number;
}

export const RatingTabs: React.FC<RatingTabsProps> = ({
  activeTab,
  onTabChange,
  variantCount,
  productCount,
}) => {
  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "variant"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => onTabChange("variant")}
        >
          Esta variante ({variantCount})
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "product"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => onTabChange("product")}
        >
          Todas las variantes ({productCount})
        </button>
      </div>
    </div>
  );
};