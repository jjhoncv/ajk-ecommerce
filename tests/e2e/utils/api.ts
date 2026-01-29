const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function apiGet<T = any>(endpoint: string, cookies?: string): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookies) {
    headers['Cookie'] = cookies
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers })
  return response.json()
}

export async function apiPost<T = any>(
  endpoint: string,
  data: any,
  cookies?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookies) {
    headers['Cookie'] = cookies
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function apiPatch<T = any>(
  endpoint: string,
  data: any,
  cookies?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookies) {
    headers['Cookie'] = cookies
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function apiDelete<T = any>(
  endpoint: string,
  data?: any,
  cookies?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookies) {
    headers['Cookie'] = cookies
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  return response.json()
}

// Bootstrap - Create first admin user
export async function bootstrapAdmin(data: {
  name: string
  lastname: string
  email: string
  password: string
}): Promise<ApiResponse> {
  return apiPost('/api/admin/bootstrap', data)
}

// Check if bootstrap is available
export async function checkBootstrap(): Promise<{ available: boolean }> {
  const response = await fetch(`${BASE_URL}/api/admin/bootstrap`)
  return response.json()
}
