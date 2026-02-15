use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LauncherProfile {
    pub id: String,
    pub name: String,
    pub mods_dir: PathBuf, // Resolved path to the mods folder
    pub last_version_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModMetadata {
    pub file_name: String,
    pub file_path: PathBuf,
    pub name: String,           // Mod Name
    pub id: String,             // Mod ID
    pub version: String,        // Version
    pub description: String,
    pub authors: Vec<String>,
    pub enabled: bool,
}
