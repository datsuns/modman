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
