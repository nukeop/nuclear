use log::{debug, error, info};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{command, AppHandle, Manager};

const RELEASE_BASE_URL: &str = "https://github.com/yt-dlp/yt-dlp/releases/latest/download";
const UPDATE_CHECK_INTERVAL_SECS: u64 = 3600;

#[derive(Serialize, Deserialize)]
struct UpdateCheck {
    tag: String,
    checked_at: u64,
}

impl UpdateCheck {
    fn now(tag: String) -> Self {
        Self {
            tag,
            checked_at: now_unix(),
        }
    }
}

#[derive(Deserialize)]
struct GitHubRelease {
    tag_name: String,
}

fn release_filename() -> &'static str {
    #[cfg(target_os = "macos")]
    {
        "yt-dlp_macos.zip"
    }
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        "yt-dlp_linux.zip"
    }
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        "yt-dlp_linux_aarch64.zip"
    }
    #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
    {
        "yt-dlp_win.zip"
    }
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    {
        "yt-dlp_win_arm64.zip"
    }
}

fn binary_name() -> &'static str {
    #[cfg(target_os = "macos")]
    {
        "yt-dlp_macos"
    }
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        "yt-dlp_linux"
    }
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        "yt-dlp_linux_aarch64"
    }
    #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
    {
        "yt-dlp.exe"
    }
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    {
        "yt-dlp_win_arm64.exe"
    }
}

fn ytdlp_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
    app_handle
        .path()
        .app_data_dir()
        .map(|dir| dir.join("ytdlp"))
        .map_err(|error| format!("Failed to resolve app data directory: {}", error))
}

async fn download_zip(url: &str, dest: &Path) -> Result<(), String> {
    use futures::StreamExt;
    use tokio::io::AsyncWriteExt;

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(300))
        .connect_timeout(Duration::from_secs(30))
        .build()
        .map_err(|error| format!("HTTP client error: {}", error))?;

    let response = client
        .get(url)
        .send()
        .await
        .map_err(|error| format!("Download failed: {}", error))?;

    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }

    let mut file = tokio::fs::File::create(dest)
        .await
        .map_err(|error| format!("Failed to create file: {}", error))?;

    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|error| format!("Download stream error: {}", error))?;
        file.write_all(&chunk)
            .await
            .map_err(|error| format!("Write error: {}", error))?;
    }

    info!("[yt-dlp] Downloaded {} to {:?}", url, dest);
    Ok(())
}

fn extract_zip(zip_path: &Path, dest: &Path) -> Result<(), String> {
    use std::io::BufReader;
    use zip::ZipArchive;

    let file =
        fs::File::open(zip_path).map_err(|error| format!("Failed to open zip: {}", error))?;
    let mut archive =
        ZipArchive::new(BufReader::new(file)).map_err(|error| format!("Invalid zip: {}", error))?;

    for i in 0..archive.len() {
        let mut entry = archive
            .by_index(i)
            .map_err(|error| format!("Zip entry error: {}", error))?;
        let out_path = dest.join(entry.mangled_name());

        if entry.is_dir() {
            fs::create_dir_all(&out_path)
                .map_err(|error| format!("Failed to create dir: {}", error))?;
        } else {
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|error| format!("Failed to create parent dir: {}", error))?;
            }
            let mut out_file = fs::File::create(&out_path)
                .map_err(|error| format!("Failed to create file: {}", error))?;
            std::io::copy(&mut entry, &mut out_file)
                .map_err(|error| format!("Failed to extract file: {}", error))?;

            #[cfg(unix)]
            if let Some(mode) = entry.unix_mode() {
                use std::os::unix::fs::PermissionsExt;
                fs::set_permissions(&out_path, fs::Permissions::from_mode(mode)).ok();
            }
        }
    }

    info!("[yt-dlp] Extracted {:?} to {:?}", zip_path, dest);
    Ok(())
}

fn now_unix() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn update_check_path(ytdlp_dir: &Path) -> PathBuf {
    ytdlp_dir.join(".update_check")
}

fn read_update_check(ytdlp_dir: &Path) -> Option<UpdateCheck> {
    let path = update_check_path(ytdlp_dir);
    let contents = fs::read_to_string(&path).ok()?;
    serde_json::from_str(&contents).ok()
}

fn write_update_check(ytdlp_dir: &Path, check: &UpdateCheck) {
    let tmp_path = ytdlp_dir.join(".update_check.tmp");
    let final_path = update_check_path(ytdlp_dir);

    let json = match serde_json::to_string(check) {
        Ok(json) => json,
        Err(err) => {
            error!("[yt-dlp] Failed to serialize update check: {}", err);
            return;
        }
    };

    if let Err(err) = fs::write(&tmp_path, &json) {
        error!("[yt-dlp] Failed to write update check tmp file: {}", err);
        return;
    }

    if let Err(err) = fs::rename(&tmp_path, &final_path) {
        error!("[yt-dlp] Failed to rename update check file: {}", err);
        fs::remove_file(&tmp_path).ok();
    }
}

