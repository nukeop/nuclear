use std::collections::HashMap;
use std::sync::Arc;

use tauri::{AppHandle, Emitter};
use tokio::sync::{broadcast, oneshot, Mutex};
use uuid::Uuid;

use super::types::{
    BridgeError, BridgeNotification, BridgeRequest, BridgeResponse, BridgeResponseBody,
    BRIDGE_EVENT,
};

type PendingRequests = Arc<Mutex<HashMap<String, oneshot::Sender<BridgeResponse>>>>;

#[derive(Clone)]
pub struct Bridge {
    app_handle: AppHandle,
    pending: PendingRequests,
    notifications: broadcast::Sender<BridgeNotification>,
}

impl Bridge {
    pub fn new(app_handle: AppHandle) -> Self {
        let (notifications, _) = broadcast::channel(16);
        Self {
            app_handle,
            pending: Arc::new(Mutex::new(HashMap::new())),
            notifications,
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
            .emit(BRIDGE_EVENT.request, &request)
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
        let mut pending = self.pending.lock().await;
        if let Some(sender) = pending.remove(&response.trace_id) {
            let _ = sender.send(response);
        } else {
            log::warn!(
                "Received bridge response for unknown trace ID: {}",
                response.trace_id
            );
        }
    }

    pub async fn handle_notification(&self, notification: BridgeNotification) {
        log::debug!(target: "bridge", "bridge notification: {}", notification.subsystem);
        let _ = self.notifications.send(notification);
    }

    pub fn subscribe_notifications(&self) -> broadcast::Receiver<BridgeNotification> {
        self.notifications.subscribe()
    }
}
