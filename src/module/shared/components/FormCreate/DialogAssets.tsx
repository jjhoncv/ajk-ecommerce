import { X } from 'lucide-react'
import { FC, useState } from 'react'
import { BrowserFiles } from './BrowserFiles'
import { FileLibraryHeader } from './FileLibraryHeader'
import { ServerFiles } from './ServerFiles'
import { Field, FileServer } from './types/fileManagement'

interface DialogAssetsProps {
  open: boolean
  addFilesToForm: (field: Field, files: FileServer[]) => void
  setOpenDialog: (value: boolean) => void
  field?: Field
}

export const DialogAssets: FC<DialogAssetsProps> = ({
  open,
  setOpenDialog,
  addFilesToForm,
  field
}) => {
  const [showBrowserFiles, setShowBrowserFiles] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [errors, setErrors] = useState<any[]>()
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setErrors([{ message: 'El nombre de la carpeta no puede estar vacío' }])
      return
    }

    try {
      const folderPath = currentPath
        ? `${currentPath}/${newFolderName.trim()}`
        : newFolderName.trim()

      console.log('🔍 Creating folder:', {
        currentPath,
        newFolderName: newFolderName.trim(),
        finalFolderPath: folderPath
      })

      const response = await fetch('/api/admin/library/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath })
      })

      const json = await response.json()

      if (!json.success) {
        setErrors([{ message: json.message || 'Error al crear carpeta' }])
        return
      }

      // Limpiar y cerrar
      setNewFolderName('')
      setShowCreateFolder(false)
      setErrors([])

      // Si estamos en modo BrowserFiles, volver a ServerFiles para ver la carpeta creada
      if (showBrowserFiles) {
        setShowBrowserFiles(false)
      }

      // Trigger reload incrementando el contador
      setReloadTrigger((prev) => prev + 1)
    } catch (error) {
      console.error('Error creating folder:', error)
      setErrors([{ message: 'Error al crear la carpeta' }])
    }
  }

  const handleGoBack = () => {
    // Si estamos en modo BrowserFiles, primero volver a ServerFiles
    if (showBrowserFiles) {
      setShowBrowserFiles(false)
      return
    }

    // Si no, navegar a la carpeta padre
    const pathParts = currentPath.split('/')
    pathParts.pop()
    const newPath = pathParts.join('/')
    setCurrentPath(newPath)
  }

  if (!field) return null

  return (
    <>
      {field && (
        <>
          <div
            onClick={() => {
              setOpenDialog(false)
              setShowBrowserFiles(false)
            }}
            className={`${
              open
                ? `absolute bottom-0 left-0 right-0 top-0 z-30 bg-black opacity-50`
                : `absolute h-0 w-0`
            } transition-all`}
          ></div>
          {open && (
            <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
              <div className="z-40 flex w-[calc(100%-20px)] flex-col rounded border border-slate-200 bg-white md:w-[800px]">
                <div className="flex w-full items-center justify-between bg-slate-200 p-4">
                  <div className="font-semibold">Añadir nuevo archivo</div>
                  <X
                    size={20}
                    onClick={() => setOpenDialog(false)}
                    className="cursor-pointer"
                  />
                </div>

                {showBrowserFiles ? (
                  <div className="py-4 !pb-0">
                    <FileLibraryHeader
                      field={field}
                      onAddFiles={() => setShowBrowserFiles(true)}
                      currentPath={currentPath}
                      onGoBack={handleGoBack}
                      showCreateFolder={showCreateFolder}
                      setShowCreateFolder={setShowCreateFolder}
                      newFolderName={newFolderName}
                      setNewFolderName={setNewFolderName}
                      onCreateFolder={handleCreateFolder}
                      errors={errors}
                    />
                    <BrowserFiles
                      field={field}
                      currentPath={currentPath}
                      setOpenDialog={(v) => {
                        setOpenDialog(v)
                        setShowBrowserFiles(false)
                      }}
                      setOpenBrowserFiles={setShowBrowserFiles}
                    />
                  </div>
                ) : (
                  <>
                    <ServerFiles
                      field={field}
                      currentPath={currentPath}
                      setCurrentPath={setCurrentPath}
                      setOpenDialog={setOpenDialog}
                      onAddFiles={() => setShowBrowserFiles(true)}
                      addFilesToForm={(f) => addFilesToForm(field, f)}
                      showCreateFolder={showCreateFolder}
                      setShowCreateFolder={setShowCreateFolder}
                      newFolderName={newFolderName}
                      setNewFolderName={setNewFolderName}
                      onCreateFolder={handleCreateFolder}
                      errors={errors}
                      reloadTrigger={reloadTrigger}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
