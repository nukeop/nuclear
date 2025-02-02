export type Options<T extends Record<string, any>> = {
  defaults?: Readonly<T>;
  configName?: string;
  projectName?: string;
  cwd?: string;
  fileExtension?: string;
  clearInvalidConfig?: boolean;
  readonly serialize?: Serialize<T>;
  readonly deserialize?: Deserialize<T>;
  readonly projectSuffix?: string;
  readonly accessPropertiesByDotNotation?: boolean;
  readonly watch?: boolean;
  readonly configFileMode?: number;
};

export type Serialize<T> = (value: T) => string;
export type Deserialize<T> = (text: string) => T;

export type OnDidChangeCallback<T> = (newValue?: T, oldValue?: T) => void;
export type OnDidAnyChangeCallback<T> = (newValue?: Readonly<T>, oldValue?: Readonly<T>) => void;

export type Unsubscribe = () => void;
