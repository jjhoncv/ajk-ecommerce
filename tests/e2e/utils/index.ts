/**
 * E2E Shared Utilities - Main Export
 *
 * Central export point for all shared e2e utilities.
 * Modules can import from here to get all common functionality.
 */

// Browser utilities
export {
  initBrowser,
  closeBrowser,
  getPage,
  getBaseUrl,
  goto,
  waitAndClick,
  waitAndType,
  waitForSelector,
  getText,
  clearAndType,
  login,
  waitForText,
  takeScreenshot
} from './browser'

// Table/list actions (DynamicTable)
export {
  findRowByContent,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  getTableRowCount,
  itemExistsInTable
} from './tableActions'

// Form helpers
export {
  fillTextField,
  fillTextArea,
  clearAndFillField,
  clearAndFillTextArea,
  submitForm,
  getFieldValue,
  getTextAreaValue,
  hasValidationError,
  fillFormFields,
  selectOption,
  toggleCheckbox
} from './formHelpers'

// Image upload (DialogAssets)
export {
  uploadImageToField,
  fieldHasImage,
  removeImageFromField,
  getTestDate,
  deleteE2EUploadFolder,
  type UploadOptions
} from './imageUpload'

// Module helpers
export {
  createScreenshotHelper,
  createPathHelpers,
  log,
  wait,
  generateTestSuffix,
  navigateToAdmin,
  isOnPage,
  getCurrentUrl,
  hasToastMessage,
  waitForNavigation,
  type ModuleConfig
} from './moduleHelpers'
