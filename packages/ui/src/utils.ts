import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge, validators } from 'tailwind-merge';

const twMerge = extendTailwindMerge<'surface'>({
  extend: {
    classGroups: {
      surface: [{ surface: [validators.isAny] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
