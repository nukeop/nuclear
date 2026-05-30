import { type FC } from 'react';

import type { PostSummary } from '../data/blog-utils';
import { Byline } from './Byline';
import { PostTag } from './PostTag';

type FeaturedPostProps = {
  post: PostSummary;
};

export const FeaturedPost: FC<FeaturedPostProps> = ({ post }) => {
  const href = `/blog/${post.slug}/`;

  return (
    <a
      href={href}
      className="themed-border border-border bg-background-secondary shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y grid grid-cols-1 overflow-hidden rounded-md text-left transition-all hover:shadow-none md:grid-cols-2"
    >
      <div className="bg-background border-border aspect-video overflow-hidden border-b-2 md:aspect-auto md:border-r-2 md:border-b-0">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-1 flex-col gap-4 p-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <PostTag key={tag} tag={tag} />
            ))}
          </div>

          <h2 className="font-heading text-3xl font-black tracking-wide md:text-4xl">
            {post.title}
          </h2>

          <p className="text-foreground/80 leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="bg-background border-border border-t-2 px-8 py-4">
          <Byline
            author={post.author}
            date={post.date}
            readTime={post.readTime}
          />
        </div>
      </div>
    </a>
  );
};
