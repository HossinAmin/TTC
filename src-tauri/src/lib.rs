pub mod migration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
use device_query::{DeviceQuery, DeviceState};
use serde::{Deserialize, Serialize};
use tauri::{
    tray::{TrayIcon, TrayIconBuilder},
    Manager,
};

use tauri::{AppHandle, Emitter};

struct AppData {
    tray: TrayIcon,
    window: tauri::WebviewWindow,
}

#[derive(Serialize, Deserialize)]
struct MouseCoords {
    x: i32,
    y: i32,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct TimerPayload {
    task_id: String,
    is_playing: bool,
}

#[tauri::command]
fn check_mouse_coords() -> MouseCoords {
    let device_state = DeviceState::new();
    let mouse_state = device_state.get_mouse();

    MouseCoords {
        x: mouse_state.coords.0,
        y: mouse_state.coords.1,
    }
}

#[tauri::command]
fn get_tray_id(state: tauri::State<AppData>) -> std::string::String {
    state.tray.id().0.clone()
}

#[tauri::command]
fn start_window_drag(state: tauri::State<AppData>) {
    print!("window draging");
    state.window.start_dragging().unwrap();
}

#[tauri::command]
fn open_floating_timer(
    app: AppHandle,
    state: tauri::State<AppData>,
    task_id: String,
    is_playing: bool,
) {
    state.window.show().expect("failed to show floating window");
    app.emit(
        "open-floating-timer",
        TimerPayload {
            task_id,
            is_playing,
        },
    )
    .unwrap();
}

#[tauri::command]
fn close_floating_timer(app: AppHandle, state: tauri::State<AppData>) {
    state.window.show().expect("failed to hide floating window");
    app.emit("close-floating-timer", {}).unwrap();
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:mybdz.db", migration::get_migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            check_mouse_coords,
            get_tray_id,
            start_window_drag,
            open_floating_timer,
            close_floating_timer,
        ])
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                if window.label() == "floating-window" {
                    window
                        .app_handle()
                        .emit("close-floating-timer", {})
                        .expect("failed to emit close floating");
                }
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.manage(AppData {
                    tray: TrayIconBuilder::new().build(app)?,
                    window: tauri::WebviewWindowBuilder::new(
                        app,
                        "floating-window",
                        tauri::WebviewUrl::App("tasks/floating".into()),
                    )
                    .decorations(false)
                    .always_on_top(true)
                    .minimizable(false)
                    .maximizable(false)
                    .min_inner_size(280.00, 128.00)
                    .inner_size(280.00, 128.00)
                    .visible(false)
                    .build()?,
                });
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
