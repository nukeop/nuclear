use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpStream;

use crate::bridge::bridge::Bridge;

use super::protocol;

enum ListMode {
    None,
    Plain,
    WithListOk,
}

pub async fn handle_connection(_bridge: Bridge, stream: TcpStream) -> std::io::Result<()> {
    let peer = stream
        .peer_addr()
        .map(|addr| addr.to_string())
        .unwrap_or_else(|_| "unknown".into());
    log::debug!(target: "mpd", "Client connected: {peer}");

    let (read_half, mut write_half) = stream.into_split();
    write_half.write_all(protocol::GREETING).await?;

    let mut reader = BufReader::new(read_half);
    let mut line = String::new();
    let mut list_mode = ListMode::None;
    let mut list_buffer: Vec<String> = Vec::new();

    loop {
        line.clear();
        let bytes_read = reader.read_line(&mut line).await?;
        if bytes_read == 0 {
            break;
        }

        let trimmed = line.trim_end_matches(['\r', '\n']);
        if trimmed == "close" {
            break;
        }

        match trimmed {
            "command_list_begin" => {
                list_mode = ListMode::Plain;
                list_buffer.clear();
            }
            "command_list_ok_begin" => {
                list_mode = ListMode::WithListOk;
                list_buffer.clear();
            }
            "command_list_end" => {
                for command in &list_buffer {
                    log::debug!(target: "mpd", "[{peer}] (list): {command}");
                    if matches!(list_mode, ListMode::WithListOk) {
                        write_half.write_all(b"list_OK\n").await?;
                    }
                }
                write_half.write_all(b"OK\n").await?;
                list_mode = ListMode::None;
                list_buffer.clear();
            }
            command => match list_mode {
                ListMode::None => {
                    log::debug!(target: "mpd", "[{peer}]: {command}");
                    write_half.write_all(b"OK\n").await?;
                }
                _ => {
                    list_buffer.push(command.to_string());
                }
            },
        }
    }

    log::debug!(target: "mpd", "Client {peer} disconnected");
    Ok(())
}
