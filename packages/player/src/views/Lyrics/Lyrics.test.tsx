import { LyricsWrapper } from './Lyrics.test-wrapper';

describe('Lyrics view', () => {
  describe('states', () => {
    it('shows an empty state when nothing is playing', async () => {
      await LyricsWrapper.mount();

      expect(LyricsWrapper.emptyState.title).toBe('Nothing is playing');
    });
    it.todo('shows a loading state while providers are fetching lyrics');
    it.todo(
      'shows "No lyrics plugins installed" with a button that opens the plugin store when no lyrics provider is registered',
    );
    it.todo(
      'shows "No lyrics for this track" and names the providers that came up empty',
    );
    it.todo('shows "Instrumental" for instrumental tracks');
  });

  describe('plain lyrics', () => {
    it.todo('shows the loaded lyrics');
    it.todo("doesn't show offset controls");
  });

  describe('line synced lyrics', () => {
    it.todo('highlights the line at the current timestamp');
    it.todo('seeks to the start of a line when clicking it');
    it.todo('changes the highlighted line when offset changes to earlier');
    it.todo('changes the highlighted line when offset changes to later');
  });
  describe('word synced lyrics', () => {
    it.todo('highlights the words up to the current timestamp');
    it.todo('changes the highlighted word when offset changes to earlier');
    it.todo('changes the highlighted word when offset changes to later');
  });

  describe('source picker', () => {
    it.todo('shows the top lyrics by default');
    it.todo('lists lyrics from all providers');
    it.todo('shows lyrics from the picked provider');
    it.todo('goes back to the top lyrics when the track changes');
  });

  describe('text size', () => {
    it.todo('makes text smaller');
    it.todo('makes text larger');
    it.todo('disables "Smaller lyrics" at the smallest size');
    it.todo('disables "Larger lyrics" at the largest size');
  });

  it.todo('loads the lyrics of the new track when the track changes');
});
