pub mod bridge;
pub mod tools;

use std::sync::Arc;

use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{self, Next},
    response::{IntoResponse, Response},
};
use bridge::{McpBridge, McpBridgeResponse};
use rmcp::transport::streamable_http_server::{
    session::local::LocalSessionManager, StreamableHttpServerConfig, StreamableHttpService,
};
use rmcp::{model::*, tool_handler, ServerHandler};
use serde::Serialize;
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

// returned to the UI so it can store the token for external MCP clients
#[derive(Debug, Serialize)]
pub struct McpStartResult {
    pub port: u16,
    pub token: String,
}

struct RunningServer {
    task: tauri::async_runtime::JoinHandle<()>,
    cancellation_token: CancellationToken,
    port: u16,
    token: String,
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

async fn try_bind(port_start: u16, port_end: u16) -> Result<tokio::net::TcpListener, String> {
    let mut last_error = String::new();
    for port in port_start..=port_end {
        match tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await {
            Ok(listener) => return Ok(listener),
            Err(err) => {
                log::debug!("Port {port} unavailable: {err}");
                last_error = format!("{err}");
            }
        }
    }
    Err(format!(
        "No available port in range {port_start}-{port_end}: {last_error}"
    ))
}

// any client needs to send x-mcp-token to talk to the MCP server.
// browsers can't send custom headers cross-origin without a CORS preflight, and we don't set
// any CORS headers, so web-based attacks are already blocked. this is mainly for local process isolation.
async fn check_mcp_token(token: String, request: Request, next: Next) -> Response {
    let provided = request
        .headers()
        .get("x-mcp-token")
        .and_then(|v| v.to_str().ok());

    if provided != Some(token.as_str()) {
        return (StatusCode::UNAUTHORIZED, "missing or invalid token\n").into_response();
    }

    next.run(request).await
}

async fn start_server(
    bridge: McpBridge,
    ct: CancellationToken,
    ready: oneshot::Sender<Result<u16, String>>,
    token: String,
) {
    let service = StreamableHttpService::new(
        move || Ok(NuclearMcpServer::new(bridge.clone())),
        LocalSessionManager::default().into(),
        StreamableHttpServerConfig {
            cancellation_token: ct.child_token(),
            ..Default::default()
        },
    );

    // wrap with token auth - client must send x-mcp-token header
    let auth_token = token.clone();
    let router = axum::Router::new()
        .nest_service("/mcp", service)
        .layer(middleware::from_fn(move |req: Request, next: Next| {
            check_mcp_token(auth_token.clone(), req, next)
        }));

    let tcp_listener = match try_bind(MCP_PORT_START, MCP_PORT_END).await {
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
    let state = McpState::new(app_handle.clone());
    app_handle.manage(state);
}

#[tauri::command]
pub async fn mcp_start(state: tauri::State<'_, McpState>) -> Result<McpStartResult, String> {
    let mut guard = state.running.lock().await;
    if let Some(server) = guard.as_ref() {
        log::info!("MCP server already running on port {}", server.port);
        return Ok(McpStartResult {
            port: server.port,
            token: server.token.clone(),
        });
    }

    // fresh token every time the server starts
    let token = uuid::Uuid::new_v4().to_string();
    log::info!("Starting MCP server");
    let ct = CancellationToken::new();
    let (ready_tx, ready_rx) = oneshot::channel();
    let task = tauri::async_runtime::spawn(start_server(
        state.bridge.clone(),
        ct.clone(),
        ready_tx,
        token.clone(),
    ));

    match ready_rx.await {
        Ok(Ok(port)) => {
            *guard = Some(RunningServer {
                task,
                cancellation_token: ct,
                port,
                token: token.clone(),
            });
            Ok(McpStartResult { port, token })
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
