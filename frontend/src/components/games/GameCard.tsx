import React from 'react'
import { Card } from '@/components/ui/Card'
import { cn, convertSignedInt } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { HouseGame, BettingHouse } from '@/types'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface GameCardProps {
  game: HouseGame
  house: BettingHouse
  getRtp: (game: HouseGame, houseId: number) => number
  rtpClass: (value: number) => string
  className?: string
}

export default function GameCard({ game, house, getRtp, rtpClass, className }: GameCardProps) {
  const signed = convertSignedInt(game.signedInt)
  const positive = signed >= 0
  const { show } = useToast()
  const handleClick = () => {
    navigator.clipboard.writeText(game.name)
    show({ type: 'info', title: `${game.name} copiado` })
  }
  return (
    <Card
      onClick={handleClick}
      className={cn('overflow-hidden cursor-pointer', className)}
    >
      <img
        src={`data:image/webp;base64,${game.imageUrl || ''}`}
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
        <p className={`text-sm ${rtpClass(getRtp(game, house.id))}`}>
          RTP {getRtp(game, house.id).toFixed(2)}%
        </p>
        <div className="flex items-center text-xs">
          {positive ? (
            <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
          )}
          <span className={positive ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(signed)}
          </span>
        </div>
      </div>
    </Card>
  )
}
