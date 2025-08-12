import { schemaImageValidation } from '@/lib/admin/schemaImage'
import { FilesIcon, Plus } from 'lucide-react'
import { FC, useCallback, useEffect, useState } from 'react'
import { Button } from '../Form/Input/Button'
import { renderOptionsFile } from './BrowserFiles'
import { FilePreviewCard } from './FilePreviewCard'
import { Field, FileServer } from './types/fileManagement'

interface ServerFilesProps {
  onAddFiles: () => void
  setOpenDialog: (value: boolean) => void
  addFilesToForm: (files: FileServer[]) => void
  field: Field
}

export const ServerFiles: FC<ServerFilesProps> = ({
  onAddFiles,
  setOpenDialog,
  addFilesToForm,
  field
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
  const [errors, setErrors] = useState<any[]>()

  const loadFilesServer = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch('/api/admin/library')
      const json = await response.json()
      const dataFiles = json.files as FileServer[]

      const extensionAlloweds = field.options?.acceptImageTypes?.map((accept) =>
        accept.split('/').pop()
      )

      const dataFilesFiltered = dataFiles.filter((file) =>
        extensionAlloweds?.includes(
          file.extension ? file.extension.toLowerCase().replace(/^\./, '') : ''
        )
      )

      setState({
        files: dataFilesFiltered,
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
  }, [field.options?.acceptImageTypes])

  useEffect(() => {
    loadFilesServer()
  }, [loadFilesServer])

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
    serverFiles: Array<any>
  ): Promise<FileList> {
    const files = await Promise.all(
      serverFiles.map((serverFile) => serverFileToFile(serverFile))
    )

    // Crear un DataTransfer para generar un FileList
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))

    return dataTransfer.files
  }

  const handleFinish = async () => {
    try {
      const filesSelecteds = state.files.filter((_, index) =>
        selecteds.includes(index.toString())
      )

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

    if (!state.files.length) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <FilesIcon size={40} />
          <p>Librería de archivos vacía</p>
          <Button onClick={onAddFiles} type="button">
            <div className="flex items-center gap-1">
              <Plus size={20} />
              <div>Añadir nuevo archivo</div>
            </div>
          </Button>
        </div>
      )
    }

    return (
      <div className="grid max-h-[330px] w-full grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {state.files.map((file, index) => (
          <FilePreviewCard
            key={`${file.path}-${index}`}
            onChangeInput={(e) =>
              handleFileSelect(e.target.value, e.target.checked)
            }
            onClickRemove={() => handleRemoveFile(file)}
            multiple={field.multiple}
            value={index.toString()}
            checked={selecteds.includes(index.toString())}
            name={file.name}
            format={file.extension.split('.').pop() ?? ''}
            id={index.toString()}
            isImage={/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name)}
            url={file.path}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="py-4 !pb-0">
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
      </div>

      <div className="p-8">
        <div className="flex h-full min-h-[200px] items-center">
          {renderContent()}
        </div>
      </div>

      <div className="w-full bg-slate-200">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => setOpenDialog(false)}
            className="rounded border bg-white px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={!selecteds.length || state.loading}
            className="rounded border bg-gray-800 px-4 py-2 text-white disabled:bg-gray-400"
          >
            Aceptar ({selecteds.length} seleccionados)
          </button>
        </div>
      </div>
    </div>
  )
}
