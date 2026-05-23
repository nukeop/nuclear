mod routes;

use std::sync::Arc;

use tauri::{AppHandle, Manager};
use tokio::sync::{oneshot, Mutex};
use tokio_util::sync::CancellationToken;

const REMOTE_PORT_START: u16 = 4120;
const REMOTE_PORT_END: u16 = 4129;

struct RunningServer {
    task: tauri::async_runtime::JoinHandle<()>,
    cancellation_token: CancellationToken,
    port: u16,
}

pub struct RemoteControlState {
    running: Arc<Mutex<Option<RunningServer>>>,
}

impl RemoteControlState {
    fn new() -> Self {
        Self {
            running: Arc::new(Mutex::new(None)),
        }
    }
}

async fn start_server(
    bridge: crate::bridge::bridge::Bridge,
    ct: CancellationToken,
    ready: oneshot::Sender<Result<u16, String>>,
) {
    let router = routes::router(bridge);

    let tcp_listener = match crate::net::bind_first_available_port(
        "0.0.0.0",
        REMOTE_PORT_START,
        REMOTE_PORT_END,
    )
    .await
    {
        Ok(listener) => listener,
        Err(message) => {
            log::error!("Failed to bind remote control server: {message}");
            let _ = ready.send(Err(message));
            return;
        }
    };

    let bound_port = tcp_listener.local_addr().unwrap().port();
    log::info!("Remote control server listening on http://0.0.0.0:{bound_port}/api/health");
    let _ = ready.send(Ok(bound_port));

    let _ = axum::serve(tcp_listener, router)
        .with_graceful_shutdown(async move {
            ct.cancelled().await;
        })
        .await;

    log::info!("Remote control server stopped");
}

pub fn init_remote_control(app_handle: AppHandle) {
    let state = RemoteControlState::new();
    app_handle.manage(state);
}

#[tauri::command]
pub async fn remote_control_start(
    state: tauri::State<'_, RemoteControlState>,
    bridge: tauri::State<'_, crate::bridge::bridge::Bridge>,
) -> Result<u16, String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.as_ref() {
        log::info!("Remote control server already running on port {}", server.port);
        return Ok(server.port);
    }

    log::info!("Starting remote control server");
    let ct = CancellationToken::new();
    let (ready_tx, ready_rx) = oneshot::channel();
    let task = tauri::async_runtime::spawn(start_server(
        bridge.inner().clone(),
        ct.clone(),
        ready_tx,
    ));

    match ready_rx.await {
        Ok(Ok(port)) => {
            *guard = Some(RunningServer {
                task,
                cancellation_token: ct,
                port,
            });
            Ok(port)
        }
        Ok(Err(message)) => Err(message),
        Err(_) => Err("Remote control server task exited before reporting ready".into()),
    }
}

#[tauri::command]
pub async fn remote_control_stop(state: tauri::State<'_, RemoteControlState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.take() {
        log::info!("Stopping remote control server");
        server.cancellation_token.cancel();
        let _ = server.task.await;
    } else {
        log::info!("Remote control server already stopped");
    }
    Ok(())
}
