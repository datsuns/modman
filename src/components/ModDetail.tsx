import { ModMetadata } from "../types";
import { useTranslation } from "react-i18next";
import { Package, User, FileText, CheckCircle2 } from "lucide-react";


interface ModDetailProps {
    mod: ModMetadata | null;
}

export function ModDetail({ mod }: ModDetailProps) {
    const { t } = useTranslation();

    if (!mod) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <Package size={64} className="mb-4 opacity-10" />
                <p>{t('moddetail.no_selection')}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                    <div className="p-4 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Package size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100 mb-1">{mod.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="bg-[#333] px-2 py-0.5 rounded text-gray-300 font-mono">{mod.id}</span>
                            <span>v{mod.version}</span>
                        </div>
                    </div>
                </div>
                {mod.enabled ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle2 size={16} />
                        {t('moddetail.enabled')}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-gray-700/50 text-gray-400 px-3 py-1.5 rounded-full text-sm font-medium">
                        {t('moddetail.disabled')}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {/* Description */}
                <div className="bg-[#252526] rounded-lg p-4 border border-[#333]">
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        {t('moddetail.description')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        {mod.description || t('moddetail.no_description')}
                    </p>
                </div>

                {/* Authors */}
                <div className="bg-[#252526] rounded-lg p-4 border border-[#333]">
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <User size={16} />
                        {t('moddetail.authors')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {mod.authors && mod.authors.length > 0 ? (
                            mod.authors.map((author, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                                    {author}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 italic">{t('moddetail.unknown')}</span>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
}
