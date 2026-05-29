use std::convert::Infallible;

use axum::{
    extract::{Path, State},
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

use super::{actions, RemoteEvent};
use crate::bridge::{bridge::Bridge, types::BridgeError};

#[derive(Clone)]
pub struct AppState {
    pub(super) bridge: Bridge,
    events_tx: broadcast::Sender<RemoteEvent>,
}

pub(super) struct BridgeErrorResponse(pub(super) BridgeError);

impl IntoResponse for BridgeErrorResponse {
    fn into_response(self) -> Response {
        let message = self.0.to_string();
        (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": message }))).into_response()
    }
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

async fn get_settings(State(state): State<AppState>) -> Result<Json<Value>, BridgeErrorResponse> {
    let bridge = &state.bridge;
    let (shuffle, repeat, discovery, language, dark, theme_id) = tokio::try_join!(
        bridge.call("Settings.getGlobal", json!({"id": "core.playback.shuffle"})),
        bridge.call("Settings.getGlobal", json!({"id": "core.playback.repeat"})),
        bridge.call("Settings.getGlobal", json!({"id": "core.playback.discovery"})),
        bridge.call("Settings.getGlobal", json!({"id": "core.general.language"})),
        bridge.call("Settings.getGlobal", json!({"id": "core.theme.dark"})),
        bridge.call("Settings.getGlobal", json!({"id": "core.theme.active.id"})),
    )
    .map_err(BridgeErrorResponse)?;

    Ok(Json(json!({
        "shuffle": shuffle,
        "repeat": repeat,
        "discovery": discovery,
        "language": language,
        "dark": dark,
        "themeId": theme_id,
    })))
}

async fn get_setting(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call("Settings.getGlobal", json!({"id": id}))
        .await
        .map(Json)
        .map_err(BridgeErrorResponse)
}

async fn set_setting(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<Value>,
) -> Result<StatusCode, BridgeErrorResponse> {
    state
        .bridge
        .call("Settings.setGlobal", json!({"id": id, "value": body}))
        .await
        .map(|_| StatusCode::OK)
        .map_err(BridgeErrorResponse)
}

fn events_stream(
    mut receiver: broadcast::Receiver<RemoteEvent>,
) -> impl Stream<Item = Result<Event, Infallible>> {
    async_stream::stream! {
        yield Ok(Event::default().comment("connected"));

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
        .route("/api/settings", get(get_settings))
        .route("/api/settings/{id}", get(get_setting).post(set_setting))
        .route("/api/events", get(get_events))
        .route("/api/playback/toggle", post(actions::toggle_playback))
        .route("/api/playback/next", post(actions::next_track))
        .route("/api/playback/previous", post(actions::previous_track))
        .route("/api/playback/seek", post(actions::seek))
        .route("/api/playback/shuffle", post(actions::set_shuffle))
        .route("/api/playback/repeat", post(actions::set_repeat))
        .fallback(super::frontend::serve_frontend)
        .with_state(state)
}
