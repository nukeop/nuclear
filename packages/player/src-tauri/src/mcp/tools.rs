use rmcp::{
    handler::server::router::tool::ToolRouter, handler::server::wrapper::Parameters, model::*,
    schemars, tool, tool_router, ErrorData as McpError,
};

use crate::bridge::bridge::Bridge;
use crate::bridge::types::BridgeError;

use super::metadata;

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
pub struct ListMethodsParams {
    pub domain: String,
}

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
pub struct MethodDetailsParams {
    /// The method to describe, in "Domain.method" format, e.g. "Queue.addToQueue".
    pub method: String,
}

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
pub struct DescribeTypeParams {
    #[serde(rename = "type")]
    pub type_name: String,
}

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
pub struct CallParams {
    /// The method to call, in "Domain.method" format, e.g. "Queue.addToQueue".
    pub method: String,
    /// Method parameters as a JSON object with named fields. Omit or pass {} for parameterless methods.
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
        Err(BridgeError::HandlerError(message)) => {
            Ok(CallToolResult::error(vec![Content::text(message)]))
        }
    }
}

fn metadata_result_to_mcp(
    result: Result<serde_json::Value, String>,
) -> Result<CallToolResult, McpError> {
    match result {
        Ok(data) => Ok(CallToolResult::success(vec![Content::text(
            serde_json::to_string_pretty(&data).unwrap_or_default(),
        )])),
        Err(message) => Ok(CallToolResult::error(vec![Content::text(message)])),
    }
}

#[derive(Clone)]
pub struct NuclearMcpServer {
    pub bridge: Bridge,
    pub(crate) tool_router: ToolRouter<NuclearMcpServer>,
}

#[tool_router]
impl NuclearMcpServer {
    pub fn new(bridge: Bridge) -> Self {
        Self {
            bridge,
            tool_router: Self::tool_router(),
        }
    }

    #[tool(
        name = "list_methods",
        description = "List available methods in a Nuclear API domain. Available domains: Queue, Playback, Metadata, Favorites, Playlists, Dashboard, Providers."
    )]
    async fn list_methods(
        &self,
        Parameters(params): Parameters<ListMethodsParams>,
    ) -> Result<CallToolResult, McpError> {
        metadata_result_to_mcp(metadata::list_methods(&params.domain))
    }

    #[tool(
        name = "method_details",
        description = "Get full details for a Nuclear API method: description, parameter names and types, return type. Use Domain.method format."
    )]
    async fn method_details(
        &self,
        Parameters(params): Parameters<MethodDetailsParams>,
    ) -> Result<CallToolResult, McpError> {
        let (domain, method) = match params.method.split_once('.') {
            Some(parts) => parts,
            None => {
                return Ok(CallToolResult::error(vec![Content::text(format!(
                    "Invalid method format '{}': expected 'Domain.method', e.g. 'Queue.addToQueue'.",
                    params.method
                ))]));
            }
        };
        metadata_result_to_mcp(metadata::method_details(domain, method))
    }

    #[tool(
        name = "describe_type",
        description = "Get the JSON shape of a Nuclear data type. Use when a method parameter or return type references a complex type like Track, Queue, QueueItem, etc."
    )]
    async fn describe_type(
        &self,
        Parameters(params): Parameters<DescribeTypeParams>,
    ) -> Result<CallToolResult, McpError> {
        metadata_result_to_mcp(metadata::describe_type(&params.type_name))
    }

    #[tool(
        name = "call",
        description = "Call a Nuclear music player API method. Use Domain.method format for the method name and pass parameters as a JSON object with named fields."
    )]
    async fn call(
        &self,
        Parameters(params): Parameters<CallParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("call({})", params.method),
            self.bridge.call(&params.method, params.params).await,
        )
    }
}
