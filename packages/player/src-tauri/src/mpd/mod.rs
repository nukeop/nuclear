mod commands;
mod connection;
mod idle;
mod protocol;

use std::sync::Arc;

use tauri::{AppHandle, Manager};
use tokio::sync::{oneshot, Mutex};
use tokio_util::sync::CancellationToken;

const MPD_PORT_START: u16 = 6600;
const MPD_PORT_END: u16 = 6609;

struct RunningServer {
    task: tauri::async_runtime::JoinHandle<()>,
    cancellation_token: CancellationToken,
    port: u16,
}

pub struct MpdState {
    running: Arc<Mutex<Option<RunningServer>>>,
}

impl MpdState {
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
    let tcp_listener = match crate::net::bind_first_available_port(
        "127.0.0.1",
        MPD_PORT_START,
        MPD_PORT_END,
    )
    .await
    {
        Ok(listener) => listener,
        Err(message) => {
            log::error!(target: "mpd", "Failed to bind: {message}");
            let _ = ready.send(Err(message));
            return;
        }
    };

    let bound_port = tcp_listener.local_addr().unwrap().port();
    log::info!(target: "mpd", "Listening on 127.0.0.1:{bound_port}");
    let _ = ready.send(Ok(bound_port));

    loop {
        tokio::select! {
            _ = ct.cancelled() => break,
            accept_result = tcp_listener.accept() => {
                match accept_result {
                    Ok((stream, _)) => {
                        let bridge = bridge.clone();
                        tauri::async_runtime::spawn(async move {
                            if let Err(err) = connection::handle_connection(bridge, stream).await {
                                log::warn!(target: "mpd", "Connection error: {err}");
                            }
                        });
                    }
                    Err(err) => {
                        log::error!(target: "mpd", "Accept error: {err}");
                    }
                }
            }
        }
    }

    log::info!(target: "mpd", "Server stopped");
}

pub fn init_mpd(app_handle: AppHandle) {
    let state = MpdState::new();
    app_handle.manage(state);
}

#[tauri::command]
pub async fn mpd_start(
    state: tauri::State<'_, MpdState>,
    bridge: tauri::State<'_, crate::bridge::bridge::Bridge>,
) -> Result<u16, String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.as_ref() {
        log::info!(target: "mpd", "Server already running on port {}", server.port);
        return Ok(server.port);
    }

    log::info!(target: "mpd", "Starting server");
    let ct = CancellationToken::new();
    let (ready_tx, ready_rx) = oneshot::channel();
    let task =
        tauri::async_runtime::spawn(start_server(bridge.inner().clone(), ct.clone(), ready_tx));

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
        Err(_) => Err("MPD server task exited before reporting ready".into()),
    }
}

#[tauri::command]
pub async fn mpd_stop(state: tauri::State<'_, MpdState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.take() {
        log::info!(target: "mpd", "Stopping server");
        server.cancellation_token.cancel();
        let _ = server.task.await;
    } else {
        log::info!(target: "mpd", "Server already stopped");
    }
    Ok(())
}
