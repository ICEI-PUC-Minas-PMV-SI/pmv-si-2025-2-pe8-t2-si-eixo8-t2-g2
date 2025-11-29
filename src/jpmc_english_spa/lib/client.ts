const API_BASE_URL = "http://localhost:8001"

export const apiClient = {
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchAPIWithFile<T>(
  endpoint: string,
  formData: FormData,
  options: Omit<RequestInit, "body"> = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    headers: {
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}
export type PaymentReport = {
  alunoId: number
  alunoNome: string
  totalPagamentos: number
  pagos: number
  pendentes: number
  valorPago: number
  valorPendente: number
}

export type ReportFilters = {
  startDate?: string
  endDate?: string
  status?: string
}

export async function getPaymentReport(filters: ReportFilters = {}) {
  const params = new URLSearchParams()

  if (filters.startDate && filters.endDate) {
    params.append("startDate", filters.startDate)
    params.append("endDate", filters.endDate)
  }

  if (filters.status) {
    params.append("status", filters.status)
  }

  const query = params.toString() ? `?${params.toString()}` : ""
  return fetchAPI<PaymentReport[]>(`/relatorios/pagamentos${query}`)
}