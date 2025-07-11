import { decodeRtp, encodeRtp } from '../src/utils/rtpProtoDecoder';

describe('decodeRtp', () => {
  it('should decode encoded binary data', () => {
    const payload = encodeRtp([
      { name: 'Mega Slot', provider: 'Acme', rtp: 9500, image: 'http://img' }
    ]);
    const decoded = decodeRtp(payload);
    expect(decoded).toEqual([
      { name: 'Mega Slot', provider: 'Acme', rtp: '9500', image: 'http://img' }
    ]);
  });
});
