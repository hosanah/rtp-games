import fs from 'fs';
import path from 'path';
import { loadSync } from 'protobufjs';

const protoInDist = path.join(__dirname, '../proto/house_game.proto');
const protoInSrc = path.join(__dirname, '../../src/proto/house_game.proto');
const protoPath = fs.existsSync(protoInDist) ? protoInDist : protoInSrc;
const root = loadSync(protoPath);
const GameList = root.lookupType('HouseGameList');

export interface DecodedHouseGame {
  id: string;
  name: string;
  provider: string;
  image?: string;
  imageUrl?: string;
  rtpDecimal: number;
  signedInt: string;
}

export function decodeHouseGames(buffer: ArrayBuffer | Uint8Array): DecodedHouseGame[] {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const msg = GameList.decode(data);
  const obj = GameList.toObject(msg, { longs: String });
  return (obj.games as any[]).map(g => ({
    id: g.id as string,
    name: g.name as string,
    provider: g.provider?.name as string,
    image: g.image as string,
    rtpDecimal: g.rtpDecimal as number,
    signedInt: g.signedInt as string,
  }));
}
