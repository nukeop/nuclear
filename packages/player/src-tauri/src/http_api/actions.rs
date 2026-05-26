use axum::{extract::State, http::StatusCode, Json};
use serde_json::{json, Value};

use super::routes::{AppState, BridgeErrorResponse};

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
