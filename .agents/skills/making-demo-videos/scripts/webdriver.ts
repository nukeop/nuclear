const config = {
  url: 'http://127.0.0.1:4445',
  pollMs: 150,
  timeoutMs: 8000,
  reloadDelayMs: 50,
  textSelector: 'button, [role=menuitem], [role=tab], a, li, span, div',
};

type Point = { x: number; y: number };

type PageMatch = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  text: string;
};

export type Match = PageMatch & { center: Point };

type WindowRect = { x: number; y: number; width: number; height: number };

const locateInPage = (selector: string, text: string | null) => {
  const matchesText = (element: Element) =>
    !text ||
    (element.textContent ?? '')
      .trim()
      .toLowerCase()
      .includes(text.toLowerCase());
  const isOnTop = (element: Element, rect: DOMRect) => {
    const topElement = document.elementFromPoint(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
    );
    return (
      topElement !== null &&
      (element.contains(topElement) || topElement.contains(element))
    );
  };
  const describe = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      visible: isOnTop(element, rect),
      text: (element.textContent ?? '').trim().slice(0, 60),
    };
  };
  return {
    innerHeight: window.innerHeight,
    matches: [...document.querySelectorAll(selector)]
      .filter(matchesText)
      .map(describe),
  };
};

const listTestIdsInPage = () =>
  [
    ...new Set(
      [...document.querySelectorAll<HTMLElement>('[data-testid]')].map(
        (element) => element.dataset.testid,
      ),
    ),
  ].sort();

const reloadInPage = (delayMs: number) =>
  setTimeout(() => location.reload(), delayMs);

const request = async <Value>(
  method: string,
  path: string,
  body?: unknown,
): Promise<Value> => {
  const response = await fetch(config.url + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const { value } = (await response.json()) as { value: Value };
  return value;
};

const pollUntil = async <Value>(
  attempt: () => Promise<Value | undefined>,
  description: string,
  timeoutMs: number,
) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await attempt();
    if (result !== undefined) {
      return result;
    }
    await Bun.sleep(config.pollMs);
  }
  throw new Error(`Not found: ${description}`);
};

const byArea = (first: Match, second: Match) =>
  first.width * first.height - second.width * second.height;

export class Page {
  private constructor(private readonly sessionId: string) {}

  static async connect() {
    const { sessionId } = await request<{ sessionId: string }>(
      'POST',
      '/session',
      { capabilities: {} },
    );
    return new Page(sessionId);
  }

  run<Value>(script: (...args: never[]) => unknown, ...args: unknown[]) {
    return request<Value>('POST', `/session/${this.sessionId}/execute/sync`, {
      script: `return (${script.toString()})(...arguments);`,
      args,
    });
  }

  testIds() {
    return this.run<string[]>(listTestIdsInPage);
  }

  reload() {
    return this.run(reloadInPage, config.reloadDelayMs);
  }

  async findAll(
    selector: string,
    text: string | null = null,
  ): Promise<Match[]> {
    const found = await this.run<{ innerHeight: number; matches: PageMatch[] }>(
      locateInPage,
      selector,
      text,
    );
    const frame = await request<WindowRect>(
      'GET',
      `/session/${this.sessionId}/window/rect`,
    );
    const contentTop = frame.y + frame.height - found.innerHeight;
    return found.matches.map((match) => ({
      ...match,
      center: {
        x: frame.x + match.x + match.width / 2,
        y: contentTop + match.y + match.height / 2,
      },
    }));
  }

  async findVisible(selector: string, text: string | null) {
    return (await this.findAll(selector, text)).filter(
      (match) => match.visible,
    );
  }

  find(selector: string, text: string | null = null, index = 0) {
    return pollUntil(
      async () => (await this.findVisible(selector, text))[index],
      `${selector} ${text ?? ''}`,
      config.timeoutMs,
    );
  }

  findText(text: string, selector = config.textSelector) {
    return pollUntil(
      async () => (await this.findVisible(selector, text)).sort(byArea)[0],
      `text "${text}"`,
      config.timeoutMs,
    );
  }
}
