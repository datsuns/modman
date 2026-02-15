# Tasks

- [x] Requirements Definition <!-- id: 0 -->
    - [x] Brainstorm feature set <!-- id: 1 -->
    - [x] Create initial specification document <!-- id: 2 -->
    - [x] Review specification with user <!-- id: 3 -->
- [x] Architecture Design <!-- id: 4 -->
    - [x] Define system architecture (Instance Manager approach) <!-- id: 4.1 -->
    - [x] Design data models (Rust structs) <!-- id: 6 -->
    - [x] Design file system layout <!-- id: 6.1 -->
- [/] Implementation <!-- id: 7 -->
    - [x] Setup project structure (Tauri + React) <!-- id: 8 -->
    - [x] Implement core mod scanning logic <!-- id: 9 -->
    - [x] Implement Frontend UI (Mod List & Layout) <!-- id: 10 -->
- [x] Feature: Official Launcher Integration <!-- id: 11 -->
    - [x] Backend: Read & Parse `launcher_profiles.json` <!-- id: 12 -->
    - [x] Frontend: Display Launcher Profiles <!-- id: 13 -->
    - [x] Connect Profile Selection to Mod Scanner <!-- id: 14 -->
- [x] Feature: Configurable Launcher Path <!-- id: 19 -->
    - [x] Backend: Accept custom path in `fetch_profiles` <!-- id: 20 -->
    - [x] Frontend: Add Path Input in Settings <!-- id: 21 -->
    - [x] Frontend: Add File Picker Button (tauri-plugin-dialog) <!-- id: 23 -->
    - [x] Frontend: Persist setting (localStorage) <!-- id: 22 -->
- [x] Feature: Internationalization (i18n) <!-- id: 15 -->
    - [x] Setup i18n infrastructure (react-i18next) <!-- id: 16 -->
    - [x] Implement English/Japanese translations <!-- id: 17 -->
    - [x] Add Language Switcher UI <!-- id: 18 -->
- [x] Feature: Mod Enable/Disable <!-- id: 24 -->
    - [x] Backend: Rename files (.jar <-> .disabled) <!-- id: 25 -->
    - [x] Frontend: Add Toggle Switch to Mod List <!-- id: 26 -->
    - [ ] Frontend: Filter/Sort by Status <!-- id: 27 -->
- [/] DevOps: GitHub Actions <!-- id: 28 -->
    - [x] Create Release Workflow (`.github/workflows/release.yml`) <!-- id: 29 -->
    - [x] Create Makefile <!-- id: 31 -->
- [x] UI Refactor: Move Version Display <!-- id: 32 -->
    - [x] Move version from Sidebar to Settings <!-- id: 33 -->
- [x] Refactor: Fix Rust Warnings <!-- id: 34 -->
- [x] Bugfix: Layout Scaling <!-- id: 35 -->
    - [x] Fix empty space on right side when maximized <!-- id: 36 -->
- [x] Release v1.0.0 <!-- id: 37 -->
    - [x] Bump version numbers <!-- id: 38 -->
    - [x] Create git tag <!-- id: 39 -->
    - [x] Configure Build Signatures (if applicable) <!-- id: 30 -->

# v1.1.0 Implementation (Completed)
- [x] Requirements Definition for v1.1.0 <!-- id: 41 -->
    - [x] Define Drag & Drop logic <!-- id: 42 -->
    - [x] Design Detail View UI <!-- id: 43 -->
    - [x] Analyze Dependency Check feasibility <!-- id: 44 -->
    - [x] Define "New Mod Installation" (Modrinth API Integration) <!-- id: 45 -->

- [x] Feature 1: Drag & Drop Installation <!-- id: 46 -->
    - [x] Backend: `install_mod` command <!-- id: 47 -->
    - [x] Frontend: Listen for drop events <!-- id: 48 -->

- [x] Feature 2: Detail View <!-- id: 49 -->
    - [x] Frontend: Create `ModDetail` component <!-- id: 50 -->
    - [x] Frontend: Integrate into Right Panel <!-- id: 51 -->

- [x] Feature 3: Dependency Check (Cancelled due to false postives) <!-- id: 41 -->
    - [x] Parse `depends` from `fabric.mod.json`.
    - [x] Parse `dependencies` from `mods.toml` (Forge/NeoForge). <!-- id: 42 -->
    - [x] Frontend: Validate dependencies against loaded mods (Added support for `provides` in `fabric.mod.json`) <!-- id: 43 -->
    - [x] Frontend: Show warning icon and details <!-- id: 44 -->

- [x] Feature 4: Modrinth Integration <!-- id: 55 -->
    - [x] Backend: Modrinth API Client (reqwest) <!-- id: 56 -->
    - [x] Frontend: Search Modal UI <!-- id: 57 -->
    - [x] Frontend: Implement Install Flow <!-- id: 58 -->

- [x] Release v1.1.0 <!-- id: 59 -->
    - [x] Bump version numbers (package.json, tauri.conf.json) <!-- id: 60 -->
    - [x] Create git tag <!-- id: 61 -->

# v1.2.0 Planning
- [ ] Requirements Definition for v1.2.0 <!-- id: 62 -->
    - [ ] Prioritize feature list <!-- id: 63 -->
    - [ ] Detail specification for chosen high-priority features <!-- id: 64 -->
- [ ] Backlog / Candidates <!-- id: 65 -->
    - [ ] Mod Updates (Check & Update) <!-- id: 66 -->
    - [ ] Dependency Resolution (Auto-install dependencies) <!-- id: 67 -->
    - [ ] Instance Creator (Create/Edit Profiles) <!-- id: 68 -->
    - [ ] Modpack Export/Import <!-- id: 69 -->
    - [ ] Bulk Operations & Filtering <!-- id: 70 -->
