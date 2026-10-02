use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

use super::routes::{AppState, BridgeErrorResponse};

pub async fn get_current_lyrics(
    State(state): State<AppState>,
) -> Result<Response, BridgeErrorResponse> {
    let current_item = state
        .bridge
        .call("Queue.getCurrentItem", json!({}))
        .await
        .map_err(BridgeErrorResponse)?;

    let Some(track) = current_item.get("track") else {
        return Ok((
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "No track is playing" })),
        )
            .into_response());
    };

    state
        .bridge
        .call("Lyrics.getLyricsForTrack", json!({ "track": track }))
        .await
        .map(|lyrics| Json(lyrics).into_response())
        .map_err(BridgeErrorResponse)
}
