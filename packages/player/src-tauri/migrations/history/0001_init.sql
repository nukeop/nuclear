CREATE TABLE tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fingerprint TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    artists TEXT NOT NULL,
    album_title TEXT,
    duration_ms INTEGER,
    artwork_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE plays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track_id INTEGER NOT NULL REFERENCES tracks(id),
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    ms_played INTEGER,
    end_position_ms INTEGER,
    end_reason TEXT CHECK (end_reason IN ('completed', 'skipped', 'stopped', 'replaced', 'abandoned'))
);

CREATE TABLE play_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    play_id INTEGER NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('started', 'paused', 'resumed', 'seeked', 'ended')),
    at INTEGER NOT NULL,
    position_ms INTEGER NOT NULL,
    seek_to_ms INTEGER
);

CREATE INDEX idx_plays_started_at ON plays(started_at DESC);
CREATE INDEX idx_plays_track_id ON plays(track_id);
CREATE INDEX idx_play_events_play_id ON play_events(play_id);
CREATE INDEX idx_plays_open ON plays(id) WHERE end_reason IS NULL;
