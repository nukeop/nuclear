use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

use crate::bridge::bridge::Bridge;

use super::protocol;

pub async fn handle_connection(_bridge: Bridge, stream: TcpStream) -> std::io::Result<()> {
    let peer = stream
        .peer_addr()
        .map(|addr| addr.to_string())
        .unwrap_or_else(|_| "unknown".into());
    log::debug!("MPD client connected: {peer}");

    let (_read_half, mut write_half) = stream.into_split();
    write_half.write_all(protocol::GREETING).await?;

    log::debug!("MPD client {peer} disconnected");
    Ok(())
}
