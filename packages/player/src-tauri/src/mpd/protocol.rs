pub const GREETING: &[u8] = b"OK MPD 0.25.0\n";

pub enum Command {
    Ping,
    Password,
    Noop,
    Idle(Vec<String>),
    NoIdle,
    Status,
    CurrentSong,
    PlaylistInfo(Option<PlaylistRange>),
    Play(Option<i32>),
    Pause(Option<bool>),
    Stop,
    Next,
    Previous,
    SetVol(u8),
    GetVol,
    Unknown(String),
}

pub enum PlaylistRange {
    Position(u32),
    Range { start: u32, end: u32 },
}

pub struct MpdResponse {
    pub fields: Vec<(String, String)>,
}

pub struct MpdError {
    pub code: u32,
    pub command: String,
    pub list_index: u32,
    pub message: String,
}

pub const ACK_ERROR_ARG: u32 = 2;
pub const ACK_ERROR_UNKNOWN: u32 = 5;
pub const ACK_ERROR_NO_EXIST: u32 = 50;
pub const ACK_ERROR_SYSTEM: u32 = 52;

fn tokenize_args(input: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut chars = input.chars().peekable();

    while let Some(&ch) = chars.peek() {
        match ch {
            ' ' | '\t' => {
                chars.next();
            }
            '"' => {
                chars.next();
                let mut token = String::new();
                while let Some(&ch) = chars.peek() {
                    match ch {
                        '"' => {
                            chars.next();
                            break;
                        }
                        '\\' => {
                            chars.next();
                            if let Some(&escaped) = chars.peek() {
                                token.push(escaped);
                                chars.next();
                            }
                        }
                        _ => {
                            token.push(ch);
                            chars.next();
                        }
                    }
                }
                tokens.push(token);
            }
            _ => {
                let mut token = String::new();
                while let Some(&ch) = chars.peek() {
                    if ch == ' ' || ch == '\t' {
                        break;
                    }
                    token.push(ch);
                    chars.next();
                }
                tokens.push(token);
            }
        }
    }

    tokens
}

pub fn parse_command(line: &str) -> Command {
    let trimmed = line.trim_end_matches(['\r', '\n']);
    let mut parts = trimmed.splitn(2, ' ');
    let name = parts.next().unwrap_or("");
    let args = tokenize_args(parts.next().unwrap_or(""));
    let first_arg = args.first().map(|arg| arg.as_str()).unwrap_or("");

    match name {
        "ping" => Command::Ping,
        "password" | "tagtypes" | "outputs" => Command::Noop,
        "idle" => Command::Idle(args),
        "noidle" => Command::NoIdle,
        "status" => Command::Status,
        "currentsong" => Command::CurrentSong,
        "stop" => Command::Stop,
        "next" => Command::Next,
        "previous" => Command::Previous,
        "getvol" => Command::GetVol,
        "play" => Command::Play(parse_optional_i32(first_arg)),
        "pause" => Command::Pause(match first_arg {
            "0" => Some(false),
            "1" => Some(true),
            _ => None,
        }),
        "setvol" => match first_arg.parse::<i32>() {
            Ok(vol) => Command::SetVol(vol.clamp(0, 100) as u8),
            Err(_) => Command::Unknown(name.to_string()),
        },
        "playlistinfo" => Command::PlaylistInfo(parse_playlist_range(first_arg)),
        _ => Command::Unknown(name.to_string()),
    }
}

fn parse_optional_i32(arg: &str) -> Option<i32> {
    if arg.is_empty() {
        None
    } else {
        arg.parse().ok()
    }
}

fn parse_playlist_range(arg: &str) -> Option<PlaylistRange> {
    if arg.is_empty() {
        return None;
    }

    if let Some((start, end)) = arg.split_once(':') {
        let start = start.parse().ok()?;
        let end = end.parse().ok()?;
        Some(PlaylistRange::Range { start, end })
    } else {
        let pos = arg.parse().ok()?;
        Some(PlaylistRange::Position(pos))
    }
}

pub fn format_response(response: &MpdResponse) -> Vec<u8> {
    let mut output = Vec::new();
    for (key, value) in &response.fields {
        output.extend_from_slice(key.as_bytes());
        output.extend_from_slice(b": ");
        output.extend_from_slice(value.as_bytes());
        output.push(b'\n');
    }
    output
}

pub fn format_error(error: &MpdError) -> Vec<u8> {
    format!(
        "ACK [{}@{}] {{{}}} {}\n",
        error.code, error.list_index, error.command, error.message
    )
    .into_bytes()
}

pub const LIST_OK: &[u8] = b"list_OK\n";
pub const OK: &[u8] = b"OK\n";
