import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes CSS usando clsx e tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valores RTP para exibição
 */
export function formatRtp(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Formata datas para exibição
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formata datas para exibição simples (apenas data)
 */
export function formatDateOnly(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Calcula a cor baseada no valor RTP
 */
export function getRtpColor(rtp: number): string {
  if (rtp >= 96) return 'text-green-600'
  if (rtp >= 94) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Calcula a cor de fundo baseada no valor RTP
 */
export function getRtpBgColor(rtp: number): string {
  if (rtp >= 96) return 'bg-green-100 text-green-800'
  if (rtp >= 94) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

/**
 * Debounce function para otimizar pesquisas
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gera cores aleatórias para gráficos
 */
export function generateChartColors(count: number): string[] {
  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
  ]
  
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length])
  }
  
  return result
}

