import { ArrowLeft, FolderPlus } from 'lucide-react'
import { type FC } from 'react'
import { renderOptionsFile } from './BrowserFiles'
import { type Field } from './types/fileManagement'

interface FileLibraryHeaderProps {
  field: Field
  onAddFiles: () => void
  currentPath: string
  onGoBack: () => void
  showCreateFolder: boolean
  setShowCreateFolder: (value: boolean) => void
  newFolderName: string
  setNewFolderName: (value: string) => void
  onCreateFolder: () => void
  errors?: any[]
}

export const FileLibraryHeader: FC<FileLibraryHeaderProps> = ({
  field,
  onAddFiles,
  currentPath,
  onGoBack,
  showCreateFolder,
  setShowCreateFolder,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  errors
}) => {
  return (
    <div className="w-full gap-3 border-b px-4 pb-4">
      <div className="flex w-full items-center justify-between">
        <div>{field.options && renderOptionsFile(field.options)}</div>
        <button
          onClick={onAddFiles}
          className="rounded border border-transparent bg-sky-600 px-4 py-2 text-white"
        >
          Añadir más archivos
        </button>
      </div>
      {(errors && errors?.length > 0 && (
        <div className="mt-2 text-sm text-red-500">
          {errors.map((error) => error.message).join('')}
        </div>
      )) ||
        ''}

      {/* Crear carpeta */}
      <div className="mt-3">
        {!showCreateFolder ? (
          <button
            onClick={() => { setShowCreateFolder(true) }}
            className="flex items-center gap-1 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          >
            <FolderPlus size={16} />
            Crear carpeta
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => { setNewFolderName(e.target.value) }}
              placeholder="Nombre de la carpeta"
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCreateFolder()
                }
                if (e.key === 'Escape') {
                  setShowCreateFolder(false)
                  setNewFolderName('')
                }
              }}
              autoFocus
            />
            <button
              onClick={onCreateFolder}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Crear
            </button>
            <button
              onClick={() => {
                setShowCreateFolder(false)
                setNewFolderName('')
              }}
              className="rounded bg-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Breadcrumb de navegación */}
      <div className="mt-3 flex items-center gap-2">
        {currentPath && (
          <button
            onClick={onGoBack}
            className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
        )}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Ubicación:</span> /uploads
          {currentPath && `/${currentPath}`}
        </div>
      </div>
    </div>
  )
}
