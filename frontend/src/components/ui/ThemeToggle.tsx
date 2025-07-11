import React from 'react'
import { useTheme, Theme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme)
  }

  return (
    <select
      value={theme}
      onChange={handleChange}
      className="h-8 rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
    >
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
      <option value="system">Sistema</option>
    </select>
  )
}
