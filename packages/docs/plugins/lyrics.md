---
description: How to write a plugin to provide lyrics for the current track, from plain text to word-synced lines with furigana and translations.
---

# Lyrics

## Lyrics providers

Lyrics providers supply the lyrics that Nuclear shows in the lyrics view. When a track plays, Nuclear asks every registered lyrics provider for lyrics, ranks the results, and shows the best result. In the lyrics view, the user can select the result of a different provider.

A provider can return plain lyrics, line-synced lyrics, word-synced lyrics, or a statement that the track is instrumental. The data model can also hold sections, vocalists, background vocals, translations, romanization, and furigana.

Plugins can also read lyrics from the registered providers through `api.Lyrics`.

---

## Implement a provider

### Minimal example

You register a lyrics provider with `api.Providers.register()`, like any other provider. The provider needs an `id`, `kind: 'lyrics'`, a `name`, and one method, `getLyrics`. The example below sends requests to a made-up service at `lyrics.example.com`. The service has one endpoint that searches for songs and one endpoint that returns the timed lines of a song.

```typescript
import type { Track } from '@nuclearplayer/model';
import type {
  LyricsProvider,
  NuclearPlugin,
  NuclearPluginAPI,
} from '@nuclearplayer/plugin-sdk';

type ExampleHit = {
  trackId: number;
  title: string;
  artist: string;
};

type ExampleLine = {
  startMs: number;
  endMs: number;
  text: string;
};

const API_URL = 'https://lyrics.example.com/api';

const createProvider = (api: NuclearPluginAPI): LyricsProvider => {
  const findHit = async (track: Track) => {
    const params = new URLSearchParams({
      title: track.title,
      artist: track.artists[0]?.name ?? '',
    });
    const response = await api.Http.fetch(`${API_URL}/search?${params}`);
    const hits: ExampleHit[] = await response.json();
    return hits.find(
      (hit) => hit.title.toLowerCase() === track.title.toLowerCase(),
    );
  };

  return {
    id: 'example-lyrics',
    kind: 'lyrics',
    name: 'Example Lyrics',

    async getLyrics(track: Track) {
      const hit = await findHit(track);
      if (!hit) {
        return undefined;
      }

      const response = await api.Http.fetch(`${API_URL}/tracks/${hit.trackId}`);
      const lines: ExampleLine[] = await response.json();

      return {
        type: 'lineSynced',
        metadata: {},
        sections: [
          {
            lines: lines.map((line) => ({
              startMs: line.startMs,
              endMs: line.endMs,
              segments: [{ text: line.text }],
            })),
          },
        ],
      };
    },
  };
};

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(createProvider(api));
  },
  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister('example-lyrics');
  },
};

export default plugin;
```

For a song with the lines "Lorem ipsum dolor sit amet" and "Consectetur adipiscing elit", `getLyrics` returns this:

```typescript
{
  type: 'lineSynced',
  metadata: {},
  sections: [
    {
      lines: [
        { startMs: 12400, endMs: 15800, segments: [{ text: 'Lorem ipsum dolor sit amet' }] },
        { startMs: 15800, endMs: 19300, segments: [{ text: 'Consectetur adipiscing elit' }] },
      ],
    },
  ],
}
```

{% hint style="warning" %}
Always unregister your provider in `onDisable`. If you do not unregister it, the provider stays registered. Nuclear then continues to call it after the plugin is disabled.
{% endhint %}

### The `getLyrics` method

`getLyrics` is the only method of a lyrics provider. It is required, so lyrics providers have no capabilities.

| Method | Receives | Returns |
|--------|----------|---------|
| `getLyrics(track, options)` | The whole `Track` | `Promise<Lyrics \| undefined>` |

`getLyrics` finds the lyrics for the track that plays. It receives the whole `Track`, so you can use any of its fields to find an accurate match, for example the duration. Your provider knows how its service matches songs, so it selects the best match. If your service needs more than one request, for example a search and then a download, do all of them inside `getLyrics`. The example above searches, selects the first hit with the same title as the track, and then gets the lines of that hit.

Return `undefined` if your service has no match for the track. This is different from instrumental lyrics. `undefined` tells Nuclear that your provider does not know the track. `{ type: 'instrumental' }` tells Nuclear that your provider knows the track and that the track has no lyrics.

### The `options` argument

`getLyrics` receives an `options` object as its last argument. The object is empty now, and reserved for future use. This way we can add new options while keeping backwards compatibility. Your provider can ignore this object for now.

### Errors

If `getLyrics` throws, Nuclear logs the error and ignores your provider for that track. The results of the other providers still show. Throw an error when a request fails, for example because of a network failure. Return `undefined` when your service has no lyrics for the track.

