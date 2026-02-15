use crate::models::{ModMetadata, ModLoader};
use std::fs;
use std::path::Path;
use std::io::Read;
use zip::ZipArchive;
use serde_json::Value;

pub fn scan_mods(dir_path: &Path) -> Vec<ModMetadata> {
    let mut mods = Vec::new();

    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    let ext_str = ext.to_string_lossy();
                    let enabled = ext_str == "jar";
                    
                    if enabled || ext_str == "disabled" {
                         // Attempt to parse metadata
                         match parse_mod_metadata(&path, enabled) {
                             Some(meta) => {
                                 mods.push(meta);
                             },
                             None => {}
                         }
                    }
                }
            }
        }
    }
    mods
}

fn parse_mod_metadata(path: &Path, enabled: bool) -> Option<ModMetadata> {
    let file = fs::File::open(path).ok()?;
    let mut archive = ZipArchive::new(file).ok()?;

    // Try Fabric first
    if let Ok(mut file) = archive.by_name("fabric.mod.json") {
        let mut content = String::new();
        file.read_to_string(&mut content).ok()?;
        
        let json: Value = serde_json::from_str(&content).ok()?;
        
        let id = json["id"].as_str()?.to_string();
        let name = json["name"].as_str().unwrap_or(&id).to_string();
        let version = json["version"].as_str().unwrap_or("0.0.0").to_string();
        let description = json["description"].as_str().unwrap_or("").to_string();
        
        let mut authors = Vec::new();
        if let Some(author_val) = json.get("authors") {
            if let Some(arr) = author_val.as_array() {
                for item in arr {
                    if let Some(s) = item.as_str() {
                        authors.push(s.to_string());
                    } else if let Some(obj) = item.as_object() {
                        if let Some(n) = obj.get("name").and_then(|v| v.as_str()) {
                            authors.push(n.to_string());
                        }
                    }
                }
            } else if let Some(s) = author_val.as_str() {
                authors.push(s.to_string());
            }
        }

        return Some(ModMetadata {
            file_name: path.file_name()?.to_string_lossy().to_string(),
            file_path: path.to_path_buf(),
            name,
            id,
            version,
            description,
            authors,
            enabled,
        });
    }

    // Try Forge/NeoForge (mods.toml)
    // Check for both META-INF/mods.toml and META-INF/neoforge.mods.toml
    let toml_files = ["META-INF/mods.toml", "META-INF/neoforge.mods.toml"];
    
    for toml_path in toml_files {
        if let Ok(mut file) = archive.by_name(toml_path) {
            let mut content = String::new();
            if file.read_to_string(&mut content).is_ok() {
                 if let Ok(toml_val) = toml::from_str::<toml::Value>(&content) {
                    if let Some(mods_arr) = toml_val.get("mods").and_then(|v| v.as_array()) {
                        if let Some(first_mod) = mods_arr.first() {
                             let mod_id = first_mod.get("modId").and_then(|v| v.as_str()).unwrap_or("unknown").to_string();
                             let display_name = first_mod.get("displayName").and_then(|v| v.as_str()).unwrap_or(&mod_id).to_string();
                             let version = first_mod.get("version").and_then(|v| v.as_str()).unwrap_or("0.0.0").to_string();
                             let description = first_mod.get("description").and_then(|v| v.as_str()).unwrap_or("").to_string();
                             let authors_str = first_mod.get("authors").and_then(|v| v.as_str()).unwrap_or("").to_string();
                             
                             return Some(ModMetadata {
                                file_name: path.file_name()?.to_string_lossy().to_string(),
                                file_path: path.to_path_buf(),
                                name: display_name,
                                id: mod_id,
                                version,
                                description,
                                authors: vec![authors_str],
                                enabled,
                            });
                        }
                    }
                 }
            }
        }
    }

    None
}
