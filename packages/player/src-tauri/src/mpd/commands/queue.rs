use serde_json::json;

use crate::bridge::bridge::Bridge;
use crate::mpd::protocol::{MpdError, MpdResponse, PlaylistRange, ACK_ERROR_ARG};

use super::{call, field, CommandResult, Fields};

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

pub(super) async fn currentsong(bridge: &Bridge) -> CommandResult {
    let queue = call(bridge, "currentsong", "Queue.getQueue", json!({})).await?;

    let current_index = queue["currentIndex"].as_u64().unwrap_or(0) as usize;
    let items = queue["items"].as_array();

    let fields = match items.and_then(|items| items.get(current_index)) {
        Some(item) => track_fields(item, current_index),
        None => Vec::new(),
    };

    Ok(MpdResponse { fields })
}

pub(super) async fn playlistinfo(bridge: &Bridge, range: &Option<PlaylistRange>) -> CommandResult {
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

pub(super) async fn clear(bridge: &Bridge) -> CommandResult {
    call(bridge, "clear", "Queue.clearQueue", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn delete(bridge: &Bridge, range: &PlaylistRange) -> CommandResult {
    let indices: Vec<u32> = match range {
        PlaylistRange::Position(pos) => vec![*pos],
        PlaylistRange::Range { start, end } => (*start..*end).collect(),
    };
    call(
        bridge,
        "delete",
        "Queue.removeByIndices",
        json!({ "indices": indices }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn deleteid(bridge: &Bridge, id: u32) -> CommandResult {
    call(
        bridge,
        "deleteid",
        "Queue.removeByIndices",
        json!({ "indices": [id] }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn move_track(bridge: &Bridge, from: u32, to: u32) -> CommandResult {
    call(
        bridge,
        "move",
        "Queue.reorder",
        json!({ "fromIndex": from, "toIndex": to }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}
