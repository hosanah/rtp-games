import axios from 'axios'

// Configuração base da API
const API_BASE_URL =
  (import.meta as any).env.VITE_API_URL || 'https://rtp-api.zapchatbr.com/api'

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Se o token expirou, remover do localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      // Redirecionar para login se não estiver na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// Funções de autenticação
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  verifyToken: () =>
    api.get('/auth/verify'),
}

// Funções de jogos
export const gamesApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    category?: string
    provider?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => api.get('/games', { params }),
  
  getById: (id: number) =>
    api.get(`/games/${id}`),
  
  getCategories: () =>
    api.get('/games/categories'),
  
  getProviders: () =>
    api.get('/games/providers'),
  
  getStats: () =>
    api.get('/games/stats'),
}

// Funções de RTP
export const rtpApi = {
  addRecord: (data: { gameId: number; rtpValue: number; notes?: string }) =>
    api.post('/rtp', data),
  
  getUserHistory: (params?: {
    page?: number
    limit?: number
    gameId?: number
    startDate?: string
    endDate?: string
  }) => api.get('/rtp/history', { params }),
  
  getUserStats: () =>
    api.get('/rtp/stats'),
  
  getGameHistory: (gameId: number, params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }) => api.get(`/rtp/games/${gameId}/history`, { params }),
  
  deleteRecord: (id: number) =>
    api.delete(`/rtp/${id}`),
}

// Funções de casas de aposta
export const housesApi = {
  create: (data: {
    name: string
    apiName: string
    apiUrl: string
    updateInterval: number
    updateIntervalUnit: 'seconds' | 'minutes'
    currency: string
  }) => api.post('/houses', data),

  getAll: () => api.get('/houses'),

  getById: (id: number) => api.get(`/houses/${id}`),

  update: (
    id: number,
    data: {
      name: string
      apiName: string
      apiUrl: string
      updateInterval: number
      updateIntervalUnit: 'seconds' | 'minutes'
      currency: string
    }
  ) => api.put(`/houses/${id}`, data),

  remove: (id: number) => api.delete(`/houses/${id}`),
}

// Função para verificar se a API está online
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health')
    return true
  } catch {
    return false
  }
}

export default api

