import { HeartOffIcon, PlusIcon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

type FavoriteCardMenuItemsProps = {
  onAddToQueue: () => void;
  onRemove: () => void;
};

export const FavoriteCardMenuItems: FC<FavoriteCardMenuItemsProps> = ({
  onAddToQueue,
  onRemove,
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
      <Popover.Item
        intent="danger"
        icon={<HeartOffIcon size={16} />}
        onClick={onRemove}
        data-testid="remove-favorite-action"
      >
        {t('actions.removeFromFavorites')}
      </Popover.Item>
    </>
  );
};
