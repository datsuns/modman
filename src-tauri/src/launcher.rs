use std::path::PathBuf;
use std::fs;
use serde_json::Value;
use crate::models::LauncherProfile;

pub fn get_launcher_profiles() -> Result<Vec<LauncherProfile>, String> {
    let appdata = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let minecraft_dir = PathBuf::from(&appdata).join(".minecraft");
    let path = minecraft_dir.join("launcher_profiles.json");

    if !path.exists() {
        return Err(format!("launcher_profiles.json not found at {:?}", path));
    }

    let file = fs::File::open(&path).map_err(|e| e.to_string())?;
    let json: Value = serde_json::from_reader(file).map_err(|e| e.to_string())?;

    let mut profiles = Vec::new();

    if let Some(profiles_map) = json.get("profiles").and_then(|v| v.as_object()) {
        for (key, value) in profiles_map {
            let name = value.get("name").and_then(|v| v.as_str()).unwrap_or("Unnamed Profile").to_string();
            let game_dir_str = value.get("gameDir").and_then(|v| v.as_str());

            let mods_dir = if let Some(dir) = game_dir_str {
                PathBuf::from(dir).join("mods")
            } else {
                minecraft_dir.join("mods")
            };

            profiles.push(LauncherProfile {
                id: key.clone(),
                name,
                mods_dir,
            });
        }
    }

    Ok(profiles)
}
