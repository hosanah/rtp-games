import React from 'react'
import { useToast } from '@/hooks/useToast'
import { XIcon, CheckCircle2Icon, AlertTriangleIcon, InfoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ToastContainer() {
  const { toasts, remove } = useToast()

  const icons = {
    success: <CheckCircle2Icon className="h-5 w-5 text-green-600" />,
    error: <XIcon className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />,
    info: <InfoIcon className="h-5 w-5 text-blue-600" />,
  }

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded-md p-3 flex items-start space-x-2'
          )}
        >
          {icons[t.type]}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.title}</p>
            {t.message && <p className="text-sm text-gray-500">{t.message}</p>}
          </div>
          <button
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
