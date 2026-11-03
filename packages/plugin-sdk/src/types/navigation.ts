export type NavigationLocation = {
  href: string;
  pathname: string;
  search: Record<string, unknown>;
  hash: string;
};

export type NavigationHost = {
  navigate(path: string): Promise<void>;
  back(): void;
  forward(): void;
  current(): NavigationLocation;
};
