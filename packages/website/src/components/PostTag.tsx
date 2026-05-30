import clsx from 'clsx';
import { type FC } from 'react';

import { tagColor } from '../data/blog-utils';

type PostTagProps = {
  tag: string;
  href?: string;
  className?: string;
};

const baseClasses =
  'themed-border border-border font-heading inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase';

export const PostTag: FC<PostTagProps> = ({ tag, href, className }) => {
  const classes = clsx(baseClasses, tagColor(tag), className);

  if (href) {
    return (
      <a
        href={href}
        className={clsx(classes, 'transition-all hover:brightness-95')}
      >
        {tag}
      </a>
    );
  }

  return <span className={classes}>{tag}</span>;
};
