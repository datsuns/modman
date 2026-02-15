export type ModLoader = "Fabric" | "Forge" | "NeoForge" | "Vanilla";

export interface Profile {
  id: string;
  name: string;
  version: string;
  loader_type: ModLoader;
  loader_version: string;
  icon?: string;
  last_played?: string;
}

export interface LauncherProfile {
  id: string;
  name: string;
  mods_dir: string;
  last_version_id?: string;
}

export interface ModMetadata {
  file_name: string;
  file_path: string;
  name: string;
  id: string;
  version: string;
  description: string;
  authors: string[];
  enabled: boolean;
}

export interface ModrinthProject {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  icon_url?: string;
  author: string;
  downloads: number;
  follows: number;
}

export interface ModrinthFile {
  url: string;
  filename: string;
  primary: boolean;
}

export interface ModrinthVersion {
  id: string;
  project_id: string;
  author_id: string;
  featured: boolean;
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  files: ModrinthFile[];
}
