import { type FC } from 'react';

import type { PostSummary } from '../lib/blog/types';
import { BlogCard } from './BlogCard';

type PostGridProps = {
  posts: PostSummary[];
  total: number;
};

export const PostGrid: FC<PostGridProps> = ({ posts, total }) => (
  <section>
    <div className="mb-6 flex items-baseline justify-between">
      <h2 className="font-heading text-2xl font-black tracking-widest uppercase">
        Recent posts
      </h2>
      <span className="text-foreground-secondary font-mono text-xs">
        {`${posts.length} of ${total} posts`}
      </span>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  </section>
);
