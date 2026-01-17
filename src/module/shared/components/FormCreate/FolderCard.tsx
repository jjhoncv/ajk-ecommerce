import { FolderIcon, Trash2 } from 'lucide-react'
import React, { type FC } from 'react'
import { type Folder } from './types/fileManagement'

interface FolderCardProps {
  folder: Folder
  onOpen: () => void
  onDelete?: () => void
  isDragOver?: boolean
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
}

export const FolderCard: FC<FolderCardProps> = ({
  folder,
  onOpen,
  onDelete,
  isDragOver = false,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-lg border transition-all ${
        isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-slate-400'
      } `}
      onClick={onOpen}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute right-2 top-2 z-10 rounded-full p-1 transition-colors hover:bg-red-100"
          title="Eliminar carpeta"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      )}

      <div className="relative flex h-[120px] flex-col items-center justify-center">
        <FolderIcon
          size={50}
          className={`${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
          strokeWidth={1}
        />
        <span className="mt-2 text-xs text-gray-500">
          {folder.itemCount} {folder.itemCount === 1 ? 'elemento' : 'elementos'}
        </span>
      </div>

      <div className="border-t border-slate-200 bg-white p-2">
        <div className="flex flex-col">
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium">
            {folder.name}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(folder.modifiedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}
