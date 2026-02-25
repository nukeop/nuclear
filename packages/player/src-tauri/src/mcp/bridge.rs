use std::collections::HashMap;
use std::fmt;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};
use tokio::sync::{Mutex, oneshot};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct McpBridgeRequest {
    pub trace_id: String,
    pub tool_name: String,
    pub arguments: serde_json::Value,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpBridgeResponse {
    pub trace_id: String,
    pub success: bool,
    pub data: Option<serde_json::Value>,
    pub error: Option<String>,
}

#[derive(Debug)]
pub enum BridgeError {
    InfrastructureError(String),
    ToolError(String),
}

impl fmt::Display for BridgeError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            BridgeError::InfrastructureError(message) => write!(formatter, "{message}"),
            BridgeError::ToolError(message) => write!(formatter, "{message}"),
        }
    }
}

type PendingRequests = Arc<Mutex<HashMap<String, oneshot::Sender<McpBridgeResponse>>>>;

#[derive(Clone)]
pub struct McpBridge {
    app_handle: AppHandle,
    pending: PendingRequests,
}

impl McpBridge {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            pending: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn call_tool(
        &self,
        tool_name: &str,
        arguments: serde_json::Value,
    ) -> Result<serde_json::Value, BridgeError> {
        let trace_id = Uuid::new_v4().to_string();
        let (sender, receiver) = oneshot::channel();

        {
            let mut pending = self.pending.lock().await;
            pending.insert(trace_id.clone(), sender);
        }

        let request = McpBridgeRequest {
            trace_id: trace_id.clone(),
            tool_name: tool_name.to_string(),
            arguments,
        };

        self.app_handle
            .emit("mcp:tool-call", &request)
            .map_err(|err| {
                BridgeError::InfrastructureError(format!("Failed to emit event: {err}"))
            })?;

        let response = tokio::time::timeout(
            std::time::Duration::from_secs(30),
            receiver,
        )
        .await
        .map_err(|_| {
            BridgeError::InfrastructureError(format!("Timed out after 30s"))
        })?
        .map_err(|_| {
            BridgeError::InfrastructureError(format!("Response channel closed unexpectedly"))
        })?;

        if response.success {
            Ok(response.data.unwrap_or(serde_json::Value::Null))
        } else {
            Err(BridgeError::ToolError(
                response.error.unwrap_or_else(|| "Unknown error".to_string()),
            ))
        }
    }

    pub async fn handle_response(&self, response: McpBridgeResponse) {
        let mut pending = self.pending.lock().await;
        if let Some(sender) = pending.remove(&response.trace_id) {
            let _ = sender.send(response);
        } else {
            log::warn!(
                "Received MCP response for unknown trace ID: {}",
                response.trace_id
            );
        }
    }
}
