/**
 * E2E Shared Utilities - Image Upload
 *
 * Common functions for uploading images through DialogAssets component.
 * Reusable across all modules that use file uploads.
 *
 * Includes error handling with fix suggestions.
 *
 * Flow:
 * 1. Create upload folder via API (if uploadPath specified) - BEFORE opening dialog
 * 2. Click on file field to open DialogAssets
 * 3. Navigate to upload folder (if specified)
 * 4. Click "Añadir más archivos" to switch to BrowserFiles
 * 5. Click "Examinar archivos" to trigger file input
 * 6. Upload file
 * 7. Click "Subir X archivo(s) a la librería"
 * 8. Select uploaded file from ServerFiles
 * 9. Click "Aceptar"
 */

import path from 'path'
import fs from 'fs'
import { getPage, getBaseUrl } from './browser'

/**
 * Wait helper
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Log helper
 */
function log(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19)
  console.log(`[${timestamp}] ${message}`)
}

/**
 * Get current test date in YYYYMMDD format
 */
export function getTestDate(): string {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
}

export interface UploadOptions {
  /** Pattern to match when selecting from library (e.g., 'banner', 'category') */
  filePattern?: string
  /** Wait time after upload before selecting (ms) */
  uploadWaitTime?: number
  /** Wait time after selection (ms) */
  selectionWaitTime?: number
  /**
   * Upload path relative to /public/uploads/
   * E.g., 'e2e/20260126/banners' will upload to /public/uploads/e2e/20260126/banners/
   */
  uploadPath?: string
}

/**
 * Create a folder in the library via API
 */
