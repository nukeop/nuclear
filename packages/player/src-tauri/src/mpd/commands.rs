use serde_json::{json, Value};

use crate::bridge::bridge::Bridge;
use crate::bridge::types::BridgeError;

use super::protocol::{
    Command, MpdError, MpdResponse, PlaylistRange, ACK_ERROR_ARG, ACK_ERROR_SYSTEM,
    ACK_ERROR_UNKNOWN,
};

type Fields = Vec<(String, String)>;
type CommandResult = Result<MpdResponse, MpdError>;

fn field(key: &str, value: impl ToString) -> (String, String) {
    (key.to_string(), value.to_string())
}

async fn call(
    bridge: &Bridge,
    command: &str,
    method: &str,
    params: Value,
) -> Result<Value, MpdError> {
    bridge.call(method, params).await.map_err(|err| MpdError {
        code: ACK_ERROR_SYSTEM,
        command: command.to_string(),
        list_index: 0,
        message: err.to_string(),
    })
}

fn track_fields(item: &serde_json::Value, position: usize) -> Fields {
    let track = &item["track"];
    let source = &track["source"];

    let file = format!(
        "nuclear://{}/{}",
        source["provider"].as_str().unwrap_or("unknown"),
        source["id"].as_str().unwrap_or("unknown")
    );

    let title = track["title"].as_str().unwrap_or("");
    let artist = track["artists"]
        .as_array()
        .and_then(|artists| artists.first())
        .and_then(|artist| artist["name"].as_str())
        .unwrap_or("");
    let album = track["album"]["title"].as_str().unwrap_or("");
    let duration_ms = track["durationMs"].as_f64().unwrap_or(0.0);
    let duration_secs = duration_ms / 1000.0;

    let mut fields: Fields = vec![field("file", &file)];

    if !title.is_empty() {
        fields.push(field("Title", title));
    }
    if !artist.is_empty() {
        fields.push(field("Artist", artist));
    }
    if !album.is_empty() {
        fields.push(field("Album", album));
    }

    fields.push(field("Time", duration_secs as i64));
    fields.push(field("duration", format!("{duration_secs:.3}")));
    fields.push(field("Pos", position));
    fields.push(field("Id", position));

    fields
}

fn bridge_error(command: &str, error: BridgeError) -> MpdError {
    MpdError {
        code: ACK_ERROR_SYSTEM,
        command: command.to_string(),
        list_index: 0,
        message: error.to_string(),
    }
}

async fn status(bridge: &Bridge) -> CommandResult {
    let state = call(bridge, "status", "Playback.getState", json!({})).await?;
    let volume = call(bridge, "status", "Playback.getVolume", json!({})).await?;
    let queue = call(bridge, "status", "Queue.getQueue", json!({})).await?;
    let shuffle = call(bridge, "status", "Playback.isShuffleEnabled", json!({})).await?;
    let repeat_mode = call(bridge, "status", "Playback.getRepeatMode", json!({})).await?;

    let mpd_volume = (volume.as_f64().unwrap_or(1.0) * 100.0).round() as i32;
    let playback_status = state["status"].as_str().unwrap_or("stopped");
    let mpd_state = match playback_status {
        "playing" => "play",
        "paused" => "pause",
        _ => "stop",
    };

    let items = queue["items"].as_array();
    let queue_length = items.map(|arr| arr.len()).unwrap_or(0);
    let current_index = queue["currentIndex"].as_i64().unwrap_or(0);

    let mpd_random = if shuffle.as_bool().unwrap_or(false) {
        1
    } else {
        0
    };
    let repeat_str = repeat_mode.as_str().unwrap_or("off");
    let mpd_repeat = if repeat_str != "off" { 1 } else { 0 };
    let mpd_single = if repeat_str == "one" { 1 } else { 0 };

    let mut fields: Fields = vec![
        field("volume", mpd_volume),
        field("repeat", mpd_repeat),
        field("random", mpd_random),
        field("single", mpd_single),
        field("consume", 0),
        field("playlist", 0),
        field("playlistlength", queue_length),
        field("state", mpd_state),
    ];

    if mpd_state != "stop" {
        let seek = state["seek"].as_f64().unwrap_or(0.0);
        let duration = state["duration"].as_f64().unwrap_or(0.0);

        fields.push(field("song", current_index));
        fields.push(field("songid", current_index));
        fields.push(field(
            "time",
            format!("{}:{}", seek as i64, duration as i64),
        ));
        fields.push(field("elapsed", format!("{seek:.3}")));
        fields.push(field("duration", format!("{duration:.3}")));

        if let Some(items) = items {
            let next_index = current_index as usize + 1;
            if next_index < items.len() {
                fields.push(field("nextsong", next_index));
                fields.push(field("nextsongid", next_index));
            }
        }
    }

    Ok(MpdResponse { fields })
}

