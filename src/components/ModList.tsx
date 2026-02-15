import { useEffect, useState } from "react";
import { ModMetadata } from "../types";
import { scanMods, toggleModEnabled } from "../lib/api";
import { Package, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

interface ModListProps {
    path: string;
}

export function ModList({ path }: ModListProps) {
    const { t } = useTranslation();
    const [mods, setMods] = useState<ModMetadata[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (path) {
            loadMods(path);
        }
    }, [path]);

    async function loadMods(targetPath: string) {
        setLoading(true);
        const data = await scanMods(targetPath);
        setMods(data);
        setLoading(false);
    }

    async function toggleMod(id: string) {
        const modToToggle = mods.find(m => m.id === id);
        if (!modToToggle) return;

        try {
            const newPath = await toggleModEnabled(modToToggle.file_path, !modToToggle.enabled);

            setMods(mods.map(mod => {
                if (mod.id === id) {
                    return {
                        ...mod,
                        enabled: !mod.enabled,
                        file_path: newPath,
                        // Update filename for display if needed, though we usually show 'name'
                        file_name: newPath.split(/[\\/]/).pop() || mod.file_name
                    };
                }
                return mod;
            }));
        } catch (error) {
            console.error("Failed to toggle mod:", error);
            // Optionally show error notification
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {loading ? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin mr-2" /> {t('app.loading')}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {mods.map((mod) => (
                        <div
                            key={mod.id}
                            className={clsx(
                                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                mod.enabled
                                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                                    : "bg-black/20 border-white/5 opacity-60 hover:opacity-80"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-md text-indigo-400">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-100">{mod.name}</h3>
                                    <p className="text-xs text-gray-400">{mod.version} • {mod.id}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleMod(mod.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                    mod.enabled
                                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700/80"
                                )}
                            >
                                {mod.enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                {mod.enabled ? t('modlist.enabled') : t('modlist.disabled')}
                            </button>
                        </div>
                    ))}

                    {!loading && mods.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            {t('app.no_mods', { path })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
