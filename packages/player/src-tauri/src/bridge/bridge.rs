use std::collections::HashMap;
use std::sync::Arc;

use tauri::AppHandle;
use tokio::sync::{oneshot, Mutex};

use super::types::BridgeResponse;

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
}
