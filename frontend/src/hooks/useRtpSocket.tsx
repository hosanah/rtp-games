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
  rtp: number
  imageUrl?: string
}

export function useRtpSocket() {
  const [updates, setUpdates] = useState<RtpUpdate[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001/ws')

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'rtp') {
          const adjusted = (payload.data as RtpUpdate[]).map((u) => ({
            ...u,
            rtp: adjustRtp(u.rtp),
          }))
          setUpdates(adjusted)
        }
      } catch {
        // ignore
      }
    }

    return () => ws.close()
  }, [])

  return updates
}
