mod actions;
mod routes;

use std::sync::Arc;

use tauri::{AppHandle, Listener, Manager};
use tokio::sync::{broadcast, oneshot, Mutex};
use tokio_util::sync::CancellationToken;

const REMOTE_PORT_START: u16 = 4120;
const REMOTE_PORT_END: u16 = 4129;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RemoteEventKind {
    Queue,
    Playback,
    Settings,
}

impl RemoteEventKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Queue => "queue",
            Self::Playback => "playback",
            Self::Settings => "settings",
        }
    }

    fn tauri_event_name(&self) -> &'static str {
        match self {
            Self::Queue => "remote:queue",
            Self::Playback => "remote:playback",
            Self::Settings => "remote:settings",
        }
    }
}

#[derive(Debug, Clone)]
pub struct RemoteEvent {
    pub kind: RemoteEventKind,
    pub data: String,
}

struct RunningServer {
    task: tauri::async_runtime::JoinHandle<()>,
    cancellation_token: CancellationToken,
    port: u16,
}

pub struct HttpApiState {
    running: Arc<Mutex<Option<RunningServer>>>,
    pub events_tx: broadcast::Sender<RemoteEvent>,
    pub latest_settings: Arc<Mutex<Option<String>>>,
}

impl HttpApiState {
    fn new() -> Self {
        let (events_tx, _) = broadcast::channel(64);
        Self {
            running: Arc::new(Mutex::new(None)),
            events_tx,
            latest_settings: Arc::new(Mutex::new(None)),
        }
    }
}

#[derive(serde::Serialize)]
pub struct HttpApiStartResult {
    pub port: u16,
    pub lan_address: Option<String>,
}

async fn start_server(
    bridge: crate::bridge::bridge::Bridge,
    events_tx: broadcast::Sender<RemoteEvent>,
    latest_settings: Arc<Mutex<Option<String>>>,
    ct: CancellationToken,
    ready: oneshot::Sender<Result<HttpApiStartResult, String>>,
) {
    let router = routes::router(bridge, events_tx, latest_settings);

    let tcp_listener = match crate::net::bind_first_available_port(
        "0.0.0.0",
        REMOTE_PORT_START,
        REMOTE_PORT_END,
    )
    .await
    {
        Ok(listener) => listener,
        Err(message) => {
            log::error!("Failed to bind HTTP API server: {message}");
            let _ = ready.send(Err(message));
            return;
        }
    };

    let bound_port = tcp_listener.local_addr().unwrap().port();
    let lan_address = crate::net::local_lan_ip().map(|ip| ip.to_string());
    log::info!("HTTP API server listening on http://0.0.0.0:{bound_port}/api/health");
    let _ = ready.send(Ok(HttpApiStartResult { port: bound_port, lan_address }));

    let _ = axum::serve(tcp_listener, router)
        .with_graceful_shutdown(async move {
            ct.cancelled().await;
        })
        .await;

    log::info!("HTTP API server stopped");
}

fn listen_for_event(app_handle: &AppHandle, kind: RemoteEventKind, tx: &broadcast::Sender<RemoteEvent>) {
    let tx = tx.clone();
    app_handle.listen(kind.tauri_event_name(), move |event| {
        let _ = tx.send(RemoteEvent {
            kind,
            data: event.payload().to_string(),
        });
    });
}

pub fn init_http_api(app_handle: AppHandle) {
    let state = HttpApiState::new();

    listen_for_event(&app_handle, RemoteEventKind::Queue, &state.events_tx);
    listen_for_event(&app_handle, RemoteEventKind::Playback, &state.events_tx);
    listen_for_event(&app_handle, RemoteEventKind::Settings, &state.events_tx);

    let latest_settings = state.latest_settings.clone();
    app_handle.listen(RemoteEventKind::Settings.tauri_event_name(), move |event| {
        let payload = event.payload().to_string();
        let cache = latest_settings.clone();
        tauri::async_runtime::spawn(async move {
            *cache.lock().await = Some(payload);
        });
    });

    app_handle.manage(state);
}

#[tauri::command]
pub async fn http_api_start(
    state: tauri::State<'_, HttpApiState>,
    bridge: tauri::State<'_, crate::bridge::bridge::Bridge>,
) -> Result<HttpApiStartResult, String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.as_ref() {
        log::info!("HTTP API server already running on port {}", server.port);
        let lan_address = crate::net::local_lan_ip().map(|ip| ip.to_string());
        return Ok(HttpApiStartResult { port: server.port, lan_address });
    }

    log::info!("Starting HTTP API server");
    let ct = CancellationToken::new();
    let (ready_tx, ready_rx) = oneshot::channel();
    let task = tauri::async_runtime::spawn(start_server(
        bridge.inner().clone(),
        state.events_tx.clone(),
        state.latest_settings.clone(),
        ct.clone(),
        ready_tx,
    ));

    match ready_rx.await {
        Ok(Ok(result)) => {
            *guard = Some(RunningServer {
                task,
                cancellation_token: ct,
                port: result.port,
            });
            Ok(result)
        }
        Ok(Err(message)) => Err(message),
        Err(_) => Err("HTTP API server task exited before reporting ready".into()),
    }
}

#[tauri::command]
pub async fn http_api_stop(state: tauri::State<'_, HttpApiState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.take() {
        log::info!("Stopping HTTP API server");
        server.cancellation_token.cancel();
        let _ = server.task.await;
    } else {
        log::info!("HTTP API server already stopped");
    }
    Ok(())
}
