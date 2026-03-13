use log::{debug, error};
use std::process::{Command, Stdio};
use std::sync::RwLock;
use tauri::command;

static YTDLP_PATH: RwLock<Option<String>> = RwLock::new(None);

pub fn set_ytdlp_path(path: String) {
    if let Ok(mut guard) = YTDLP_PATH.write() {
        debug!("[yt-dlp] Binary path set to: {}", path);
        *guard = Some(path);
    }
}

fn get_ytdlp_path() -> Result<String, String> {
    match YTDLP_PATH.read() {
        Ok(guard) => match guard.as_ref() {
            Some(path) => Ok(path.clone()),
            None => {
                Err("yt-dlp is not installed. It will be downloaded automatically.".to_string())
            }
        },
        Err(_) => {
            debug!("[yt-dlp] RwLock poisoned, falling back to system PATH");
            Ok("yt-dlp".to_string())
        }
    }
}

#[derive(serde::Serialize, Debug, PartialEq)]
pub struct YtdlpStreamInfo {
    pub stream_url: String,
    pub duration: Option<f64>,
    pub title: Option<String>,
    pub container: Option<String>,
    pub codec: Option<String>,
}

#[derive(serde::Serialize, Debug, PartialEq)]
pub struct YtdlpSearchResult {
    pub id: String,
    pub title: String,
    pub duration: Option<f64>,
    pub thumbnail: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone, PartialEq)]
pub struct YtdlpThumbnail {
    pub url: String,
    pub width: Option<u32>,
    pub height: Option<u32>,
}

#[derive(serde::Serialize, Debug, PartialEq)]
pub struct YtdlpPlaylistEntry {
    pub id: String,
    pub title: String,
    pub duration: Option<f64>,
    pub thumbnails: Vec<YtdlpThumbnail>,
    pub channel: Option<String>,
}

#[derive(serde::Serialize, Debug, PartialEq)]
pub struct YtdlpPlaylistInfo {
    pub id: String,
    pub title: String,
    pub entries: Vec<YtdlpPlaylistEntry>,
}

#[derive(serde::Deserialize)]
struct YtdlpJson {
    id: Option<String>,
    title: Option<String>,
    duration: Option<f64>,
    url: Option<String>,
    thumbnail: Option<String>,
    thumbnails: Option<Vec<YtdlpThumbnail>>,
    ext: Option<String>,
    acodec: Option<String>,
    playlist_title: Option<String>,
    playlist_id: Option<String>,
    channel: Option<String>,
}

fn run_ytdlp(args: &[&str]) -> Result<String, String> {
    let program = get_ytdlp_path()?;
    let output = Command::new(&program)
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|error| {
            error!("[yt-dlp] Failed to execute: {}", error);
            format!("Failed to execute yt-dlp: {}. Is yt-dlp installed?", error)
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("[yt-dlp] Command failed: {}", stderr);
        return Err(format!("yt-dlp failed: {}", stderr));
    }

    Ok(String::from_utf8_lossy(&output.stdout).into_owned())
}

fn parse_ndjson_entries(stdout: &str) -> Vec<YtdlpJson> {
    stdout
        .lines()
        .filter(|line| !line.trim().is_empty())
        .filter_map(|line| serde_json::from_str::<YtdlpJson>(line).ok())
        .collect()
}

#[command]
pub async fn ytdlp_search(
    query: String,
    max_results: Option<u32>,
) -> Result<Vec<YtdlpSearchResult>, String> {
    let limit = max_results.unwrap_or(10);
    debug!("[yt-dlp] Searching: {} (limit: {})", query, limit);

    let search_url = format!("ytsearch{}:{}", limit, query);
    let stdout = run_ytdlp(&[
        "--dump-json",
        "--flat-playlist",
        "--no-warnings",
        &search_url,
    ])?;

    let results: Vec<YtdlpSearchResult> = parse_ndjson_entries(&stdout)
        .into_iter()
        .filter_map(|entry| {
            entry.id.map(|id| YtdlpSearchResult {
                id,
                title: entry.title.unwrap_or_else(|| "Unknown".to_string()),
                duration: entry.duration,
                thumbnail: entry.thumbnail,
            })
        })
        .collect();

    debug!("[yt-dlp] Found {} results", results.len());
    Ok(results)
}

