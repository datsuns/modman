use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModLoader {
    Fabric,
    Forge,
    NeoForge,
    Vanilla,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: String,             // UUID
    pub name: String,           // Display Name
    pub version: String,        // Minecraft Version
    pub loader_type: ModLoader,
    pub loader_version: String,
    pub icon: Option<String>,   // Icon path or Base64
    pub last_played: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LauncherProfile {
    pub id: String,
    pub name: String,
    pub mods_dir: PathBuf, // Resolved path to the mods folder
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

// Structs for parsing mod metadata files

#[derive(Deserialize)]
pub struct FabricModJson {
    pub id: String,
    pub name: Option<String>,
    pub version: String,
    pub description: Option<String>,
    pub authors: Option<Vec<String>>, // Can be string or list of strings/objects, need careful parsing
}

#[derive(Deserialize)]
pub struct ForgeModsToml {
    pub mods: Vec<ForgeModInfo>,
}

#[derive(Deserialize)]
pub struct ForgeModInfo {
    pub modId: String,
    pub displayName: Option<String>,
    pub version: String,
    pub description: Option<String>,
    pub authors: Option<String>, // Often a single string
}
