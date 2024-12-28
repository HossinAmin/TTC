#[cfg_attr(mobile, tauri::mobile_entry_point)]
use device_query::{DeviceQuery, DeviceState};
use serde::{Deserialize, Serialize};
use tauri::{
    tray::{TrayIcon, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use tauri_plugin_sql::{Migration, MigrationKind};

struct AppData {
    tray: TrayIcon,
}

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

#[tauri::command]
fn get_tray_id(state: tauri::State<AppData>) -> std::string::String {
    state.tray.id().0.clone()
}

pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: r###"
            CREATE TABLE "Projects" (
                "id" TEXT NOT NULL UNIQUE,
                "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "link" TEXT,
                "time" INTEGER NOT NULL DEFAULT 0,
                "tasks" INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("id")
            );
            
            CREATE TABLE "Tasks" (
                "id" TEXT NOT NULL UNIQUE,
                "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "link" TEXT,
                "time" INTEGER NOT NULL DEFAULT 0,
                "project" TEXT NOT NULL,
                FOREIGN KEY("project") REFERENCES "Projects"("id"),
                PRIMARY KEY("id")
            );
            "###,
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:mybdz.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![check_mouse_coords, get_tray_id])
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.manage(AppData {
                    tray: TrayIconBuilder::new()
                        .menu_on_left_click(false)
                        .on_tray_icon_event(|tray, event| match event {
                            TrayIconEvent::Click { .. } => {
                                println!("left click pressed and released");
                                // in this example, let's show and focus the main window when the tray is clicked
                                let app = tray.app_handle();
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                            _ => {
                                println!("unhandled event {event:?}");
                            }
                        })
                        .build(app)?,
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
