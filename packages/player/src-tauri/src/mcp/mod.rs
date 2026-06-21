pub mod metadata;
pub mod tools;

use std::sync::Arc;

use rmcp::transport::streamable_http_server::{
    session::local::LocalSessionManager, StreamableHttpServerConfig, StreamableHttpService,
};
use rmcp::{model::*, tool_handler, ServerHandler};
use tauri::{AppHandle, Manager};
use tokio::sync::{oneshot, Mutex};
use tokio_util::sync::CancellationToken;
use tools::NuclearMcpServer;

const MCP_PORT_START: u16 = 8800;
const MCP_PORT_END: u16 = 8809;

#[tool_handler]
impl ServerHandler for NuclearMcpServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            instructions: Some(
                "Nuclear Music Player MCP server. Use list_methods to discover domains, method_details for parameter info, describe_type for data type shapes, and call to execute methods.".into(),
            ),
            capabilities: ServerCapabilities::builder().enable_tools().build(),
            ..Default::default()
        }
    }
}

struct RunningServer {
    task: tauri::async_runtime::JoinHandle<()>,
    cancellation_token: CancellationToken,
    port: u16,
}

pub struct McpState {
    running: Arc<Mutex<Option<RunningServer>>>,
}

impl McpState {
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
    let service = StreamableHttpService::new(
        move || Ok(NuclearMcpServer::new(bridge.clone())),
        LocalSessionManager::default().into(),
        StreamableHttpServerConfig {
            cancellation_token: ct.child_token(),
            ..Default::default()
        },
    );

    let router = axum::Router::new().nest_service("/mcp", service);

    let tcp_listener = match crate::net::bind_first_available_port(
        "127.0.0.1",
        MCP_PORT_START,
        MCP_PORT_END,
    )
    .await
    {
        Ok(listener) => listener,
        Err(message) => {
            log::error!("Failed to bind MCP server: {message}");
            let _ = ready.send(Err(message));
            return;
        }
    };

    let bound_port = tcp_listener.local_addr().unwrap().port();
    log::info!("MCP server listening on http://127.0.0.1:{bound_port}/mcp");
    let _ = ready.send(Ok(bound_port));

    let _ = axum::serve(tcp_listener, router)
        .with_graceful_shutdown(async move {
            ct.cancelled().await;
        })
        .await;

    log::info!("MCP server stopped");
}

pub fn init_mcp(app_handle: AppHandle) {
    let state = McpState::new();
    app_handle.manage(state);
}

#[tauri::command]
pub async fn mcp_start(
    state: tauri::State<'_, McpState>,
    bridge: tauri::State<'_, crate::bridge::bridge::Bridge>,
) -> Result<u16, String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.as_ref() {
        log::info!("MCP server already running on port {}", server.port);
        return Ok(server.port);
    }

    log::info!("Starting MCP server");
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
        Err(_) => Err("MCP server task exited before reporting ready".into()),
    }
}

#[tauri::command]
pub async fn mcp_stop(state: tauri::State<'_, McpState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.take() {
        log::info!("Stopping MCP server");
        server.cancellation_token.cancel();
        let _ = server.task.await;
    } else {
        log::info!("MCP server already stopped");
    }
    Ok(())
}