async function createLibraryFolder(folderPath: string): Promise<boolean> {
  const page = getPage()
  const baseUrl = getBaseUrl()

  try {
    const response = await page.evaluate(async (url: string, path: string) => {
      const res = await fetch(`${url}/api/admin/library/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: path })
      })
      return res.json()
    }, baseUrl, folderPath)

    return response.success === true
  } catch (error) {
    log(`    Warning: Could not create folder ${folderPath}`)
    return false
  }
}

/**
 * Wait for folders to load in ServerFiles
 * Returns true when folders are visible, false if timeout
 */
async function waitForFoldersToLoad(timeoutMs: number = 5000): Promise<boolean> {
  const page = getPage()
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const hasContent = await page.evaluate(() => {
      // Check if loading spinner is gone
      const spinner = document.querySelector('.animate-spin')
      if (spinner) return false

      // Check if there's content (folders or files or empty message)
      const folderCards = document.querySelectorAll('.group.relative.rounded-lg.border-2')
      const emptyMessage = document.querySelector('p.text-gray-500')

      return folderCards.length > 0 || (emptyMessage && emptyMessage.textContent?.includes('vacía'))
    })

    if (hasContent) return true
    await wait(200)
  }

  return false
}

/**
 * Navigate to a specific folder in the library
 * ServerFiles renders folders with class "group relative flex flex-col ... rounded-lg border-2"
 * The folder name is in <p class="text-sm font-medium text-gray-700">
 */
async function navigateToFolder(folderPath: string): Promise<boolean> {
  const page = getPage()
  const folders = folderPath.split('/').filter(f => f.length > 0)

  for (const folder of folders) {
    // Wait for content to load
    const loaded = await waitForFoldersToLoad()
    if (!loaded) {
      log(`    Timeout waiting for folder content to load`)
      return false
    }

    const result = await page.evaluate((folderName: string) => {
      // Find all folder cards - they have border-2 and contain an SVG icon
      const allCards = document.querySelectorAll('.group.relative.rounded-lg.border-2')
      const availableFolders: string[] = []

      for (const card of allCards) {
        // Check if it's a folder (has SVG and folder name <p>)
        const svg = card.querySelector('svg')
        const nameEl = card.querySelector('p.text-sm.font-medium')

        if (svg && nameEl) {
          const name = nameEl.textContent?.trim() || ''
          availableFolders.push(name)

          if (name === folderName) {
            // Find clickable area and click
            const clickableArea = card.querySelector('.cursor-pointer')
            if (clickableArea) {
              ;(clickableArea as HTMLElement).click()
              return { clicked: true }
            }
          }
        }
      }
      return { clicked: false, availableFolders }
    }, folder)

    if (!result.clicked) {
      log(`    Could not navigate to folder: ${folder}`)
      if (result.availableFolders && result.availableFolders.length > 0) {
        log(`    📋 Available folders: ${JSON.stringify(result.availableFolders)}`)
      } else {
        log(`    📋 No folders found in current view`)
      }
      return false
    }

    await wait(500) // Brief wait for navigation
  }

  return true
}

/**
 * Upload an image through the DialogAssets component
 *
 * @param fieldLabel - The label text of the file field (e.g., "Imagen", "Imagen*")
 * @param imagePath - Full path to the image file to upload
 * @param options - Optional configuration for upload behavior
 */
export async function uploadImageToField(
  fieldLabel: string,
  imagePath: string,
  options: UploadOptions = {}
): Promise<boolean> {
  const page = getPage()
  const {
    filePattern,
    uploadWaitTime = 5000,
    selectionWaitTime = 1500,
    uploadPath
  } = options

  try {
    log(`  Uploading image for "${fieldLabel}"...`)

    // Verify file exists
    if (!fs.existsSync(imagePath)) {
      log(`  ⚠️ ERROR: Archivo no existe: ${imagePath}`)
      log(`  💡 SUGERENCIA: Verifica que:`)
      log(`     1. El archivo existe en fixtures/`)
      log(`     2. El path es absoluto y correcto`)
      log(`     3. El nombre del archivo coincide exactamente`)
      return false
    }

    // 1. If uploadPath specified, create folder BEFORE opening dialog
    // This ensures the folder exists when DialogAssets fetches library content
    if (uploadPath) {
      log(`    Creating upload folder: ${uploadPath}`)
      await createLibraryFolder(uploadPath)
      await wait(300)
    }

    // 2. Click on file field area to open DialogAssets
    const fieldResult = await page.evaluate((label: string) => {
      const labels = document.querySelectorAll('label')
      const foundLabels: string[] = []

      for (const lbl of labels) {
        const labelText = lbl.textContent?.trim() || ''
        foundLabels.push(labelText)

        if (lbl.textContent?.includes(label)) {
          const parent = lbl.closest('.flex.flex-col') || lbl.parentElement
          if (parent) {
            // Try various selectors for the clickable area
            const clickableArea =
              parent.querySelector('[class*="cursor-pointer"]') ||
              parent.querySelector('[class*="min-h-"]') ||
              parent.querySelector('div[class*="border-dashed"]')

            if (clickableArea) {
              (clickableArea as HTMLElement).click()
              return { clicked: true }
            }

            // Fallback: click the next div sibling
            const nextDiv = lbl.nextElementSibling
            if (nextDiv && nextDiv.tagName === 'DIV') {
              (nextDiv as HTMLElement).click()
              return { clicked: true }
            }
          }
        }
      }
      return { clicked: false, foundLabels: foundLabels.slice(0, 10) }
    }, fieldLabel)

    if (!fieldResult.clicked) {
      log(`  ⚠️ ERROR: Campo "${fieldLabel}" no encontrado`)
      log(`  💡 SUGERENCIA: Verifica que:`)
      log(`     1. El label del campo es correcto`)
      log(`     2. El campo de imagen está visible en el formulario`)
      if (fieldResult.foundLabels && fieldResult.foundLabels.length > 0) {
        log(`  📋 Labels encontrados: ${JSON.stringify(fieldResult.foundLabels)}`)
      }
      return false
    }

    await wait(1500)

    // 3. If uploadPath specified, navigate to the folder
    if (uploadPath) {
      const navigated = await navigateToFolder(uploadPath)
      if (!navigated) {
        log(`    Warning: Could not navigate to ${uploadPath}, uploading to current location`)
      }
    }

    // 4. Click "Añadir más archivos" to switch to browser files view
    const addFilesResult = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      const buttonTexts: string[] = []

      for (const btn of buttons) {
        const text = btn.textContent?.trim() || ''
        buttonTexts.push(text)
        if (text.includes('Añadir más archivos')) {
          btn.click()
          return { clicked: true }
        }
      }
      return { clicked: false, buttonTexts: buttonTexts.filter(t => t.length < 30).slice(0, 10) }
    })

    if (!addFilesResult.clicked) {
      log(`  ⚠️ ERROR: Botón "Añadir más archivos" no encontrado`)
      log(`  💡 SUGERENCIA: Verifica que:`)
      log(`     1. El DialogAssets se abrió correctamente`)
      log(`     2. Estás en la vista de librería (ServerFiles)`)
      if (addFilesResult.buttonTexts && addFilesResult.buttonTexts.length > 0) {
        log(`  📋 Botones visibles: ${JSON.stringify(addFilesResult.buttonTexts)}`)
      }
      return false
    }

    await wait(1000)

    // 5. Click "Examinar archivos" to trigger file input
    const examineClicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        if (btn.textContent?.includes('Examinar archivos')) {
          btn.click()
          return true
        }
      }
      return false
    })

    if (!examineClicked) {
      log(`  ⚠️ ERROR: Botón "Examinar archivos" no encontrado`)
      log(`  💡 SUGERENCIA: Verifica que estás en la vista BrowserFiles`)
      return false
    }

    await wait(500)

    // 6. Upload the file
    const fileInput = await page.$('input[type="file"]')
    if (!fileInput) {
      log(`  ⚠️ ERROR: Input de archivo no encontrado`)
      log(`  💡 SUGERENCIA: Verifica que el componente de upload está visible`)
      return false
    }

    await fileInput.uploadFile(imagePath)
    log(`    File selected: ${path.basename(imagePath)}`)

    await wait(2500)

    // 7. Click upload button ("Subir X archivo(s) a la librería")
    const uploadResult = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[type="submit"]')
      for (const btn of buttons) {
        if (btn.textContent?.includes('Subir') && btn.textContent?.includes('librería')) {
          if (btn.disabled) {
            return { clicked: false, reason: 'disabled', text: btn.textContent }
          }
          btn.click()
          return { clicked: true }
        }
      }
      return { clicked: false, reason: 'not_found' }
    })

    if (uploadResult.clicked) {
      log(`    File uploading to library...`)
      await wait(uploadWaitTime)
    } else {
      log(`  ⚠️ ERROR: Botón de subir no encontrado o deshabilitado`)
      if (uploadResult.reason === 'disabled') {
        log(`  💡 SUGERENCIA: El botón está deshabilitado. Verifica que:`)
        log(`     1. El archivo es válido (formato, tamaño)`)
        log(`     2. No hay errores de validación`)
      } else {
        log(`  💡 SUGERENCIA: Verifica que el archivo se seleccionó correctamente`)
      }
      return false
    }

    // 8. Select the uploaded file from library
    await wait(2000)

    const fileSelected = await page.evaluate((pattern?: string) => {
      // First, deselect any currently selected files
      const selectedInputs = document.querySelectorAll(
        'input[type="radio"]:checked, input[type="checkbox"]:checked'
      )
      selectedInputs.forEach(input => {
        const card = input.closest('.relative.w-full.rounded.border')
        if (card) {
          ;(input as HTMLInputElement).click()
        }
      })

      // Get all file cards with images
      const fileCards = Array.from(
        document.querySelectorAll('.relative.w-full.rounded.border')
      )
      const imageCards = fileCards.filter(card => card.querySelector('img'))

      if (imageCards.length === 0) {
        return { selected: false, reason: 'no_images', cardCount: 0 }
      }

      // If a pattern is provided, try to find a matching file
      if (pattern) {
        for (const card of imageCards) {
          const cardText = card.textContent || ''
          const img = card.querySelector('img')
          const imgSrc = img?.getAttribute('src') || ''
          const imgAlt = img?.getAttribute('alt') || ''

          if (
            cardText.toLowerCase().includes(pattern.toLowerCase()) ||
            imgSrc.toLowerCase().includes(pattern.toLowerCase()) ||
            imgAlt.toLowerCase().includes(pattern.toLowerCase())
          ) {
            const input = card.querySelector('input[type="radio"], input[type="checkbox"]')
            if (input) {
              ;(input as HTMLInputElement).click()
              return { selected: true, method: 'found-pattern' }
            }
          }
        }
      }

      // Fallback: select the last card (most recently uploaded)
      const lastCard = imageCards[imageCards.length - 1]
      const input = lastCard.querySelector('input[type="radio"], input[type="checkbox"]')
      if (input) {
        ;(input as HTMLInputElement).click()
        return { selected: true, method: 'selected-last', cardCount: imageCards.length }
      }

      return { selected: false, reason: 'no_selectable', cardCount: imageCards.length }
    }, filePattern)

    if (fileSelected.selected) {
      log(`    File selection: ${fileSelected.method}`)
    } else {
      log(`  ⚠️ ERROR: No se pudo seleccionar archivo de la librería`)
      if (fileSelected.reason === 'no_images') {
        log(`  💡 SUGERENCIA: No hay imágenes en la librería. Verifica que:`)
        log(`     1. El archivo se subió correctamente`)
        log(`     2. Aumenta uploadWaitTime si el upload es lento`)
      } else {
        log(`  💡 SUGERENCIA: Hay ${fileSelected.cardCount} imágenes pero no se pudo seleccionar`)
      }
    }

    await wait(1000)

    // 9. Click "Aceptar" to confirm selection
    const acceptResult = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        if (btn.textContent?.includes('Aceptar')) {
          if (btn.disabled) {
            return { clicked: false, reason: 'disabled' }
          }
          btn.click()
          return { clicked: true }
        }
      }
      return { clicked: false, reason: 'not_found' }
    })

    if (acceptResult.clicked) {
      log(`    Selection confirmed`)
      await wait(selectionWaitTime)
      return true
    } else {
      log(`  ⚠️ ERROR: Botón "Aceptar" no encontrado o deshabilitado`)
      if (acceptResult.reason === 'disabled') {
        log(`  💡 SUGERENCIA: Selecciona un archivo antes de aceptar`)
      }
      return false
    }
  } catch (error) {
    log(`  ⚠️ ERROR: Excepción durante upload: ${error}`)
    log(`  💡 SUGERENCIA: Revisa la consola del navegador para más detalles`)
    return false
  }
}

/**
 * Check if an image is already set for a field
 */
export async function fieldHasImage(fieldLabel: string): Promise<boolean> {
  const page = getPage()

  return page.evaluate((label: string) => {
    const labels = document.querySelectorAll('label')
    for (const lbl of labels) {
      if (lbl.textContent?.includes(label)) {
        const parent = lbl.closest('.flex.flex-col') || lbl.parentElement
        if (parent) {
          // Check if there's an image preview
          const img = parent.querySelector('img')
          return img !== null
        }
      }
    }
    return false
  }, fieldLabel)
}

/**
 * Remove the current image from a field (if supported)
 */
export async function removeImageFromField(fieldLabel: string): Promise<boolean> {
  const page = getPage()

  const removed = await page.evaluate((label: string) => {
    const labels = document.querySelectorAll('label')
    for (const lbl of labels) {
      if (lbl.textContent?.includes(label)) {
        const parent = lbl.closest('.flex.flex-col') || lbl.parentElement
        if (parent) {
          // Look for remove/delete button
          const removeBtn = parent.querySelector(
            'button[class*="remove"], button[class*="delete"], [class*="trash"]'
          )
          if (removeBtn) {
            ;(removeBtn as HTMLElement).click()
            return true
          }
        }
      }
    }
    return false
  }, fieldLabel)

  if (!removed) {
    log(`  ⚠️ ERROR: No se encontró botón para remover imagen de "${fieldLabel}"`)
    log(`  💡 SUGERENCIA: Verifica que el campo tiene una imagen y un botón de eliminar`)
  }

  return removed
}

/**
 * Delete e2e upload folder for a specific date
 */
export async function deleteE2EUploadFolder(date: string): Promise<boolean> {
  const folderPath = path.join(process.cwd(), 'public', 'uploads', 'e2e', date)

  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true })
      log(`  Deleted upload folder: /public/uploads/e2e/${date}`)
      return true
    } catch (error) {
      log(`  Warning: Could not delete folder ${folderPath}`)
      return false
    }
  }

  return true // Folder doesn't exist, nothing to delete
}
