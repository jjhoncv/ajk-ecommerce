import { FetchCustomBody } from '@/lib/admin/FetchCustomBody'
import { formatBytes } from '@/lib/admin/formatBytes'
import { schemaImageValidation } from '@/lib/admin/schemaImage'
import { ImagePlusIcon, Trash2, UploadCloud } from 'lucide-react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { Button } from '../Form/Input/Button'
import { FilePreview, FilePreviewCard } from './FilePreviewCard'
import { Field, FileOptions } from './types/fileManagement'

interface BrowserFilesProps {
  setOpenDialog: (value: boolean) => void
  setOpenBrowserFiles: (value: boolean) => void
  field: Field
}

export const renderOptionsFile = (options: FileOptions) => {
  return (
    <>
      {options.acceptImageTypes
        ?.map((accept) => accept.split('/')[1].toUpperCase())
        .join(', ')}
      {options.maxFileSize && <>, Max {formatBytes(options.maxFileSize)}</>}

      <br />
      {options.dimensions && (
        <>
          {`Min: ${options.dimensions.min.width}x${options.dimensions.min.height}  píxeles, `}
          {`Max: ${options.dimensions.max.width}x${options.dimensions.max.height}  píxeles`}
        </>
      )}
    </>
  )
}

export const BrowserFiles: FC<BrowserFilesProps> = ({
  setOpenDialog,
  field,
  setOpenBrowserFiles
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [selecteds, setSelecteds] = useState<string[]>([])

  // Crear el schema para un solo archivo
  const singleFileSchema = schemaImageValidation({
    acceptImageTypes: field.options?.acceptImageTypes,
    dimensions: field.options?.dimensions,
    maxFileSize: field.options?.maxFileSize,
    multiple: false // Importante: validamos de a un archivo
  })

  const newPreviews: FilePreview[] = []

  const validateSingleFile = async (
    file: File
  ): Promise<{ isValid: boolean; errors: string[] }> => {
    try {
      // Crear FileList con un solo archivo
      const dt = new DataTransfer()
      dt.items.add(file)

      // Validar usando el schema
      await singleFileSchema.parseAsync(dt.files)
      return { isValid: true, errors: [] }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map((e) => e.message)
        }
      }
      return {
        isValid: false,
        errors: ['Error al validar el archivo']
      }
    }
  }

  const validateFiles = async (files: FileList) => {
    setIsValidating(true)

    try {
      for (const file of Array.from(files)) {
        const preview = URL.createObjectURL(file)
        const validation = await validateSingleFile(file)
        newPreviews.push({
          id: uuidv4(),
          file,
          preview,
          isValid: validation.isValid,
          errors: validation.errors
        })
      }

      // Limpiar previews anteriores
      previews.forEach((preview) => URL.revokeObjectURL(preview.preview))
      setPreviews(newPreviews)
    } catch (error) {
      console.error('Error validating files:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    if (!field.multiple && files.length > 1) {
      const dt = new DataTransfer()
      dt.items.add(files[0])
      await validateFiles(dt.files)
    } else {
      await validateFiles(files)
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const validFiles = previews.filter((p) => p.isValid).map((p) => p.file)
    if (validFiles.length > 0) {
      const dt = new DataTransfer()
      validFiles.forEach((file) => dt.items.add(file))

      const formData = new FormData()
      formData.append('name', field.key)

      const files = dt.files
      if (files instanceof FileList) {
        Array.from(files).forEach((file, index) => {
          formData.append(`${field.key}[]`, file)
        })
      }
      try {
        await FetchCustomBody({
          data: formData,
          method: 'POST',
          url: '/api/admin/library',
          withFiles: true
        })
        setOpenBrowserFiles(false)
      } catch (e: any) {
        console.error(e.message)
      }
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.preview))
    }
  }, [])

  return (
    <form onSubmit={onSubmit}>
      <div className="p-8">
        <div className="flex h-full min-h-[200px] w-full items-center">
          <div className="relative flex w-full flex-col items-center justify-center gap-2">
            {previews.length === 0 && (
              <div
                id="inputUpload"
                className="w-full rounded border border-slate-100 bg-slate-100 py-8"
              >
                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlusIcon size={40} />
                  <p>Arrastra y suelta aquí ó</p>
                  {field.options && (
                    <p className="flex w-full justify-center text-center text-sm">
                      {field.options && renderOptionsFile(field.options)}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={() => {
                      inputFileRef.current?.click()
                    }}
                  >
                    Examinar archivos
                  </Button>
                </div>
              </div>
            )}

            <input
              accept={field.options?.acceptImageTypes?.join(',')}
              onChange={onChangeInput}
              type="file"
              multiple={field.multiple}
              className="hidden cursor-pointer"
              ref={inputFileRef}
            />

            {isValidating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
              </div>
            )}

            {/* Grid de previsualizaciones */}
            {previews.length > 0 && (
              <>
                <div className="flex w-full justify-between gap-2 border-b border-slate-300 pb-4">
                  <div>
                    <p className="text-sm">
                      {field.options && renderOptionsFile(field.options)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {selecteds.length > 0 && (
                      <div
                        onClick={() => {
                          setPreviews(
                            previews.filter(
                              (previews) => !selecteds.includes(previews.id)
                            )
                          )
                        }}
                        className="flex items-center gap-1 rounded border p-2 px-4"
                      >
                        <Trash2 size={18} />
                        <p>Eliminar</p>
                      </div>
                    )}

                    <div
                      className="cursor-pointer rounded border bg-gray-800 px-4 py-2 text-white hover:bg-gray-600"
                      onClick={() => {
                        inputFileRef.current?.click()
                      }}
                    >
                      Examinar archivos
                    </div>
                  </div>
                </div>
                <div className="flex w-full">
                  {previews.length > 0 && (
                    <div className="grid max-h-[330px] w-full grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                      {previews.map((preview, index) => (
                        <FilePreviewCard
                          value={preview.id}
                          onChangeInput={(e) => {
                            if (e.target.checked) {
                              setSelecteds([...selecteds, e.target.value])
                            } else {
                              setSelecteds(
                                selecteds.filter(
                                  (v: any) => v !== e.target.value
                                )
                              )
                            }
                          }}
                          onClickRemove={() => {
                            setPreviews(
                              previews.filter(
                                (previews) => previews.id !== preview.id
                              )
                            )
                          }}
                          checked={selecteds.includes(preview.id)}
                          name={preview.file.name}
                          format={preview.file.type.split('/')[1]}
                          id={preview.id}
                          isImage={/image/gi.test(preview.file.type)}
                          url={preview.preview}
                          errors={preview.errors}
                          isValid={preview.isValid}
                          withValidation
                          key={index}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
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
          {previews.filter((p) => p.isValid).length > 0 && (
            <button
              type="submit"
              disabled={isValidating || !previews.some((p) => p.isValid)}
              className="flex items-center gap-2 rounded border bg-gray-800 px-4 py-2 text-white"
            >
              <UploadCloud size={20} />
              Subir {previews.filter((p) => p.isValid).length} archivo
              {previews.filter((p) => p.isValid).length > 1 ? 's' : ''} a la
              librería
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
