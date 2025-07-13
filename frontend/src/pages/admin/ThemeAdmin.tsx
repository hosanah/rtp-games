import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { settingsApi } from '@/lib/api'
import { useCustomCss } from '@/hooks/useCustomCss'

export default function ThemeAdminPage() {
  const { updateCss } = useCustomCss()
  const [css, setCss] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    settingsApi.getTheme()
      .then(res => setCss(res.data.css || ''))
      .catch(() => setError('Erro ao carregar tema'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await updateCss(css)
    } catch {
      setError('Erro ao salvar tema')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Personalizar Tema</h3>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono text-sm dark:bg-gray-800 dark:text-gray-100"
            />
            <Button type="submit" loading={loading}>Salvar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
