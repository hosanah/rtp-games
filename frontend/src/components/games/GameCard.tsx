import React from 'react'
import { Card } from '@/components/ui/Card'
import { Game, BettingHouse } from '@/types'

interface GameCardProps {
  game: Game
  houses: BettingHouse[]
  getRtp: (game: Game, houseId: number) => number
  rtpClass: (value: number) => string
}

export default function GameCard({ game, houses, getRtp, rtpClass }: GameCardProps) {
  const image = `https://cgg.bet.br/static/v1/casino/game/0/${game.id}/big.webp`
  return (
    <Card className="overflow-hidden">
      <img
        src={image}
        alt={game.name}
        className="w-full h-24 object-contain border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
      />
      <div className="p-4 space-y-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {game.name}
        </h4>
        <p className="text-xs text-gray-500">
          {game.provider} - {game.category}
        </p>
        <p className={`text-sm ${rtpClass(getRtp(game, 0))}`}>
          RTP {getRtp(game, 0).toFixed(2)}%
        </p>
        {houses.map((h) => (
          <p key={h.id} className={`text-xs ${rtpClass(getRtp(game, h.id))}`}> 
            {h.name}: {getRtp(game, h.id).toFixed(2)}%
          </p>
        ))}
      </div>
    </Card>
  )
}
