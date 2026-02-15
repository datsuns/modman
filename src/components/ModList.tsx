import { useEffect, useState } from "react";
import { ModMetadata } from "../types";
import { scanMods, toggleModEnabled } from "../lib/api";
import { Package, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

interface ModListProps {
    path: string;
    selectedModId?: string;
    onSelect?: (mod: ModMetadata) => void;
}

export function ModList({ path, selectedModId, onSelect }: ModListProps) {
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

    async function toggleMod(id: string, e: React.MouseEvent) {
        e.stopPropagation(); // Prevent row selection when clicking toggle
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
                        file_name: newPath.split(/[\\/]/).pop() || mod.file_name
                    };
                }
                return mod;
            }));
        } catch (error) {
            console.error("Failed to toggle mod:", error);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {loading ? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin mr-2" /> {t('app.loading')}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {mods.map((mod) => (
                        <div
                            key={mod.id}
                            onClick={() => onSelect?.(mod)}
                            className={clsx(
                                "flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                                mod.id === selectedModId
                                    ? "bg-indigo-500/20 border-indigo-500/50"
                                    : mod.enabled
                                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                                        : "bg-black/20 border-white/5 opacity-60 hover:opacity-80"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2 rounded-md",
                                    mod.id === selectedModId ? "text-indigo-300" : "text-indigo-400 bg-indigo-500/20"
                                )}>
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-100">{mod.name}</h3>
                                    <p className="text-xs text-gray-400">{mod.version} • {mod.id}</p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => toggleMod(mod.id, e)}
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
