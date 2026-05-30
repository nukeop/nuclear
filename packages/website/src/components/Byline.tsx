import clsx from 'clsx';
import { type FC } from 'react';

import { avatarUrl, formatDate } from '../data/blog-utils';

type BylineProps = {
  author: string;
  date: string;
  readTime?: number;
  className?: string;
};

export const Byline: FC<BylineProps> = ({
  author,
  date,
  readTime,
  className,
}) => (
  <div className={clsx('flex items-center gap-3', className)}>
    <img
      src={avatarUrl(author)}
      alt={author}
      loading="lazy"
      width={36}
      height={36}
      className="themed-border border-border h-9 w-9 rounded-full object-cover"
    />
    <div className="text-foreground-secondary flex flex-col text-sm font-bold">
      <span className="text-foreground">{author}</span>
      <span className="font-mono text-xs">
        <time dateTime={date}>{formatDate(date)}</time>
        {readTime ? <span> · {readTime} min read</span> : null}
      </span>
    </div>
  </div>
);
