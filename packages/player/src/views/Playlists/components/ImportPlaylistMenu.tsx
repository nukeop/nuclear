import { Import, Link } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Popover } from '@nuclearplayer/ui';

import { usePlaylistImport } from '../../../hooks/usePlaylistImport';
import { useImportFromUrlContext } from '../PlaylistsContext';
import { ImportFromUrlDialog } from './ImportFromUrlDialog';

export const ImportPlaylistMenu: FC = () => {
  const { t } = useTranslation('playlists');
  const { openUrlDialog } = useImportFromUrlContext();
  const { importFromJson } = usePlaylistImport();

  return (
    <>
      <Popover
        className="relative"
        panelClassName="bg-background px-0 py-0"
        trigger={
          <Button size="icon" data-testid="import-playlist-button">
            <Import size={16} />
          </Button>
        }
        anchor="bottom start"
      >
        <Popover.Menu>
          <Popover.Item
            icon={<Import size={16} />}
            onClick={importFromJson}
            data-testid="import-json-option"
          >
            {t('importJson')}
          </Popover.Item>
          <Popover.Item
            icon={<Link size={16} />}
            onClick={openUrlDialog}
            data-testid="import-url-option"
          >
            {t('importUrl')}
          </Popover.Item>
        </Popover.Menu>
      </Popover>
      <ImportFromUrlDialog />
    </>
  );
};
