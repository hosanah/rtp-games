import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import GameCard from '@/components/games/GameCard'
import { useRtpSocket } from '@/hooks/useRtpSocket'
import { HouseGame } from '@/types'
import { applySignedInt } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function GamesPage() {
  const [games, setGames] = useState<HouseGame[]>([])
  const { updates, houses, houseGames } = useRtpSocket()
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [rtpFilter, setRtpFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const [providers, setProviders] = useState<string[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})


  useEffect(() => {
    const allGamesMap = new Map<string, HouseGame>()

    Object.values(houseGames).forEach((gamesArray) => {
      gamesArray.forEach((game) => {
        if (game?.id && !allGamesMap.has(game.id)) {
          allGamesMap.set(game.id, game)
        }
      })
    })

    setGames(Array.from(allGamesMap.values()))
  }, [houseGames])

  useEffect(() => {
    const provs = Array.from(new Set(games.map((g) => g.provider))).sort()
    setProviders(provs)
  }, [games])


  // Retorna o RTP do jogo mais atualizado
  const getRtp = (game: HouseGame, houseId: number): number => {
    const up = updates.find((u) => u.gameName === game.name && u.houseId === houseId)
    const base = applySignedInt(game.rtpDecimal ?? 0, game.signedInt)
    const rawRtp = up?.rtp ?? base
    return rawRtp / 100
  }

  const toggleExpanded = (houseId: number) => {
    setExpanded((prev) => ({ ...prev, [houseId]: !prev[houseId] }))
  }


  const rtpClass = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600')

  return (
  <div className="space-y-6">
    {/* Filtros */}
    <div className="flex flex-wrap items-end gap-2">
      <div className="w-full sm:w-48">
        <Input
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-40">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Provedor
        </label>
        <select
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
        >
          <option value="">Todos</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={rtpFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setRtpFilter('all')}
        >
          Todos
        </Button>
        <Button
          size="sm"
          variant={rtpFilter === 'positive' ? 'primary' : 'outline'}
          onClick={() => setRtpFilter('positive')}
        >
          RTP +
        </Button>
        <Button
          size="sm"
          variant={rtpFilter === 'negative' ? 'primary' : 'outline'}
          onClick={() => setRtpFilter('negative')}
        >
          RTP -
        </Button>
      </div>
    </div>

    {/* Listagem por casa */}
    {houses.map((house) => {
      const isExpanded = expanded[house.id]
      let filteredGames = houseGames[house.id] ?? []

      if (isExpanded) {
        if (search) {
          filteredGames = filteredGames.filter((g) =>
            g.name.toLowerCase().includes(search.toLowerCase())
          )
        }

        if (providerFilter) {
          filteredGames = filteredGames.filter((g) => g.provider === providerFilter)
        }

        if (rtpFilter !== 'all') {
          filteredGames = filteredGames.filter((g) => {
            const rtp = getRtp(g, house.id)
            return rtpFilter === 'positive' ? rtp >= 0 : rtp < 0
          })
        }
      }

      return (
        <Card key={house.id}>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Jogos - {house.name}
            </h3>
            <button
              onClick={() => toggleExpanded(house.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </button>
          </CardHeader>

          {isExpanded && (
            <CardContent>
              {filteredGames.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum jogo disponível</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={`${house.id}-${game.id}`}
                      game={game}
                      house={house}
                      getRtp={getRtp}
                      rtpClass={rtpClass}
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )
    })}
  </div>
  )
}
