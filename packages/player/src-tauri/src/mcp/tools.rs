use rmcp::{
    ErrorData as McpError,
    handler::server::router::tool::ToolRouter,
    handler::server::wrapper::Parameters,
    model::*,
    schemars, tool, tool_router,
};

use super::bridge::{BridgeError, McpBridge};

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
pub struct ApiCallParams {
    pub method: String,
    #[serde(default)]
    pub params: serde_json::Value,
}

fn bridge_result_to_mcp(
    tool_label: &str,
    result: Result<serde_json::Value, BridgeError>,
) -> Result<CallToolResult, McpError> {
    match result {
        Ok(data) => Ok(CallToolResult::success(vec![Content::text(
            serde_json::to_string_pretty(&data).unwrap_or_default(),
        )])),
        Err(BridgeError::InfrastructureError(message)) => {
            log::error!("MCP {tool_label} infrastructure error: {message}");
            Err(McpError::internal_error(message, None))
        }
        Err(BridgeError::ToolError(message)) => {
            Ok(CallToolResult::error(vec![Content::text(message)]))
        }
    }
}

#[derive(Clone)]
pub struct NuclearMcpServer {
    pub bridge: McpBridge,
    tool_router: ToolRouter<NuclearMcpServer>,
}

#[tool_router]
impl NuclearMcpServer {
    pub fn new(bridge: McpBridge) -> Self {
        Self {
            bridge,
            tool_router: Self::tool_router(),
        }
    }

    #[tool(
        name = "nuclear_api",
        description = "Call the Nuclear music player API. Supports methods for search, queue management, playback control, and more. Call nuclear_api_schema first to discover available methods and their parameters."
    )]
    async fn nuclear_api(
        &self,
        Parameters(params): Parameters<ApiCallParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("nuclear_api({})", params.method),
            self.bridge.call_tool(&params.method, params.params).await,
        )
    }

    #[tool(
        name = "nuclear_api_schema",
        description = "Discover available Nuclear API methods and their parameters. Returns the full schema of methods you can call via nuclear_api."
    )]
    async fn nuclear_api_schema(&self) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            "nuclear_api_schema",
            self.bridge
                .call_tool("schema", serde_json::Value::Null)
                .await,
        )
    }
}
