'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { handleKeyDown } from '@/module/shared/lib/form'
import { isImageFile } from '@/module/shared/lib/isImageFile'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardContent } from '../CardContent/CardContent'
import { Button } from '../Form/Input/Button'
import { CheckboxGroup } from '../Form/Input/CheckboxGroup'
import { Input } from '../Form/Input/Input'
import { Select } from '../Form/Input/Select'
import { createDynamicSchema } from './createDynamicSchema'
import { DialogAssets } from './DialogAssets'
import { extractDefaultValues } from './extractDefaultValues'
import { SliderImages } from './SliderImages'
import { type Field } from './types/fileManagement'

// Types

export interface AuditMetadata {
  createdAt?: Date | string | null
  createdByName?: string | null
  updatedAt?: Date | string | null
  updatedByName?: string | null
}

interface FormCreateProps {
  type?: 'new' | 'edit'
  api: {
    url: string
    method: 'PUT' | 'PATCH' | 'POST' | 'DELETE'
    withFiles: boolean
  }
  form: {
    redirect: string
    fields: Field[]
    customFields?: object
  }
  audit?: AuditMetadata
}

// Helper para formatear fechas (zona horaria Lima, Perú)
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date

  // Usar formato manual para evitar diferencias de hidratación SSR/cliente
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  return new Intl.DateTimeFormat('es-PE', options).format(d)
}

export const FormCreate: FC<FormCreateProps> = ({
  type = 'new',
  api,
  form: { redirect, fields: initialFields, customFields },
  audit
}) => {
  const router = useRouter()
  const [fields, setFields] = useState<Field[]>(initialFields)
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    selectedField: Field | null
  }>({
    isOpen: false,
    selectedField: null
  })

  const schema = createDynamicSchema(fields)
  const defaultValues = extractDefaultValues(fields)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  })

  const handleFileSelect = useCallback((field: Field) => {
    setDialogState({
      isOpen: true,
      selectedField: field
    })
  }, [])

  const handleFilesAdd = useCallback(
    (field: Field, files: any[]) => {
      setValue(field.key, files)
      setFields((prev) =>
        prev.map((prevField) =>
          prevField.key === field.key
            ? {
                ...prevField,
                value: files.map((f) => f.path)
              }
            : prevField
        )
      )
      setDialogState({ isOpen: false, selectedField: null })
    },
    [setValue]
  )

  const onSubmit = async (data: any, e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      // Procesar campos
      Object.entries(data).forEach(([key, value]: any) => {
        const field = fields.find((f) => f.key === key)
        if (!field) return

        if (field.type === 'file') {
          if (value && value.length > 0) {
            if (field.multiple) {
              value.forEach((file: any) => {
                formData.append(`${key}[]`, file.path)
              })
            } else if (value[0].path) {
              formData.append(key, value[0].path)
            }
          }
        } else if (field.type === 'checkbox-group') {
          // Para checkbox-group, enviamos un array de IDs
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((item: string) => {
              formData.append(`${key}[]`, item)
            })
          }
        } else {
          formData.append(key, value)
        }
      })

      // Agregar customFields si existe
      if (customFields) {
        Object.entries(customFields).forEach(([key, value]) => {
          formData.append(key, value.toString())
        })
      }

      const message = await FetchCustomBody({
        data: formData,
        ...api
      })

      ToastSuccess(message)
      router.push(redirect)
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message)
    }
  }

  const renderField = (field: Field) => {
    console.log('field', field)
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <Input
            {...register(field.key)}
            error={errors[field.key] as any}
            label={field.label}
            type={field.type}
            rows={field.type === 'textarea' ? 2 : undefined}
            onKeyDown={handleKeyDown}
          />
        )
      case 'select':
        return (
          <Select
            {...register(field.key)}
            error={errors[field.key] as any}
            label={field.label}
          >
            {field.placeholder && (
              <option value="">{field.placeholder}</option>
            )}
            {field.selectOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )
      case 'checkbox-group':
        return (
          <CheckboxGroup
            name={field.key}
            label={field.label || ''}
            error={errors[field.key] as any}
            control={control}
            items={field.checkboxItems || []}
          />
        )
      case 'file':
        const existsFiles =
          field.value && Array.isArray(field.value) && field.value.length > 0
        return (
          <div className="flex flex-col gap-1">
            <label className="text-slate-250 text-sm">{field.label}</label>
            <div className="flex min-h-[240px] w-full items-center rounded border border-gray-300 bg-slate-100 px-3 py-2">
              {existsFiles ? (
                <div className="h-full max-h-[240px] w-full">
                  {field.value.every(isImageFile) ? (
                    <SliderImages
                      images={field.value}
                      onClickEdit={() => {
                        handleFileSelect(field)
                      }}
                    />
                  ) : (
                    <ul>
                      {field.value.map((file: any, index: number) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleFileSelect(field)
                  }}
                  className="flex h-full w-full cursor-pointer items-center justify-center transition-colors hover:bg-slate-200"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-2">
                    <ImageIcon size={30} className="text-gray-400" />
                    <p className="text-center text-gray-500">
                      Click para añadir un archivo o arrasta y suelta un archivo
                      en esta área
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {dialogState.isOpen && dialogState.selectedField && (
        <DialogAssets
          open={dialogState.isOpen}
          setOpenDialog={(isOpen) => {
            setDialogState((prev) => ({ ...prev, isOpen }))
          }}
          addFilesToForm={handleFilesAdd}
          field={dialogState.selectedField}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit as any)} noValidate>
        <div className="flex w-full flex-col gap-4 xl:flex-row 2xl:gap-6">
          <CardContent className="w-full md:!mb-0 xl:w-3/4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {fields.map((field, index) => (
                <div
                  key={`${field.key}-${index}`}
                  className="flex flex-col gap-1"
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
          </CardContent>
          <CardContent className="w-full md:!mb-0 md:!mt-0 xl:!mt-7 xl:w-1/4">
            <div className="border-b">
              <p className="pb-2 text-xs font-semibold uppercase">
                Información
              </p>
            </div>

            {type === 'new' ? (
              <div className="my-5 text-sm text-gray-500">
                La información de auditoría se registrará al guardar.
              </div>
            ) : (
              <ul className="my-5 flex flex-col gap-4 text-sm font-light">
                <li className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Creado
                  </p>
                  <p className="text-gray-700">
                    {formatDate(audit?.createdAt)}
                  </p>
                  <p className="text-gray-500">
                    {audit?.createdByName || '—'}
                  </p>
                </li>
                <li className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Última actualización
                  </p>
                  <p className="text-gray-700">
                    {formatDate(audit?.updatedAt)}
                  </p>
                  <p className="text-gray-500">
                    {audit?.updatedByName || '—'}
                  </p>
                </li>
              </ul>
            )}
          </CardContent>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button type="cancel" href={redirect} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {type === 'edit' ? 'Guardar cambios' : 'Añadir'}
          </Button>
        </div>
      </form>
    </>
  )
}
