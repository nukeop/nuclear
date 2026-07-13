describe('Listening history view', () => {
  it.todo('shows an empty state when nothing has been played yet');
  it.todo('shows recent plays with artwork, title, artist, and relative time');
  it.todo(
    'separates plays with day markers: Today, Yesterday, then calendar dates',
  );

  describe('Pagination', () => {
    it.todo('shows page numbers and highlights the current page');
    it.todo('moves between pages with next and previous');
    it.todo('changes how many plays are shown per page');
    it.todo('hides the pagination controls when all plays fit on one page');
  });

  describe('Row actions', () => {
    it.todo('favorites a track from its history row');
    it.todo('adds a track to the queue from its history row');
    it.todo('plays a track immediately from its history row');
  });
});
