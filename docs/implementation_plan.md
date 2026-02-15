# Mod Manager Implementation Plan

## v1.1.0 (Completed)

1.  **Drag & Drop Installation**: Easy mod installation by dragging files.
2.  **Detail View**: View detailed mod information.
3.  **Modrinth Integration**: Search and install new mods.
4.  **Internationalization**: English and Japanese support.

---

## v1.2.0 Potential Candidates

Based on creating a robust modding environment, the following features are proposed for the next version.

### 1. Mod Updates (MOD更新機能)
Check for newer versions of installed mods against Modrinth and update them.
- **Value**: Keeps the environment secure and feature-rich.
- **Complexity**: Medium (Version comparison logic).

### 2. Dependency Resolution (依存関係の自動解決)
Automatically detect and install required dependencies (e.g., Fabric API) when installing a mod from Modrinth.
- **Value**: Reduces "mod not working" frustration significantly.
- **Complexity**: High (Recursive dependency resolution).

### 3. Instance Creator (インスタンス作成・編集)
Create and edit Minecraft launcher profiles (`launcher_profiles.json`) directly within the app.
- **Value**: Reduces context switching between ModMan and the Official Launcher.
- **Complexity**: Medium.

### 4. Modpack Export/Import
Export the current mod list as a `mrpack` or compatible format to share with friends.
- **Value**: Easy multiplayer setup.
- **Complexity**: High.

### 5. Bulk Operations & Filtering
"Disable All", "Enable All", and better filtering/search within the local mod list.
- **Value**: QoL for heavy mod users.
- **Complexity**: Low.
