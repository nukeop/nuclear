use rmcp::{
    handler::server::router::tool::ToolRouter, handler::server::wrapper::Parameters, model::*,
    schemars, tool, tool_router, ErrorData as McpError,
};

use super::bridge::{BridgeError, McpBridge};

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
        Err(BridgeError::ToolError(message)) => {
            Ok(CallToolResult::error(vec![Content::text(message)]))
        }
    }
}

#[derive(Clone)]
pub struct NuclearMcpServer {
    pub bridge: McpBridge,
    pub(crate) tool_router: ToolRouter<NuclearMcpServer>,
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
        name = "nuclear_list_methods",
        description = "List available methods in a Nuclear API domain. Available domains: Queue."
    )]
    async fn nuclear_list_methods(
        &self,
        Parameters(params): Parameters<ListMethodsParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("nuclear_list_methods({})", params.domain),
            self.bridge
                .call_tool(
                    "list_methods",
                    serde_json::to_value(&params.domain).unwrap(),
                )
                .await,
        )
    }

    #[tool(
        name = "nuclear_method_details",
        description = "Get full details for a Nuclear API method: description, parameter names and types, return type. Use Domain.method format."
    )]
    async fn nuclear_method_details(
        &self,
        Parameters(params): Parameters<MethodDetailsParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("nuclear_method_details({})", params.method),
            self.bridge
                .call_tool(
                    "method_details",
                    serde_json::to_value(&params.method).unwrap(),
                )
                .await,
        )
    }

    #[tool(
        name = "nuclear_describe_type",
        description = "Get the JSON shape of a Nuclear data type. Use when a method parameter or return type references a complex type like Track, Queue, QueueItem, etc."
    )]
    async fn nuclear_describe_type(
        &self,
        Parameters(params): Parameters<DescribeTypeParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("nuclear_describe_type({})", params.type_name),
            self.bridge
                .call_tool(
                    "describe_type",
                    serde_json::to_value(&params.type_name).unwrap(),
                )
                .await,
        )
    }

    #[tool(
        name = "nuclear_call",
        description = "Call a Nuclear music player API method. Use Domain.method format for the method name and pass parameters as a JSON object with named fields."
    )]
    async fn nuclear_call(
        &self,
        Parameters(params): Parameters<CallParams>,
    ) -> Result<CallToolResult, McpError> {
        bridge_result_to_mcp(
            &format!("nuclear_call({})", params.method),
            self.bridge.call_tool(&params.method, params.params).await,
        )
    }
}
