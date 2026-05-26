use std::convert::Infallible;

use axum::{
    extract::State,
    http::StatusCode,
    response::{
        sse::{Event, KeepAlive, Sse},
        IntoResponse, Response,
    },
    routing::{get, post},
    Json, Router,
};
use futures::Stream;
use serde_json::{json, Value};
use tokio::sync::broadcast;

use super::RemoteEvent;
use crate::bridge::{bridge::Bridge, types::BridgeError};

#[derive(Clone)]
pub struct AppState {
    bridge: Bridge,
    events_tx: broadcast::Sender<RemoteEvent>,
}

struct BridgeErrorResponse(BridgeError);

impl IntoResponse for BridgeErrorResponse {
    fn into_response(self) -> Response {
        let message = self.0.to_string();
        (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": message }))).into_response()
    }
}

async fn bridge_action(
    bridge: &Bridge,
    method: &str,
    params: Value,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge
        .call(method, params)
        .await
        .map(|_| StatusCode::OK)
        .map_err(BridgeErrorResponse)
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn get_queue(State(state): State<AppState>) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call("Queue.getQueue", json!({}))
        .await
        .map(Json)
        .map_err(BridgeErrorResponse)
}

async fn get_playback(State(state): State<AppState>) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call("Playback.getState", json!({}))
        .await
        .map(Json)
        .map_err(BridgeErrorResponse)
}

async fn toggle_playback(
    State(state): State<AppState>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.toggle", json!({})).await
}

async fn next_track(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.goToNext", json!({})).await
}

async fn previous_track(
    State(state): State<AppState>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Queue.goToPrevious", json!({})).await
}

async fn seek(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.seekTo", body).await
}

async fn set_shuffle(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.setShuffleEnabled", body).await
}

async fn set_repeat(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Playback.setRepeatMode", body).await
}

fn events_stream(
    mut receiver: broadcast::Receiver<RemoteEvent>,
) -> impl Stream<Item = Result<Event, Infallible>> {
    async_stream::stream! {
        loop {
            match receiver.recv().await {
                Ok(remote_event) => {
                    let event = Event::default()
                        .event(remote_event.kind.as_str())
                        .data(remote_event.data);
                    yield Ok(event);
                }
                Err(broadcast::error::RecvError::Lagged(count)) => {
                    log::warn!("SSE client lagged, skipped {count} events");
                    continue;
                }
                Err(broadcast::error::RecvError::Closed) => break,
            }
        }
    }
}

async fn get_events(
    State(state): State<AppState>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let receiver = state.events_tx.subscribe();
    Sse::new(events_stream(receiver)).keep_alive(KeepAlive::default())
}

pub fn router(bridge: Bridge, events_tx: broadcast::Sender<RemoteEvent>) -> Router {
    let state = AppState { bridge, events_tx };

    Router::new()
        .route("/api/health", get(health))
        .route("/api/queue", get(get_queue))
        .route("/api/playback", get(get_playback))
        .route("/api/events", get(get_events))
        .route("/api/playback/toggle", post(toggle_playback))
        .route("/api/playback/next", post(next_track))
        .route("/api/playback/previous", post(previous_track))
        .route("/api/playback/seek", post(seek))
        .route("/api/playback/shuffle", post(set_shuffle))
        .route("/api/playback/repeat", post(set_repeat))
        .with_state(state)
}
