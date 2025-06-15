import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImageUpload,
  onRemoveImage,
  maxImages = 5,
}) => {
  return (
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
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="mt-1 text-xs text-gray-500">Subir</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Puedes subir hasta {maxImages} imágenes (opcional)
      </p>
    </div>
  );
};