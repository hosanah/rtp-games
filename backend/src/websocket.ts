import { WebSocketServer, WebSocket } from 'ws';
import sequelize from './models';
import { BettingHouse } from './models/bettingHouse';
import axios from 'axios';

interface RtpUpdate {
  houseId: number;
  gameName: string;
  provider: string;
  rtp: number;
  imageUrl?: string;
}

export class RtpSocket {
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.wss.on('connection', ws => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  async start() {
    const houses = await BettingHouse.findAll();
    for (const house of houses) {
      const intervalMs =
        house.updateIntervalUnit === 'minutes'
          ? house.updateInterval * 60000
          : house.updateInterval * 1000;
      setInterval(() => this.fetchAndBroadcast(house), intervalMs);
      this.fetchAndBroadcast(house).catch(() => {});
    }
  }

  private async fetchAndBroadcast(house: BettingHouse) {
    try {
      const res = await axios.post<ArrayBuffer>(house.apiUrl, Buffer.from([8, 2, 16, 2]), {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/x-protobuf',
          'Origin': house.apiUrl.split('/').slice(0, 3).join('/'),
          'User-Agent': 'Mozilla/5.0',
          'accept': 'application/x-protobuf',
        },
      });
      const updates = this.parseProto(res.data, house.id);
      this.broadcast(updates);
    } catch (err) {
      console.error('Erro ao consultar RTP da casa', house.name, err);
    }
  }

  private parseProto(data: ArrayBuffer, houseId: number): RtpUpdate[] {
    // Simplified parser: treat data as JSON if possible
    try {
      const text = Buffer.from(data).toString();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((g: any) => ({
          houseId,
          gameName: g.name,
          provider: g.provider,
          rtp: this.adjustRtp(g.rtp),
          imageUrl: g.image,
        }));
      }
    } catch {
      // ignore parsing errors
    }
    return [];
  }

  private adjustRtp(value: number | string): number {
    const val = BigInt(value);
    const max = BigInt('18446744073709551616');
    const limit = BigInt('9223372036854775807');
    if (val > limit) {
      return Number(val - max);
    }
    return Number(val);
  }

  private broadcast(updates: RtpUpdate[]) {
    if (!updates.length) return;
    const payload = JSON.stringify({ type: 'rtp', data: updates });
    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }
}

export default function initWebSocket(server: any) {
  const socket = new RtpSocket(server);
  socket.start().catch(err => console.error('Erro inicializando RTP service', err));
}
