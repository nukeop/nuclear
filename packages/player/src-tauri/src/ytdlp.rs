use log::{debug, error};
use std::process::{Command, Output, Stdio};
use tauri::command;

#[cfg(test)]
use mockall::automock;

// These types correspond to Typescript types in packages/plugin-sdk/src/types/ytdlp.ts
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

#[derive(serde::Deserialize)]
struct YtdlpJson {
    id: Option<String>,
    title: Option<String>,
    duration: Option<f64>,
    url: Option<String>,
    thumbnail: Option<String>,
    ext: Option<String>,
    acodec: Option<String>,
}

#[cfg_attr(test, automock)]
trait CommandRunner {
    fn run<'a>(&self, program: &'a str, args: &'a [&'a str]) -> Result<Output, std::io::Error>;
}

struct RealCommandRunner;

impl CommandRunner for RealCommandRunner {
    fn run(&self, program: &str, args: &[&str]) -> Result<Output, std::io::Error> {
        Command::new(program)
            .args(args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
    }
}

fn search_with_runner(
    runner: &impl CommandRunner,
    query: &str,
    max_results: Option<u32>,
) -> Result<Vec<YtdlpSearchResult>, String> {
    let limit = max_results.unwrap_or(10);
    debug!("[yt-dlp] Searching: {} (limit: {})", query, limit);

    let search_url = format!("ytsearch{}:{}", limit, query);
    let args = [
        "--dump-json",
        "--flat-playlist",
        "--no-warnings",
        &search_url,
    ];

    let output = runner.run("yt-dlp", &args).map_err(|e| {
        error!("[yt-dlp] Failed to execute: {}", e);
        format!("Failed to execute yt-dlp: {}. Is yt-dlp installed?", e)
    })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("[yt-dlp] Search failed: {}", stderr);
        return Err(format!("yt-dlp search failed: {}", stderr));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut results = Vec::new();

    for line in stdout.lines() {
        if line.trim().is_empty() {
            continue;
        }

        if let Ok(info) = serde_json::from_str::<YtdlpJson>(line) {
            if let Some(id) = info.id {
                results.push(YtdlpSearchResult {
                    id,
                    title: info.title.unwrap_or_else(|| "Unknown".to_string()),
                    duration: info.duration,
                    thumbnail: info.thumbnail,
                });
            }
        }
    }

    debug!("[yt-dlp] Found {} results", results.len());
    Ok(results)
}

fn get_stream_with_runner(
    runner: &impl CommandRunner,
    video_id: &str,
) -> Result<YtdlpStreamInfo, String> {
    debug!("[yt-dlp] Getting stream for: {}", video_id);

    let url = format!("https://www.youtube.com/watch?v={}", video_id);
    let args = [
        "-f",
        "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        &url,
    ];

    let output = runner.run("yt-dlp", &args).map_err(|e| {
        error!("[yt-dlp] Failed to execute: {}", e);
        format!("Failed to execute yt-dlp: {}. Is yt-dlp installed?", e)
    })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("[yt-dlp] Failed: {}", stderr);
        return Err(format!("yt-dlp failed: {}", stderr));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let info: YtdlpJson = serde_json::from_str(&stdout).map_err(|e| {
        error!("[yt-dlp] Failed to parse output: {}", e);
        format!("Failed to parse yt-dlp output: {}", e)
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
pub async fn ytdlp_search(
    query: String,
    max_results: Option<u32>,
) -> Result<Vec<YtdlpSearchResult>, String> {
    search_with_runner(&RealCommandRunner, &query, max_results)
}

#[command]
pub async fn ytdlp_get_stream(video_id: String) -> Result<YtdlpStreamInfo, String> {
    get_stream_with_runner(&RealCommandRunner, &video_id)
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::*;
    use std::os::unix::process::ExitStatusExt;
    use std::process::ExitStatus;

    fn mock_output(stdout: &str, stderr: &str, exit_code: i32) -> Output {
        Output {
            status: ExitStatus::from_raw(exit_code << 8),
            stdout: stdout.as_bytes().to_vec(),
            stderr: stderr.as_bytes().to_vec(),
        }
    }

    fn success_output(stdout: &str) -> Output {
        mock_output(stdout, "", 0)
    }

    fn error_output(stderr: &str) -> Output {
        mock_output("", stderr, 1)
    }

    mod search {
        use super::*;

        #[test]
        fn calls_ytdlp_with_correct_args() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .withf(|program, args| {
                    program == "yt-dlp"
                        && args.contains(&"--dump-json")
                        && args.contains(&"--flat-playlist")
                        && args.contains(&"--no-warnings")
                        && args
                            .iter()
                            .any(|a| (a.to_string()).eq("ytsearch5:test query"))
                })
                .times(1)
                .returning(|_, _| Ok(success_output("")));

            let _ = search_with_runner(&mock, "test query", Some(5));
        }

        #[test]
        fn uses_default_limit_of_10() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .withf(|_, args| args.iter().any(|a| a.contains("ytsearch10:")))
                .times(1)
                .returning(|_, _| Ok(success_output("")));

            let _ = search_with_runner(&mock, "test", None);
        }

        #[test]
        fn includes_query_in_search_url() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .withf(|_, args| args.iter().any(|a| a.contains("rick astley")))
                .times(1)
                .returning(|_, _| Ok(success_output("")));

            let _ = search_with_runner(&mock, "rick astley", Some(10));
        }

        #[test]
        fn parses_multiple_json_lines() {
            let stdout = r#"{"id":"vid1","title":"First","duration":100.0,"thumbnail":"http://a.jpg"}
{"id":"vid2","title":"Second","duration":200.0,"thumbnail":"http://b.jpg"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let results = search_with_runner(&mock, "test", None).unwrap();

            assert_eq!(
                results,
                vec![
                    YtdlpSearchResult {
                        id: "vid1".to_string(),
                        title: "First".to_string(),
                        duration: Some(100.0),
                        thumbnail: Some("http://a.jpg".to_string()),
                    },
                    YtdlpSearchResult {
                        id: "vid2".to_string(),
                        title: "Second".to_string(),
                        duration: Some(200.0),
                        thumbnail: Some("http://b.jpg".to_string()),
                    }
                ]
            );
        }

        #[test]
        fn skips_entries_without_id() {
            let stdout = r#"{"title":"No ID"}
{"id":"has_id","title":"Has ID"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let results = search_with_runner(&mock, "test", None).unwrap();

            assert_eq!(
                results,
                vec![YtdlpSearchResult {
                    id: "has_id".to_string(),
                    title: "Has ID".to_string(),
                    duration: None,
                    thumbnail: None,
                }]
            );
        }

        #[test]
        fn uses_unknown_for_missing_title() {
            let stdout = r#"{"id":"notitle"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let results = search_with_runner(&mock, "test", None).unwrap();

            assert_eq!(results[0].title, "Unknown");
        }

        #[test]
        fn skips_malformed_json_lines() {
            let stdout = r#"{"id":"valid","title":"Valid"}
not json at all
{"id":"also_valid","title":"Also Valid"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let results = search_with_runner(&mock, "test", None).unwrap();

            assert_eq!(results.len(), 2);
        }

        #[test]
        fn returns_empty_vec_for_no_results() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run().returning(|_, _| Ok(success_output("")));

            let results = search_with_runner(&mock, "test", None).unwrap();

            assert_eq!(results, vec![]);
        }

        #[test]
        fn returns_error_on_nonzero_exit() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(|_, _| Ok(error_output("ERROR: No results")));

            let result = search_with_runner(&mock, "test", None);

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("No results"));
        }

        #[test]
        fn returns_error_when_command_fails_to_execute() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run().returning(|_, _| {
                Err(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "not found",
                ))
            });

            let result = search_with_runner(&mock, "test", None);

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("Is yt-dlp installed?"));
        }
    }

    mod get_stream {
        use super::*;

        #[test]
        fn calls_ytdlp_with_correct_args() {
            let stdout = r#"{"url":"http://example.com"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .withf(|program, args| {
                    program == "yt-dlp"
                        && args.contains(&"-f")
                        && args.contains(&"bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio")
                        && args.contains(&"--dump-json")
                        && args.contains(&"--no-playlist")
                        && args.contains(&"--no-warnings")
                })
                .times(1)
                .returning(move |_, _| Ok(success_output(stdout)));

            let _ = get_stream_with_runner(&mock, "abc123");
        }

        #[test]
        fn constructs_youtube_url_from_video_id() {
            let stdout = r#"{"url":"http://example.com"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .withf(|_, args| {
                    args.iter()
                        .any(|a| *a == "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                })
                .times(1)
                .returning(move |_, _| Ok(success_output(stdout)));

            let _ = get_stream_with_runner(&mock, "dQw4w9WgXcQ");
        }

        #[test]
        fn parses_full_response() {
            let stdout = r#"{"id":"vid","title":"My Video","duration":212.5,"url":"https://google.com/stream","ext":"m4a","acodec":"mp4a.40.2"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let info = get_stream_with_runner(&mock, "vid").unwrap();

            assert_eq!(
                info,
                YtdlpStreamInfo {
                    stream_url: "https://google.com/stream".to_string(),
                    duration: Some(212.5),
                    title: Some("My Video".to_string()),
                    container: Some("m4a".to_string()),
                    codec: Some("mp4a.40.2".to_string()),
                }
            );
        }

        #[test]
        fn handles_minimal_response_with_only_url() {
            let stdout = r#"{"url":"https://example.com/audio.m4a"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let info = get_stream_with_runner(&mock, "test").unwrap();

            assert_eq!(info.stream_url, "https://example.com/audio.m4a");
            assert_eq!(info.duration, None);
            assert_eq!(info.title, None);
            assert_eq!(info.container, None);
            assert_eq!(info.codec, None);
        }

        #[test]
        fn parses_container_and_codec() {
            let stdout =
                r#"{"url":"https://example.com/stream","ext":"m4a","acodec":"mp4a.40.2"}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let info = get_stream_with_runner(&mock, "test").unwrap();

            assert_eq!(info.container, Some("m4a".to_string()));
            assert_eq!(info.codec, Some("mp4a.40.2".to_string()));
        }

        #[test]
        fn returns_error_when_url_missing() {
            let stdout = r#"{"id":"vid","title":"No URL Video","duration":100.0}"#;

            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(move |_, _| Ok(success_output(stdout)));

            let result = get_stream_with_runner(&mock, "vid");

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("No stream URL"));
        }

        #[test]
        fn returns_error_on_invalid_json() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(|_, _| Ok(success_output("not valid json")));

            let result = get_stream_with_runner(&mock, "test");

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("Failed to parse"));
        }

        #[test]
        fn returns_error_on_nonzero_exit() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run()
                .returning(|_, _| Ok(error_output("ERROR: Private video")));

            let result = get_stream_with_runner(&mock, "private");

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("Private video"));
        }

        #[test]
        fn returns_error_when_command_fails_to_execute() {
            let mut mock = MockCommandRunner::new();
            mock.expect_run().returning(|_, _| {
                Err(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "not found",
                ))
            });

            let result = get_stream_with_runner(&mock, "test");

            assert!(result.is_err());
            assert!(result.unwrap_err().contains("Is yt-dlp installed?"));
        }
    }
}
