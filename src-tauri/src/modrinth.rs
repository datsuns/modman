use serde::{Deserialize, Serialize};
use reqwest::blocking::Client;

const MODRINTH_API_URL: &str = "https://api.modrinth.com/v2";

#[derive(Debug, Serialize, Deserialize)]
pub struct ModrinthProject {
    pub project_id: String,
    pub slug: String,
    pub title: String,
    pub description: String,
    pub icon_url: Option<String>,
    pub author: String,
    pub downloads: u64,
    pub follows: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ModrinthVersion {
    pub id: String,
    pub project_id: String,
    pub author_id: String,
    pub featured: bool,
    pub name: String,
    pub version_number: String,
    pub game_versions: Vec<String>,
    pub loaders: Vec<String>,
    pub files: Vec<ModrinthFile>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ModrinthFile {
    pub url: String,
    pub filename: String,
    pub primary: bool,
}

#[derive(Debug, Deserialize)]
struct SearchResponse {
    hits: Vec<SearchResult>,
}

#[derive(Debug, Deserialize)]
struct SearchResult {
    project_id: String,
    slug: String,
    title: String,
    description: String,
    icon_url: Option<String>,
    author: String,
    downloads: u64,
    follows: u64,
}

fn get_client() -> Client {
    Client::builder()
        .user_agent("tauri-appmodman/1.0.0 (thesk@example.com)") // TODO: Replace with real contact
        .build()
        .unwrap_or_else(|_| Client::new())
}

#[tauri::command]
pub fn search_mods_command(query: String) -> Result<Vec<ModrinthProject>, String> {
    let client = get_client();
    let url = format!("{}/search?query={}&facets=[[\"project_type:mod\"]]", MODRINTH_API_URL, query);

    let resp = client.get(&url)
        .send()
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Modrinth API error: {}", resp.status()));
    }

    let search_response: SearchResponse = resp.json()
        .map_err(|e| e.to_string())?;

    let projects = search_response.hits.into_iter().map(|hit| ModrinthProject {
        project_id: hit.project_id,
        slug: hit.slug,
        title: hit.title,
        description: hit.description,
        icon_url: hit.icon_url,
        author: hit.author,
        downloads: hit.downloads,
        follows: hit.follows,
    }).collect();

    Ok(projects)
}

#[tauri::command]
pub fn get_versions_command(project_id: String, loader: Option<String>, game_version: Option<String>) -> Result<Vec<ModrinthVersion>, String> {
    let client = get_client();
    let mut url = format!("{}/project/{}/version", MODRINTH_API_URL, project_id);
    
    // Build query params
    let mut params = Vec::new();
    if let Some(l) = loader {
        params.push(format!("loaders=[\"{}\"]", l));
    }
    if let Some(v) = game_version {
        params.push(format!("game_versions=[\"{}\"]", v));
    }

    if !params.is_empty() {
        url = format!("{}?{}", url, params.join("&"));
    }

    let resp = client.get(&url)
        .send()
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Modrinth API error: {}", resp.status()));
    }

    let versions: Vec<ModrinthVersion> = resp.json()
        .map_err(|e| e.to_string())?;

    Ok(versions)
}

#[tauri::command]
pub fn install_version_command(url: String, filename: String, destination_dir: String) -> Result<(), String> {
    let client = get_client();
    
    let resp = client.get(&url)
        .send()
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Download failed: {}", resp.status()));
    }

    let bytes = resp.bytes().map_err(|e| e.to_string())?;
    let path = std::path::Path::new(&destination_dir).join(&filename);

    std::fs::write(&path, &bytes).map_err(|e| e.to_string())?;

    Ok(())
}
