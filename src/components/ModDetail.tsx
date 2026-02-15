import { ModMetadata } from "../types";
import { Package, User, FileText, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModDetailProps {
    mod: ModMetadata | null;
}

export function ModDetail({ mod }: ModDetailProps) {
    const { t } = useTranslation();

    if (!mod) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <Package size={48} className="mb-4 opacity-20" />
                <p>{t('moddetail.no_selection')}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Package size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-100">{mod.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <span className="bg-gray-800 px-2 py-0.5 rounded text-xs font-mono">{mod.id}</span>
                        <span>v{mod.version}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Description */}
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <Info size={16} /> {t('moddetail.description')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg">
                        {mod.description || t('moddetail.no_description')}
                    </p>
                </div>

                {/* Authors */}
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <User size={16} /> {t('moddetail.authors')}
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

                {/* File Info */}
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <FileText size={16} /> {t('moddetail.file_info')}
                    </h3>
                    <div className="bg-black/20 p-3 rounded-lg text-sm font-mono text-gray-400 break-all">
                        {mod.file_name}
                    </div>
                </div>
            </div>
        </div>
    );
}
