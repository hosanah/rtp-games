import React from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Game, BettingHouse } from '@/types'

interface GameCardProps {
  game: Game
  house: BettingHouse
  getRtp: (game: Game, houseId: number) => number
  rtpClass: (value: number) => string
  className?: string
}

export default function GameCard({ game, house, getRtp, rtpClass, className }: GameCardProps) {
  return (
    <Card onClick={() => {
    navigator.clipboard.writeText(game.name)
    }}
    className={cn('overflow-hidden', className)}
    >
      <img
        src={game.imageUrl}
        alt={game.name}
        className="w-full h-24 object-contain border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
      />
      <div className="p-4 space-y-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {game.name}
        </h4>
        <p className="text-xs text-gray-500">
          {game.provider} 
        </p>
        <p className={`text-sm ${rtpClass(getRtp(game, 0))}`}>
          RTP {getRtp(game, 0).toFixed(2)}%
        </p>
      </div>
    </Card>
  )
}
