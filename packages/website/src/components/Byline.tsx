import clsx from 'clsx';
import { type FC } from 'react';

import { formatDate, profileUrl } from '../lib/blog/format';
import { Avatar } from './Avatar';

type BylineProps = {
  author: string;
  date: string;
  readTime?: number;
  linkAuthor?: boolean;
  className?: string;
};

export const Byline: FC<BylineProps> = ({
  author,
  date,
  readTime,
  linkAuthor = false,
  className,
}) => (
  <div className={clsx('flex items-center gap-3', className)}>
    {linkAuthor ? (
      <a
        href={profileUrl(author)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${author} on GitHub`}
      >
        <Avatar author={author} />
      </a>
    ) : (
      <Avatar author={author} />
    )}
    <div className="text-foreground-secondary flex flex-col text-sm font-bold">
      {linkAuthor ? (
        <a
          href={profileUrl(author)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground w-fit"
        >
          {author}
        </a>
      ) : (
        <span className="text-foreground">{author}</span>
      )}
      <span className="font-mono text-xs">
        <time dateTime={date}>{formatDate(date)}</time>
        {readTime ? <span> · {readTime} min read</span> : null}
      </span>
    </div>
  </div>
);
