import fs from 'node:fs';
import path from 'node:path';
import {get} from 'lodash';
import { Options } from './electron-store-types';

const createPlainObject = <T = Record<string, unknown>>(): T => Object.create(null);

const isExist = <T = unknown>(data: T): boolean => data !== undefined && data !== null;

const INTERNAL_KEY = '__internal__';

export default class Conf<T extends Record<string, any> = Record<string, unknown>> implements Iterable<[keyof T, T[keyof T]]> {
  readonly path: string;
  readonly events: EventTarget;
  readonly #options: Readonly<Partial<Options<T>>>;
  readonly #defaultValues: Partial<T> = {};

  constructor(partialOptions: Readonly<Partial<Options<T>>> = {}) {
    const options: Partial<Options<T>> = {
      configName: 'config',
      fileExtension: 'json',
      projectSuffix: 'electron',
      clearInvalidConfig: false,
      accessPropertiesByDotNotation: true,
      configFileMode: 0o666,
      ...partialOptions
    };

    if (!options.cwd) {
      if (!options.projectName) {
        throw new Error('Please specify the `projectName` option.');
      }
      options.cwd = path.resolve(options.projectName);
    }

    this.#options = options;

    if (options.defaults) {
      this.#defaultValues = {
        ...this.#defaultValues,
        ...options.defaults
      };
    }

    this.events = new EventTarget();
    const fileExtension = options.fileExtension ? `.${options.fileExtension}` : '';
    this.path = path.resolve(options.cwd, `${options.configName ?? 'config'}${fileExtension}`);

    const fileStore = this.store;
    const store = Object.assign(createPlainObject(), options.defaults, fileStore);

    try {
      if (!fileStore) {
        this.store = store;
      }
    } catch {
      this.store = store;
    }

    if (options.watch) {
      this._watch();
    }
  }

  get<Key extends keyof T>(key: Key): T[Key];
  get<Key extends keyof T>(key: Key, defaultValue: Required<T>[Key]): Required<T>[Key];
  get<Key extends string, Value = unknown>(key: Exclude<Key, keyof T>, defaultValue?: Value): Value;
  get(key: string, defaultValue?: unknown): unknown {
    if (this.#options.accessPropertiesByDotNotation) {
      return this._get(key, defaultValue);
    }
    const { store } = this;
    return key in store ? store[key] : defaultValue;
  }

  set<Key extends keyof T>(key: Key, value?: T[Key]): void;
  set(key: string, value: unknown): void;
  set(object: Partial<T>): void;
  set<Key extends keyof T>(key: Partial<T> | Key | string, value?: T[Key] | unknown): void {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    if (typeof key !== 'object' && value === undefined) {
      throw new TypeError('Use `delete()` to clear values');
    }

    if (this._containsReservedKey(key)) {
      throw new TypeError(`Please don't use the ${INTERNAL_KEY} key, as it's used to manage this module internal operations.`);
    }

    const { store } = this;

    const set = (key: string, value?: T[Key] | T | unknown): void => {
      if (this.#options.accessPropertiesByDotNotation) {
        this._setProperty(store, key, value);
      } else {
        store[key as Key] = value as T[Key];
      }
    };

    if (typeof key === 'object') {
      const object = key;
      for (const [key, value] of Object.entries(object)) {
        set(key, value);
      }
    } else {
      set(key, value);
    }

    this.store = store;
  }

  has<Key extends keyof T>(key: Key | string): boolean {
    if (this.#options.accessPropertiesByDotNotation) {
      return this._hasProperty(this.store, key as string);
    }
    return (key as string) in this.store;
  }

  reset<Key extends keyof T>(...keys: Key[]): void {
    for (const key of keys) {
      if (isExist(this.#defaultValues[key])) {
        this.set(key, this.#defaultValues[key]);
      }
    }
  }

  delete<Key extends keyof T>(key: Key): void;
  delete(key: string): void;
  delete(key: string): void {
    const { store } = this;
    if (this.#options.accessPropertiesByDotNotation) {
      this._deleteProperty(store, key);
    } else {
      delete store[key];
    }
    this.store = store;
  }

  clear(): void {
    this.store = createPlainObject();
    for (const key of Object.keys(this.#defaultValues)) {
      this.reset(key);
    }
  }

  get size(): number {
    return Object.keys(this.store).length;
  }

  get store(): T {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      const deserializedData = JSON.parse(data);
      return Object.assign(createPlainObject(), deserializedData);
    } catch (error: unknown) {
      if ((error as any)?.code === 'ENOENT') {
        this._ensureDirectory();
        return createPlainObject();
      }
      if (this.#options.clearInvalidConfig && (error as Error).name === 'SyntaxError') {
        return createPlainObject();
      }
      throw error;
    }
  }

  set store(value: T) {
    this._ensureDirectory();
    this._write(value);
    this.events.dispatchEvent(new Event('change'));
  }

  *[Symbol.iterator](): IterableIterator<[keyof T, T[keyof T]]> {
    for (const [key, value] of Object.entries(this.store)) {
      yield [key, value];
    }
  }

  private _handleChange<Key extends keyof T>(
    getter: () => T | undefined,
    callback: (newValue: T | undefined, oldValue: T | undefined) => void
  ): () => void {
    let currentValue = getter();
    const onChange = (): void => {
      const oldValue = currentValue;
      const newValue = getter();
      if (this._isDeepStrictEqual(newValue, oldValue)) {
        return;
      }
      currentValue = newValue;
      callback.call(this, newValue, oldValue);
    };
    this.events.addEventListener('change', onChange);
    return () => {
      this.events.removeEventListener('change', onChange);
    };
  }

  private _isDeepStrictEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private _setProperty(store: any, key: string, value: any) {
    const keys = key.split('.');
    let current = store;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  private _hasProperty(store: any, key: string): boolean {
    const keys = key.split('.');
    let current = store;
    for (const key of keys) {
      if (!current[key]) {
        return false;
      }
      current = current[key];
    }
    return true;
  }

  private _deleteProperty(store: any, key: string) {
    const keys = key.split('.');
    let current = store;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        return;
      }
      current = current[keys[i]];
    }
    delete current[keys[keys.length - 1]];
  }

  private _ensureDirectory(): void {
    fs.mkdirSync(path.dirname(this.path), { recursive: true });
  }

  private _write(value: T): void {
    const data = JSON.stringify(value, undefined, '\t');
    fs.writeFileSync(this.path, data, { mode: this.#options.configFileMode });
  }

  private _watch(): void {
    this._ensureDirectory();
    if (!fs.existsSync(this.path)) {
      this._write(createPlainObject<T>());
    }
    fs.watchFile(this.path, { persistent: false }, () => {
      this.events.dispatchEvent(new Event('change'));
    });
  }

  private _containsReservedKey(key: string | Partial<T>): boolean {
    if (typeof key === 'object') {
      const firstKey = Object.keys(key)[0];
      if (firstKey === INTERNAL_KEY) {
        return true;
      }
    }
    if (typeof key !== 'string') {
      return false;
    }
    if (this.#options.accessPropertiesByDotNotation) {
      if (key.startsWith(`${INTERNAL_KEY}.`)) {
        return true;
      }
      return false;
    }
    return false;
  }

  private _get<Key extends keyof T>(key: Key): T[Key] | undefined;
  private _get<Key extends keyof T, Default = unknown>(key: Key, defaultValue: Default): T[Key] | Default;
  private _get<Key extends keyof T, Default = unknown>(key: Key | string, defaultValue?: Default): Default | undefined {
    return get(this.store, key as string, defaultValue as T[Key]);
  }
}
