pub mod bridge;
pub mod types;

use bridge::Bridge;
use tauri::{AppHandle, Manager};

pub fn init_bridge(app_handle: AppHandle) {
    let bridge = Bridge::new(app_handle.clone());
    app_handle.manage(bridge);
}
