import { usePlaylistStore } from '../../stores/playlistStore';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

vi.mock('@tauri-apps/plugin-fs', async () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

describe('import from URL', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
  });

  it.todo('opens the URL import dialog');

  it.todo('disables the import button when the URL input is empty');

  it.todo('imports a playlist from a URL and shows it in the list');

  it.todo('marks the imported playlist as read-only with provider origin');

  it.todo('closes the dialog after a successful import');

  it.todo('shows an error when no providers are registered');

  it.todo('shows an error when no provider matches the URL');

  it.todo('shows an error when the provider fails to fetch');

  it.todo('shows an error when the provider returns invalid data');
});
