mod options;
mod playback;
mod queue;
mod status;

use serde_json::Value;

use crate::bridge::bridge::Bridge;

use super::protocol::{
    Command, MpdError, MpdResponse, ACK_ERROR_SYSTEM, ACK_ERROR_UNKNOWN, SUPPORTED_COMMANDS,
};

use options::{getvol, random, repeat, setvol, single};
use playback::{next, pause, play, previous, seek, seekcur, seekid, stop};
use queue::{clear, currentsong, delete, deleteid, move_track, playlistinfo};
use status::status;

type Fields = Vec<(String, String)>;
type CommandResult = Result<MpdResponse, MpdError>;

fn field(key: &str, value: impl ToString) -> (String, String) {
    (key.to_string(), value.to_string())
}

async fn call(
    bridge: &Bridge,
    command: &str,
    method: &str,
    params: Value,
) -> Result<Value, MpdError> {
    bridge.call(method, params).await.map_err(|err| MpdError {
        code: ACK_ERROR_SYSTEM,
        command: command.to_string(),
        list_index: 0,
        message: err.to_string(),
    })
}

fn commands() -> MpdResponse {
    MpdResponse {
        fields: SUPPORTED_COMMANDS
            .iter()
            .map(|name| field("command", name))
            .collect(),
    }
}

pub async fn dispatch(command: &Command, bridge: &Bridge) -> CommandResult {
    match command {
        Command::Ping | Command::Password | Command::Noop | Command::NoIdle => {
            Ok(MpdResponse { fields: Vec::new() })
        }
        Command::Idle(_) => Err(MpdError {
            code: ACK_ERROR_UNKNOWN,
            command: "idle".to_string(),
            list_index: 0,
            message: "idle not allowed in command lists".to_string(),
        }),
        Command::Commands => Ok(commands()),
        Command::Status => status(bridge).await,
        Command::CurrentSong => currentsong(bridge).await,
        Command::PlaylistInfo(range) => playlistinfo(bridge, range).await,
        Command::Play(position) => play(bridge, position).await,
        Command::Pause(state) => pause(bridge, state).await,
        Command::Stop => stop(bridge).await,
        Command::Next => next(bridge).await,
        Command::Previous => previous(bridge).await,
        Command::SetVol(vol) => setvol(bridge, *vol).await,
        Command::GetVol => getvol(bridge).await,
        Command::Seek(position, time) => seek(bridge, *position, *time).await,
        Command::SeekId(id, time) => seekid(bridge, *id, *time).await,
        Command::SeekCur(raw_time) => seekcur(bridge, raw_time).await,
        Command::Clear => clear(bridge).await,
        Command::Delete(range) => delete(bridge, range).await,
        Command::DeleteId(id) => deleteid(bridge, *id).await,
        Command::Move(from, to) => move_track(bridge, *from, *to).await,
        Command::Shuffle => Ok(MpdResponse { fields: Vec::new() }),
        Command::Random(enabled) => random(bridge, *enabled).await,
        Command::Repeat(enabled) => repeat(bridge, *enabled).await,
        Command::Single(enabled) => single(bridge, *enabled).await,
        Command::Unknown(name) => Err(MpdError {
            code: ACK_ERROR_UNKNOWN,
            command: name.clone(),
            list_index: 0,
            message: "unknown command".to_string(),
        }),
    }
}
