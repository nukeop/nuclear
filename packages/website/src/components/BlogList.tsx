import { useMemo, useState, type FC } from 'react';

import { collectTags, type PostSummary } from '../data/blog-utils';
import { FeaturedPost } from './FeaturedPost';
import { ALL_TAG, FilterBar } from './FilterBar';
import { PostGrid } from './PostGrid';

type BlogListProps = {
  posts: PostSummary[];
};

export const BlogList: FC<BlogListProps> = ({ posts }) => {
  const [selectedTag, setSelectedTag] = useState(ALL_TAG);
  const tags = useMemo(() => collectTags(posts), [posts]);

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
      <FilterBar tags={tags} selected={selectedTag} onSelect={setSelectedTag} />

      {featured ? (
        <section className="mb-16">
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {rest.length > 0 ? <PostGrid posts={rest} total={posts.length} /> : null}
    </>
  );
};
