import { Mock, vi } from 'vitest';

import type { commands } from '../../services/tauri/bindings';

type Commands = typeof commands;
type CommandName = keyof Commands;

const unprogrammed = (name: CommandName) => () => {
  throw new Error(
    `Tauri command "${name}" was called but not mocked. Program it with command('${name}').mockResolvedValue(...)`,
  );
};

export type CommandResult<Data, Err> =
  | { status: 'ok'; data: Data }
  | { status: 'error'; error: Err };

export const ok = <Data>(data: Data): CommandResult<Data, never> => ({
  status: 'ok',
  data,
});

export const err = <Err>(error: Err): CommandResult<never, Err> => ({
  status: 'error',
  error,
});

export class TauriCommandMocks {
  private registry = new Map<CommandName, Mock>();

  command<Name extends CommandName>(name: Name): Mock<Commands[Name]> {
    const existing = this.registry.get(name);
    if (existing) {
      return existing as Mock<Commands[Name]>;
    }

    const mock: Mock = vi.fn(unprogrammed(name));
    this.registry.set(name, mock);
    return mock as Mock<Commands[Name]>;
  }

  moduleFactory(): { commands: Commands } {
    const commandsProxy = new Proxy({} as Commands, {
      get: (_target, property) => {
        if (typeof property !== 'string') {
          return undefined;
        }
        return this.command(property as CommandName);
      },
    });

    return { commands: commandsProxy };
  }

  reset(): void {
    this.registry.forEach((mock) => mock.mockReset());
  }
}
