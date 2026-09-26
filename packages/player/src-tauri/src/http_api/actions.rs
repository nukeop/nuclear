use axum::{extract::State, http::StatusCode, Json};
use serde::Deserialize;
use serde_json::{json, Value};

use super::routes::{AppState, BridgeErrorResponse};

#[derive(Deserialize)]
pub struct VolumeBody {
    volume: f64,
}

#[derive(Deserialize)]
pub struct IndexBody {
    index: usize,
}

#[derive(Deserialize)]
pub struct TrackBody {
    track: Value,
}

#[derive(Deserialize)]
pub struct SourceBody {
    source: Value,
}

#[derive(Deserialize)]
pub struct PlaylistNameBody {
    name: String,
}

async fn bridge_action(
    bridge: &crate::bridge::bridge::Bridge,
    method: &str,
    params: Value,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge
        .call(method, params)
        .await
        .map(|_| StatusCode::OK)
        .map_err(BridgeErrorResponse)
}

pub async fn play(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.play", json!({})).await
}

pub async fn pause(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.pause", json!({})).await
}

pub async fn toggle_playback(
    State(state): State<AppState>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.toggle", json!({})).await
}

pub async fn next_track(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.goToNext", json!({})).await
}

pub async fn previous_track(
    State(state): State<AppState>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.goToPrevious", json!({})).await
}

pub async fn seek(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.seekTo", body).await
}

pub async fn set_shuffle(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.setShuffleEnabled", body).await
}

pub async fn set_repeat(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.setRepeatMode", body).await
}

pub async fn set_volume(
    State(state): State<AppState>,
    Json(body): Json<VolumeBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Playback.setVolume",
        json!({ "volume": body.volume }),
    )
    .await
}

pub async fn add_to_queue(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.addToQueue", body).await
}

pub async fn remove_from_queue(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.removeByIds", body).await
}

pub async fn go_to_index(
    State(state): State<AppState>,
    Json(body): Json<IndexBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Queue.goToIndex",
        json!({ "index": body.index }),
    )
    .await
}

pub async fn clear_queue(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.clearQueue", json!({})).await
}

pub async fn add_favorite_track(
    State(state): State<AppState>,
    Json(body): Json<TrackBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Favorites.addTrack",
        json!({ "track": body.track }),
    )
    .await
}

pub async fn remove_favorite_track(
    State(state): State<AppState>,
    Json(body): Json<SourceBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Favorites.removeTrack",
        json!({ "source": body.source }),
    )
    .await
}

pub async fn save_queue_as_playlist(
    State(state): State<AppState>,
    Json(body): Json<PlaylistNameBody>,
) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call(
            "Playlists.saveQueueAsPlaylist",
            json!({ "name": body.name }),
        )
        .await
        .map(|id| Json(json!({ "id": id })))
        .map_err(BridgeErrorResponse)
}
