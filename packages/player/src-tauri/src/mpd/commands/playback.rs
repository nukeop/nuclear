use serde_json::json;

use crate::bridge::bridge::Bridge;
use crate::mpd::protocol::{MpdError, MpdResponse, ACK_ERROR_ARG};

use super::{call, CommandResult};

pub(super) async fn play(bridge: &Bridge, position: &Option<i32>) -> CommandResult {
    if let Some(pos) = position.filter(|pos| *pos >= 0) {
        call(bridge, "play", "Queue.goToIndex", json!({ "index": pos })).await?;
    }
    call(bridge, "play", "Playback.play", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn pause(bridge: &Bridge, state: &Option<bool>) -> CommandResult {
    let method = match state {
        Some(true) => "Playback.pause",
        Some(false) => "Playback.play",
        None => "Playback.toggle",
    };
    call(bridge, "pause", method, json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn stop(bridge: &Bridge) -> CommandResult {
    call(bridge, "stop", "Playback.stop", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn next(bridge: &Bridge) -> CommandResult {
    call(bridge, "next", "Queue.goToNext", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn previous(bridge: &Bridge) -> CommandResult {
    call(bridge, "previous", "Queue.goToPrevious", json!({})).await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn seek(bridge: &Bridge, position: u32, time: f64) -> CommandResult {
    call(
        bridge,
        "seek",
        "Queue.goToIndex",
        json!({ "index": position }),
    )
    .await?;
    call(
        bridge,
        "seek",
        "Playback.seekTo",
        json!({ "seconds": time }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn seekid(bridge: &Bridge, id: u32, time: f64) -> CommandResult {
    seek(bridge, id, time).await
}

pub(super) async fn seekcur(bridge: &Bridge, raw_time: &str) -> CommandResult {
    let parse_err = || MpdError {
        code: ACK_ERROR_ARG,
        command: "seekcur".to_string(),
        list_index: 0,
        message: format!("Invalid time: {raw_time}"),
    };

    let time = match raw_time.strip_prefix(['+', '-']) {
        Some(offset_str) => {
            let offset = offset_str.parse::<f64>().map_err(|_| parse_err())?;
            let state = call(bridge, "seekcur", "Playback.getState", json!({})).await?;
            let current = state["seek"].as_f64().unwrap_or(0.0);
            let signed_offset = if raw_time.starts_with('-') {
                -offset
            } else {
                offset
            };
            (current + signed_offset).max(0.0)
        }
        None => raw_time.parse::<f64>().map_err(|_| parse_err())?,
    };

    call(
        bridge,
        "seekcur",
        "Playback.seekTo",
        json!({ "seconds": time }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}
