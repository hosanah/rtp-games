import { useEffect, useState } from 'react'

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
  rtpDaily?: number
  rtpWeekly?: number
  rtpMonthly?: number
  imageUrl?: string
}

export function useRtpSocket() {
  const [updates, setUpdates] = useState<RtpUpdate[]>([])

  useEffect(() => {
    const wsUrl =
      (import.meta as any).env.VITE_WS_URL || 'wss://rtp-api.zapchatbr.com/ws'
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'rtp') {
          const adjusted = (payload.data as RtpUpdate[]).map((u) => ({
            ...u,
            rtpDaily: u.rtpDaily !== undefined ? adjustRtp(u.rtpDaily) : undefined,
            rtpWeekly: u.rtpWeekly !== undefined ? adjustRtp(u.rtpWeekly) : undefined,
            rtpMonthly: u.rtpMonthly !== undefined ? adjustRtp(u.rtpMonthly) : undefined,
          }))
          setUpdates((prev) => {
            const map = new Map(prev.map((u) => [`${u.houseId}:${u.gameName}`, u]))
            adjusted.forEach((u) => {
              map.set(`${u.houseId}:${u.gameName}`, u)
            })
            return Array.from(map.values())
          })
        }
      } catch {
        // ignore
      }
    }

    return () => ws.close()
  }, [])

  return updates
}
