use serde_json::json;

use crate::bridge::bridge::Bridge;
use crate::mpd::protocol::MpdResponse;

use super::{call, field, CommandResult};

pub(super) async fn setvol(bridge: &Bridge, volume: u8) -> CommandResult {
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

pub(super) async fn getvol(bridge: &Bridge) -> CommandResult {
    let volume = call(bridge, "getvol", "Playback.getVolume", json!({})).await?;
    let mpd_volume = (volume.as_f64().unwrap_or(1.0) * 100.0).round() as i32;
    Ok(MpdResponse {
        fields: vec![field("volume", mpd_volume)],
    })
}

pub(super) async fn random(bridge: &Bridge, enabled: bool) -> CommandResult {
    call(
        bridge,
        "random",
        "Playback.setShuffleEnabled",
        json!({ "enabled": enabled }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn repeat(bridge: &Bridge, enabled: bool) -> CommandResult {
    let mode = if enabled { "all" } else { "off" };
    call(
        bridge,
        "repeat",
        "Playback.setRepeatMode",
        json!({ "mode": mode }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}

pub(super) async fn single(bridge: &Bridge, enabled: bool) -> CommandResult {
    let mode = if enabled { "one" } else { "off" };
    call(
        bridge,
        "single",
        "Playback.setRepeatMode",
        json!({ "mode": mode }),
    )
    .await?;
    Ok(MpdResponse { fields: Vec::new() })
}
