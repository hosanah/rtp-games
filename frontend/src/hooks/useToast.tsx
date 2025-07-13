import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Notification } from '@/types'

interface ToastContextType {
  toasts: Notification[]
  show: (toast: Omit<Notification, 'id'>) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Notification[]>([])

  const show = (toast: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID()
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration ?? 3000)
  }

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
