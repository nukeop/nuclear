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

CREATE TABLE play_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    play_id TEXT NOT NULL,
    track_id INTEGER REFERENCES tracks(id),
    kind TEXT NOT NULL CHECK (kind IN ('started', 'paused', 'resumed', 'seeked', 'finished', 'skipped', 'stopped')),
    at INTEGER NOT NULL,
    position_ms INTEGER NOT NULL,
    seek_to_ms INTEGER,
    provider TEXT,
    provider_id TEXT
);

CREATE INDEX idx_play_events_play_id ON play_events(play_id);
CREATE INDEX idx_play_events_started_at ON play_events(at DESC) WHERE kind = 'started';
