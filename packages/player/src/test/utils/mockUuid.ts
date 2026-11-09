class MockUuid {
  #counter = 0;
  #nextIds: string[] = [];

  v4 = (): string => this.#nextIds.shift() ?? `mock-uuid-${this.#counter++}`;

  willReturn(...ids: string[]): void {
    this.#nextIds.push(...ids);
  }

  reset(): void {
    this.#counter = 0;
    this.#nextIds = [];
  }
}

export const mockUuid = new MockUuid();
