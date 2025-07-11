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
      className="h-8 rounded-md border border-secondary-300 bg-white dark:bg-secondary-800 text-sm text-secondary-700 dark:text-secondary-200"
    >
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
      <option value="system">Sistema</option>
      <option value="forest">Floresta</option>
    </select>
  )
}
