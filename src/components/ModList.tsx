import { ModMetadata } from "../types";
import { Package, ToggleLeft, ToggleRight } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

interface ModListProps {
    mods: ModMetadata[];
    selectedModId?: string;
    onSelect?: (mod: ModMetadata) => void;
    onToggle: (mod: ModMetadata) => void;
}

export function ModList({ mods, selectedModId, onSelect, onToggle }: ModListProps) {
    const { t } = useTranslation();

    if (mods.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Package size={48} className="mb-4 opacity-20" />
                <p>{t('modlist.empty')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {mods.map((mod) => {
                return (
                    <div
                        key={mod.file_name}
                        onClick={() => onSelect?.(mod)}
                        className={clsx(
                            "flex items-center justify-between p-3 rounded-lg border transition-colors relative cursor-pointer",
                            mod.id === selectedModId
                                ? "bg-indigo-500/20 border-indigo-500/50"
                                : mod.enabled
                                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                                    : "bg-black/20 border-white/5 opacity-60 hover:opacity-80"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={clsx("p-2 rounded-lg", mod.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/50 text-gray-500")}>
                                <Package size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-medium text-gray-200 truncate">{mod.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="truncate">{mod.version}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection when clicking toggle
                                    onToggle(mod);
                                }}
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
                    </div>
                );
            })}
        </div>
    );
}
