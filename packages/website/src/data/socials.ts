import { stars } from './github';

export type Social = {
  name: string;
  label: string;
  icon: string;
  url: string;
  variant: 'discord' | 'secondary';
};

export const socials: Social[] = [
  {
    name: 'Discord',
    label: 'Join our Discord',
    icon: 'simple-icons:discord',
    url: 'https://discord.gg/JqPjKxE',
    variant: 'discord',
  },
  {
    name: 'GitHub',
    label: stars ? `${stars} stars` : 'Star on GitHub',
    icon: 'simple-icons:github',
    url: 'https://github.com/nukeop/nuclear',
    variant: 'secondary',
  },
  {
    name: 'Mastodon',
    label: 'Mastodon',
    icon: 'simple-icons:mastodon',
    url: 'https://fosstodon.org/@nuclearplayer',
    variant: 'secondary',
  },
];
