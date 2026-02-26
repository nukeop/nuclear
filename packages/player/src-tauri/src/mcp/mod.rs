pub mod bridge;
pub mod tools;

use std::sync::Arc;

use bridge::{McpBridge, McpBridgeResponse};
use rmcp::transport::streamable_http_server::{
    session::local::LocalSessionManager, StreamableHttpServerConfig, StreamableHttpService,
};
use rmcp::{model::*, tool_handler, ServerHandler};
use tauri::{AppHandle, Manager};
use tokio::sync::{oneshot, Mutex};
use tokio_util::sync::CancellationToken;
use tools::NuclearMcpServer;

const MCP_PORT: u16 = 8800;

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
}

pub struct McpState {
    bridge: McpBridge,
    running: Arc<Mutex<Option<RunningServer>>>,
}

impl McpState {
    fn new(app_handle: AppHandle) -> Self {
        Self {
            bridge: McpBridge::new(app_handle),
            running: Arc::new(Mutex::new(None)),
        }
    }
}

async fn start_server(
    bridge: McpBridge,
    ct: CancellationToken,
    ready: oneshot::Sender<Result<(), String>>,
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

    let bind_addr = format!("127.0.0.1:{MCP_PORT}");
    let tcp_listener = match tokio::net::TcpListener::bind(&bind_addr).await {
        Ok(listener) => listener,
        Err(err) => {
            let message = format!("Failed to bind MCP server to {bind_addr}: {err}");
            log::error!("{message}");
            let _ = ready.send(Err(message));
            return;
        }
    };

    log::info!("MCP server listening on http://{bind_addr}/mcp");
    let _ = ready.send(Ok(()));

    let _ = axum::serve(tcp_listener, router)
        .with_graceful_shutdown(async move {
            ct.cancelled().await;
        })
        .await;

    log::info!("MCP server stopped");
}

pub fn init_mcp(app_handle: AppHandle) {
    let state = McpState::new(app_handle.clone());
    app_handle.manage(state);
}

#[tauri::command]
pub async fn mcp_start(state: tauri::State<'_, McpState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if guard.is_some() {
        log::info!("MCP server already running");
        return Ok(());
    }

    log::info!("Starting MCP server");
    let ct = CancellationToken::new();
    let (ready_tx, ready_rx) = oneshot::channel();
    let task =
        tauri::async_runtime::spawn(start_server(state.bridge.clone(), ct.clone(), ready_tx));

    match ready_rx.await {
        Ok(Ok(())) => {
            *guard = Some(RunningServer {
                task,
                cancellation_token: ct,
            });
            Ok(())
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

#[tauri::command]
pub async fn mcp_respond(
    state: tauri::State<'_, McpState>,
    response: McpBridgeResponse,
) -> Result<(), String> {
    state.bridge.handle_response(response).await;
    Ok(())
}
