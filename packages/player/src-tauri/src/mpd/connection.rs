use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpStream;
use tokio::net::tcp::{OwnedReadHalf, OwnedWriteHalf};

use crate::bridge::bridge::Bridge;

use super::commands;
use super::idle::{IdleResult, IdleWait};
use super::protocol::{self, Command, MpdError, MpdResponse};

enum ListMode {
    None,
    Plain,
    WithListOk,
}

struct Connection {
    reader: BufReader<OwnedReadHalf>,
    writer: OwnedWriteHalf,
    bridge: Bridge,
    peer: String,
}

impl Connection {
    fn new(stream: TcpStream, bridge: Bridge) -> Self {
        let peer = stream
            .peer_addr()
            .map(|addr| addr.to_string())
            .unwrap_or_else(|_| "unknown".into());

        let (read_half, writer) = stream.into_split();
        let reader = BufReader::new(read_half);

        Connection { reader, writer, bridge, peer }
    }

    async fn write_ok(&mut self) -> std::io::Result<()> {
        self.writer.write_all(protocol::OK).await
    }

    async fn write_response(&mut self, response: &MpdResponse) -> std::io::Result<()> {
        self.writer
            .write_all(&protocol::format_response(response))
            .await?;
        self.write_ok().await
    }

    async fn write_error(&mut self, error: &MpdError) -> std::io::Result<()> {
        self.writer
            .write_all(&protocol::format_error(error))
            .await
    }

    async fn read_line(&mut self, buf: &mut String) -> std::io::Result<usize> {
        self.reader.read_line(buf).await
    }

    async fn handle_command(&mut self, command: Command) -> std::io::Result<()> {
        match command {
            Command::Idle(subsystems) => self.handle_idle(subsystems).await,
            Command::NoIdle => self.write_ok().await,
            _ => match commands::dispatch(&command, &self.bridge).await {
                Ok(response) => self.write_response(&response).await,
                Err(error) => self.write_error(&error).await,
            },
        }
    }

    async fn handle_idle(&mut self, subsystems: Vec<String>) -> std::io::Result<()> {
        log::debug!(target: "mpd", "[{}] entering idle (subsystems: {:?})", self.peer, subsystems);

        let receiver = self.bridge.subscribe_notifications();
        let mut idle_wait = IdleWait::new(receiver, subsystems);
        let mut idle_line = String::new();

        'idle: loop {
            idle_line.clear();
            tokio::select! {
                idle_result = idle_wait.wait() => {
                    match idle_result {
                        IdleResult::Changed(changed) => {
                            for subsystem in &changed {
                                self.writer
                                    .write_all(format!("changed: {subsystem}\n").as_bytes())
                                    .await?;
                            }
                            self.write_ok().await?;
                            break 'idle;
                        }
                        IdleResult::Closed => {
                            self.write_ok().await?;
                            break 'idle;
                        }
                    }
                }
                read_result = self.reader.read_line(&mut idle_line) => {
                    let bytes = read_result?;
                    if bytes == 0 {
                        break 'idle;
                    }
                    let trimmed = idle_line.trim_end_matches(['\r', '\n']);
                    if matches!(protocol::parse_command(trimmed), Command::NoIdle) {
                        self.write_ok().await?;
                        break 'idle;
                    }
                    // Any other input during idle is ignored per MPD protocol
                }
            }
        }

        log::debug!(target: "mpd", "[{}] exiting idle", self.peer);
        Ok(())
    }

    async fn execute_command_list(
        &mut self,
        commands: &[Command],
        list_ok: bool,
    ) -> std::io::Result<()> {
        for (index, command) in commands.iter().enumerate() {
            match commands::dispatch(command, &self.bridge).await {
                Ok(response) => {
                    self.writer
                        .write_all(&protocol::format_response(&response))
                        .await?;
                    if list_ok {
                        self.writer.write_all(protocol::LIST_OK).await?;
                    }
                }
                Err(error) => {
                    let indexed_error = MpdError {
                        code: error.code,
                        command: error.command.clone(),
                        list_index: index as u32,
                        message: error.message.clone(),
                    };
                    self.write_error(&indexed_error).await?;
                    return Ok(());
                }
            }
        }
        self.write_ok().await
    }

    async fn run(&mut self) -> std::io::Result<()> {
        self.writer.write_all(protocol::GREETING).await?;

        let mut line = String::new();
        let mut list_mode = ListMode::None;
        let mut list_buffer: Vec<Command> = Vec::new();

        loop {
            line.clear();
            let bytes_read = self.read_line(&mut line).await?;
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
                    let list_ok = matches!(list_mode, ListMode::WithListOk);
                    self.execute_command_list(&list_buffer, list_ok).await?;
                    list_mode = ListMode::None;
                    list_buffer.clear();
                }
                raw_command => {
                    let command = protocol::parse_command(raw_command);
                    match list_mode {
                        ListMode::None => {
                            log::debug!(target: "mpd", "[{}]: {raw_command}", self.peer);
                            self.handle_command(command).await?;
                        }
                        _ => {
                            list_buffer.push(command);
                        }
                    }
                }
            }
        }

        Ok(())
    }
}


pub async fn handle_connection(bridge: Bridge, stream: TcpStream) -> std::io::Result<()> {
    let mut conn = Connection::new(stream, bridge);
    log::debug!(target: "mpd", "Client connected: {}", conn.peer);

    conn.run().await?;

    log::debug!(target: "mpd", "Client {} disconnected", conn.peer);
    Ok(())
}
