import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { gamesApi, housesApi } from '@/lib/api'
import { useRtpSocket } from '@/hooks/useRtpSocket'
import { Game, BettingHouse } from '@/types'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [houses, setHouses] = useState<BettingHouse[]>([])
  const updates = useRtpSocket()

  useEffect(() => {
    gamesApi
      .getAll()
      .then((res) => setGames(res.data))
      .catch(() => {})
    housesApi
      .getAll()
      .then((res) => setHouses(res.data))
      .catch(() => {})
  }, [])

  const getRtp = (game: Game, houseId: number) => {
    const up = updates.find((u) => u.gameName === game.name && u.houseId === houseId)
    return up ? up.rtp : game.currentRtp
  }

  const rtpClass = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Jogos</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Jogo</th>
                  <th className="px-4 py-2 text-left">Provedor</th>
                  <th className="px-4 py-2 text-left">Categoria</th>
                  <th className="px-4 py-2 text-left">RTP Min</th>
                  <th className="px-4 py-2 text-left">RTP Máx</th>
                  <th className="px-4 py-2 text-left">RTP Atual</th>
                  {houses.map((h) => (
                    <th key={h.id} className="px-4 py-2 text-left">
                      {h.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {games.map((game) => (
                  <tr key={game.id}>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        {game.imageUrl && (
                          <img
                            src={game.imageUrl}
                            alt={game.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
                          />
                        )}
                        <span>{game.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{game.provider}</td>
                    <td className="px-4 py-2">{game.category}</td>
                    <td className="px-4 py-2">{game.minRtp.toFixed(2)}%</td>
                    <td className="px-4 py-2">{game.maxRtp.toFixed(2)}%</td>
                    <td className={"px-4 py-2 " + rtpClass(getRtp(game, 0))}>
                      {getRtp(game, 0).toFixed(2)}%
                    </td>
                    {houses.map((h) => (
                      <td key={h.id} className={"px-4 py-2 " + rtpClass(getRtp(game, h.id))}>
                        {getRtp(game, h.id).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
