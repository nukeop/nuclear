use std::collections::HashMap;
use std::sync::Arc;

use tauri::{AppHandle, Emitter};
use tokio::sync::{oneshot, Mutex};
use uuid::Uuid;

use super::types::{BridgeError, BridgeRequest, BridgeResponse, BridgeResponseBody, BRIDGE_CHANNEL};

type PendingRequests = Arc<Mutex<HashMap<String, oneshot::Sender<BridgeResponse>>>>;

#[derive(Clone)]
pub struct Bridge {
    app_handle: AppHandle,
    pending: PendingRequests,
}

impl Bridge {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            pending: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn call(
        &self,
        method: &str,
        params: serde_json::Value,
    ) -> Result<serde_json::Value, BridgeError> {
        let trace_id = Uuid::new_v4().to_string();
        let (sender, receiver) = oneshot::channel();

        {
            let mut pending = self.pending.lock().await;
            pending.insert(trace_id.clone(), sender);
        }

        let request = BridgeRequest {
            trace_id: trace_id.clone(),
            method: method.to_string(),
            params,
        };

        self.app_handle
            .emit(BRIDGE_CHANNEL.request, &request)
            .map_err(|err| {
                BridgeError::InfrastructureError(format!("Failed to emit event: {err}"))
            })?;

        let response =
            match tokio::time::timeout(std::time::Duration::from_secs(30), receiver).await {
                Ok(Ok(response)) => response,
                Ok(Err(_)) => {
                    self.pending.lock().await.remove(&trace_id);
                    return Err(BridgeError::InfrastructureError(
                        "Response channel closed unexpectedly".into(),
                    ));
                }
                Err(_) => {
                    self.pending.lock().await.remove(&trace_id);
                    return Err(BridgeError::InfrastructureError(
                        "Timed out after 30s".into(),
                    ));
                }
            };

        match response.body {
            BridgeResponseBody::Success { data } => Ok(data),
            BridgeResponseBody::Error { error } => Err(BridgeError::HandlerError(error)),
        }
    }

    pub async fn handle_response(&self, response: BridgeResponse) {
        todo!()
    }

    pub async fn handle_notification(&self, notification: serde_json::Value) {
        todo!()
    }
}
