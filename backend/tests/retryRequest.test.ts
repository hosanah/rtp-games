import { retryRequest } from '../src/utils/retryRequest';

it('retries until success', async () => {
  let attempts = 0;
  const fn = jest.fn(async () => {
    attempts++;
    if (attempts < 2) {
      throw new Error('fail');
    }
    return 'ok';
  });

  const result = await retryRequest(fn, 2, 1);

  expect(fn).toHaveBeenCalledTimes(2);
  expect(result).toBe('ok');
});
