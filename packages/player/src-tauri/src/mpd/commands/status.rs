use serde_json::json;

use crate::bridge::bridge::Bridge;
use crate::mpd::protocol::MpdResponse;

use super::{call, field, CommandResult, Fields};

pub(super) async fn status(bridge: &Bridge) -> CommandResult {
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

    let shuffle_enabled = shuffle.as_bool().unwrap_or(false);
    let mpd_random = if shuffle_enabled { 1 } else { 0 };
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
            if !shuffle_enabled && next_index < items.len() {
                fields.push(field("nextsong", next_index));
                fields.push(field("nextsongid", next_index));
            }
        }
    }

    Ok(MpdResponse { fields })
}
