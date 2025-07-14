import { useEffect, useState } from 'react'
import { BettingHouse, HouseGame } from '@/types'

function adjustRtp(raw: number): number {
  const val = BigInt(raw)
  const max = BigInt('18446744073709551616')
  const limit = BigInt('9223372036854775807')
  return val > limit ? Number(val - max) : Number(val)
}

export interface RtpUpdate {
  houseId: number
  gameName: string
  provider: string
  rtp: number
  imageUrl?: string
}

export function useRtpSocket() {
  const [updates, setUpdates] = useState<RtpUpdate[]>([])
  const [houses, setHouses] = useState<BettingHouse[]>([])
  const [houseGames, setHouseGames] = useState<Record<number, HouseGame[]>>({})

  useEffect(() => {
    const meta = import.meta as unknown as { env: { VITE_WS_URL?: string } }
    const wsUrl = meta.env.VITE_WS_URL || 'wss://rtp-api.zapchatbr.com/ws'
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        switch (payload.type) {
          case 'rtp': {
            const adjusted = (payload.data as RtpUpdate[]).map((u) => ({
              ...u,
              rtp: adjustRtp(u.rtp),
            }))
            setUpdates((prev) => {
              const map = new Map(prev.map((u) => [`${u.houseId}:${u.gameName}`, u]))
              adjusted.forEach((u) => {
                map.set(`${u.houseId}:${u.gameName}`, u)
              })
              return Array.from(map.values())
            })
            break
          }
          case 'init': {
            const data = payload.data as { houses: BettingHouse[]; games: Record<number, HouseGame[]> }
            setHouses(data.houses)
            setHouseGames(data.games || {})
            break
          }
          case 'houseAdded': {
            const { house, games } = payload.data as { house: BettingHouse; games: HouseGame[] }
            setHouses((prev) => [...prev.filter((h) => h.id !== house.id), house])
            setHouseGames((prev) => ({ ...prev, [house.id]: games }))
            break
          }
          case 'houseRemoved': {
            const { houseId } = payload.data as { houseId: number }
            setHouses((prev) => prev.filter((h) => h.id !== houseId))
            setHouseGames((prev) => {
              const copy = { ...prev }
              delete copy[houseId]
              return copy
            })
            break
          }
        }
      } catch {
        // ignore
      }
    }

    return () => ws.close()
  }, [])

  return { updates, houses, houseGames }
}