async fn currentsong(bridge: &Bridge) -> CommandResult {
    let queue = call(bridge, "currentsong", "Queue.getQueue", json!({})).await?;

    let current_index = queue["currentIndex"].as_u64().unwrap_or(0) as usize;
    let items = queue["items"].as_array();

    let fields = match items.and_then(|items| items.get(current_index)) {
        Some(item) => track_fields(item, current_index),
        None => Vec::new(),
    };

    Ok(MpdResponse { fields })
}

async fn playlistinfo(bridge: &Bridge, range: &Option<PlaylistRange>) -> CommandResult {
    let queue = call(bridge, "playlistinfo", "Queue.getQueue", json!({})).await?;

    let items = queue["items"].as_array();
    let all_items = match items {
        Some(items) => items,
        None => return Ok(MpdResponse { fields: Vec::new() }),
    };

    let selected: Vec<(usize, &serde_json::Value)> = match range {
        None => all_items.iter().enumerate().collect(),
        Some(PlaylistRange::Position(pos)) => {
            let pos = *pos as usize;
            match all_items.get(pos) {
                Some(item) => vec![(pos, item)],
                None => {
                    return Err(MpdError {
                        code: ACK_ERROR_ARG,
                        command: "playlistinfo".to_string(),
                        list_index: 0,
                        message: format!("Bad song index: {pos}"),
                    })
                }
            }
        }
        Some(PlaylistRange::Range { start, end }) => {
            let start = *start as usize;
            let end = *end as usize;
            all_items
                .iter()
                .enumerate()
                .skip(start)
                .take(end.saturating_sub(start))
                .collect()
        }
    };

    let fields = selected
        .iter()
        .flat_map(|(pos, item)| track_fields(item, *pos))
        .collect();

    Ok(MpdResponse { fields })
}

async fn play(bridge: &Bridge, position: &Option<i32>) -> CommandResult {
    if let Some(pos) = position.filter(|pos| *pos >= 0) {
        call(bridge, "play", "Queue.goToIndex", json!({ "index": pos })).await?;
    }
    call(bridge, "play", "Playback.play", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn pause(bridge: &Bridge, state: &Option<bool>) -> CommandResult {
    let method = match state {
        Some(true) => "Playback.pause",
        Some(false) => "Playback.play",
        None => "Playback.toggle",
    };
    call(bridge, "pause", method, json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn stop(bridge: &Bridge) -> CommandResult {
    call(bridge, "stop", "Playback.stop", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn next(bridge: &Bridge) -> CommandResult {
    call(bridge, "next", "Queue.goToNext", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn previous(bridge: &Bridge) -> CommandResult {
    call(bridge, "previous", "Queue.goToPrevious", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn setvol(bridge: &Bridge, volume: u8) -> CommandResult {
    let normalized = volume as f64 / 100.0;
    call(
        bridge,
        "setvol",
        "Playback.setVolume",
        json!({ "volume": normalized }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

async fn getvol(bridge: &Bridge) -> CommandResult {
    let volume = call(bridge, "getvol", "Playback.getVolume", json!({})).await?;
    let mpd_volume = (volume.as_f64().unwrap_or(1.0) * 100.0).round() as i32;
    Ok(MpdResponse {
        fields: vec![field("volume", mpd_volume)],
    })
}

pub async fn dispatch(command: &Command, bridge: &Bridge) -> CommandResult {
    match command {
        Command::Ping | Command::Password | Command::Noop | Command::NoIdle => {
            Ok(MpdResponse { fields: Vec::new() })
        }
        Command::Idle(_) => Err(MpdError {
            code: ACK_ERROR_UNKNOWN,
            command: "idle".to_string(),
            list_index: 0,
            message: "idle not allowed in command lists".to_string(),
        }),
        Command::Status => status(bridge).await,
        Command::CurrentSong => currentsong(bridge).await,
        Command::PlaylistInfo(range) => playlistinfo(bridge, range).await,
        Command::Play(position) => play(bridge, position).await,
        Command::Pause(state) => pause(bridge, state).await,
        Command::Stop => stop(bridge).await,
        Command::Next => next(bridge).await,
        Command::Previous => previous(bridge).await,
        Command::SetVol(vol) => setvol(bridge, *vol).await,
        Command::GetVol => getvol(bridge).await,
        Command::Unknown(name) => Err(MpdError {
            code: ACK_ERROR_UNKNOWN,
            command: name.clone(),
            list_index: 0,
            message: "unknown command".to_string(),
        }),
    }
}
