import { getCollection, type CollectionEntry } from 'astro:content';

import { readingTime } from './format';
import type { PostSummary } from './types';

export type BlogPost = CollectionEntry<'blog'>;

const isPublished = (post: BlogPost) =>
  import.meta.env.PROD ? !post.data.draft : true;

const byDateDescending = (first: BlogPost, second: BlogPost) =>
  second.data.date.getTime() - first.data.date.getTime();

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const posts = await getCollection('blog');
  return posts.filter(isPublished).sort(byDateDescending);
};

export const getRelatedPosts = (
  current: BlogPost,
  all: BlogPost[],
  limit = 3,
): BlogPost[] => all.filter((post) => post.id !== current.id).slice(0, limit);

export const toSummary = (post: BlogPost): PostSummary => ({
  slug: post.id,
  title: post.data.title,
  description: post.data.description,
  date: post.data.date.toISOString(),
  author: post.data.author,
  tags: post.data.tags,
  cover: post.data.cover,
  readTime: readingTime(post.body),
});
