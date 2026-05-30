import { type FC } from 'react';

import type { PostSummary } from '../data/blog-utils';
import { Byline } from './Byline';
import { PostTag } from './PostTag';

type BlogCardProps = {
  post: PostSummary;
};

export const BlogCard: FC<BlogCardProps> = ({ post }) => {
  const href = `/blog/${post.slug}/`;

  return (
    <a
      href={href}
      className="themed-border border-border bg-background-secondary shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y flex flex-col overflow-hidden rounded-md text-left transition-all hover:shadow-none"
    >
      <div className="bg-background border-border aspect-video overflow-hidden border-b-2">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <PostTag key={tag} tag={tag} />
          ))}
        </div>

        <h2 className="font-heading text-xl font-black tracking-wide">
          {post.title}
        </h2>

        <p className="text-foreground/80 text-sm leading-relaxed">
          {post.description}
        </p>
      </div>

      <div className="bg-background border-border mt-auto border-t-2 p-4">
        <Byline
          author={post.author}
          date={post.date}
          readTime={post.readTime}
        />
      </div>
    </a>
  );
};
