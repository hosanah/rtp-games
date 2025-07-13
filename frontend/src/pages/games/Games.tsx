import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import GameCard from '@/components/games/GameCard'
import { gamesApi, housesApi } from '@/lib/api'
import { useRtpSocket } from '@/hooks/useRtpSocket'
import { Game, BettingHouse, HouseGame } from '@/types'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [houses, setHouses] = useState<BettingHouse[]>([])
  const [houseGames, setHouseGames] = useState<Record<number, Game[]>>({})
  const updates = useRtpSocket()

  useEffect(() => {
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
          .then((res) => {
            setHouseGames((prev) => ({ ...prev, [house.id]: res.data }))
          })
          .catch((err) => {
            console.error(`Erro ao buscar jogos da casa ${house.name}`, err)
          })
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

    useEffect(() => {
    const allGamesMap = new Map<string, Game>()

    Object.values(houseGames).forEach((gamesArray) => {
      gamesArray.forEach((game) => {
        if (game?.id && !allGamesMap.has(game.id)) {
          allGamesMap.set(game.id, game)
        }
      })
    })

    setGames(Array.from(allGamesMap.values()))
  }, [houseGames])


  // Retorna o RTP do jogo mais atualizado
  const getRtp = (game: Game, houseId: number): number => {
    const up = updates.find((u) => u.gameName === game.name && u.houseId === houseId)
    const rawRtp = up?.rtp ?? game.rtpDecimal ?? 0
    return rawRtp / 100
  }


  const rtpClass = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Jogos</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div className="flex w-max space-x-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  houses={houses}
                  getRtp={getRtp}
                  rtpClass={rtpClass}
                  className="w-60 shrink-0"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
