import { AlertTriangle, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { type FC } from 'react'
import { Button } from '../Form/Input/Button'

interface AlertProps {
  message: React.ReactNode
  title?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const Alert: FC<AlertProps> = ({
  title,
  message,
  onSuccess,
  onCancel
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const open = searchParams.get('action') === 'alert'

  return (
    <>
      {open && (
        <div>
          <div
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search)
              urlParams.delete('action')
              urlParams.delete('id')
              router.push('/dashboard/roles')
            }}
            className={`${
              open ? 'block' : 'hidden'
            } fixed bottom-0 left-0 right-0 top-0 z-40 mx-auto h-full w-full bg-[#00000036]`}
          />
          <div className="absolute left-0 right-0 z-50 mx-auto flex w-[calc(100%-40px)] flex-col rounded-lg bg-white shadow-lg md:min-h-[200px] md:w-[450px]">
            <div className="p-2">
              <div className="relative px-3 py-3 font-semibold">
                {title ?? 'Notificación'}
                <XIcon
                  className="absolute right-2 top-2.5 cursor-pointer"
                  size={28}
                  strokeWidth={0.8}
                  onClick={onCancel}
                />
              </div>
              <hr />
              {message && (
                <div className="flex min-h-[100px] p-6">
                  <div className="flex w-full flex-col items-center justify-center gap-3">
                    <AlertTriangle size={30} strokeWidth={0.9} />
                    <p>{message}</p>
                  </div>
                </div>
              )}
              {/* <hr /> */}
              <div className="flex justify-end gap-3 p-3 py-4">
                {onCancel && (
                  <Button outline type="button" onClick={onCancel}>
                    Cancelar
                  </Button>
                )}
                {onSuccess && (
                  <Button type="button" onClick={onSuccess}>
                    Aceptar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
