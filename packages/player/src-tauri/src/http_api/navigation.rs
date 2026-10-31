use axum::{extract::State, http::StatusCode, Json};
use serde::Deserialize;
use serde_json::{json, Value};

use super::actions::bridge_action;
use super::routes::{AppState, BridgeErrorResponse};

#[derive(Deserialize)]
pub struct NavigateBody {
    path: String,
}

pub async fn navigate(
    State(state): State<AppState>,
    Json(body): Json<NavigateBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Navigation.navigate",
        json!({ "path": body.path }),
    )
    .await
}

pub async fn back(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Navigation.back", json!({})).await
}

pub async fn forward(State(state): State<AppState>) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Navigation.forward", json!({})).await
}

pub async fn current(State(state): State<AppState>) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call("Navigation.current", json!({}))
        .await
        .map(Json)
        .map_err(BridgeErrorResponse)
}
