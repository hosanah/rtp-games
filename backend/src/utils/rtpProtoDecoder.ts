import fs from 'fs';
import path from 'path';
import { loadSync } from 'protobufjs';

const protoInDist = path.join(__dirname, '../proto/game.proto');
const protoInSrc = path.join(__dirname, '../../src/proto/game.proto');
const protoPath = fs.existsSync(protoInDist) ? protoInDist : protoInSrc;
const root = loadSync(protoPath);
const GameRtpList = root.lookupType('GameRtpList');

export interface DecodedGameRtp {
  name: string;
  provider: string;
  rtp: string | number;
  image?: string;
}

export function decodeRtp(buffer: ArrayBuffer | Uint8Array): DecodedGameRtp[] {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const msg = GameRtpList.decode(data);
  const obj = GameRtpList.toObject(msg, { longs: String });
  return obj.games as DecodedGameRtp[];
}

export function encodeRtp(games: DecodedGameRtp[]): Uint8Array {
  const message = GameRtpList.fromObject({ games });
  return GameRtpList.encode(message).finish();
}
