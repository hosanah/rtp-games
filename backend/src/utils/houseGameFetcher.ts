import axios from 'axios';
import https from 'https';
import { BettingHouse } from '../models/bettingHouse';
import { decodeHouseGames, DecodedHouseGame } from './houseGameDecoder';

interface CacheEntry {
  timestamp: number;
  data: DecodedHouseGame[];
}

const houseCache = new Map<number, CacheEntry>();

export async function fetchHouseGames(house: BettingHouse): Promise<DecodedHouseGame[]> {
  const cached = houseCache.get(house.id);
  const intervalMs =
    house.updateIntervalUnit === 'minutes'
      ? house.updateInterval * 60000
      : house.updateInterval * 1000;
  const now = Date.now();

  const verifySsl = (process.env.VERIFY_SSL || 'true').toLowerCase() !== 'false';
  const httpsAgent = new https.Agent({ rejectUnauthorized: verifySsl });

  if (cached && now - cached.timestamp <= intervalMs) {
    return cached.data;
  }

  const response = await axios.post<ArrayBuffer>(
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
  );

  const games = decodeHouseGames(response.data);
  const gamesWithImages = await Promise.all(
    games.map(async g => {
      const domain = house.name.toLowerCase().includes('cbet') ? 'cbet.gg' : 'cgg.bet.br';
      const url = `https://${domain}/static/v1/casino/game/0/${g.id}/big.webp`;
      try {
        const img = await axios.get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
          httpsAgent,
        });
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
