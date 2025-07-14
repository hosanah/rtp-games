import { WebSocketServer, WebSocket } from 'ws';
import { BettingHouse } from './models/bettingHouse';
import axios, { type AxiosRequestConfig } from 'axios';
import { retryRequest } from './utils/retryRequest';
import { decodeRtp } from './utils/rtpProtoDecoder';
import { fetchHouseGames } from './utils/houseGameFetcher';
import { DecodedHouseGame } from './utils/houseGameDecoder';

interface RtpUpdate {
  houseId: number;
  gameName: string;
  provider: string;
  rtp: number;
  imageUrl?: string;
}

interface InitData {
  houses: BettingHouse[];
  games: Record<number, DecodedHouseGame[]>;
}

export class RtpSocket {
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();
  private houseIntervals = new Map<number, NodeJS.Timeout>();
  private reloadTimer?: NodeJS.Timeout;
  private knownHouseIds = new Set<number>();
  private failureCounts = new Map<number, number>();
  private pauseUntil = new Map<number, number>();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.wss.on('connection', ws => {
      this.clients.add(ws);
      this.sendInit(ws).catch(err => console.error('Erro enviando init', err));
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
        if (!this.knownHouseIds.has(house.id)) {
          try {
            const games = await fetchHouseGames(house);
            this.broadcastMessage({ type: 'houseAdded', data: { house, games } });
          } catch {
            this.broadcastMessage({ type: 'houseAdded', data: { house, games: [] } });
          }
        }
      }
    }
    for (const [id, timer] of this.houseIntervals) {
      if (!activeIds.has(id)) {
        clearInterval(timer);
        this.houseIntervals.delete(id);
        if (this.knownHouseIds.has(id)) {
          this.broadcastMessage({ type: 'houseRemoved', data: { houseId: id } });
        }
      }
    }
    this.knownHouseIds = activeIds;
  }

  private async fetchAndBroadcast(house: BettingHouse) {
    const paused = this.pauseUntil.get(house.id);
    if (paused && paused > Date.now()) return;
    if (paused && paused <= Date.now()) {
      this.pauseUntil.delete(house.id);
      this.failureCounts.set(house.id, 0);
    }

    try {
      const baseTimeout = Number(process.env.RTP_API_TIMEOUT_MS || 20000);
      const common: AxiosRequestConfig = {
        responseType: 'arraybuffer',
        family: 4 as const,
        headers: {
          'Content-Type': 'application/x-protobuf',
          Origin: house.apiUrl.split('/').slice(0, 3).join('/'),
          'User-Agent': 'Mozilla/5.0',
          accept: 'application/x-protobuf',
        },
      };

      const res = await retryRequest(() =>
        axios.post<ArrayBuffer>(
          house.apiUrl,
          Buffer.from([8, 2, 16, 2]),
          { ...common, timeout: baseTimeout },
        ),
      );

      const updates = this.parseProto(res.data, house.id);
      this.failureCounts.set(house.id, 0);
      this.broadcastRtp(updates);
    } catch (err) {
      const fails = (this.failureCounts.get(house.id) || 0) + 1;
      this.failureCounts.set(house.id, fails);
      const threshold = Number(process.env.HOUSE_FAIL_THRESHOLD || 3);
      const cooldown = Number(process.env.HOUSE_COOLDOWN_MS || 300000);
      if (fails >= threshold) {
        if (!this.pauseUntil.has(house.id) || this.pauseUntil.get(house.id)! <= Date.now()) {
          console.warn(`Pausing RTP requests for ${house.name} after ${fails} failures`);
        }
        this.pauseUntil.set(house.id, Date.now() + cooldown);
      }
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

  private broadcastRtp(updates: RtpUpdate[]) {
    if (!updates.length) return;
    this.broadcastMessage({ type: 'rtp', data: updates });
  }

  private broadcastMessage(message: any) {
    const payload = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }

  private async sendInit(ws: WebSocket) {
    const houses = await BettingHouse.findAll();
    const games: Record<number, DecodedHouseGame[]> = {};
    for (const house of houses) {
      try {
        games[house.id] = await fetchHouseGames(house);
      } catch {
        games[house.id] = [];
      }
    }
    const payload: InitData = { houses, games };
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'init', data: payload }));
    }
  }
}

export default function initWebSocket(server: any) {
  const socket = new RtpSocket(server);
  socket.start().catch(err => console.error('Erro inicializando RTP service', err));
}
