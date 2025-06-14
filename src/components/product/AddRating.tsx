"use client";
import LoginForm from "@/components/ui/LoginForm";
import Modal from "@/components/ui/Modal";
import RegisterForm from "@/components/ui/RegisterForm";
import { ProductVariants, Products } from "@/types/domain";
import { Star, Upload, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

interface AddRatingProps {
  variant: ProductVariants;
  product: Products;
  onRatingAdded: () => void;
}

const AddRating: React.FC<AddRatingProps> = ({
  variant,
  product,
  onRatingAdded
}) => {
  const { status } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Simular la carga de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => {
        // En un caso real, aquí subiríamos la imagen a un servidor
        // y obtendríamos la URL. Por ahora, usamos URL.createObjectURL
        return URL.createObjectURL(file);
      });

      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (rating === 0) {
      setError("Por favor, selecciona una valoración");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: variant.id,
          productId: variant.productId,
          rating,
          title: title.trim() || undefined,
          review: review.trim() || undefined,
          verifiedPurchase: 1, // 1 para true, siguiendo tu schema GraphQL
          images: images.length > 0 ? images : undefined,
          // Información adicional que puede ser útil
          productName: product.name,
          variantSku: variant.sku,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al enviar la valoración");
      }

      // Limpiar el formulario
      setRating(0);
      setTitle("");
      setReview("");
      setImages([]);
      setSuccess(true);

      // Notificar al componente padre
      onRatingAdded();

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al enviar la valoración");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener el nombre completo de la variante para mostrar en el formulario
  const getVariantDisplayName = () => {
    let displayName = product.name;

    if (variant.variantAttributeOptions && variant.variantAttributeOptions.length > 0) {
      const attributes = variant.variantAttributeOptions
        .filter(attr => attr?.attributeOption?.value)
        .map(attr => attr!.attributeOption!.value)
        .join(", ");

      if (attributes) {
        displayName += ` - ${attributes}`;
      }
    }

    return displayName;
  };

  return (
    <div className="pt-6 mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Deja tu valoración</h2>
        <div className="text-sm text-gray-600">
          Producto: <span className="font-medium">{getVariantDisplayName()}</span>
        </div>
      </div>

      {!isAuthenticated ? (
        // Mostrar mensaje de autenticación requerida
        <div className="bg-blue-50 border border-blue-200 p-6 text-center">
          <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inicia sesión para valorar este producto
          </h3>
          <p className="text-gray-600 mb-4">
            Necesitas tener una cuenta para poder dejar tu valoración y ayudar a otros usuarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md font-medium transition-colors"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      ) : success ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          ¡Gracias por tu valoración! Tu opinión es muy importante para
          nosotros.
        </div>
      ) : isLoading ? (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estrellas para valoración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Cómo valorarías este producto?*
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${(hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="mt-1 text-sm text-gray-600">
                {rating === 1 && "Muy malo"}
                {rating === 2 && "Malo"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bueno"}
                {rating === 5 && "Excelente"}
              </div>
            )}
          </div>

          {/* Título */}
          <div>
            <label
              htmlFor="rating-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título
            </label>
            <input
              type="text"
              id="rating-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume tu experiencia en una frase"
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/100 caracteres
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label
              htmlFor="rating-review"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comentario
            </label>
            <textarea
              id="rating-review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="¿Qué te gustó o no te gustó? ¿Para qué usaste este producto?"
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {review.length}/500 caracteres
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Añadir imágenes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500">Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Puedes subir hasta 5 imágenes (opcional)
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Información de stock para contexto */}
          {variant.stock !== undefined && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Stock disponible: {variant.stock} unidades
            </div>
          )}

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar valoración"}
            </button>
          </div>
        </form>
      )}

      {/* Modal de login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Iniciar sesión"
      >
        <LoginForm
          onSuccess={() => {
            setIsLoginModalOpen(false);
            // La sesión se actualizará automáticamente
          }}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      </Modal>

      {/* Modal de registro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Crear cuenta"
      >
        <RegisterForm
          onSuccess={() => {
            setIsRegisterModalOpen(false);
            // La sesión se actualizará automáticamente
          }}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </Modal>
    </div>
  );
};

export default AddRating;
