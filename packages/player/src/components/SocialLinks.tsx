import { openUrl } from '@tauri-apps/plugin-opener';
import { FC } from 'react';
import { LuGlobe } from 'react-icons/lu';
import { SiDiscord, SiGithub, SiMastodon } from 'react-icons/si';

import { Button, Tooltip } from '@nuclearplayer/ui';

const SOCIAL_LINKS = [
  {
    label: 'Discord',
    icon: <SiDiscord size={16} />,
    url: 'https://discord.gg/JqPjKxE',
  },
  {
    label: 'GitHub',
    icon: <SiGithub size={16} />,
    url: 'https://github.com/nukeop/nuclear',
  },
  {
    label: 'Mastodon',
    icon: <SiMastodon size={16} />,
    url: 'https://fosstodon.org/@nuclearplayer',
  },
  {
    label: 'Website',
    icon: <LuGlobe size={16} />,
    url: 'https://nuclearplayer.com',
  },
] as const;

export const SocialLinks: FC = () => (
  <div className="flex items-center gap-1">
    {SOCIAL_LINKS.map((link) => (
      <Tooltip key={link.label} content={link.label} side="top">
        <Button variant="text" size="icon-sm" onClick={() => openUrl(link.url)}>
          {link.icon}
        </Button>
      </Tooltip>
    ))}
  </div>
);
