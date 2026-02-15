import { invoke } from "@tauri-apps/api/core";
import { ModMetadata, LauncherProfile } from "../types";

// Toggle this to force mock mode during development if backend is broken/missing
// In a real app, you might want to detect if window.__TAURI_INTERNALS__ is present
const USE_MOCK = false;

export async function fetchLauncherProfiles(): Promise<LauncherProfile[]> {
    if (USE_MOCK) {
        return MOCK_PROFILES;
    }
    try {
        return await invoke("fetch_profiles_command");
    } catch (error) {
        console.error("Failed to fetch profiles:", error);
        return [];
    }
}

const MOCK_PROFILES: LauncherProfile[] = [
    {
        id: "default",
        name: "Latest Release",
        mods_dir: "C:\\Users\\User\\.minecraft\\mods"
    },
    {
        id: "fabric-1.20.1",
        name: "Fabric 1.20.1",
        mods_dir: "C:\\Users\\User\\.minecraft\\instances\\fabric-1.20.1\\mods"
    }
];

export async function scanMods(path: string): Promise<ModMetadata[]> {
    if (USE_MOCK) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_MODS;
    }

    try {
        return await invoke("scan_mods_command", { path });
    } catch (error) {
        console.error("Failed to invoke scan_mods_command:", error);
        return [];
    }
}

export async function greet(name: string): Promise<string> {
    if (USE_MOCK) {
        return `Hello, ${name}! (from Mock)`;
    }
    return await invoke("greet", { name });
}

const MOCK_MODS: ModMetadata[] = [
    {
        file_name: "lithium-fabric-mc1.20.1-0.11.2.jar",
        file_path: "C:\\Users\\User\\.minecraft\\mods\\lithium.jar",
        name: "Lithium",
        id: "lithium",
        version: "0.11.2",
        description: "No-compromise game logic/server optimization mod",
        authors: ["JellySquid"],
        enabled: true,
    },
    {
        file_name: "sodium-fabric-mc1.20.1-0.5.3.jar",
        file_path: "C:\\Users\\User\\.minecraft\\mods\\sodium.jar",
        name: "Sodium",
        id: "sodium",
        version: "0.5.3",
        description: "Modern rendering engine and client-side optimization mod",
        authors: ["JellySquid"],
        enabled: true,
    },
    {
        file_name: "fabric-api-0.90.0+1.20.1.jar",
        file_path: "C:\\Users\\User\\.minecraft\\mods\\fabric-api.jar",
        name: "Fabric API",
        id: "fabric-api",
        version: "0.90.0+1.20.1",
        description: "Core API module for Fabric mods",
        authors: ["FabricMC"],
        enabled: true,
    },
    {
        file_name: "architectury-9.1.12-fabric.jar.disabled",
        file_path: "C:\\Users\\User\\.minecraft\\mods\\architectury.jar.disabled",
        name: "Architectury API",
        id: "architectury",
        version: "9.1.12",
        description: "An intermediary api to ease developing multiplatform mods.",
        authors: ["Shedaniel"],
        enabled: false,
    },
];