---

## How Nuclear combines providers

Lyrics work like the dashboard and unlike metadata and streaming. Metadata and streaming use one active provider that the user selects in the Sources view. For lyrics, Nuclear uses every registered lyrics provider for every track.

When a track plays, Nuclear does these steps:

1. It calls `getLyrics` on every lyrics provider in parallel.
2. It ignores the providers that return `undefined` or throw an error.
3. It ranks the remaining results by type.
4. It shows the result with the highest rank.

The ranking order is:

1. `wordSynced`
2. `lineSynced`
3. `plain`
4. `instrumental`

An instrumental result ranks below all results with text. One provider can say that the track is instrumental while a different provider returns text. In that case, the track probably has lyrics, so Nuclear shows the text.

The lyrics view has a source picker that lists the results with text. For each result, the source picker shows the provider name and the lyrics type. The user can select a different result in the source picker. The selection applies to the current playback only, and Nuclear does not remember it.

---

## The lyrics data model

All lyrics types are in `@nuclearplayer/model`. A `Lyrics` object is one of four types, and its `type` field identifies the type:

```typescript
type Lyrics =
  | PlainLyrics
  | LineSyncedLyrics
  | WordSyncedLyrics
  | InstrumentalLyrics;
```

| `type` | Contents |
|--------|----------|
| `'plain'` | Sections of lines without timing |
| `'lineSynced'` | Sections of lines, each with a start and an end time |
| `'wordSynced'` | Sections of timed lines, where each segment of a line also has a start and an end time |
| `'instrumental'` | No text. The track has no lyrics. |

Every type has a `metadata` object. All types except `instrumental` have `sections`:

```typescript
type PlainLyrics = {
  type: 'plain';
  metadata: LyricsMetadata;
  sections: LyricsSection<LyricsLine<LyricsSegment>>[];
};

type LineSyncedLyrics = {
  type: 'lineSynced';
  metadata: LyricsMetadata;
  sections: LyricsSection<SyncedLyricsLine<LyricsSegment>>[];
};

type WordSyncedLyrics = {
  type: 'wordSynced';
  metadata: LyricsMetadata;
  sections: LyricsSection<SyncedLyricsLine<TimedLyricsSegment>>[];
};

type InstrumentalLyrics = {
  type: 'instrumental';
  metadata: LyricsMetadata;
};
```

Return `instrumental` only when your service says that the track has no lyrics. If your service has no entry for the track, return `undefined` from `getLyrics` instead.

### Metadata

```typescript
type LyricsMetadata = {
  vocalists?: LyricsVocalist[];
};

type LyricsVocalist = {
  id: string;
  name?: string;
  type: 'person' | 'group';
};
```

Use an empty object if your service gives no metadata.

`vocalists` lists the people and groups who sing. Lines refer to vocalists by their `id`, so the `id` only has to be unique inside one `Lyrics` object.

### Sections

```typescript
type LyricsSection<TLine> = {
  label?: string;
  lines: TLine[];
};
```

A section is a group of lines, for example a verse or a chorus. `label` is the header text that your service gives, for example `Verse 2` or `Skit`. Nuclear shows the label as it is and does not translate it. If your service has no section information, put all lines in one section without a label.

### Lines

```typescript
type LyricsLine<TSegment> = {
  segments: TSegment[];
  background?: TSegment[];
  vocalistIds?: string[];
  annotations?: LineAnnotation[];
};

type SyncedLyricsLine<TSegment> = LyricsLine<TSegment> & {
  startMs: number;
  endMs: number;
};
```

`segments` holds the text of the line. Plain lyrics use `LyricsLine`. Line-synced and word-synced lyrics use `SyncedLyricsLine`, which adds a start and an end time.

`background` holds background vocals. For example, the line `Lorem ipsum dolor sit amet (sit amet, sit amet)` has background vocals at the end. Put the main text in `segments`. Put the background vocals in `background`, without the parentheses:

```typescript
{
  startMs: 61200,
  endMs: 64100,
  segments: [{ text: 'Lorem ipsum dolor sit amet' }],
  background: [{ text: 'sit amet, sit amet' }],
  vocalistIds: ['lead'],
}
```

`vocalistIds` lists the ids of the vocalists from `metadata.vocalists` who sing the line. The model puts vocalists on lines and not on sections, because the vocalists can change from line to line inside one section.

### Segments

```typescript
type LyricsSegment = {
  text: string;
  ruby?: string;
};

type TimedLyricsSegment = LyricsSegment & {
  startMs: number;
  endMs: number;
};
```

