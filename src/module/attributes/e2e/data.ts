/**
 * Test data for Attributes E2E tests
 */

const timestamp = Date.now()

export const TEST_ATTRIBUTES = {
  attribute: {
    name: `Color Test ${timestamp}`,
    displayType: 'color'
  },
  attributeEdited: {
    name: `Color Test Editado ${timestamp}`,
    displayType: 'pills'
  },
  attributeForDelete: {
    name: `Attr Para Eliminar ${timestamp}`,
    displayType: 'select'
  }
}

export const DISPLAY_TYPE_OPTIONS = [
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'pills', label: 'Pills (Botones)' },
  { value: 'color', label: 'Color Picker' },
  { value: 'custom', label: 'Personalizado' }
]

export const SCREENSHOTS_PATH = 'src/module/attributes/e2e/screenshots'
