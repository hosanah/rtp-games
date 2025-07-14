import { useEffect, useRef, useState } from 'react'
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
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attemptRef = useRef(0)

  useEffect(() => {
    const meta = import.meta as unknown as { env: { VITE_WS_URL?: string } }
    const wsUrl = meta.env.VITE_WS_URL || 'wss://rtp-api.zapchatbr.com/ws'
    let ws: WebSocket | null = null
    let unmounted = false

    const connect = () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }

      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        attemptRef.current = 0
      }

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

      ws.onerror = () => {
        ws?.close()
      }

      ws.onclose = () => {
        if (unmounted) return

        attemptRef.current += 1
        const delay = Math.min(30000, 1000 * 2 ** (attemptRef.current - 1))
        reconnectTimer.current = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      unmounted = true
      ws?.close()
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
    }
  }, [])

  return { updates, houses, houseGames }
}
