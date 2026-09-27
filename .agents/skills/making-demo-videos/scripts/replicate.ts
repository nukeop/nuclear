const config = {
  apiUrl: 'https://api.replicate.com/v1',
  pollMs: 2000,
  rateLimitDelayMs: 5000,
  maxRetries: 8,
  timeoutMs: 5 * 60 * 1000,
  requestTimeoutMs: 90 * 1000,
};

type Prediction = {
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output: unknown;
  error: string | null;
  urls: { get: string };
};

const headers = () => ({
  Authorization: `Bearer ${Bun.env.REPLICATE_API_TOKEN}`,
  'Content-Type': 'application/json',
  Prefer: 'wait',
});

const request = async <Value>(
  url: string,
  body?: unknown,
  attempt = 0,
): Promise<Value> => {
  const response = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(config.requestTimeoutMs),
  });
  if (response.status === 429 && attempt < config.maxRetries) {
    await Bun.sleep(config.rateLimitDelayMs * (attempt + 1));
    return request(url, body, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${await response.text()}`);
  }
  return response.json() as Promise<Value>;
};

const firstUrl = (output: unknown): string => {
  if (typeof output === 'string') {
    return output;
  }
  if (Array.isArray(output)) {
    return firstUrl(output[0]);
  }
  throw new Error(`Unexpected output: ${JSON.stringify(output)}`);
};

export const run = async (model: string, input: Record<string, unknown>) => {
  let prediction = await request<Prediction>(
    `${config.apiUrl}/models/${model}/predictions`,
    { input },
  );
  const deadline = Date.now() + config.timeoutMs;
  while (!['succeeded', 'failed', 'canceled'].includes(prediction.status)) {
    if (Date.now() > deadline) {
      throw new Error(`${model}: no result after ${config.timeoutMs} ms`);
    }
    await Bun.sleep(config.pollMs);
    prediction = await request<Prediction>(prediction.urls.get);
  }
  if (prediction.status !== 'succeeded') {
    throw new Error(`${model}: ${prediction.error}`);
  }
  return firstUrl(prediction.output);
};

export const download = async (url: string, path: string) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(config.requestTimeoutMs),
  });
  await Bun.write(path, await response.arrayBuffer());
  return path;
};

export const dataUri = async (path: string) => {
  const file = Bun.file(path);
  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  return `data:${file.type};base64,${base64}`;
};

export const inputSchema = async (model: string) => {
  const { latest_version } = await request<{
    latest_version: {
      openapi_schema: {
        components: { schemas: { Input: { properties: unknown } } };
      };
    };
  }>(`${config.apiUrl}/models/${model}`);
  return latest_version.openapi_schema.components.schemas.Input.properties;
};
