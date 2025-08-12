import { AlertTriangle, CheckCircleIcon, File, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { FC } from 'react'

export interface FilePreview {
  id: string
  file: File
  preview: string
  isValid: boolean
  errors?: string[]
}

interface FilePreviewCardProps {
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClickRemove?: () => void
  checked?: boolean
  isValid?: boolean
  errors?: string[]
  isImage: boolean
  url: string
  name: string
  id: string
  value: string
  format: string
  withValidation?: boolean
  multiple?: boolean
}

export const FilePreviewCard: FC<FilePreviewCardProps> = ({
  onChangeInput,
  onClickRemove,
  name,
  id,
  value,
  isValid,
  checked,
  errors,
  isImage,
  url,
  format,
  withValidation,
  multiple
}) => {
  return (
    <div className={`relative w-full rounded border border-slate-300`}>
      <input
        type={multiple ? 'checkbox' : 'radio'}
        className="absolute z-40 m-2 flex h-4 w-4 cursor-pointer"
        onChange={onChangeInput}
        value={value}
        checked={checked}
      />
      <Trash2
        size={28}
        strokeWidth={1}
        className="absolute right-0 z-40 m-1 flex cursor-pointer rounded-full p-1 hover:bg-slate-200"
        onClick={onClickRemove}
      />

      <div className="relative flex justify-center">
        <>
          {withValidation && (
            <>
              {isValid ? (
                <div className="absolute bottom-2 right-2.5">
                  <CheckCircleIcon size={18} className="stroke-green-500" />
                </div>
              ) : (
                <div className="group absolute bottom-2 right-2.5 hover:last:block">
                  <AlertTriangle size={18} className="stroke-red-500" />

                  <div className="invisible absolute z-50 w-[300px] rounded border border-red-600 bg-white px-3 py-1 text-sm transition-all group-hover:visible">
                    {(errors &&
                      errors?.length > 0 &&
                      errors.map((error) => error).join('')) ||
                      ''}
                  </div>
                </div>
              )}
            </>
          )}
        </>
        <div className={`relative aspect-square h-[100px] overflow-hidden`}>
          {isImage ? (
            <Image
              src={url}
              alt={`Preview ${id + 1}`}
              sizes="200px"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <File size={50} strokeWidth={1} />
            </div>
          )}
        </div>
      </div>
      <div className="border border-b-0 border-l-0 border-r-0 border-t-slate-300 p-2 text-sm">
        <div className="flex flex-col">
          <div className="overflow-hidden overflow-ellipsis text-nowrap">
            {name}
          </div>
          <div className="text-xs uppercase">{format}</div>
        </div>
      </div>
    </div>
  )
}
