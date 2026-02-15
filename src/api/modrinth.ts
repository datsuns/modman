import { invoke } from "@tauri-apps/api/core";
import { ModrinthProject, ModrinthVersion } from "../types";

export async function searchMods(query: string): Promise<ModrinthProject[]> {
    try {
        return await invoke<ModrinthProject[]>("search_mods_command", { query });
    } catch (error) {
        console.error("Failed to search mods:", error);
        throw error;
    }
}

export async function getVersions(projectId: string, loader?: string, gameVersion?: string): Promise<ModrinthVersion[]> {
    try {
        return await invoke<ModrinthVersion[]>("get_versions_command", {
            projectId,
            loader: loader?.toLowerCase(),
            gameVersion
        });
    } catch (error) {
        console.error("Failed to get versions:", error);
        throw error;
    }
}

export async function installVersion(url: string, filename: string, destinationDir: string): Promise<void> {
    try {
        await invoke("install_version_command", { url, filename, destinationDir });
    } catch (error) {
        console.error("Failed to install version:", error);
        throw error;
    }
}
