"use client";
import React from "react";
import Image from "next/image";
import { ProductDTO } from "@/dto";

interface ProductAttributesProps {
  product: ProductDTO;
  selectedVariantIndex: number;
  setSelectedVariantIndex: (index: number) => void;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  product,
  selectedVariantIndex,
  setSelectedVariantIndex,
}) => {
  const variants = product.variants;
  const selectedVariant = variants[selectedVariantIndex];

  // Agrupar atributos por nombre
  const attributeGroups: Record<string, Set<string>> = {};
  const attributeDisplayTypes: Record<string, string> = {};

  // Recopilar todos los atributos y sus tipos de visualización
  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!attributeGroups[attr.name]) {
        attributeGroups[attr.name] = new Set();
      }
      attributeGroups[attr.name].add(attr.value);

      // Guardar el tipo de visualización para este atributo
      if (attr.display_type) {
        attributeDisplayTypes[attr.name] = attr.display_type;
      }
    });
  });

  // Obtener los valores de atributos seleccionados actualmente
  const selectedAttributes = selectedVariant.attributes.reduce((acc, attr) => {
    acc[attr.name] = attr.value;
    return acc;
  }, {} as Record<string, string>);

  // Encontrar la variante que coincide con los atributos seleccionados
  const findVariantByAttributes = (
    attributes: Record<string, string>
  ): number => {
    return variants.findIndex((variant) => {
      // Verificar si todos los atributos seleccionados coinciden con esta variante
      const variantAttributes = variant.attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>);

      // Comprobar si todos los atributos seleccionados coinciden
      return Object.entries(attributes).every(
        ([name, value]) => variantAttributes[name] === value
      );
    });
  };

  // Manejar el cambio de un atributo
  const handleAttributeChange = (name: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [name]: value };
    const variantIndex = findVariantByAttributes(newAttributes);

    if (variantIndex !== -1) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  // Verificar si un valor de atributo está disponible
  const isAttributeValueAvailable = (name: string, value: string): boolean => {
    // Crear un conjunto de atributos con el valor seleccionado
    const testAttributes = { ...selectedAttributes, [name]: value };

    // Verificar si existe alguna variante con estos atributos
    return variants.some((variant) => {
      const variantAttributes = variant.attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>);

      return Object.entries(testAttributes).every(
        ([attrName, attrValue]) => variantAttributes[attrName] === attrValue
      );
    });
  };

  // Renderizar un atributo según su tipo de visualización
  const renderAttributeSelector = (name: string, values: string[]) => {
    const displayType = attributeDisplayTypes[name] || "select";

    switch (displayType.toLowerCase()) {
      case "color":
        return (
          <div key={name} className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(values).map((value) => {
                const isSelected = selectedAttributes[name] === value;
                const isAvailable = isAttributeValueAvailable(name, value);

                // Buscar imagen del atributo para este color
                const attributeImage = selectedVariant.attributeImages?.find(
                  (img) =>
                    img.option.value === value && img.attribute.name === name
                );

                return (
                  <button
                    key={value}
                    onClick={() =>
                      isAvailable && handleAttributeChange(name, value)
                    }
                    className={`relative w-12 h-12 rounded-lg overflow-hidden ${
                      isSelected
                        ? "ring-2 ring-indigo-600 ring-offset-2"
                        : "ring-1 ring-gray-300 hover:ring-gray-400"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAvailable}
                    title={value}
                    aria-label={`${name}: ${value}`}
                  >
                    {attributeImage ? (
                      <Image
                        src={attributeImage.imageUrlThumb}
                        alt={attributeImage.altText || `${name}: ${value}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-lg"
                        style={{ backgroundColor: value.toLowerCase() }}
                      />
                    )}

                    {/* Indicador de selección */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}

                    {/* Nombre del color */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {value}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "pills":
        return (
          <div key={name} className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(values).map((value) => {
                const isSelected = selectedAttributes[name] === value;
                const isAvailable = isAttributeValueAvailable(name, value);

                return (
                  <button
                    key={value}
                    onClick={() =>
                      isAvailable && handleAttributeChange(name, value)
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAvailable}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "radio":
        return (
          <div key={name} className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from(values).map((value) => {
                const isSelected = selectedAttributes[name] === value;
                const isAvailable = isAttributeValueAvailable(name, value);

                return (
                  <button
                    key={value}
                    onClick={() =>
                      isAvailable && handleAttributeChange(name, value)
                    }
                    className={`px-3 py-2 border rounded text-sm ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAvailable}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );

      // Caso por defecto: select
      default:
        return (
          <div key={name} className="mb-4">
            <label
              htmlFor={`select-${name}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {name}
            </label>
            <select
              id={`select-${name}`}
              value={selectedAttributes[name]}
              onChange={(e) => handleAttributeChange(name, e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Array.from(values).map((value) => {
                const isAvailable = isAttributeValueAvailable(name, value);

                return (
                  <option key={value} value={value} disabled={!isAvailable}>
                    {value} {!isAvailable && "(No disponible)"}
                  </option>
                );
              })}
            </select>
          </div>
        );
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Opciones</h2>
      {Object.entries(attributeGroups).map(([name, valuesSet]) =>
        renderAttributeSelector(name, Array.from(valuesSet))
      )}
    </div>
  );
};

export default ProductAttributes;
