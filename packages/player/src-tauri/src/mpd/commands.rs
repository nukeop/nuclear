use crate::bridge::bridge::Bridge;

use super::protocol::{Command, MpdResponse};

pub async fn dispatch(
    _command: &Command,
    _bridge: &Bridge,
) -> Result<MpdResponse, super::protocol::MpdError> {
    Ok(MpdResponse {
        fields: Vec::new(),
    })
}
