import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';

jest.mock('tinyreq', () => (url: string, callback: (err: any, html: string) => void) => {
  fetch(url)
    .then(response => response.text())
    .then(html => callback(null, html))
    .catch(err => callback(err, ''));
});

import { Bandcamp } from '.'; 

describe('Bandcamp tests', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('search', async () => {
    const searchHtml = `
      <div class="result-items">
        <li>
          <div class="itemtype">album</div>
          <div class="heading">The Seer</div>
          <div class="itemurl">https://swans.bandcamp.com/album/the-seer</div>
          <div class="art"><img src="https://f4.bcbits.com/img/a3233794906_2.jpg" /></div>
          <div class="tags">experimental</div>
        </li>
      </div>
    `;
    fetchMock.get('https://bandcamp.com/search?q=swans&page=1', searchHtml);

    const result = await Bandcamp.search('swans');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe('The Seer');
    expect(result[0].type).toBe('album');
    expect(result[0].url).toBe('https://swans.bandcamp.com/album/the-seer');
    expect(result[0].imageUrl).toBe('https://f4.bcbits.com/img/a3233794906_2.jpg');
    expect(result[0].tags).toContain('experimental');
  });
  
  it('get album info', async () => {
    const albumHtml = `
    <body>
      <div id="name-section">
        <span>SWANS</span>
        <div class="trackTitle">The Seer</div>
      </div>
      <div id="tralbumArt">
        <img src="https://f4.bcbits.com/img/a3233794906_2.jpg" />
      </div>
      <table id="track_table">
        ${Array.from({ length: 11 }).map((_, i) => `
          <tr class="track_row_view">
            <td class="info_link"><a href="/track/track-${i + 1}">Track ${i + 1}</a></td>
            <td><span class="track-title">Track ${i + 1}</span></td>
            <td class="time">3:00</td>
          </tr>
        `).join('')}
      </table>
      <script data-tralbum='{"trackinfo":[]}'></script>
      </body>
    `;
    fetchMock.get('https://swans.bandcamp.com/album/the-seer', albumHtml);

    const result = await Bandcamp.getAlbumInfo('https://swans.bandcamp.com/album/the-seer');
    expect(result.tracks.length).toBe(11);
    expect(result.artist).toBe('SWANS');
    expect(result.title).toBe('The Seer');
    expect(result.imageUrl).toBe('https://f4.bcbits.com/img/a3233794906_2.jpg');
    expect(result.url).toBe('https://swans.bandcamp.com/album/the-seer');
  });
  
  it('get track stream', async () => {
    const trackUrl = 'https://swans.bandcamp.com/track/apostate';
    const html = `<!DOCTYPE html><html><head></head><body>
      <div id="tralbumArt"><a href="https://example.com/art.jpg"><img src="thumb.jpg"/></a></div>
      <script data-tralbum='{"trackinfo":[{"duration":123,"file":{"mp3-128":"https://example.com/stream/mp3-128"},"title":"Apostate"}]}'></script>
    </body></html>`;
    fetchMock.getOnce(trackUrl, {
      body: html,
      headers: { 'Content-Type': 'text/html' }
    });

    const { duration, stream, url, imageUrl, name } = await Bandcamp.getTrackData(trackUrl);
    expect(url).toEqual(trackUrl);
    expect(imageUrl).toBe('https://example.com/art.jpg');
    expect(name).toBe('Apostate');
    expect(stream).toBe('https://example.com/stream/mp3-128');
    expect(duration).toBe(123);
  });
});
