import { schemaImageValidation } from '@/module/shared/lib/schemaImage'
import { Edit2, FilesIcon, Folder, Trash2 } from 'lucide-react'
import { type FC, useCallback, useEffect, useState } from 'react'
import { FileLibraryHeader } from './FileLibraryHeader'
import { FilePreviewCard } from './FilePreviewCard'
import { type Field, type FileServer } from './types/fileManagement'

interface ServerFilesProps {
  onAddFiles: () => void
  setOpenDialog: (value: boolean) => void
  addFilesToForm: (files: FileServer[]) => void
  field: Field
  currentPath: string
  setCurrentPath: (path: string) => void
  showCreateFolder: boolean
  setShowCreateFolder: (value: boolean) => void
  newFolderName: string
  setNewFolderName: (value: string) => void
  onCreateFolder: () => void
  errors?: any[]
  reloadTrigger?: number
}

export const ServerFiles: FC<ServerFilesProps> = ({
  onAddFiles,
  setOpenDialog,
  addFilesToForm,
  field,
  currentPath,
  setCurrentPath,
  showCreateFolder,
  setShowCreateFolder,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  errors,
  reloadTrigger
}) => {
  const [state, setState] = useState<{
    files: FileServer[]
    loading: boolean
    error: string | null
  }>({
    files: [],
    loading: true,
    error: null
  })
  const [selecteds, setSelecteds] = useState<string[]>([])
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [newFolderNameRename, setNewFolderNameRename] = useState('')

  const loadFilesServer = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const url = currentPath
        ? `/api/admin/library?path=${encodeURIComponent(currentPath)}`
        : '/api/admin/library'

      const response = await fetch(url)
      const json = await response.json()
      const dataFiles = json.files as FileServer[]

      const extensionAlloweds = field.options?.acceptImageTypes?.map((accept) =>
        accept.split('/').pop()
      )

      // Separar carpetas y archivos
      const folders = dataFiles.filter((item) => item.type === 'directory')
      const files = dataFiles.filter((item) => item.type === 'file')

      // Filtrar archivos por extensión permitida
      const filesFiltered = files.filter((file) =>
        extensionAlloweds?.includes(
          file.extension ? file.extension.toLowerCase().replace(/^\./, '') : ''
        )
      )

      // Combinar carpetas primero, luego archivos
      const allItems = [...folders, ...filesFiltered]

      setState({
        files: allItems,
        loading: false,
        error: null
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Error al cargar archivos'
      }))
      console.error('Error loading files:', error)
    }
  }, [field.options?.acceptImageTypes, currentPath])

  useEffect(() => {
    loadFilesServer()
  }, [loadFilesServer, reloadTrigger])

  const handleFileSelect = useCallback(
    (value: string, checked: boolean) => {
      setSelecteds((prev) => {
        if (field.multiple) {
          return checked ? [...prev, value] : prev.filter((v) => v !== value)
        }
        return checked ? [value] : []
      })
    },
    [field.multiple]
  )

  const handleFolderClick = (folderName: string) => {
    // Navegar a la carpeta
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
    console.log('📁 Navigating to folder:', {
      from: currentPath,
      folderName,
      to: newPath
    })
    setCurrentPath(newPath)
    setSelecteds([]) // Limpiar selección al cambiar de carpeta
  }

  const handleGoBack = () => {
    // Volver a la carpeta padre
    const pathParts = currentPath.split('/')
    pathParts.pop()
    const newPath = pathParts.join('/')
    setCurrentPath(newPath)
    setSelecteds([])
  }

  const handleRenameFolder = async (folderName: string) => {
    if (!newFolderNameRename.trim()) {
      alert('El nombre no puede estar vacío')
      return
    }

    try {
      const oldPath = currentPath ? `${currentPath}/${folderName}` : folderName

      const response = await fetch('/api/admin/library/folder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPath,
          newName: newFolderNameRename.trim()
        })
      })

      const json = await response.json()

      if (!json.success) {
        alert(json.message || 'Error al renombrar carpeta')
        return
      }

      // Mostrar mensaje con información de actualización de BD
      if (json.databaseUpdates && json.databaseUpdates.recordsUpdated > 0) {
        alert(
          `Carpeta renombrada exitosamente.\n\n` +
            `✅ Se actualizaron ${json.databaseUpdates.recordsUpdated} registro(s) en la base de datos.`
        )
      } else {
        alert('Carpeta renombrada exitosamente.')
      }

      // Limpiar y recargar
      setRenamingFolder(null)
      setNewFolderNameRename('')
      await loadFilesServer()
    } catch (error) {
      console.error('Error renaming folder:', error)
      alert('Error al renombrar la carpeta')
    }
  }

  const handleDeleteFolder = async (folderName: string) => {
    try {
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName

      // Primero obtener info de la carpeta para mostrar advertencia
      const response = await fetch('/api/admin/library/folder', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath })
      })

      const json = await response.json()

      if (!json.success) {
        alert(json.message || 'Error al eliminar carpeta')
        return
      }

      if (json.deleted) {
        const { files, folders, databaseRecords } = json.deleted
        let message = `Carpeta eliminada exitosamente.\n\n` +
          `Se eliminaron:\n` +
          `- ${files} archivo(s)\n` +
          `- ${folders} carpeta(s)`

        if (databaseRecords > 0) {
          message += `\n- ${databaseRecords} registro(s) de la base de datos`
        }

        alert(message)
      }

      // Recargar archivos
      await loadFilesServer()
    } catch (error) {
      console.error('Error deleting folder:', error)
      alert('Error al eliminar la carpeta')
    }
  }

  const confirmDeleteFolder = async (folderName: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar la carpeta "${folderName}"?\n\n` +
        `Esta acción eliminará la carpeta y todo su contenido de forma permanente.`
    )

    if (confirmed) {
      await handleDeleteFolder(folderName)
    }
  }

  const handleRemoveFile = async (file: FileServer) => {
    try {
      await fetch('/api/admin/library', {
        method: 'DELETE',
        body: JSON.stringify({ filePath: file.path })
      })
      await loadFilesServer() // Recargar archivos después de eliminar
    } catch (error) {
      console.error('Error removing file:', error)
    }
  }

  // Función para convertir la información del servidor a File
  async function serverFileToFile(serverFile: {
    name: string
    path: string
    type: string
    size: number
    extension: string
  }): Promise<File> {
    try {
      // Fetch el archivo usando la ruta
      const response = await fetch(serverFile.path)
      const blob = await response.blob()

      const mimeType = getMimeType(serverFile.extension)

      // Crear un nuevo archivo con la información del servidor
      return new File([blob], serverFile.name, {
        type: mimeType, // Usar el tipo MIME detectado
        lastModified: new Date().getTime()
      })
    } catch (error) {
      console.error('Error converting server file to File:', error)
      throw error
    }
  }

  function getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
      // Puedes agregar más tipos según necesites
    }

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
  }

  async function convertServerFilesToFileList(
    serverFiles: any[]
  ): Promise<FileList> {
    const files = await Promise.all(
      serverFiles.map(async (serverFile) => await serverFileToFile(serverFile))
    )

    // Crear un DataTransfer para generar un FileList
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))

    return dataTransfer.files
  }

  const handleFinish = async () => {
    try {
      const filesSelecteds = state.files.filter((item, index) =>
        selecteds.includes(index.toString()) && item.type === 'file'
      )

      if (filesSelecteds.length === 0) {
        setErrors([{ message: 'Debes seleccionar al menos un archivo' }])
        return
      }

      const fileList = await convertServerFilesToFileList(filesSelecteds)

      const singleFileSchema = schemaImageValidation({
        acceptImageTypes: field.options?.acceptImageTypes,
        dimensions: field.options?.dimensions,
        maxFileSize: field.options?.maxFileSize,
        multiple: field.multiple ?? false
      })

      // Validar con el schema
      await singleFileSchema.parseAsync(fileList)
      addFilesToForm(filesSelecteds)
    } catch (error: any) {
      setErrors(JSON.parse(error.message))
    }
  }

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      )
    }

    if (state.error) {
      return (
        <div className="flex h-[200px] flex-col items-center justify-center text-red-500">
          <p>Error al cargar los archivos</p>
          <button onClick={loadFilesServer} className="mt-2 text-sm underline">
            Intentar de nuevo
          </button>
        </div>
      )
    }

    if (state.files.length === 0) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <FilesIcon size={40} className="text-gray-400" />
          <p className="text-gray-500">
            {currentPath ? 'Carpeta vacía' : 'Librería de archivos vacía'}
          </p>
          <p className="text-sm text-gray-400">
            Usa el botón "Añadir más archivos" para subir contenido
          </p>
        </div>
      )
    }

    return (
      <div className="grid max-h-[330px] w-full grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {state.files.map((item, index) => {
          // Si es carpeta, mostrar card de carpeta
          if (item.type === 'directory') {
            const isRenaming = renamingFolder === item.name

            return (
              <div
                key={`folder-${item.name}-${index}`}
                className="group relative flex flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100 p-6 transition-all hover:border-blue-400 hover:shadow-md"
              >
                {/* Botones de acción */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setRenamingFolder(item.name)
                      setNewFolderNameRename(item.name)
                    }}
                    className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                    title="Renombrar carpeta"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      confirmDeleteFolder(item.name)
                    }}
                    className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
                    title="Eliminar carpeta"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Contenido de la carpeta */}
                <div
                  onClick={() => !isRenaming && handleFolderClick(item.name)}
                  className={!isRenaming ? 'cursor-pointer' : ''}
                >
                  <Folder
                    size={48}
                    className="text-gray-400 transition-colors group-hover:text-blue-500"
                  />
                </div>

                {/* Nombre de carpeta o input de renombrado */}
                {isRenaming ? (
                  <div className="mt-2 flex w-full flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={newFolderNameRename}
                      onChange={(e) => setNewFolderNameRename(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameFolder(item.name)
                        }
                        if (e.key === 'Escape') {
                          setRenamingFolder(null)
                          setNewFolderNameRename('')
                        }
                      }}
                      className="w-full rounded border border-blue-500 px-2 py-1 text-center text-xs focus:outline-none"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRenameFolder(item.name)}
                        className="flex-1 rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setRenamingFolder(null)
                          setNewFolderNameRename('')
                        }}
                        className="flex-1 rounded bg-gray-400 px-2 py-1 text-xs text-white hover:bg-gray-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-center text-sm font-medium text-gray-700">
                    {item.name}
                  </p>
                )}
              </div>
            )
          }

          // Si es archivo, mostrar FilePreviewCard normal
          return (
            <FilePreviewCard
              key={`${item.path}-${index}`}
              onChangeInput={(e) => {
                handleFileSelect(e.target.value, e.target.checked)
              }}
              onClickRemove={async () => {
                await handleRemoveFile(item)
              }}
              multiple={field.multiple}
              value={index.toString()}
              checked={selecteds.includes(index.toString())}
              name={item.name}
              format={item.extension?.split('.').pop() ?? ''}
              id={index.toString()}
              isImage={/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(item.name)}
              url={item.path}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="py-4 !pb-0">
      <FileLibraryHeader
        field={field}
        onAddFiles={onAddFiles}
        currentPath={currentPath}
        onGoBack={handleGoBack}
        showCreateFolder={showCreateFolder}
        setShowCreateFolder={setShowCreateFolder}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onCreateFolder={onCreateFolder}
        errors={errors}
      />

      <div className="p-8">
        <div className="flex h-full min-h-[200px] items-center">
          {renderContent()}
        </div>
      </div>

      <div className="w-full bg-slate-200">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => {
              setOpenDialog(false)
            }}
            className="rounded border bg-white px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={selecteds.length === 0 || state.loading}
            className="rounded border bg-gray-800 px-4 py-2 text-white disabled:bg-gray-400"
          >
            Aceptar ({selecteds.length} seleccionados)
          </button>
        </div>
      </div>
    </div>
  )
}
