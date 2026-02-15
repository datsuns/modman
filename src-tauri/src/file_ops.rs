use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn toggle_mod_enabled_command(path: String, enabled: bool) -> Result<String, String> {
    let current_path = PathBuf::from(&path);
    
    if !current_path.exists() {
        return Err("File does not exist".to_string());
    }

    let parent = current_path.parent().ok_or("Invalid path")?;
    let file_name = current_path.file_name().ok_or("Invalid file name")?;
    let file_name_str = file_name.to_string_lossy().to_string();

    let new_file_name = if enabled {
        // We want to enable it, so rename .disabled -> .jar
        if file_name_str.ends_with(".disabled") {
            file_name_str.trim_end_matches(".disabled").to_string()
        } else {
            file_name_str.clone() // Already enabled or different extension
        }
    } else {
        // We want to disable it, so rename .jar -> .disabled
        // But we should check if it already has .disabled to avoid double suffix
        if !file_name_str.ends_with(".disabled") {
            format!("{}.disabled", file_name_str)
        } else {
            file_name_str.clone()
        }
    };

    if file_name_str == new_file_name {
        return Ok(path); // No change needed
    }

    let new_path = parent.join(&new_file_name);
    
    fs::rename(&current_path, &new_path).map_err(|e| e.to_string())?;

    Ok(new_path.to_string_lossy().to_string())
}
