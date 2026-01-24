import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import {
  ALLOWED_FORMATS_TEXT,
  MAX_DIMENSIONS_TEXT,
  MAX_SIZE_TEXT,
  type ProcessingProgress
} from './utils/imageProcessor'

interface ImageUploadProps {
  images: string[]
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  maxImages?: number
  isProcessing?: boolean
  progress?: ProcessingProgress | null
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImageUpload,
  onRemoveImage,
  maxImages = 5,
  isProcessing = false,
  progress = null
}) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Añadir imágenes
      </label>

      {/* Barra de progreso */}
      {isProcessing && progress && (
        <div className="mb-3 rounded-lg bg-blue-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-700">
              Procesando {progress.current} de {progress.total}: {progress.fileName}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-blue-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

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
              disabled={isProcessing}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && !isProcessing && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="mt-1 text-xs text-gray-500">Subir</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        )}
        {isProcessing && (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-blue-300 bg-blue-50">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      <div className="space-y-0.5 text-xs text-gray-500">
        <p>Máximo {maxImages} imágenes. Formatos: {ALLOWED_FORMATS_TEXT}</p>
        <p>Las imágenes se redimensionan a {MAX_DIMENSIONS_TEXT} y {MAX_SIZE_TEXT} máx.</p>
      </div>
    </div>
  )
}
