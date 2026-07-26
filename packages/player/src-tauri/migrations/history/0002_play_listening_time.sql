CREATE VIEW play_listening_time AS
SELECT
    play_id,
    play_track_id AS track_id,
    play_started_at AS started_at,
    SUM(at - prev_at) AS ms_played,
    CASE
        WHEN play_last_kind IN ('finished', 'skipped', 'stopped') THEN play_last_kind
    END AS end_reason,
    CASE
        WHEN play_last_kind IN ('finished', 'skipped', 'stopped') THEN play_last_position
    END AS end_position_ms
FROM (
    SELECT
        play_id,
        kind,
        at,
        LAG(kind) OVER w AS prev_kind,
        LAG(at) OVER w AS prev_at,
        FIRST_VALUE(at) OVER w AS play_started_at,
        FIRST_VALUE(track_id) OVER w AS play_track_id,
        LAST_VALUE(kind) OVER whole_play AS play_last_kind,
        LAST_VALUE(position_ms) OVER whole_play AS play_last_position
    FROM play_events
    WHERE kind <> 'seeked'
    WINDOW
        w AS (PARTITION BY play_id ORDER BY at, id),
        whole_play AS (
            PARTITION BY play_id ORDER BY at, id
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        )
)
WHERE kind IN ('paused', 'finished', 'skipped', 'stopped')
    AND prev_kind IN ('started', 'resumed')
GROUP BY play_id;
