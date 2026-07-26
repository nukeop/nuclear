CREATE VIEW play_listening_time AS
SELECT
    play_id,
    play_track_id AS track_id,
    play_started_at AS started_at,
    SUM(at - prev_at) AS ms_played
FROM (
    SELECT
        play_id,
        kind,
        at,
        LAG(kind) OVER w AS prev_kind,
        LAG(at) OVER w AS prev_at,
        FIRST_VALUE(at) OVER w AS play_started_at,
        FIRST_VALUE(track_id) OVER w AS play_track_id
    FROM play_events
    WHERE kind <> 'seeked'
    WINDOW w AS (PARTITION BY play_id ORDER BY at, id)
)
WHERE kind IN ('paused', 'finished', 'skipped', 'stopped')
    AND prev_kind IN ('started', 'resumed')
GROUP BY play_id;
