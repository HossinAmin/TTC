#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .invoke_handler(tauri::generate_handler![check_mouse_coords])
        .setup(|app| {
            #[cfg(desktop)]
            {
                tauri::tray::TrayIconBuilder::new()
                    .on_tray_icon_event(|tray_handle, event| {
                        // Use the method from the plugin
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    })
                    .build(app)?;
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

use device_query::{DeviceQuery, DeviceState};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct MouseCoords {
    x: i32,
    y: i32,
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
