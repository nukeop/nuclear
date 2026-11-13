use std::collections::HashMap;
use std::fmt::Display;
use std::iter::successors;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{channel, Sender};
use std::thread;

use windows::core::{implement, Interface, Ref, Result, HSTRING, PCWSTR};
use windows::Win32::Foundation::{CloseHandle, PROPERTYKEY};
use windows::Win32::Media::Audio::{
    eRender, EDataFlow, ERole, IAudioSessionControl, IAudioSessionControl2, IAudioSessionManager2,
    IAudioSessionNotification, IAudioSessionNotification_Impl, IMMDevice, IMMDeviceEnumerator,
    IMMNotificationClient, IMMNotificationClient_Impl, MMDeviceEnumerator, DEVICE_STATE,
    DEVICE_STATE_ACTIVE,
};
use windows::Win32::System::Com::{
    CoCreateInstance, CoInitializeEx, CLSCTX_ALL, COINIT_MULTITHREADED,
};
use windows::Win32::System::Diagnostics::ToolHelp::{
    CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
};

static WARNED: AtomicBool = AtomicBool::new(false);

fn warn_once(error: impl Display) {
    if !WARNED.swap(true, Ordering::Relaxed) {
        log::warn!("Could not label Nuclear in the Windows volume mixer: {error}");
    }
}

#[derive(Clone)]
struct Label {
    owner_pid: u32,
    name: HSTRING,
    icon: HSTRING,
}

pub fn init_win_mixer(app: tauri::AppHandle) {
    let exe = match std::env::current_exe() {
        Ok(exe) => exe,
        Err(error) => {
            warn_once(error);
            return;
        }
    };
    let mut icon = exe.into_os_string();
    icon.push(",-32512");
    let name = app
        .config()
        .product_name
        .clone()
        .unwrap_or_else(|| "Nuclear".to_string());
    let label = Label {
        owner_pid: std::process::id(),
        name: HSTRING::from(name),
        icon: HSTRING::from(icon.as_os_str()),
    };

    let spawned = thread::Builder::new()
        .name("win-mixer".into())
        .spawn(move || {
            if let Err(error) = watch(label) {
                warn_once(error);
            }
        });
    if let Err(error) = spawned {
        warn_once(error);
    }
}

fn watch(label: Label) -> Result<()> {
    unsafe { CoInitializeEx(None, COINIT_MULTITHREADED).ok()? };
    let devices: IMMDeviceEnumerator =
        unsafe { CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)? };

    let (sender, receiver) = channel();
    let device_listener: IMMNotificationClient = DeviceListener { changed: sender }.into();
    unsafe { devices.RegisterEndpointNotificationCallback(&device_listener)? };
    let session_listener: IAudioSessionNotification = SessionListener {
        label: label.clone(),
    }
    .into();

    let mut managers = attach_all(&devices, &session_listener, &label);
    while receiver.recv().is_ok() {
        for manager in &managers {
            let _ = unsafe { manager.UnregisterSessionNotification(&session_listener) };
        }
        managers = attach_all(&devices, &session_listener, &label);
    }
    Ok(())
}

fn attach_all(
    devices: &IMMDeviceEnumerator,
    listener: &IAudioSessionNotification,
    label: &Label,
) -> Vec<IAudioSessionManager2> {
    let mut managers = Vec::new();
    let render_devices = match list_render_devices(devices) {
        Ok(render_devices) => render_devices,
        Err(error) => {
            warn_once(error);
            return managers;
        }
    };
    for device in render_devices {
        match attach(&device, listener, label) {
            Ok(manager) => managers.push(manager),
            Err(error) => warn_once(error),
        }
    }
    managers
}

fn list_render_devices(devices: &IMMDeviceEnumerator) -> Result<Vec<IMMDevice>> {
    let collection = unsafe { devices.EnumAudioEndpoints(eRender, DEVICE_STATE_ACTIVE)? };
    let count = unsafe { collection.GetCount()? };
    (0..count)
        .map(|index| unsafe { collection.Item(index) })
        .collect()
}

