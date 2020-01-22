// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEmptyKeys = <T = any>(obj: T, base: T): Record<string, string[]> => {
  const emptyKeys = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue === base[key][nestedKey]) {
          if (!emptyKeys[key]) {
            emptyKeys[key] = [];
          }
          emptyKeys[key].push(nestedKey);
        }
      }
      // const nestedKeys 
    }
  }

  return emptyKeys;
};
