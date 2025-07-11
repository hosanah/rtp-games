import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { housesApi } from '@/lib/api'
import { BettingHouse } from '@/types'

interface HouseFormData {
  name: string
  apiName: string
  apiUrl: string
  updateInterval: number
  currency: string
}

export default function HousesPage() {
  const [houses, setHouses] = useState<BettingHouse[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HouseFormData>()

  const loadHouses = async () => {
    try {
      const res = await housesApi.getAll()
      setHouses(res.data)
    } catch {
      setError('Erro ao carregar casas de aposta')
    }
  }

  useEffect(() => {
    loadHouses()
  }, [])

  const onSubmit = async (data: HouseFormData) => {
    try {
      setLoading(true)
      if (editingId) {
        await housesApi.update(editingId, data)
      } else {
        await housesApi.create(data)
      }
      reset()
      setEditingId(null)
      await loadHouses()
    } catch {
      setError('Erro ao salvar casa de aposta')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (house: BettingHouse) => {
    setEditingId(house.id)
    reset({
      name: house.name,
      apiName: house.apiName,
      apiUrl: house.apiUrl,
      updateInterval: house.updateInterval,
      currency: house.currency,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja remover esta casa de aposta?')) return
    try {
      await housesApi.remove(id)
      await loadHouses()
    } catch {
      setError('Erro ao remover casa de aposta')
    }
  }

  const cancelEdit = () => {
    reset()
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-secondary-900">
              {editingId ? 'Editar Casa de Aposta' : 'Nova Casa de Aposta'}
            </h3>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Nome" error={errors.name?.message} {...register('name', { required: true })} />
              <Input label="API Name" error={errors.apiName?.message} {...register('apiName', { required: true })} />
              <Input label="API URL" error={errors.apiUrl?.message} {...register('apiUrl', { required: true })} />
              <Input label="Intervalo (minutos)" type="number" error={errors.updateInterval?.message} {...register('updateInterval', { required: true, valueAsNumber: true })} />
              <Input label="Moeda" error={errors.currency?.message} {...register('currency', { required: true })} />
              <div className="flex space-x-2">
                <Button type="submit" loading={loading}>
                  {editingId ? 'Salvar' : 'Adicionar'}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-secondary-900">Casas de Aposta</h3>
          </CardHeader>
          <CardContent>
            {houses.length === 0 ? (
              <p className="text-secondary-600">Nenhuma casa de aposta cadastrada.</p>
            ) : (
              <table className="min-w-full divide-y divide-secondary-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">API Name</th>
                    <th className="px-4 py-2 text-left">URL</th>
                    <th className="px-4 py-2 text-left">Intervalo</th>
                    <th className="px-4 py-2 text-left">Moeda</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {houses.map((house) => (
                    <tr key={house.id}>
                      <td className="px-4 py-2">{house.name}</td>
                      <td className="px-4 py-2">{house.apiName}</td>
                      <td className="px-4 py-2">{house.apiUrl}</td>
                      <td className="px-4 py-2">{house.updateInterval}</td>
                      <td className="px-4 py-2">{house.currency}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(house)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(house.id)}>
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    )
}