async fn download_and_extract(ytdlp_dir: &Path, binary_path: &Path) -> Result<(), String> {
    let download_url = format!("{}/{}", RELEASE_BASE_URL, release_filename());
    let zip_path = ytdlp_dir.join(".download.zip");

    fs::create_dir_all(ytdlp_dir)
        .map_err(|error| format!("Failed to create ytdlp dir: {}", error))?;

    download_zip(&download_url, &zip_path)
        .await
        .inspect_err(|_| {
            fs::remove_file(&zip_path).ok();
        })?;

    let extract_result = {
        let zip_path = zip_path.clone();
        let ytdlp_dir = ytdlp_dir.to_path_buf();
        tokio::task::spawn_blocking(move || extract_zip(&zip_path, &ytdlp_dir))
            .await
            .map_err(|error| format!("Extract task failed: {}", error))?
    };

    fs::remove_file(&zip_path).ok();
    extract_result?;

    if !binary_path.exists() {
        return Err(format!(
            "Binary not found after extraction: {:?}",
            binary_path
        ));
    }

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(binary_path, fs::Permissions::from_mode(0o755))
            .map_err(|error| format!("Failed to set permissions: {}", error))?;
    }

    Ok(())
}

async fn fetch_latest_release_tag() -> Result<String, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .build()
        .map_err(|error| format!("HTTP client error: {}", error))?;

    let response = client
        .get("https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest")
        .header("User-Agent", "nuclear-player")
        .send()
        .await
        .map_err(|error| format!("GitHub API request failed: {}", error))?;

    if !response.status().is_success() {
        return Err(format!("GitHub API HTTP error: {}", response.status()));
    }

    let release: GitHubRelease = response
        .json()
        .await
        .map_err(|error| format!("Failed to parse GitHub release response: {}", error))?;

    Ok(release.tag_name)
}

async fn check_for_update(ytdlp_dir: &Path, binary_path: &Path) {
    let existing = read_update_check(ytdlp_dir);

    if let Some(ref check) = existing {
        let elapsed = now_unix().saturating_sub(check.checked_at);
        if elapsed < UPDATE_CHECK_INTERVAL_SECS {
            debug!("[yt-dlp] Last update check was {}s ago, skipping", elapsed);
            return;
        }
    }

    let existing_tag = existing.map(|check| check.tag);

    let latest_tag = match fetch_latest_release_tag().await {
        Ok(tag) => tag,
        Err(err) => {
            error!("[yt-dlp] Update check failed: {}", err);
            if let Some(tag) = existing_tag {
                write_update_check(ytdlp_dir, &UpdateCheck::now(tag));
            }
            return;
        }
    };

    let needs_update = existing_tag.as_ref().map_or(true, |tag| *tag != latest_tag);

    if !needs_update {
        debug!("[yt-dlp] Already on latest version: {}", latest_tag);
        write_update_check(ytdlp_dir, &UpdateCheck::now(latest_tag));
        return;
    }

    info!(
        "[yt-dlp] New version available: {}, updating...",
        latest_tag
    );

    match download_and_extract(ytdlp_dir, binary_path).await {
        Ok(()) => {
            info!("[yt-dlp] Updated to {}", latest_tag);
            write_update_check(ytdlp_dir, &UpdateCheck::now(latest_tag));
        }
        Err(err) => {
            error!("[yt-dlp] Update download failed: {}", err);
            if let Some(tag) = existing_tag {
                write_update_check(ytdlp_dir, &UpdateCheck::now(tag));
            }
        }
    }
}

#[command]
pub async fn ytdlp_ensure_installed(app_handle: AppHandle) -> Result<bool, String> {
    let ytdlp_dir = ytdlp_dir(&app_handle)?;
    let binary_path = ytdlp_dir.join(binary_name());

    let already_installed = binary_path.exists();

    if !already_installed {
        info!("[yt-dlp] Not found, downloading...");
        download_and_extract(&ytdlp_dir, &binary_path).await?;
        info!("[yt-dlp] Installed to {:?}", binary_path);
    }

    let path_str = binary_path
        .to_str()
        .ok_or("Invalid path encoding")?
        .to_string();
    crate::ytdlp::set_ytdlp_path(path_str);

    if already_installed {
        debug!("[yt-dlp] Already installed at {:?}", binary_path);
        check_for_update(&ytdlp_dir, &binary_path).await;
    } else {
        let tag = fetch_latest_release_tag().await.unwrap_or_else(|err| {
            debug!(
                "[yt-dlp] Could not fetch release tag after install: {}",
                err
            );
            "unknown".to_string()
        });
        write_update_check(&ytdlp_dir, &UpdateCheck::now(tag));
    }

    Ok(already_installed)
}
