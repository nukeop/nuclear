import { usePlaylistStore } from '../stores/playlistStore';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { ConnectedTrackContextMenuWrapper as Wrapper } from './ConnectedTrackContextMenu.test-wrapper';

vi.mock(
  '../services/playlistFileService',
  async () =>
    (await import('../test/fixtures/playlists')).playlistFileServiceMock,
);

describe('ConnectedTrackContextMenu', () => {
  beforeEach(() => {
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
  });

  describe('playlist submenu', () => {
    it('does not show submenu when no playlists exist', async () => {
      Wrapper.mount();
      await Wrapper.open();

      expect(Wrapper.submenu.trigger).not.toBeInTheDocument();
    });

    it('shows playlists in submenu and adds track on click', async () => {
      const addTracks = vi.fn();
      usePlaylistStore.setState({ addTracks });

      Wrapper.createPlaylists(
        new PlaylistBuilder().withId('p1').withName('Rock Classics'),
        new PlaylistBuilder().withName('Chill Vibes'),
      );

      Wrapper.mount();
      await Wrapper.open();

      expect(Wrapper.submenu.trigger).toHaveTextContent('Add to playlist');

      await Wrapper.submenu.open();

      expect(Wrapper.submenu.filterInput).not.toBeInTheDocument();
      expect(Wrapper.submenu.item('Rock Classics').element).toBeInTheDocument();
      expect(Wrapper.submenu.item('Chill Vibes').element).toBeInTheDocument();

      await Wrapper.submenu.item('Rock Classics').click();

      expect(addTracks).toHaveBeenCalledWith('p1', [
        expect.objectContaining({ title: 'Test Track' }),
      ]);
    });

    it('shows filter and caps at 5 items when many playlists exist', async () => {
      Wrapper.createPlaylists(
        new PlaylistBuilder().withName('Playlist 1'),
        new PlaylistBuilder().withName('Playlist 2'),
        new PlaylistBuilder().withName('Playlist 3'),
        new PlaylistBuilder().withName('Playlist 4'),
        new PlaylistBuilder().withName('Playlist 5'),
        new PlaylistBuilder().withName('Playlist 6'),
        new PlaylistBuilder().withName('Playlist 7'),
      );

      Wrapper.mount();
      await Wrapper.open();
      await Wrapper.submenu.open();

      expect(Wrapper.submenu.filterInput).toBeInTheDocument();
      expect(Wrapper.submenu.items).toHaveLength(5);
    });

    it('filters playlists by name', async () => {
      Wrapper.createPlaylists(
        new PlaylistBuilder().withName('Rock Classics'),
        new PlaylistBuilder().withName('Jazz Standards'),
        new PlaylistBuilder().withName('Rock Ballads'),
        new PlaylistBuilder().withName('Electronic'),
        new PlaylistBuilder().withName('Classical'),
      );

      Wrapper.mount();
      await Wrapper.open();
      await Wrapper.submenu.open();
      await Wrapper.submenu.filter('rock');

      expect(Wrapper.submenu.items).toHaveLength(2);
      expect(Wrapper.submenu.item('Rock Classics').element).toBeInTheDocument();
      expect(Wrapper.submenu.item('Rock Ballads').element).toBeInTheDocument();
    });
  });
});
