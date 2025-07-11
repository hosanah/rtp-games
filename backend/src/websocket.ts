import { WebSocketServer, WebSocket } from 'ws';
import sequelize from './models';
import { BettingHouse } from './models/bettingHouse';
import axios from 'axios';
import { decodeRtp } from './utils/rtpProtoDecoder';

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
  private houseIntervals = new Map<number, NodeJS.Timeout>();
  private reloadTimer?: NodeJS.Timeout;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.wss.on('connection', ws => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  async start() {
    await this.reloadHouses();
    const reloadMs = Number(process.env.HOUSE_RELOAD_INTERVAL_MS || 300000);
    this.reloadTimer = setInterval(
      () => this.reloadHouses().catch(err => console.error('Erro reloading houses', err)),
      reloadMs
    );
  }

  private async reloadHouses() {
    const houses = await BettingHouse.findAll();
    const activeIds = new Set<number>();
    for (const house of houses) {
      activeIds.add(house.id);
      if (!this.houseIntervals.has(house.id)) {
        const intervalMs =
          house.updateIntervalUnit === 'minutes'
            ? house.updateInterval * 60000
            : house.updateInterval * 1000;
        const timer = setInterval(() => this.fetchAndBroadcast(house), intervalMs);
        this.houseIntervals.set(house.id, timer);
        this.fetchAndBroadcast(house).catch(() => {});
      }
    }
    for (const [id, timer] of this.houseIntervals) {
      if (!activeIds.has(id)) {
        clearInterval(timer);
        this.houseIntervals.delete(id);
      }
    }
  }

  private async fetchAndBroadcast(house: BettingHouse) {
    try {
      const res = await axios.post<ArrayBuffer>(house.apiUrl, Buffer.from([8, 2, 16, 2]), {
        responseType: 'arraybuffer',
        timeout: Number(process.env.RTP_API_TIMEOUT_MS || 10000),
        family: 4,
        headers: {
          'Content-Type': 'application/x-protobuf',
          Origin: house.apiUrl.split('/').slice(0, 3).join('/'),
          'User-Agent': 'Mozilla/5.0',
          accept: 'application/x-protobuf',
        },
      });
      const updates = this.parseProto(res.data, house.id);
      this.broadcast(updates);
    } catch (err) {
      console.error('Erro ao consultar RTP da casa', house.name, err);
    }
  }

  private parseProto(data: ArrayBuffer, houseId: number): RtpUpdate[] {
    try {
      const games = decodeRtp(data);
      return games.map(g => ({
        houseId,
        gameName: g.name,
        provider: g.provider,
        rtp: this.adjustRtp(g.rtp),
        imageUrl: g.image,
      }));
    } catch {
      return [];
    }
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