fn attach(
    device: &IMMDevice,
    listener: &IAudioSessionNotification,
    label: &Label,
) -> Result<IAudioSessionManager2> {
    let manager: IAudioSessionManager2 = unsafe { device.Activate(CLSCTX_ALL, None)? };
    unsafe { manager.RegisterSessionNotification(listener)? };
    if let Err(error) = label_existing_sessions(&manager, label) {
        warn_once(error);
    }
    Ok(manager)
}

fn label_existing_sessions(manager: &IAudioSessionManager2, label: &Label) -> Result<()> {
    let sessions = unsafe { manager.GetSessionEnumerator()? };
    let count = unsafe { sessions.GetCount()? };
    for index in 0..count {
        let session = unsafe { sessions.GetSession(index)? };
        if let Err(error) = label_session(&session, label) {
            warn_once(error);
        }
    }
    Ok(())
}

fn label_session(session: &IAudioSessionControl, label: &Label) -> Result<()> {
    let process_id = unsafe { session.cast::<IAudioSessionControl2>()?.GetProcessId()? };
    if !is_owned_webview(process_id, label.owner_pid)? {
        return Ok(());
    }
    unsafe {
        session.SetDisplayName(&label.name, std::ptr::null())?;
        session.SetIconPath(&label.icon, std::ptr::null())?;
    }
    Ok(())
}

struct ProcessInfo {
    parent_id: u32,
    exe: String,
}

fn is_owned_webview(process_id: u32, owner_pid: u32) -> Result<bool> {
    let processes = list_processes()?;
    let Some(process) = processes.get(&process_id) else {
        return Ok(false);
    };
    if !process.exe.eq_ignore_ascii_case("msedgewebview2.exe") {
        return Ok(false);
    }
    let ancestors = successors(Some(process.parent_id), |ancestor| {
        processes.get(ancestor).map(|info| info.parent_id)
    });
    Ok(ancestors
        .take(processes.len())
        .any(|ancestor| ancestor == owner_pid))
}

fn list_processes() -> Result<HashMap<u32, ProcessInfo>> {
    let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)? };
    let mut entry = PROCESSENTRY32W {
        dwSize: size_of::<PROCESSENTRY32W>() as u32,
        ..Default::default()
    };
    let mut processes = HashMap::new();
    let mut found = unsafe { Process32FirstW(snapshot, &mut entry) };
    while found.is_ok() {
        let name_length = entry
            .szExeFile
            .iter()
            .position(|&unit| unit == 0)
            .unwrap_or(entry.szExeFile.len());
        processes.insert(
            entry.th32ProcessID,
            ProcessInfo {
                parent_id: entry.th32ParentProcessID,
                exe: String::from_utf16_lossy(&entry.szExeFile[..name_length]),
            },
        );
        found = unsafe { Process32NextW(snapshot, &mut entry) };
    }
    let _ = unsafe { CloseHandle(snapshot) };
    Ok(processes)
}

#[implement(IAudioSessionNotification)]
struct SessionListener {
    label: Label,
}

impl IAudioSessionNotification_Impl for SessionListener_Impl {
    fn OnSessionCreated(&self, session: Ref<'_, IAudioSessionControl>) -> Result<()> {
        if let Err(error) = label_session(session.ok()?, &self.label) {
            warn_once(error);
        }
        Ok(())
    }
}

#[implement(IMMNotificationClient)]
struct DeviceListener {
    changed: Sender<()>,
}

impl DeviceListener {
    fn notify(&self) -> Result<()> {
        let _ = self.changed.send(());
        Ok(())
    }
}

impl IMMNotificationClient_Impl for DeviceListener_Impl {
    fn OnDeviceStateChanged(&self, _device_id: &PCWSTR, _state: DEVICE_STATE) -> Result<()> {
        self.notify()
    }

    fn OnDeviceAdded(&self, _device_id: &PCWSTR) -> Result<()> {
        self.notify()
    }

    fn OnDeviceRemoved(&self, _device_id: &PCWSTR) -> Result<()> {
        self.notify()
    }

    fn OnDefaultDeviceChanged(
        &self,
        _flow: EDataFlow,
        _role: ERole,
        _device_id: &PCWSTR,
    ) -> Result<()> {
        Ok(())
    }

    fn OnPropertyValueChanged(&self, _device_id: &PCWSTR, _key: &PROPERTYKEY) -> Result<()> {
        Ok(())
    }
}
