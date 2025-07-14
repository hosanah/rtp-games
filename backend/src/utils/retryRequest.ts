export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 500
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('unreachable');
}