#[command]
pub async fn ytdlp_get_stream(video_id: String) -> Result<YtdlpStreamInfo, String> {
    debug!("[yt-dlp] Getting stream for: {}", video_id);

    let url = format!("https://www.youtube.com/watch?v={}", video_id);
    let stdout = run_ytdlp(&[
        "-f",
        "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        &url,
    ])?;

    let info: YtdlpJson = serde_json::from_str(&stdout).map_err(|error| {
        error!("[yt-dlp] Failed to parse output: {}", error);
        format!("Failed to parse yt-dlp output: {}", error)
    })?;

    let stream_url = info.url.ok_or_else(|| {
        error!("[yt-dlp] No URL in output");
        "No stream URL returned by yt-dlp".to_string()
    })?;

    debug!(
        "[yt-dlp] Got stream for '{}', duration: {:?}s",
        info.title.as_deref().unwrap_or("Unknown"),
        info.duration
    );

    Ok(YtdlpStreamInfo {
        stream_url,
        duration: info.duration,
        title: info.title,
        container: info.ext,
        codec: info.acodec,
    })
}

#[command]
pub async fn ytdlp_get_playlist(url: String) -> Result<YtdlpPlaylistInfo, String> {
    debug!("[yt-dlp] Getting playlist: {}", url);

    let stdout = run_ytdlp(&["--dump-json", "--flat-playlist", "--no-warnings", &url])?;
    let entries_json = parse_ndjson_entries(&stdout);

    let playlist_title = entries_json
        .iter()
        .find_map(|entry| entry.playlist_title.clone())
        .ok_or_else(|| {
            error!("[yt-dlp] No playlist metadata found in output");
            "No playlist metadata found in yt-dlp output".to_string()
        })?;

    let playlist_id = entries_json
        .iter()
        .find_map(|entry| entry.playlist_id.clone())
        .unwrap_or_default();

    let entries: Vec<YtdlpPlaylistEntry> = entries_json
        .into_iter()
        .filter_map(|entry| {
            entry.id.map(|id| YtdlpPlaylistEntry {
                id,
                title: entry.title.unwrap_or_else(|| "Unknown".to_string()),
                duration: entry.duration,
                thumbnails: entry.thumbnails.unwrap_or_default(),
                channel: entry.channel,
            })
        })
        .collect();

    debug!(
        "[yt-dlp] Playlist '{}' has {} entries",
        playlist_title,
        entries.len()
    );

    Ok(YtdlpPlaylistInfo {
        id: playlist_id,
        title: playlist_title,
        entries,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    mod parse_ndjson {
        use super::*;

        #[test]
        fn parses_multiple_lines() {
            let input = r#"{"id":"v1","title":"First"}
{"id":"v2","title":"Second"}"#;

            let results = parse_ndjson_entries(input);

            assert_eq!(results.len(), 2);
            assert_eq!(results[0].id.as_deref(), Some("v1"));
            assert_eq!(results[1].id.as_deref(), Some("v2"));
        }

        #[test]
        fn skips_malformed_lines() {
            let input = r#"{"id":"good"}
not json
{"id":"also_good"}"#;

            let results = parse_ndjson_entries(input);

            assert_eq!(results.len(), 2);
        }

        #[test]
        fn skips_empty_lines() {
            let input = "\n{\"id\":\"v1\"}\n\n{\"id\":\"v2\"}\n";

            let results = parse_ndjson_entries(input);

            assert_eq!(results.len(), 2);
        }

        #[test]
        fn returns_empty_vec_for_empty_input() {
            assert!(parse_ndjson_entries("").is_empty());
            assert!(parse_ndjson_entries("\n\n").is_empty());
        }
    }
}
