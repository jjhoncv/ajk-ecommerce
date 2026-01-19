import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  maxImages?: number
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImageUpload,
  onRemoveImage,
  maxImages = 5
}) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Añadir imágenes
      </label>
      <div className="mb-2 flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200"
          >
            <Image
              src={image}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => { onRemoveImage(index) }}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:bg-gray-50">
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
  )
}
