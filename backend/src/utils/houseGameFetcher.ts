import axios from 'axios';
import { retryRequest } from './retryRequest';
import https from 'https';
import { BettingHouse } from '../models/bettingHouse';
import { decodeHouseGames, DecodedHouseGame } from './houseGameDecoder';

interface CacheEntry {
  timestamp: number;
  data: DecodedHouseGame[];
}

const houseCache = new Map<number, CacheEntry>();
const failCounts = new Map<number, number>();
const pauseUntil = new Map<number, number>();

export async function fetchHouseGames(house: BettingHouse): Promise<DecodedHouseGame[]> {
  const cached = houseCache.get(house.id);
  const intervalMs =
    house.updateIntervalUnit === 'minutes'
      ? house.updateInterval * 60000
      : house.updateInterval * 1000;
  const now = Date.now();

  const paused = pauseUntil.get(house.id);
  if (paused && paused > now) return [];
  if (paused && paused <= now) {
    pauseUntil.delete(house.id);
    failCounts.set(house.id, 0);
  }

  const verifySsl = (process.env.VERIFY_SSL || 'true').toLowerCase() !== 'false';
  const httpsAgent = new https.Agent({ rejectUnauthorized: verifySsl });

  if (cached && now - cached.timestamp <= intervalMs) {
    return cached.data;
  }

  let response: { data: ArrayBuffer };
  try {
    response = await retryRequest(() =>
      axios.post<ArrayBuffer>(
        house.apiUrl,
        Buffer.from([8, 1, 16, 2]),
        {
          responseType: 'arraybuffer',
          timeout: Number(process.env.RTP_API_TIMEOUT_MS || 20000),
          family: 4,
          httpsAgent,
          headers: {
            accept: 'application/x-protobuf',
            'content-type': 'application/x-protobuf',
            'x-language-iso': 'pt-BR',
          },
        },
      ),
    );
    failCounts.set(house.id, 0);
  } catch (err) {
    const count = (failCounts.get(house.id) || 0) + 1;
    failCounts.set(house.id, count);
    const threshold = Number(process.env.HOUSE_FAIL_THRESHOLD || 3);
    const cooldown = Number(process.env.HOUSE_COOLDOWN_MS || 300000);
    if (count >= threshold) {
      if (!pauseUntil.has(house.id) || pauseUntil.get(house.id)! <= now) {
        console.warn(`Pausing game fetch for ${house.name} after ${count} failures`);
      }
      pauseUntil.set(house.id, Date.now() + cooldown);
    }
    throw err;
  }

  const games = decodeHouseGames(response.data);
  const gamesWithImages = await Promise.all(
    games.map(async g => {
      const domain = house.name.toLowerCase().includes('cbet') ? 'cbet.gg' : 'cgg.bet.br';
      const url = `https://${domain}/static/v1/casino/game/0/${g.id}/big.webp`;
      try {
        const img = await retryRequest(() =>
          axios.get<ArrayBuffer>(url, {
            responseType: 'arraybuffer',
            httpsAgent,
          }),
        );
        const b64 = Buffer.from(img.data).toString('base64');
        return { ...g, imageUrl: b64 } as DecodedHouseGame;
      } catch {
        return { ...g } as DecodedHouseGame;
      }
    })
  );

  houseCache.set(house.id, { timestamp: now, data: gamesWithImages });
  return gamesWithImages;
}
