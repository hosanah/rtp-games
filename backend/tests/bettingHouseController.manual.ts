import assert from 'assert';
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
import { createBettingHouse, updateBettingHouse } from '../src/controllers/bettingHouseController';
import { BettingHouse } from '../src/models/bettingHouse';

class MockResponse {
  statusCode = 0;
  body: any;
  status(code: number) { this.statusCode = code; return this; }
  json(obj: any) { if (this.statusCode === 0) this.statusCode = 200; this.body = obj; return this; }
  send() { return this; }
}

class MockRequest {
  body: any;
  params: any;
  constructor(body: any = {}, params: any = {}) {
    this.body = body;
    this.params = params;
  }
}

async function run() {
  // Stub methods
  (BettingHouse as any).create = async (data: any) => ({ id: 1, ...data });
  const house = { id: 1, update: async function (data: any) { Object.assign(this, data); } } as any;
  (BettingHouse as any).findByPk = async (id: number) => (id === 1 ? house : null);

  // create valid
  const validReq = new MockRequest({
    name: 'Test',
    apiName: 'test',
    apiUrl: 'http://x',
    updateInterval: 5,
    updateIntervalUnit: 'seconds',
    currency: 'USD'
  });
  const validRes = new MockResponse();
  await createBettingHouse(validReq as any, validRes as any);
  assert.strictEqual(validRes.statusCode, 201, 'create should accept valid interval');

  // create invalid (0)
  const invalidReq = new MockRequest({
    name: 'Test',
    apiName: 'test',
    apiUrl: 'http://x',
    updateInterval: 0,
    updateIntervalUnit: 'seconds',
    currency: 'USD'
  });
  const invalidRes = new MockResponse();
  await createBettingHouse(invalidReq as any, invalidRes as any);
  assert.strictEqual(invalidRes.statusCode, 400, 'create should reject zero interval');

  // update invalid (0)
  const updInvalidReq = new MockRequest({
    name: 'Test',
    apiName: 'test',
    apiUrl: 'http://x',
    updateInterval: 0,
    updateIntervalUnit: 'seconds',
    currency: 'USD'
  }, { id: '1' });
  const updInvalidRes = new MockResponse();
  await updateBettingHouse(updInvalidReq as any, updInvalidRes as any);
  assert.strictEqual(updInvalidRes.statusCode, 400, 'update should reject zero interval');

  // update valid
  const updValidReq = new MockRequest({
    name: 'Test',
    apiName: 'test',
    apiUrl: 'http://x',
    updateInterval: 5,
    updateIntervalUnit: 'seconds',
    currency: 'USD'
  }, { id: '1' });
  const updValidRes = new MockResponse();
  await updateBettingHouse(updValidReq as any, updValidRes as any);
  assert.strictEqual(updValidRes.statusCode, 200, 'update should accept valid interval');

  console.log('All tests passed');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
