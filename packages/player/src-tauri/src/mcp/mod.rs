pub mod bridge;
pub mod tools;

use std::sync::Arc;

use bridge::{McpBridge, McpBridgeResponse};
use rmcp::{ServerHandler, model::*, tool_handler};
use rmcp::transport::streamable_http_server::{
    StreamableHttpServerConfig, StreamableHttpService,
    session::local::LocalSessionManager,
};
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;
use tools::NuclearMcpServer;

const MCP_PORT: u16 = 8800;

#[tool_handler]
impl ServerHandler for NuclearMcpServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            instructions: Some(
                "Nuclear Music Player API. Call nuclear_api_schema to discover available methods, then use nuclear_api to call them.".into(),
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

async fn start_server(bridge: McpBridge, ct: CancellationToken) {
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
            log::error!("Failed to bind MCP server to {bind_addr}: {err}");
            return;
        }
    };

    log::info!("MCP server listening on http://{bind_addr}/mcp");

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
        return Ok(());
    }

    let ct = CancellationToken::new();
    let task = tauri::async_runtime::spawn(start_server(state.bridge.clone(), ct.clone()));
    *guard = Some(RunningServer { task, cancellation_token: ct });
    Ok(())
}

#[tauri::command]
pub async fn mcp_stop(state: tauri::State<'_, McpState>) -> Result<(), String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.take() {
        server.cancellation_token.cancel();
        let _ = server.task.await;
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
