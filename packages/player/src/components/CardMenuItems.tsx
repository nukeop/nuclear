import { HeartIcon, HeartOffIcon, PlusIcon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

type CardMenuItemsProps = {
  isFavorite: boolean;
  onAddToQueue: () => void;
  onToggleFavorite: () => void;
};

export const CardMenuItems: FC<CardMenuItemsProps> = ({
  isFavorite,
  onAddToQueue,
  onToggleFavorite,
}) => {
  const { t } = useTranslation('track');

  return (
    <>
      <Popover.Item
        icon={<PlusIcon size={16} />}
        onClick={onAddToQueue}
        data-testid="add-to-queue-action"
      >
        {t('actions.addToQueue')}
      </Popover.Item>
      {isFavorite && (
        <Popover.Item
          intent="danger"
          icon={<HeartOffIcon size={16} />}
          onClick={onToggleFavorite}
          data-testid="remove-favorite-action"
        >
          {t('actions.removeFromFavorites')}
        </Popover.Item>
      )}
      {!isFavorite && (
        <Popover.Item
          icon={<HeartIcon size={16} />}
          onClick={onToggleFavorite}
          data-testid="add-favorite-action"
        >
          {t('actions.addToFavorites')}
        </Popover.Item>
      )}
    </>
  );
};
