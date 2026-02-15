import { useState, useEffect } from "react";
import { ModList } from "./components/ModList";
import { ModDetail } from "./components/ModDetail";
import { fetchLauncherProfiles, installMod } from "./lib/api";
import { LauncherProfile, ModMetadata } from "./types";
import { LayoutGrid, Settings, FolderOpen, Play } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("mods");
  const [profiles, setProfiles] = useState<LauncherProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [launcherPath, setLauncherPath] = useState(localStorage.getItem("launcherPath") || "");
  const [selectedMod, setSelectedMod] = useState<ModMetadata | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadProfiles();
  }, []);

  // Drag and Drop Listener
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unlisten = await getCurrentWindow().onDragDropEvent((event) => {
          if (event.payload.type === 'drop') {
            handleDrop(event.payload.paths);
          }
        });
      } catch (e) {
        console.error("Failed to setup DnD listener:", e);
      }
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [activeTab, selectedProfileId, profiles]);

  async function handleDrop(paths: string[]) {
    if (activeTab === "mods" && activeProfile) {
      let installedCount = 0;
      let errors: string[] = [];

      for (const path of paths) {
        if (path.endsWith(".jar")) {
          try {
            await installMod(path, activeProfile.mods_dir);
            installedCount++;
          } catch (error) {
            console.error("Failed to install mod:", error);
            errors.push(`${path}: ${error}`);
          }
        }
      }

      if (installedCount > 0) {
        setRefreshKey(prev => prev + 1);
        // Optional: Show success message via a proper UI component in the future
      }

      if (errors.length > 0) {
        alert(`Some mods failed to install:\n${errors.join('\n')}`);
      }
    }
  }

  async function loadProfiles() {
    const data = await fetchLauncherProfiles(launcherPath || undefined);
    setProfiles(data);
    if (data.length > 0) {
      if (!data.find(p => p.id === selectedProfileId)) {
        setSelectedProfileId(data[0].id);
      }
    }
  }

  const activeProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252526] border-r border-[#333] flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-[#333]">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center font-bold text-white">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight">{t('app.title')}</span>
        </div>

        <div className="px-4 pt-4 pb-2">
          <label className="text-xs text-gray-500 mb-1 block">{t('sidebar.profiles')}</label>
          <select
            className="w-full bg-[#1e1e1e] border border-[#333] text-gray-300 text-sm rounded p-2 focus:outline-none focus:border-emerald-600"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            {profiles.length === 0 && <option disabled>Loading...</option>}
          </select>
          {activeProfile && (
            <div className="text-[10px] text-gray-600 mt-1 truncate" title={activeProfile.mods_dir}>{activeProfile.mods_dir}</div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            label={t('sidebar.mods')}
            active={activeTab === "mods"}
            onClick={() => setActiveTab("mods")}
          />
          <SidebarItem
            icon={<FolderOpen size={20} />}
            label={t('sidebar.instances')}
            active={activeTab === "instances"}
            onClick={() => setActiveTab("instances")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label={t('sidebar.settings')}
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="p-4 border-t border-[#333]">
          <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors">
            <Play size={18} fill="currentColor" />
            {t('app.launch')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#333] bg-[#1e1e1e] flex items-center px-6 justify-between">
          <h2 className="text-lg font-medium text-gray-100">
            {activeTab === "mods" && activeProfile ? `${t('sidebar.mods')} (${activeProfile.name})` : ""}
            {activeTab === "instances" && t('sidebar.instances')}
            {activeTab === "settings" && t('sidebar.settings')}
          </h2>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === "mods" && activeProfile && (
            <div className="absolute inset-0 flex">
              <div className="w-1/2 flex flex-col border-r border-[#333] overflow-y-auto p-4 custom-scrollbar">
                <ModList
                  key={activeProfile.mods_dir + refreshKey}
                  path={activeProfile.mods_dir}
                  selectedModId={selectedMod?.id}
                  onSelect={setSelectedMod}
                />
              </div>
              <div className="w-1/2 bg-[#1e1e1e] overflow-y-auto custom-scrollbar">
                <ModDetail mod={selectedMod} />
              </div>
            </div>
          )}
          {activeTab === "instances" && (
            <div className="absolute inset-0 overflow-y-auto p-6">
              <div className="text-center text-gray-500 mt-20">Instance Manager uses a different folder structure.</div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="absolute inset-0 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-xl font-medium mb-6">{t('sidebar.settings')}</h3>

                {/* Language Config */}
                <div className="bg-[#252526] rounded-lg p-6 border border-[#333]">
                  <h4 className="text-md font-medium mb-4 text-emerald-400">{t('settings.language')}</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => i18n.changeLanguage('en')}
                      className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium border transition-colors",
                        i18n.language.startsWith('en')
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "border-[#3e3e3e] hover:bg-[#333] text-gray-300"
                      )}
                    >
                      {t('settings.english')}
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage('ja')}
                      className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium border transition-colors",
                        i18n.language === 'ja'
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "border-[#3e3e3e] hover:bg-[#333] text-gray-300"
                      )}
                    >
                      {t('settings.japanese')}
                    </button>
                  </div>
                </div>

                {/* Launcher Path Config */}
                <div className="bg-[#252526] rounded-lg p-6 border border-[#333]">
                  <h4 className="text-md font-medium mb-4 text-emerald-400">{t('settings.launcher_path')}</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={launcherPath}
                        onChange={(e) => setLauncherPath(e.target.value)}
                        placeholder={t('settings.launcher_path_placeholder')}
                        className="flex-1 bg-[#1e1e1e] border border-[#333] rounded p-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        onClick={async () => {
                          try {
                            const selected = await open({
                              multiple: false,
                              directory: false,
                              filters: [{
                                name: 'Launcher Profiles',
                                extensions: ['json']
                              }]
                            });
                            if (selected && typeof selected === 'string') {
                              setLauncherPath(selected);
                            }
                          } catch (err) {
                            console.error("Failed to open file dialog", err);
                          }
                        }}
                        className="px-4 py-2 bg-[#3e3e3e] hover:bg-[#4e4e4e] text-white rounded-md text-sm font-medium transition-colors"
                      >
                        {t('settings.browse')}
                      </button>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setLauncherPath("")}
                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                        {t('settings.reset_default')}
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("launcherPath", launcherPath);
                          loadProfiles(); // Reload profiles with new path
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        {t('settings.save')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-600 pt-8">
                  {t('app.version')}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
        active
          ? "bg-[#37373d] text-white"
          : "text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
