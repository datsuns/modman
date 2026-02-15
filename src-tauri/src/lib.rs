mod models;
mod mod_scanner;
mod launcher;
mod file_ops;

use models::{ModMetadata, LauncherProfile};
use std::path::PathBuf;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn scan_mods_command(path: String) -> Vec<ModMetadata> {
    let path_buf = PathBuf::from(path);
    mod_scanner::scan_mods(&path_buf)
}

#[tauri::command]
fn fetch_profiles_command(custom_path: Option<String>) -> Result<Vec<LauncherProfile>, String> {
    launcher::get_launcher_profiles(custom_path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            scan_mods_command, 
            fetch_profiles_command,
            file_ops::toggle_mod_enabled_command,
            file_ops::install_mod_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
