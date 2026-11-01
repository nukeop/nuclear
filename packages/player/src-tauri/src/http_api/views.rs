use axum::{extract::State, http::StatusCode, Json};
use serde::Deserialize;
use serde_json::{json, Value};

use super::actions::bridge_action;
use super::routes::{AppState, BridgeErrorResponse};

#[derive(Deserialize)]
pub struct RegisterBody {
    view: Value,
}

#[derive(Deserialize)]
pub struct UnregisterBody {
    id: String,
}

pub async fn register(
    State(state): State<AppState>,
    Json(body): Json<RegisterBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(
        &state.bridge,
        "Views.register",
        json!({ "view": body.view }),
    )
    .await
}

pub async fn unregister(
    State(state): State<AppState>,
    Json(body): Json<UnregisterBody>,
) -> Result<StatusCode, BridgeErrorResponse> {
    bridge_action(&state.bridge, "Views.unregister", json!({ "id": body.id })).await
}
