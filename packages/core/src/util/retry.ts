import { logger } from '..';

export async function retryWithExponentialBackoff<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let retries = 0;
  let delay = delayMs;

  while (retries < maxRetries) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      logger.log(`API call failed, retrying in ${delay}ms...`, {
        status: (error as any).response?.status,
        response: (error as any).response?.data
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
      retries++;
      delay *= 2; // Exponential backoff

      if (retries === maxRetries) {
        throw new Error('Max retries exceeded');
      }
    }
  }

  throw new Error('Max retries exceeded');
}
