// Appimage build comes with some outdated libraries that cause
// incompatibilities with Wayland. This script tries to override that.
// See: https://gitlab.freedesktop.org/mesa/mesa/-/issues/11316
// See: https://girishjoshi.io/post/tauri-2.0-appimage-egl-issue-on-wayland/

use std::env;
use std::ffi::OsString;
use std::os::unix::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::Command;

const REEXEC_GUARD: &str = "NUCLEAR_APPIMAGE_PRELOAD_DONE";
const WAYLAND_CLIENT_LIB: &str = "libwayland-client";

const HOST_LIB_DIRS: [&str; 5] = [
    "/usr/lib/x86_64-linux-gnu",
    "/usr/lib/aarch64-linux-gnu",
    "/usr/lib/arm-linux-gnueabihf",
    "/usr/lib64",
    "/usr/lib",
];

pub fn preload_host_wayland_client() {
    if env::var_os(REEXEC_GUARD).is_some() {
        return;
    }
    if env::var_os("APPIMAGE").is_none() {
        return;
    }
    if !is_wayland_session() {
        return;
    }

    let existing_preload = env::var("LD_PRELOAD").unwrap_or_default();
    if existing_preload.contains(WAYLAND_CLIENT_LIB) {
        return;
    }

    let Some(host_lib) = find_host_wayland_client() else {
        return;
    };
    let Ok(current_exe) = env::current_exe() else {
        return;
    };

    let exec_error = Command::new(current_exe)
        .args(env::args_os().skip(1))
        .env(REEXEC_GUARD, "1")
        .env(
            "LD_PRELOAD",
            compose_ld_preload(&host_lib, &existing_preload),
        )
        .exec();

    eprintln!("Failed to re-exec with host libwayland-client preloaded: {exec_error}");
}

fn is_wayland_session() -> bool {
    if env::var_os("WAYLAND_DISPLAY").is_some() {
        return true;
    }
    env::var("XDG_SESSION_TYPE").is_ok_and(|session_type| session_type == "wayland")
}

fn find_host_wayland_client() -> Option<PathBuf> {
    HOST_LIB_DIRS
        .iter()
        .flat_map(|dir| {
            let base = PathBuf::from(dir);
            [
                base.join("libwayland-client.so.0"),
                base.join("libwayland-client.so"),
            ]
        })
        .find(|candidate| candidate.is_file())
}

fn compose_ld_preload(host_lib: &Path, existing_preload: &str) -> OsString {
    if existing_preload.is_empty() {
        return host_lib.into();
    }
    let mut composed = OsString::from(host_lib);
    composed.push(":");
    composed.push(existing_preload);
    composed
}
