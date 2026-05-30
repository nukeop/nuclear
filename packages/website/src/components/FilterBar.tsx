import clsx from 'clsx';
import { type FC } from 'react';

import { tagColor } from '../data/blog-utils';

export const ALL_TAG = 'all';

type FilterBarProps = {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
};

const pillClasses = (active: boolean, color: string) =>
  clsx(
    'themed-border border-border font-heading cursor-pointer rounded-md px-3 py-1 text-xs font-bold tracking-wider uppercase transition-all',
    active ? color : 'bg-background-secondary hover:brightness-95',
  );

export const FilterBar: FC<FilterBarProps> = ({ tags, selected, onSelect }) => (
  <div className="themed-border border-border bg-background shadow-shadow mb-12 flex flex-wrap items-center gap-2 rounded-md p-4">
    <span className="font-heading text-foreground-secondary mr-2 text-xs font-bold tracking-widest uppercase">
      Filter
    </span>
    <button
      type="button"
      onClick={() => onSelect(ALL_TAG)}
      className={pillClasses(selected === ALL_TAG, 'bg-primary')}
    >
      All
    </button>
    {tags.map((tag) => (
      <button
        key={tag}
        type="button"
        onClick={() => onSelect(tag)}
        className={pillClasses(selected === tag, tagColor(tag))}
      >
        {tag}
      </button>
    ))}
  </div>
);
