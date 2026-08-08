use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use super::routes::{AppState, BridgeErrorResponse};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum SearchCategory {
    Artists,
    Albums,
    Tracks,
    Playlists,
}

#[derive(Deserialize, Serialize)]
pub struct SearchParams {
    query: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    types: Option<Vec<SearchCategory>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    limit: Option<u32>,
}

pub async fn search(
    State(state): State<AppState>,
    Json(params): Json<SearchParams>,
) -> Result<Json<Value>, BridgeErrorResponse> {
    state
        .bridge
        .call("Metadata.search", json!({ "params": params }))
        .await
        .map(Json)
        .map_err(BridgeErrorResponse)
}
