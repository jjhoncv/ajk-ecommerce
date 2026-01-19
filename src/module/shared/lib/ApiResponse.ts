export interface ApiResponse {
  message?: string
  error?: string
  success: boolean
  banner?: any
  data?: any
  emailSent?: boolean
  [key: string]: any
}