In plain and line-synced lyrics, a segment is a run of text. Most lines have one segment. Split a line into more segments only when part of the line needs ruby.

In word-synced lyrics, a segment is also the unit of timing. A segment can be one word, one syllable, or one character. Your service decides the size. Nuclear does not add spaces when it joins the segments of a line. Thus, put the spaces between words in the segment text:

```typescript
segments: [
  { text: 'Lorem ', startMs: 12400, endMs: 12900 },
  { text: 'ipsum ', startMs: 12900, endMs: 13500 },
  { text: 'dolor', startMs: 13500, endMs: 14200 },
]
```

### Timing

All times are in milliseconds from the start of the track. `startMs` and `endMs` are required on synced lines and on timed segments. If your service gives only start times, use the start of each line as the end of the previous line.

Do not add instrumental breaks to the data. Nuclear calculates them from the gaps between lines. A gap of 5 seconds or more between two lines, or before the first line, shows as an instrumental break in the view.

### Translations and romanization

```typescript
type LineAnnotation = {
  type: 'translation' | 'romanization';
  language: string;
  text: string;
};
```

`annotations` holds translations and romanizations of the whole line. Each annotation has its own BCP 47 `language` code. A line in Japanese can have a romanization with the code `ja-Latn` and an English translation with the code `en`:

```typescript
{
  startMs: 30500,
  endMs: 33800,
  segments: [{ text: '夜に駆ける' }],
  annotations: [
    { type: 'romanization', language: 'ja-Latn', text: 'Yoru ni kakeru' },
    { type: 'translation', language: 'en', text: 'Lorem ipsum dolor' },
  ],
}
```

Annotations have no timing of their own. They use the timing of their line.

### Ruby and furigana

Ruby is small annotation text above the base text. Japanese furigana are ruby, and so are Chinese pinyin and zhuyin above characters. In HTML, ruby uses the `<ruby>` and `<rt>` elements.

The `ruby` of a segment is the reading of the whole `text` of that segment. To put furigana on one kanji, make that kanji its own segment. For the phrase 夜に駆ける, only 夜 and 駆 have readings:

```typescript
segments: [
  { text: '夜', ruby: 'よる' },
  { text: 'に' },
  { text: '駆', ruby: 'か' },
  { text: 'ける' },
]
```

Nuclear renders this as `<ruby>夜<rt>よる</rt></ruby>に<ruby>駆<rt>か</rt></ruby>ける`.

In word-synced lyrics, your service can time a word like 駆ける as one unit while only 駆 has a reading. In that case, split the word into two segments, 駆 and ける. Then divide the time range of the word between the two segments.

The model has no character offsets for ruby inside a segment. JavaScript string offsets count UTF-16 code units. Thus, they give wrong results for characters outside the Basic Multilingual Plane.

Ruby has no timing of its own. It uses the timing of its segment.

---

## What the lyrics view shows

The lyrics view does not show all parts of the data model yet. It shows these parts:

* In plain lyrics, the label of each section and the names of its vocalists, as a small header above the lines of the section.
* Ruby above its text.
* Translations and romanizations below their line.
* Background vocals in parentheses after their line.
* In synced lyrics, instrumental breaks for gaps of 5 seconds or more between lines.

It does not show section labels and vocalists in line-synced and word-synced lyrics. Synced lyrics show as one continuous list of lines.

Return these fields anyway if your service has them. Plugins and clients that read lyrics through `api.Lyrics`, the MCP server, or the HTTP API get the complete data.

---

## Read lyrics from a plugin

Plugins can get lyrics from the registered lyrics providers through `api.Lyrics`:

```typescript
import type { Track } from '@nuclearplayer/model';
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const logLyricsSources = async (api: NuclearPluginAPI, track: Track) => {
  const results = await api.Lyrics.getLyricsForTrack(track);

  for (const result of results) {
    api.Logger.info(`${result.providerName}: ${result.lyrics.type}`);
  }
};
```

`getLyricsForTrack` returns an array of `AttributedLyrics`, one for each provider that returned lyrics:

```typescript
type AttributedLyrics = {
  providerId: string;
  providerName: string;
  lyrics: Lyrics;
};
```

### Consumer reference

```typescript
api.Lyrics.getLyricsForTrack(track: Track, providerId?: string): Promise<AttributedLyrics[]>
```

Without `providerId`, Nuclear queries all lyrics providers and returns their results in rank order, with the best result first. Providers that fail or return no lyrics are not in the array. If no lyrics provider is registered, the promise rejects.

With `providerId`, Nuclear queries only that provider. The array has one result, or no result if the provider returns no lyrics. The promise rejects if the provider does not exist or if it throws.
