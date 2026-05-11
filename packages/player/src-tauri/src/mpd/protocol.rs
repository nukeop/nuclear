pub const GREETING: &[u8] = b"OK MPD 0.25.0\n";

pub enum Command {
    Ping,
    Password,
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

pub fn parse_command(line: &str) -> Command {
    let trimmed = line.trim_end_matches(['\r', '\n']);
    let mut parts = trimmed.splitn(2, ' ');
    let name = parts.next().unwrap_or("");
    let args = parts.next().unwrap_or("").trim();

    match name {
        "ping" => Command::Ping,
        "password" => Command::Password,
        "status" => Command::Status,
        "currentsong" => Command::CurrentSong,
        "stop" => Command::Stop,
        "next" => Command::Next,
        "previous" => Command::Previous,
        "getvol" => Command::GetVol,
        "play" => Command::Play(parse_optional_i32(args)),
        "pause" => Command::Pause(match args {
            "0" => Some(false),
            "1" => Some(true),
            _ => None,
        }),
        "setvol" => match args.parse::<i32>() {
            Ok(vol) => Command::SetVol(vol.clamp(0, 100) as u8),
            Err(_) => Command::Unknown(name.to_string()),
        },
        "playlistinfo" => Command::PlaylistInfo(parse_playlist_range(args)),
        _ => Command::Unknown(name.to_string()),
    }
}

fn parse_optional_i32(args: &str) -> Option<i32> {
    if args.is_empty() {
        None
    } else {
        args.parse().ok()
    }
}

fn parse_playlist_range(args: &str) -> Option<PlaylistRange> {
    if args.is_empty() {
        return None;
    }

    if let Some((start, end)) = args.split_once(':') {
        let start = start.parse().ok()?;
        let end = end.parse().ok()?;
        Some(PlaylistRange::Range { start, end })
    } else {
        let pos = args.parse().ok()?;
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
