use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BridgeRequest {
    pub trace_id: String,
    pub method: String,
    pub params: serde_json::Value,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BridgeResponse {
    pub trace_id: String,
    #[serde(flatten)]
    pub body: BridgeResponseBody,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", tag = "status")]
pub enum BridgeResponseBody {
    Success { data: serde_json::Value },
    Error { error: String },
}
