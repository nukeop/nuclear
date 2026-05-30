import { type FC } from 'react';

const avatarUrl = (author: string): string =>
  `https://github.com/${author}.png?size=80`;

type AvatarProps = {
  author: string;
};

export const Avatar: FC<AvatarProps> = ({ author }) => (
  <img
    src={avatarUrl(author)}
    alt={author}
    loading="lazy"
    width={36}
    height={36}
    className="themed-border border-border h-9 w-9 rounded-full object-cover"
  />
);
