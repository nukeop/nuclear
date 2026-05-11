use serde::{Deserialize, Serialize};

pub struct BridgeEvent {
    pub request: &'static str,
}

pub const BRIDGE_EVENT: BridgeEvent = BridgeEvent {
    request: "bridge:request",
};

#[derive(Debug)]
pub enum BridgeError {
    InfrastructureError(String),
    HandlerError(String),
}

// Infrastructure error means something went wrong with the bridge itself
// Handler errror means there was an error in the method called through the bridge
impl std::fmt::Display for BridgeError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BridgeError::InfrastructureError(message) => write!(formatter, "{message}"),
            BridgeError::HandlerError(message) => write!(formatter, "{message}"),
        }
    }
}

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
