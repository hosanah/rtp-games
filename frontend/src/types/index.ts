// Tipos de usuário
export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

// Tipos de autenticação
export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Tipos de jogos
export interface Game {
  id: number
  name: string
  provider: string
  category: string
  minRtp: number
  maxRtp: number
  currentRtp: number
  imageUrl?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    rtpHistory: number
  }
  rtpHistory?: RtpRecord[]
}

export interface GameStats {
  totalGames: number
  totalCategories: number
  totalProviders: number
  averageRtp: number
  topRtpGames: Array<{
    id: number
    name: string
    provider: string
    currentRtp: number
    _count: {
      rtpHistory: number
    }
  }>
}

// Tipos de RTP
export interface RtpRecord {
  id: number
  userId: number
  gameId: number
  rtpValue: number
  timestamp: string
  notes?: string
  user?: {
    name: string
  }
  game?: {
    name: string
    provider: string
    category?: string
  }
}

export interface RtpStats {
  totalRecords: number
  averageRtp: number
  bestRtp?: RtpRecord
  worstRtp?: RtpRecord
  recentRecords: RtpRecord[]
  topGames: Array<{
    game: Game
    recordCount: number
    averageRtp: number
  }>
}

export interface GameRtpHistory {
  game: Game
  records: RtpRecord[]
  stats: {
    totalRecords: number
    averageRtp: number
    minRtp: number
    maxRtp: number
  }
  pagination: PaginationInfo
}

// Tipos de paginação
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data?: T[]
  games?: Game[]
  records?: RtpRecord[]
  pagination: PaginationInfo
}

// Tipos de formulários
export interface GameFilters {
  category?: string
  provider?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface RtpFilters {
  gameId?: number
  startDate?: string
  endDate?: string
}

// Tipos de componentes
export interface SelectOption {
  value: string | number
  label: string
}

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

// Tipos de contexto
export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

// Tipos de erro
export interface ApiError {
  error: string
  code?: string
  message?: string
}

// Tipos de notificação
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Tipos de modal
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

// Tipos de dashboard
export interface DashboardStats {
  totalGames: number
  totalRecords: number
  averageRtp: number
  recentActivity: RtpRecord[]
}

