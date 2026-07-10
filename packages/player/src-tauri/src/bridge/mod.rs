pub mod bridge;
pub mod types;

use bridge::Bridge;
use tauri::{AppHandle, Manager};
use types::{BridgeNotification, BridgeResponse};

pub fn init_bridge(app_handle: AppHandle) {
    let bridge = Bridge::new(app_handle.clone());
    app_handle.manage(bridge);
}

#[tauri::command]
#[specta::specta]
pub async fn bridge_respond(
    bridge: tauri::State<'_, Bridge>,
    response: BridgeResponse,
) -> Result<(), String> {
    bridge.handle_response(response).await;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn bridge_notify(
    bridge: tauri::State<'_, Bridge>,
    notification: BridgeNotification,
) -> Result<(), String> {
    bridge.handle_notification(notification).await;
    Ok(())
}
