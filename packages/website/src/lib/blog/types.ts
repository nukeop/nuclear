export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  cover?: string;
  readTime: number;
};
