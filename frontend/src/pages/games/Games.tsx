import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { gamesApi, housesApi } from '@/lib/api'
import { useRtpSocket } from '@/hooks/useRtpSocket'
import { Game, BettingHouse, HouseGame } from '@/types'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [houses, setHouses] = useState<BettingHouse[]>([])
  const [houseGames, setHouseGames] = useState<Record<number, HouseGame[]>>({})
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

  useEffect(() => {
    const intervals: number[] = []
    houses.forEach((house) => {
      const fetchGames = () => {
        gamesApi
          .getHouseGames(house.id)
          .then((res) =>
            setHouseGames((prev) => ({ ...prev, [house.id]: res.data }))
          )
          .catch(() => {})
      }
      fetchGames()
      const ms =
        house.updateIntervalUnit === 'minutes'
          ? house.updateInterval * 60000
          : house.updateInterval * 1000
      intervals.push(window.setInterval(fetchGames, ms))
    })
    return () => {
      intervals.forEach((id) => clearInterval(id))
    }
  }, [houses])

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
      {houses.map((house) => (
        <Card key={house.id}>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Jogos - {house.name}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">Provedor</th>
                    <th className="px-4 py-2 text-left">RTP</th>
                    <th className="px-4 py-2 text-left">Signed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(houseGames[house.id] || []).map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-2">{g.id}</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        {g.image && (
                          <img
                            src={g.image}
                            alt={g.name}
                            className="h-10 w-10 object-contain rounded"
                          />
                        )}
                        <span>{g.name}</span>
                      </td>
                      <td className="px-4 py-2">{g.provider}</td>
                      <td className="px-4 py-2">{(g.rtpDecimal / 100).toFixed(2)}%</td>
                      <td className="px-4 py-2">{g.signedInt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
