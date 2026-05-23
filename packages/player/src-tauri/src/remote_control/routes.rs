use axum::{routing::get, Json, Router};
use serde_json::{json, Value};

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

pub fn router() -> Router {
    Router::new().route("/api/health", get(health))
}
