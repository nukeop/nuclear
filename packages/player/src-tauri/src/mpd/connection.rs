use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpStream;

use crate::bridge::bridge::Bridge;

use super::commands;
use super::protocol::{self, Command, MpdResponse};

enum ListMode {
    None,
    Plain,
    WithListOk,
}

async fn execute_command(
    command: &Command,
    bridge: &Bridge,
) -> Result<MpdResponse, protocol::MpdError> {
    commands::dispatch(command, bridge).await
}

async fn write_success(
    write_half: &mut tokio::net::tcp::OwnedWriteHalf,
    response: &MpdResponse,
) -> std::io::Result<()> {
    write_half
        .write_all(&protocol::format_response(response))
        .await?;
    write_half.write_all(protocol::OK).await
}

pub async fn handle_connection(bridge: Bridge, stream: TcpStream) -> std::io::Result<()> {
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
    let mut list_buffer: Vec<Command> = Vec::new();

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
                let mut list_error = false;
                for (index, command) in list_buffer.iter().enumerate() {
                    match execute_command(command, &bridge).await {
                        Ok(response) => {
                            write_half
                                .write_all(&protocol::format_response(&response))
                                .await?;
                            if matches!(list_mode, ListMode::WithListOk) {
                                write_half.write_all(protocol::LIST_OK).await?;
                            }
                        }
                        Err(error) => {
                            let indexed_error = protocol::MpdError {
                                code: error.code,
                                command: error.command.clone(),
                                list_index: index as u32,
                                message: error.message.clone(),
                            };
                            write_half
                                .write_all(&protocol::format_error(&indexed_error))
                                .await?;
                            list_error = true;
                            break;
                        }
                    }
                }
                if !list_error {
                    write_half.write_all(protocol::OK).await?;
                }
                list_mode = ListMode::None;
                list_buffer.clear();
            }
            raw_command => {
                let command = protocol::parse_command(raw_command);
                match list_mode {
                    ListMode::None => {
                        log::debug!(target: "mpd", "[{peer}]: {raw_command}");
                        match execute_command(&command, &bridge).await {
                            Ok(response) => write_success(&mut write_half, &response).await?,
                            Err(error) => {
                                write_half
                                    .write_all(&protocol::format_error(&error))
                                    .await?
                            }
                        }
                    }
                    _ => {
                        list_buffer.push(command);
                    }
                }
            }
        }
    }

    log::debug!(target: "mpd", "Client {peer} disconnected");
    Ok(())
}
