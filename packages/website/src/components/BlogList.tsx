import { useMemo, useState, type FC, type ReactNode } from 'react';

import type { PostSummary } from '../lib/blog/types';
import { FeaturedPost } from './FeaturedPost';
import { ALL_TAG, FilterBar } from './FilterBar';
import { PostGrid } from './PostGrid';

type BlogListProps = {
  posts: PostSummary[];
  rss?: ReactNode;
};

export const BlogList: FC<BlogListProps> = ({ posts, rss }) => {
  const [selectedTag, setSelectedTag] = useState(ALL_TAG);

  const visiblePosts = useMemo(
    () =>
      selectedTag === ALL_TAG
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag)),
    [posts, selectedTag],
  );

  const [featured, ...rest] = visiblePosts;

  return (
    <>
      <div className="mb-12 flex items-stretch gap-2">
        <FilterBar selected={selectedTag} onSelect={setSelectedTag} />
        {rss}
      </div>

      {featured ? (
        <section className="mb-16">
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {rest.length > 0 ? <PostGrid posts={rest} total={posts.length} /> : null}
    </>
  );
};
